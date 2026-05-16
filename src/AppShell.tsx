import { NavLink, Outlet } from 'react-router-dom';
import { scenes } from '@/scenes/registry';
import styles from './AppShell.module.css';

export function AppShell() {
  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <NavLink to="/" className={styles.brand}>
          <span className={styles.brandTitle}>Forces</span>
          <span className={styles.brandSub}>Vector Physics Playground</span>
        </NavLink>

        <nav className={styles.nav}>
          <div className={styles.navHeading}>Scenes</div>
          {scenes.map((s) => (
            <NavLink
              key={s.path}
              to={`/scenes/${s.path}`}
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.active : ''}`
              }
            >
              {s.label}
            </NavLink>
          ))}
        </nav>

        <footer className={styles.footer}>
          <code>src/lib/vector</code> + <code>src/lib/forces</code>
          <br /> are yours to fill in.
        </footer>
      </aside>

      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}
