import {
  useEffect,
  useLayoutEffect,
  useRef,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { useWorld } from '@/lib/engine';
import { Grid } from './Grid';
import { VectorOverlay } from './VectorOverlay';
import { FpsCounter } from './FpsCounter';
import { MouseTracker } from './MouseTracker';
import { DebugPanel } from './DebugPanel';
import styles from './Stage.module.css';

export interface StageProps {
  children: ReactNode;
  /** Stage background color. Defaults to a soft dark plate. */
  background?: string;
  /** Show all debug overlays/panel. Default: true. */
  debug?: boolean;
  /** Override the stage size. By default the stage fills its parent. */
  style?: CSSProperties;
}

/**
 * Bounded rendering area for a physics scene.
 *
 * Bodies position themselves with `transform: translate(x, y)` relative to
 * the stage's top-left corner. The Stage clips overflow so flying-off bodies
 * don't disrupt page layout.
 *
 * The Stage also feeds the World with its measured `bounds` and the
 * mouse position (in stage-local pixels), so user-defined forces can use them.
 */
export function Stage({
  children,
  background,
  debug = true,
  style,
}: StageProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const world = useWorld();

  // Track the stage's size so forces can reference `ctx.bounds`.
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const update = () => {
      const rect = el.getBoundingClientRect();
      world.setBounds({ width: rect.width, height: rect.height });
    };
    update();

    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [world]);

  // Mouse tracking in stage-local pixels.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      world.setMouse({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };
    const onLeave = () => world.setMouse(null);

    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
    return () => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
    };
  }, [world]);

  return (
    <div
      ref={ref}
      className={styles.stage}
      style={{ background: background ?? undefined, ...style }}
    >
      {debug && world.debug.showGrid && <Grid />}
      {children}
      {debug && <VectorOverlay />}
      {debug && world.debug.showFps && <FpsCounter />}
      {debug && <MouseTracker />}
      {debug && <DebugPanel />}
    </div>
  );
}
