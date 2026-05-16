import { useWorld } from '@/lib/engine';
import styles from './DebugPanel.module.css';

export function DebugPanel() {
  const {
    paused,
    setPaused,
    step,
    reset,
    timeScale,
    setTimeScale,
    debug,
    setDebug,
  } = useWorld();

  return (
    <div className={styles.panel}>
      <div className={styles.row}>
        <button
          className={styles.btn}
          onClick={() => setPaused(!paused)}
          title={paused ? 'Resume (Space)' : 'Pause (Space)'}
        >
          {paused ? '▶' : '⏸'}
        </button>
        <button
          className={styles.btn}
          onClick={step}
          disabled={!paused}
          title="Step one frame (1/60s)"
        >
          ⏭
        </button>
        <button className={styles.btn} onClick={reset} title="Reset positions">
          ↺
        </button>
      </div>

      <label className={styles.slider}>
        <span>time × {timeScale.toFixed(2)}</span>
        <input
          type="range"
          min={0.05}
          max={2}
          step={0.05}
          value={timeScale}
          onChange={(e) => setTimeScale(Number(e.target.value))}
        />
      </label>

      <div className={styles.toggles}>
        <Toggle
          label="Grid"
          checked={debug.showGrid}
          onChange={(v) => setDebug({ showGrid: v })}
        />
        <Toggle
          label="Velocity"
          color="var(--vec-velocity)"
          checked={debug.showVelocity}
          onChange={(v) => setDebug({ showVelocity: v })}
        />
        <Toggle
          label="Acceleration"
          color="var(--vec-acceleration)"
          checked={debug.showAcceleration}
          onChange={(v) => setDebug({ showAcceleration: v })}
        />
        <Toggle
          label="Forces (Σ)"
          color="var(--vec-force)"
          checked={debug.showForces}
          onChange={(v) => setDebug({ showForces: v })}
        />
        <Toggle
          label="FPS"
          checked={debug.showFps}
          onChange={(v) => setDebug({ showFps: v })}
        />
      </div>
    </div>
  );
}

interface ToggleProps {
  label: string;
  checked: boolean;
  color?: string;
  onChange: (v: boolean) => void;
}

function Toggle({ label, checked, color, onChange }: ToggleProps) {
  return (
    <label className={styles.toggle}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      {color && <span className={styles.dot} style={{ background: color }} />}
      <span>{label}</span>
    </label>
  );
}
