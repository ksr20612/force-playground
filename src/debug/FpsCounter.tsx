import { useWorld } from '@/lib/engine';

export function FpsCounter() {
  const { fps } = useWorld();
  return (
    <div
      style={{
        position: 'absolute',
        top: 12,
        right: 12,
        padding: '4px 8px',
        background: 'rgba(22,24,29,0.85)',
        border: '1px solid var(--border)',
        borderRadius: 6,
        color: 'var(--text-dim)',
        fontFamily: 'JetBrains Mono, ui-monospace, monospace',
        fontSize: 11,
        lineHeight: 1.4,
        pointerEvents: 'none',
      }}
    >
      <div>
        <span style={{ color: 'var(--text)' }}>{fps}</span> fps
      </div>
    </div>
  );
}
