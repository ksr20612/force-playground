/**
 * Background grid for the stage. Cell size = 50px, with a stronger line
 * every 5 cells (250px). Pure CSS — no per-frame work.
 */
export function Grid() {
  return (
    <div
      aria-hidden
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        backgroundImage: `
          linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px),
          linear-gradient(to right, rgba(255,255,255,0.08) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(255,255,255,0.08) 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px, 50px 50px, 250px 250px, 250px 250px',
      }}
    />
  );
}
