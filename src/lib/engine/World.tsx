import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { Mover } from "./Mover";
import type { DebugState, ForceFn, Vector2Like } from "./types";
import { useAnimationFrame } from "./useAnimationFrame";
import WorldContext, { WorldContextValue } from "./World.context";

/**
 * Internal record stored in the world for each body.
 * - `element` is the DOM node we mutate every frame (`transform: translate`).
 * - `forces` is the live list of forces registered for this body.
 * - `resetState` snapshots the initial state so "Reset" works.
 */
interface MoverRecord {
  mover: Mover;
  element: HTMLElement | null;
  forces: Set<ForceFn>;
  resetState: {
    position: Vector2Like;
    velocity: Vector2Like;
  };
}

export interface WorldProps {
  children: ReactNode;
  /** Optional initial debug overlay state. */
  debug?: Partial<DebugState>;
}

const DEFAULT_DEBUG: DebugState = {
  showGrid: true,
  showVelocity: true,
  showAcceleration: true,
  showForces: false,
  showFps: true,
};

export function World({ children, debug: initialDebug }: WorldProps) {
  // Mutable registry — refs only, no re-renders during simulation.
  const recordsRef = useRef<Map<Mover, MoverRecord>>(new Map());

  // Reactive UI state for debug panel.
  const [paused, setPaused] = useState(false);
  const [timeScale, setTimeScale] = useState(1);
  const [fps, setFps] = useState(0);
  const [debug, setDebugState] = useState<DebugState>({
    ...DEFAULT_DEBUG,
    ...initialDebug,
  });
  const [mouse, setMouseState] = useState<Vector2Like | null>(null);
  const [bounds, setBoundsState] = useState({ width: 0, height: 0 });

  // Wrap setters with shallow-equality checks. Without this, callers like
  // <Stage>'s ResizeObserver pass a fresh object every frame — React sees
  // a new reference, re-renders <World>, the context value memo regenerates,
  // <Stage>'s effect deps change, the effect re-runs, and we have an
  // infinite loop. With the check, identical values become a no-op.
  const setBounds = useCallback((b: { width: number; height: number }) => {
    setBoundsState((prev) =>
      prev.width === b.width && prev.height === b.height ? prev : b,
    );
  }, []);

  const setMouse = useCallback((m: Vector2Like | null) => {
    setMouseState((prev) => {
      if (prev === m) return prev;
      if (prev && m && prev.x === m.x && prev.y === m.y) return prev;
      return m;
    });
  }, []);

  // For "Step": advance exactly one frame while paused.
  const stepRequestedRef = useRef(false);
  const timeRef = useRef(0);

  // FPS sampling.
  const fpsAccumRef = useRef({ frames: 0, elapsed: 0 });

  const setDebug = useCallback((patch: Partial<DebugState>) => {
    setDebugState((prev) => ({ ...prev, ...patch }));
  }, []);

  const registerBody = useCallback((body: Mover) => {
    const record: MoverRecord = {
      mover: body,
      element: null,
      forces: new Set(),
      resetState: {
        position: { x: body.position.x, y: body.position.y },
        velocity: { x: body.velocity.x, y: body.velocity.y },
      },
    };
    recordsRef.current.set(body, record);
    return () => {
      recordsRef.current.delete(body);
    };
  }, []);

  const bindElement = useCallback((body: Mover, el: HTMLElement | null) => {
    const record = recordsRef.current.get(body);
    if (!record) return;
    record.element = el;
    if (el) {
      // Apply current transform immediately so the element doesn't flash at (0,0).
      el.style.transform = `translate3d(${body.position.x}px, ${body.position.y}px, 0) translate(-50%, -50%)`;
    }
  }, []);

  const registerForce = useCallback((body: Mover, force: ForceFn) => {
    const record = recordsRef.current.get(body);
    if (!record) return () => {};
    record.forces.add(force);
    return () => {
      record.forces.delete(force);
    };
  }, []);

  const getBodies = useCallback(() => {
    return Array.from(recordsRef.current.keys());
  }, []);

  const step = useCallback(() => {
    stepRequestedRef.current = true;
  }, []);

  const reset = useCallback(() => {
    timeRef.current = 0;
    for (const record of recordsRef.current.values()) {
      record.mover.setPosition(record.resetState.position);
      record.mover.velocity.x = record.resetState.velocity.x;
      record.mover.velocity.y = record.resetState.velocity.y;
      record.mover.acceleration.x = 0;
      record.mover.acceleration.y = 0;
      record.mover._appliedForces.length = 0;
      if (record.element) {
        record.element.style.transform = `translate3d(${record.mover.position.x}px, ${record.mover.position.y}px, 0) translate(-50%, -50%)`;
      }
    }
  }, []);

  // ---- The main loop ----
  useAnimationFrame(({ dt: rawDt }) => {
    // FPS sampling on real (unscaled) dt.
    const acc = fpsAccumRef.current;
    acc.frames += 1;
    acc.elapsed += rawDt;
    if (acc.elapsed >= 0.5) {
      setFps(Math.round(acc.frames / acc.elapsed));
      acc.frames = 0;
      acc.elapsed = 0;
    }

    // Pause gate (with single-step support).
    if (paused && !stepRequestedRef.current) return;
    const stepping = stepRequestedRef.current;
    stepRequestedRef.current = false;

    // Use a fixed step when stepping manually so each click feels consistent.
    const dt = stepping ? 1 / 60 : rawDt * timeScale;
    timeRef.current += dt;

    const ctx = {
      dt,
      time: timeRef.current,
      mouse,
      bounds,
    };

    for (const record of recordsRef.current.values()) {
      const { mover: body, forces, element } = record;

      // Reset acceleration & per-frame force log.
      body.acceleration.x = 0;
      body.acceleration.y = 0;
      body._appliedForces.length = 0;

      // Apply each force.
      for (const force of forces) {
        const result = force(body, ctx);
        if (result) body.applyForce(result);
      }

      // Semi-implicit Euler integration: v += a*dt; p += v*dt.
      body.velocity.x += body.acceleration.x * dt;
      body.velocity.y += body.acceleration.y * dt;
      body.position.x += body.velocity.x * dt;
      body.position.y += body.velocity.y * dt;

      // Write transform directly to the DOM — bypassing React entirely.
      if (element) {
        element.style.transform = `translate3d(${body.position.x}px, ${body.position.y}px, 0) translate(-50%, -50%)`;
      }
    }
  }, true);

  const value = useMemo<WorldContextValue>(
    () => ({
      registerMover: registerBody,
      bindElement,
      registerForce,
      getBodies,
      paused,
      setPaused,
      step,
      reset,
      timeScale,
      setTimeScale,
      fps,
      debug,
      setDebug,
      mouse,
      setMouse,
      bounds,
      setBounds,
    }),
    [
      registerBody,
      bindElement,
      registerForce,
      getBodies,
      paused,
      step,
      reset,
      timeScale,
      fps,
      debug,
      setDebug,
      mouse,
      bounds,
    ],
  );

  return (
    <WorldContext.Provider value={value}>{children}</WorldContext.Provider>
  );
}

export function useWorld(): WorldContextValue {
  const ctx = useContext(WorldContext);
  if (!ctx) {
    throw new Error(
      "useWorld must be called inside <World>. Wrap your scene in <World>...</World>.",
    );
  }
  return ctx;
}

/**
 * Useful for debug overlays that DO need to re-render every frame.
 * Returns an ever-incrementing counter you can put in `useEffect` deps,
 * or call `useFrameTick(60)` to throttle to ~60fps in tests.
 */
export function useFrameTick(): number {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    let id = 0;
    const loop = () => {
      setTick((t) => (t + 1) % 1_000_000);
      id = requestAnimationFrame(loop);
    };
    id = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(id);
  }, []);
  return tick;
}
