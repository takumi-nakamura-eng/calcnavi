'use client';

/**
 * CantileverDiagram — SVG schematic of a cantilever (fixed–free) beam.
 *
 * Shows:
 *  - Fixed-end wall with hatch marks (left)
 *  - Horizontal beam bar
 *  - Free end (right)
 *  - Load arrow(s) with label
 *  - Span dimension label
 */

import type { LoadCase } from '@/lib/beams/simpleBeam';

interface Props {
  loadCase: LoadCase;
  spanLabel?: string;
  loadLabel?: string;
}

const W = 360;
const H_SVG = 180;

const BEAM_Y = 90;
const BEAM_H = 14;
const WALL_X = 40;
const WALL_W = 18;
const BEAM_X1 = WALL_X + WALL_W;
const BEAM_X2 = 330;

export default function CantileverDiagram({ loadCase, spanLabel, loadLabel }: Props) {
  const beamTop = BEAM_Y - BEAM_H / 2;
  const beamBot = BEAM_Y + BEAM_H / 2;

  const ARROW_LEN = 38;
  const ARROW_HEAD = 8;

  const loads: Array<{ x: number; label?: string }> = (() => {
    if (loadCase === 'center') {
      return [{ x: BEAM_X2, label: loadLabel }];
    }
    const count = 7;
    const step = (BEAM_X2 - BEAM_X1) / (count - 1);
    return Array.from({ length: count }, (_, i) => ({
      x: BEAM_X1 + i * step,
      label: i === Math.floor(count / 2) ? loadLabel : undefined,
    }));
  })();

  const arrowTopY = beamTop - ARROW_LEN;

  // Hatch lines for the wall
  const hatchLines = [];
  const hatchStep = 8;
  for (let y = 30; y <= 150; y += hatchStep) {
    hatchLines.push(
      <line key={y} x1={WALL_X + WALL_W} y1={y} x2={WALL_X} y2={y + 10}
        stroke="#888" strokeWidth={1} />
    );
  }

  return (
    <svg
      viewBox={`0 0 ${W} ${H_SVG}`}
      width="100%"
      aria-label="片持ち梁模式図"
      style={{ display: 'block', maxWidth: 420 }}
    >
      {/* ── Fixed-end wall ── */}
      <rect x={WALL_X} y={30} width={WALL_W} height={120}
        fill="#d1d5db" stroke="#374151" strokeWidth={1.5} />
      {hatchLines}

      {/* ── Beam bar ── */}
      <rect
        x={BEAM_X1} y={beamTop}
        width={BEAM_X2 - BEAM_X1} height={BEAM_H}
        fill="#2563eb" rx={2}
      />

      {/* ── Load arrows ── */}
      {loads.map((ld, i) => (
        <g key={i}>
          <line
            x1={ld.x} y1={arrowTopY}
            x2={ld.x} y2={beamTop - 1}
            stroke="#dc2626" strokeWidth={loadCase === 'center' ? 2.5 : 1.5}
          />
          <polygon
            points={arrowHead(ld.x, beamTop - 1, ARROW_HEAD)}
            fill="#dc2626"
          />
          {ld.label && (
            <text
              x={ld.x} y={arrowTopY - 5}
              textAnchor="middle"
              fontSize={11} fontWeight={700}
              fill="#dc2626"
            >
              {ld.label}
            </text>
          )}
        </g>
      ))}

      {/* uniform load top bar */}
      {loadCase === 'uniform' && (
        <line
          x1={BEAM_X1} y1={arrowTopY}
          x2={BEAM_X2} y2={arrowTopY}
          stroke="#dc2626" strokeWidth={2}
        />
      )}

      {/* ── Span dimension line ── */}
      {spanLabel && (
        <g>
          <line x1={BEAM_X1} y1={beamBot + 20} x2={BEAM_X2} y2={beamBot + 20}
            stroke="#374151" strokeWidth={1} />
          <line x1={BEAM_X1} y1={beamBot + 15} x2={BEAM_X1} y2={beamBot + 25}
            stroke="#374151" strokeWidth={1} />
          <line x1={BEAM_X2} y1={beamBot + 15} x2={BEAM_X2} y2={beamBot + 25}
            stroke="#374151" strokeWidth={1} />
          <text x={(BEAM_X1 + BEAM_X2) / 2} y={beamBot + 35}
            textAnchor="middle" fontSize={11} fontWeight={600} fill="#374151">
            L = {spanLabel}
          </text>
        </g>
      )}

      {/* ── Labels ── */}
      <text x={WALL_X + WALL_W / 2} y={162}
        textAnchor="middle" fontSize={9} fill="#555">固定端</text>
      <text x={BEAM_X2} y={beamBot + (spanLabel ? 12 : 18)}
        textAnchor="middle" fontSize={9} fill="#555">自由端</text>
    </svg>
  );
}

function arrowHead(x: number, tipY: number, size: number): string {
  return `${x},${tipY} ${x - size / 2},${tipY - size} ${x + size / 2},${tipY - size}`;
}
