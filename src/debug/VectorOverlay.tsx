import { useEffect, useRef } from 'react';
import { useWorld } from '@/lib/engine';

/**
 * Draws live arrows for each body's velocity (cyan), acceleration (pink),
 * and last-frame forces (yellow).
 *
 * Implemented with imperative SVG mutation each frame to avoid React
 * reconciliation pressure during the simulation.
 */
export function VectorOverlay() {
  const world = useWorld();
  const svgRef = useRef<SVGSVGElement | null>(null);
  const groupsRef = useRef<Map<unknown, SVGGElement>>(new Map());

  // Keep the latest debug state without restarting the loop.
  const debugRef = useRef(world.debug);
  debugRef.current = world.debug;

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    let raf = 0;
    const ns = 'http://www.w3.org/2000/svg';

    const ensureGroup = (key: unknown): SVGGElement => {
      let g = groupsRef.current.get(key);
      if (!g) {
        g = document.createElementNS(ns, 'g');
        // velocity, acceleration, force arrows + label
        for (let i = 0; i < 4; i += 1) {
          const line = document.createElementNS(ns, 'line');
          line.setAttribute('stroke-width', '2');
          line.setAttribute('stroke-linecap', 'round');
          line.setAttribute('marker-end', `url(#arrow-${i})`);
          g.appendChild(line);
        }
        const label = document.createElementNS(ns, 'text');
        label.setAttribute('font-size', '11');
        label.setAttribute('fill', 'rgba(230,232,238,0.6)');
        label.setAttribute('font-family', 'JetBrains Mono, ui-monospace, monospace');
        g.appendChild(label);
        svg.appendChild(g);
        groupsRef.current.set(key, g);
      }
      return g;
    };

    const tick = () => {
      const bodies = world.getBodies();
      const seen = new Set<unknown>();
      const debug = debugRef.current;

      for (const body of bodies) {
        seen.add(body);
        const g = ensureGroup(body);

        const px = body.position.x;
        const py = body.position.y;
        const [velLine, accLine, fLine, _slot, label] = g.childNodes as unknown as [
          SVGLineElement,
          SVGLineElement,
          SVGLineElement,
          SVGLineElement,
          SVGTextElement,
        ];

        // --- velocity (cyan) ---
        if (debug.showVelocity) {
          const vx = body.velocity.x * 0.15; // scale for legibility
          const vy = body.velocity.y * 0.15;
          velLine.setAttribute('x1', String(px));
          velLine.setAttribute('y1', String(py));
          velLine.setAttribute('x2', String(px + vx));
          velLine.setAttribute('y2', String(py + vy));
          velLine.setAttribute('stroke', 'var(--vec-velocity)');
          velLine.setAttribute('marker-end', 'url(#arrow-velocity)');
          velLine.style.opacity = '1';
        } else {
          velLine.style.opacity = '0';
        }

        // --- acceleration (pink) ---
        if (debug.showAcceleration) {
          const ax = body.acceleration.x * 0.04;
          const ay = body.acceleration.y * 0.04;
          accLine.setAttribute('x1', String(px));
          accLine.setAttribute('y1', String(py));
          accLine.setAttribute('x2', String(px + ax));
          accLine.setAttribute('y2', String(py + ay));
          accLine.setAttribute('stroke', 'var(--vec-acceleration)');
          accLine.setAttribute('marker-end', 'url(#arrow-acceleration)');
          accLine.style.opacity = '1';
        } else {
          accLine.style.opacity = '0';
        }

        // --- forces (yellow, sum) ---
        if (debug.showForces && body._appliedForces.length > 0) {
          let fx = 0;
          let fy = 0;
          for (const f of body._appliedForces) {
            fx += f.x;
            fy += f.y;
          }
          fx *= 0.04;
          fy *= 0.04;
          fLine.setAttribute('x1', String(px));
          fLine.setAttribute('y1', String(py));
          fLine.setAttribute('x2', String(px + fx));
          fLine.setAttribute('y2', String(py + fy));
          fLine.setAttribute('stroke', 'var(--vec-force)');
          fLine.setAttribute('marker-end', 'url(#arrow-force)');
          fLine.style.opacity = '1';
        } else {
          fLine.style.opacity = '0';
        }

        // --- optional label ---
        if (body.label) {
          label.setAttribute('x', String(px + body.radius + 4));
          label.setAttribute('y', String(py - body.radius - 4));
          label.textContent = body.label;
          label.style.opacity = '1';
        } else {
          label.style.opacity = '0';
        }
      }

      // GC: remove groups whose body is gone.
      for (const [key, g] of groupsRef.current.entries()) {
        if (!seen.has(key)) {
          g.remove();
          groupsRef.current.delete(key);
        }
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [world]);

  return (
    <svg
      ref={svgRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        overflow: 'visible',
      }}
    >
      <defs>
        <marker
          id="arrow-velocity"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--vec-velocity)" />
        </marker>
        <marker
          id="arrow-acceleration"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--vec-acceleration)" />
        </marker>
        <marker
          id="arrow-force"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--vec-force)" />
        </marker>
      </defs>
    </svg>
  );
}
