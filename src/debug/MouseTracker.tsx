import { useWorld } from '@/lib/engine';

export function MouseTracker() {
  const { mouse } = useWorld();
  if (!mouse) return null;
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 12,
        right: 12,
        padding: '4px 8px',
        background: 'rgba(22,24,29,0.85)',
        border: '1px solid var(--border)',
        borderRadius: 6,
        color: 'var(--text-dim)',
        fontFamily: 'JetBrains Mono, ui-monospace, monospace',
        fontSize: 11,
        pointerEvents: 'none',
      }}
    >
      mouse: <span style={{ color: 'var(--text)' }}>{mouse.x.toFixed(0)}, {mouse.y.toFixed(0)}</span>
    </div>
  );
}
