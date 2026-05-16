# `lib/forces/` — your force library

This folder is **yours to fill in**. Each force is a function that the engine
calls every frame for each body it's bound to.

## Force signature

```ts
import type { ForceFn } from '@/lib/engine';
import { Vector2 } from '@/lib/vector';

export const gravity: ForceFn = () => new Vector2(0, 980);
//   ^                          ^
//   bound to a body            return a Vector2 — engine applies it for you
```

You can also do work imperatively if you need to apply multiple forces from
one function:

```ts
export const myForce: ForceFn = (body, ctx) => {
  body.applyForce({ x: 0, y: 980 }); // gravity
  body.applyForce({ x: -body.velocity.x * 0.1, y: 0 }); // horizontal drag
};
```

## What `ctx` gives you

| field    | meaning                                                              |
| -------- | -------------------------------------------------------------------- |
| `dt`     | Frame delta in seconds (already time-scaled).                        |
| `time`   | Total scaled time since the World mounted, in seconds.               |
| `mouse`  | Stage-local mouse position, or `null` when outside.                  |
| `bounds` | `{ width, height }` of the stage, in pixels.                         |

## Suggested forces to build

A good progression that matches the chapters of Nature of Code:

1. **`gravity`** — constant downward vector.
2. **`drag(coefficient)`** — opposes velocity, proportional to `-v`.
3. **`damping(factor)`** — multiplicative slowdown applied as a force.
4. **`friction(mu)`** — opposes velocity with constant magnitude.
5. **`spring({ anchor, k, restLength })`** — Hooke's law toward an anchor.
6. **`attractor({ position, g })`** — gravitational pull toward a point.
7. **`bounce({ bounds, restitution })`** — invert velocity when crossing edges.
8. **`mouseFollow({ strength })`** — steer toward the mouse.

Each one is usually 2–10 lines once your `Vector2` methods are in place.
