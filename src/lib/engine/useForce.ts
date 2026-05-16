import { useEffect, useRef } from "react";
import type { Mover } from "./Mover";
import type { ForceFn } from "./types";
import { useWorld } from "./World";

/**
 * Register a force on a body for the lifetime of the calling component.
 *
 * The `force` function reference is captured in a ref so changing it (e.g.
 * via a closure that depends on slider values) does NOT register/unregister
 * a new force every render — your physics stays continuous.
 *
 * @example
 * useForce(body, () => new Vector2(0, 980)); // gravity
 *
 * @example
 * useForce(body, (b, { mouse }) => {
 *   if (!mouse) return;
 *   return new Vector2(mouse.x - b.position.x, mouse.y - b.position.y).setMag(50);
 * });
 */
export function useForce(body: Mover, force: ForceFn): void {
  const world = useWorld();

  const latestRef = useRef(force);
  latestRef.current = force;

  useEffect(() => {
    // We register a stable trampoline — it always calls the freshest closure.
    const trampoline: ForceFn = (b, ctx) => latestRef.current(b, ctx);
    return world.registerForce(body, trampoline);
  }, [world, body]);
}
