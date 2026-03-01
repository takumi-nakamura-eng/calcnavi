'use client';

/**
 * BeamDiagram — SVG schematic of a simply-supported beam.
 *
 * Shows:
 *  - Horizontal beam bar
 *  - Pin support (left) and roller support (right)
 *  - Load arrow(s) with label
 *  - Span dimension label
 */

import type { LoadCase } from '@/lib/beams/simpleBeam';

interface Props {
  loadCase: LoadCase;
  /** Display span string (e.g. "2000 mm") — shown as label only */
  spanLabel?: string;
  /** Display load string (e.g. "9.8 kN") — shown as label only */
  loadLabel?: string;
}

const W = 360; // SVG viewport width
const H_SVG = 180; // SVG viewport height

const BEAM_Y = 90;      // vertical center of beam bar
const BEAM_H = 14;      // beam bar thickness
const BEAM_X1 = 40;     // left support X
const BEAM_X2 = 320;    // right support X
const SUP_H = 18;       // support triangle height

export default function BeamDiagram({ loadCase, spanLabel, loadLabel }: Props) {
  const beamTop = BEAM_Y - BEAM_H / 2;
  const beamBot = BEAM_Y + BEAM_H / 2;

  // ── Supports ────────────────────────────────────────────────────────────────
  // Pin (left) — filled triangle + hatch
  const pinLeft = trianglePoints(BEAM_X1, beamBot, SUP_H);
  // Roller (right) — open triangle + circle
  const rolRight = trianglePoints(BEAM_X2, beamBot, SUP_H);

  // ── Loads ───────────────────────────────────────────────────────────────────
  const ARROW_LEN = 38;
  const ARROW_HEAD = 8;

  const loads: Array<{ x: number; label?: string }> = (() => {
    if (loadCase === 'center') {
      return [{ x: (BEAM_X1 + BEAM_X2) / 2, label: loadLabel }];
    }
    // uniform: many small arrows
    const count = 7;
    const step = (BEAM_X2 - BEAM_X1) / (count - 1);
    return Array.from({ length: count }, (_, i) => ({
      x: BEAM_X1 + i * step,
      label: i === Math.floor(count / 2) ? loadLabel : undefined,
    }));
  })();

  const arrowTopY = beamTop - ARROW_LEN;

  return (
    <svg
      viewBox={`0 0 ${W} ${H_SVG}`}
      width="100%"
      aria-label="単純梁模式図"
      style={{ display: 'block', maxWidth: 420 }}
    >
      {/* ── Ground hatch lines ── */}
      <GroundHatch x={BEAM_X1} y={beamBot + SUP_H} />
      <GroundHatch x={BEAM_X2} y={beamBot + SUP_H} roller />

      {/* ── Beam bar ── */}
      <rect
        x={BEAM_X1} y={beamTop}
        width={BEAM_X2 - BEAM_X1} height={BEAM_H}
        fill="#2563eb" rx={2}
      />

      {/* ── Pin support (left) ── */}
      <polygon points={pinLeft} fill="#1e3a5f" />

      {/* ── Roller support (right) ── */}
      <polygon points={rolRight} fill="none" stroke="#1e3a5f" strokeWidth={2} />
      {/* roller circle */}
      <circle cx={BEAM_X2} cy={beamBot + SUP_H + 5} r={5}
        fill="none" stroke="#1e3a5f" strokeWidth={2} />

      {/* ── Load arrows ── */}
      {loads.map((ld, i) => (
        <g key={i}>
          {/* shaft */}
          <line
            x1={ld.x} y1={arrowTopY}
            x2={ld.x} y2={beamTop - 1}
            stroke="#dc2626" strokeWidth={loadCase === 'center' ? 2.5 : 1.5}
          />
          {/* arrowhead */}
          <polygon
            points={arrowHead(ld.x, beamTop - 1, ARROW_HEAD)}
            fill="#dc2626"
          />
          {/* label for center load or middle uniform */}
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
        <SpanDim
          x1={BEAM_X1} x2={BEAM_X2}
          y={beamBot + SUP_H + 28}
          label={`L = ${spanLabel}`}
        />
      )}

      {/* ── Support labels ── */}
      <text x={BEAM_X1} y={beamBot + SUP_H + (spanLabel ? 14 : 20)}
        textAnchor="middle" fontSize={9} fill="#555">ピン</text>
      <text x={BEAM_X2} y={beamBot + SUP_H + (spanLabel ? 14 : 20) + (spanLabel ? 0 : 0)}
        textAnchor="middle" fontSize={9} fill="#555">ローラ</text>
    </svg>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function trianglePoints(cx: number, baseY: number, h: number): string {
  const hw = h * 0.7;
  return `${cx},${baseY} ${cx - hw},${baseY + h} ${cx + hw},${baseY + h}`;
}

function arrowHead(x: number, tipY: number, size: number): string {
  return `${x},${tipY} ${x - size / 2},${tipY - size} ${x + size / 2},${tipY - size}`;
}

function GroundHatch({ x, y, roller }: { x: number; y: number; roller?: boolean }) {
  const w = 28;
  const step = 6;
  const lines = [];
  for (let i = 0; i <= w; i += step) {
    lines.push(<line key={i} x1={x - w / 2 + i} y1={y} x2={x - w / 2 + i - 8} y2={y + 10}
      stroke="#888" strokeWidth={1} />);
  }
  return (
    <g>
      <line x1={x - w / 2} y1={y} x2={x + w / 2} y2={y}
        stroke="#555" strokeWidth={1.5} />
      {!roller && lines}
      {roller && lines}
    </g>
  );
}

function SpanDim({ x1, x2, y, label }: { x1: number; x2: number; y: number; label: string }) {
  const tick = 5;
  return (
    <g>
      {/* horizontal arrow line */}
      <line x1={x1} y1={y} x2={x2} y2={y} stroke="#374151" strokeWidth={1} markerEnd="url(#arr)" markerStart="url(#arrL)" />
      {/* tick marks */}
      <line x1={x1} y1={y - tick} x2={x1} y2={y + tick} stroke="#374151" strokeWidth={1} />
      <line x1={x2} y1={y - tick} x2={x2} y2={y + tick} stroke="#374151" strokeWidth={1} />
      {/* label */}
      <text x={(x1 + x2) / 2} y={y + 13} textAnchor="middle"
        fontSize={11} fontWeight={600} fill="#374151">{label}</text>
    </g>
  );
}
