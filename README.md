# Forces

A React-based playground for studying Vector-driven physics — inertia, damping,
bounce, gravity, springs, attractors — by **building the engine yourself**.

The repository provides the **environment** (animation loop, body/force
binding, debug visualization, scene routing). You build the **physics**:
the `Vector2` class and the force functions.

```
              ┌─────────────────────────────────────────────────┐
              │                                                 │
              │  Environment (provided)        Your area        │
              │  ──────────────────────        ─────────────    │
              │   lib/engine/                  lib/vector/      │
              │   debug/                       lib/forces/      │
              │   scenes/registry.ts           scenes/NN-*/     │
              │                                                 │
              └─────────────────────────────────────────────────┘
```

## Quick start

```bash
pnpm install
pnpm dev          # http://localhost:5173
```

The first scene (`/scenes/mouse-attractor`) is a demo wired with raw
`{ x, y }` arithmetic so it runs immediately, even before you implement
your `Vector2` methods. Read the comments in
`src/scenes/01-mouse-attractor/MouseAttractorScene.tsx` to see how it
will look once your `Vector2` is filled in.

## How a scene is built

```tsx
import { useBody, useForce } from '@/lib/engine';

function Ball() {
  const { ref, body } = useBody({
    mass: 1,
    position: { x: 200, y: 100 },
  });

  // gravity
  useForce(body, () => ({ x: 0, y: 980 }));

  // damping (viscous)
  useForce(body, (b) => ({ x: -b.velocity.x * 0.5, y: -b.velocity.y * 0.5 }));

  return <div ref={ref} className="ball" />;
}
```

That's the whole API. Then register the scene in
`src/scenes/registry.ts` and it appears in the sidebar.

## Engine API surface

```ts
import {
  // top-level
  World,            // <World> — owns the RAF loop and body registry
  useWorld,         // pause/reset/timeScale/debug, mouse, bounds, fps

  // per-component
  useBody,          // register a body, get { ref, body }
  useForce,         // bind a force function to a body

  // types
  type ForceFn,     // (body, ctx) => Vector2Like | void
  type ForceContext // { dt, time, mouse, bounds }
} from '@/lib/engine';
```

The integration each frame:

```
for each body:
  body.acceleration = (0, 0)
  for each force: body.applyForce(force(body, ctx))   // a += F/m
  body.velocity += body.acceleration * dt              // semi-implicit Euler
  body.position += body.velocity * dt
  element.style.transform = `translate(${pos.x}px, ${pos.y}px) translate(-50%, -50%)`
```

Every body's bound element is positioned via DOM transform — **React does
not re-render during the simulation**.

## Debug tools

The Stage shows:

- **FPS** (top-right)
- **Mouse coordinates** in stage-local pixels (bottom-right)
- **Debug panel** (bottom-left) — Pause / Step / Reset / TimeScale + toggles
- **SVG vector overlay** — velocity (cyan), acceleration (pink), force sum (yellow)
- **Grid** background (50px / 250px)

Toggle anything off with the panel checkboxes.

## Folder layout

```
src/
├── lib/
│   ├── engine/                  # provided — animation loop & React bindings
│   │   ├── Body.ts
│   │   ├── World.tsx
│   │   ├── useBody.ts
│   │   ├── useForce.ts
│   │   ├── useAnimationFrame.ts
│   │   └── types.ts
│   ├── vector/                  # YOUR area — build Vector2 here
│   │   └── Vector.ts
│   └── forces/                  # YOUR area — build force functions here
├── debug/                       # provided — Stage, overlays, panel
├── scenes/                      # YOUR experiments
│   ├── registry.ts              # add scenes here
│   └── 01-mouse-attractor/      # demo, replace as you wish
├── AppShell.tsx                 # sidebar + outlet
├── Home.tsx
├── SceneHost.tsx                # wraps every scene with World + Stage
├── router.tsx
└── main.tsx
```

## Suggested learning path

1. Implement `Vector2.copy / set / add / sub / mult / div`.
2. Implement `mag / normalize / setMag / limit`.
3. Refactor `MouseAttractorScene` to use Vector methods (see comment).
4. Build `gravity`, `drag`, `damping` in `lib/forces/` and a Scene for each.
5. Build `spring`, `attractor`, `bounce`.
6. Compose multiple bodies and forces in one scene.

## Scripts

```bash
pnpm dev          # Vite dev server
pnpm build        # type-check + production build
pnpm preview      # serve the production build
pnpm typecheck    # tsc only
pnpm lint         # ESLint
```
