import { World } from '@/lib/engine';
import { Stage } from '@/debug';
import type { SceneMeta } from '@/scenes/registry';
import styles from './SceneHost.module.css';

interface SceneHostProps {
  meta: SceneMeta;
}

/**
 * Wraps every scene with a `<World>` (physics) and `<Stage>` (debug-aware
 * rendering surface). The scene component itself only declares its bodies
 * and forces.
 */
export function SceneHost({ meta }: SceneHostProps) {
  const SceneComponent = meta.component;
  return (
    <div className={styles.host}>
      <header className={styles.header}>
        <h1 className={styles.title}>{meta.label}</h1>
        {meta.description && <p className={styles.desc}>{meta.description}</p>}
      </header>
      <div className={styles.stageWrap}>
        <World>
          <Stage>
            <SceneComponent />
          </Stage>
        </World>
      </div>
    </div>
  );
}
