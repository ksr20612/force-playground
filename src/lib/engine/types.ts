/**
 * Engine-level types.
 *
 * The engine is intentionally generic over the user's `Vector` implementation.
 * It only requires that a vector exposes mutable `x` and `y` numeric fields.
 * This lets you replace / extend `src/lib/vector/Vector.ts` freely without
 * touching the engine.
 */

import { Vector2 } from "../vector";
import type { Mover } from "./Mover";

export type Vector2Like = Pick<Vector2, "x" | "y">;

/**
 * A force is a function evaluated every frame for a given body.
 *
 * - Return a `Vector2Like` to have the engine call `body.applyForce(...)`
 *   on your behalf (recommended — clean and functional).
 * - Or return `void` and call `body.applyForce(...)` yourself inside the
 *   function (useful when one force needs to apply multiple impulses).
 *
 * @example
 * const gravity: ForceFn = () => new Vector2(0, 980); // px / s^2 * mass
 *
 * @example
 * const drag: ForceFn = (body) => body.velocity.copy().mult(-0.1);
 */
export type ForceFn = (body: Mover, ctx: ForceContext) => Vector2Like | void;

/**
 * Context passed to every force on every frame.
 */
export interface ForceContext {
  /** Delta time for this frame, in seconds (already scaled by timeScale). */
  dt: number;
  /** Wall-clock time since the world started, in seconds (scaled). */
  time: number;
  /** Mouse position in stage-local coordinates, or null if outside. */
  mouse: Vector2Like | null;
  /** Stage size in pixels. */
  bounds: { width: number; height: number };
}

/**
 * Snapshot of debug state, used by the engine UI overlays.
 */
export interface DebugState {
  showGrid: boolean;
  showVelocity: boolean;
  showAcceleration: boolean;
  showForces: boolean;
  showFps: boolean;
}
