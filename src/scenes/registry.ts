import type { ComponentType } from 'react';
import { MouseAttractorScene } from './01-mouse-attractor/MouseAttractorScene';

export interface SceneMeta {
  /** URL slug, e.g. `mouse-attractor` -> `/scenes/mouse-attractor`. */
  path: string;
  /** Sidebar label. */
  label: string;
  /** One-line description shown in the scene header. */
  description?: string;
  /** The actual scene component. Render it inside a `<World>` + `<Stage>`. */
  component: ComponentType;
}

/**
 * Add a new experiment by:
 *   1. Creating `src/scenes/NN-my-scene/MySceneScene.tsx` exporting a default-ish component.
 *   2. Importing it here.
 *   3. Adding one entry to this array.
 *
 * That's it — sidebar nav and routing pick it up automatically.
 */
export const scenes: SceneMeta[] = [
  {
    path: 'mouse-attractor',
    label: '01 · Mouse Attractor',
    description:
      'A point pulled toward the mouse. Demo of the engine — replace once your own forces are ready.',
    component: MouseAttractorScene,
  },
];
