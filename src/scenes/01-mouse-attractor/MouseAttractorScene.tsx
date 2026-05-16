/**
 * 01 — Mouse Attractor (DEMO)
 *
 * Purpose: verify the engine end-to-end. The dot is pulled toward the
 * mouse, with a damping force opposing motion so it doesn't oscillate
 * forever.
 *
 * IMPORTANT: this demo intentionally uses raw `{ x, y }` arithmetic
 * instead of Vector2 methods (which are mostly unimplemented in
 * `src/lib/vector/Vector.ts` until you fill them in).
 *
 * Once you implement `sub`, `setMag`, and `mult` on Vector2, the
 * cleaner version below shows what this code can look like:
 *
 * ```ts
 * useForce(body, (b, { mouse }) => {
 *   if (!mouse) return;
 *   const m = new Vector2(mouse.x, mouse.y);
 *   return m.sub(b.position).setMag(800); // pull toward mouse
 * });
 *
 * useForce(body, (b) => b.velocity.copy().mult(-1.5)); // damping
 * ```
 *
 * Feel free to delete this scene once your own experiments are running.
 */
import { useMover, useForce } from "@/lib/engine";
import styles from "./MouseAttractorScene.module.css";

export function MouseAttractorScene() {
  const { ref, mover } = useMover({
    mass: 1,
    position: { x: 300, y: 300 },
    label: "attractor target",
    radius: 18,
  });

  // Force 1 — pull toward mouse (constant magnitude steering).
  useForce(mover, (b, { mouse }) => {
    if (!mouse) return;
    const dx = mouse.x - b.position.x;
    const dy = mouse.y - b.position.y;
    const len = Math.hypot(dx, dy) || 1;
    const strength = 800; // px/s^2 of pull (with mass=1)
    return { x: (dx / len) * strength, y: (dy / len) * strength };
  });

  // Force 2 — viscous damping (opposes velocity).
  useForce(mover, (b) => {
    return { x: -b.velocity.x * 1.5, y: -b.velocity.y * 1.5 };
  });

  return <div ref={ref} className={styles.dot} />;
}
