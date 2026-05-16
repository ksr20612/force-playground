import { Link } from 'react-router-dom';
import { scenes } from '@/scenes/registry';
import styles from './Home.module.css';

export function Home() {
  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <h1 className={styles.title}>Forces</h1>
        <p className={styles.lead}>
          A React playground for studying Vector-driven physics. Build your{' '}
          <code>Vector2</code> in <code>src/lib/vector/</code>, build your forces
          in <code>src/lib/forces/</code>, and watch them move bodies on the stage.
        </p>

        <div className={styles.split}>
          <section>
            <h2>How it works</h2>
            <ul>
              <li>
                Each <strong>scene</strong> mounts a <code>&lt;World&gt;</code> +{' '}
                <code>&lt;Stage&gt;</code>.
              </li>
              <li>
                <code>useBody()</code> registers a body, returns a{' '}
                <code>ref</code> for the DOM node.
              </li>
              <li>
                <code>useForce(body, fn)</code> binds a per-frame force function.
              </li>
              <li>
                The engine integrates motion and writes{' '}
                <code>transform: translate</code> to the DOM each frame — React
                does not re-render during the simulation.
              </li>
            </ul>
          </section>

          <section>
            <h2>Scenes</h2>
            <ul className={styles.sceneList}>
              {scenes.map((s) => (
                <li key={s.path}>
                  <Link to={`/scenes/${s.path}`}>{s.label}</Link>
                  {s.description && (
                    <span className={styles.sceneDesc}> — {s.description}</span>
                  )}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2>Your area</h2>
            <ul>
              <li>
                <code>src/lib/vector/Vector.ts</code> — implement methods as you
                study (see file's recommended order).
              </li>
              <li>
                <code>src/lib/forces/</code> — add force functions; export them
                from <code>index.ts</code>.
              </li>
              <li>
                <code>src/scenes/</code> — copy{' '}
                <code>01-mouse-attractor</code> as a template for your own
                experiments, then register it in{' '}
                <code>scenes/registry.ts</code>.
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
