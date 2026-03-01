/**
 * String-based SVG generator for simply-supported beam schematic.
 * Used in PDF report (window.print approach — no React).
 */

import type { LoadCase } from './simpleBeam';

const W = 360;
const H = 170;
const BEAM_Y = 85;
const BEAM_HT = 13;
const BEAM_X1 = 44;
const BEAM_X2 = 316;
const SUP_H = 17;
const BEAM_TOP = BEAM_Y - BEAM_HT / 2;
const BEAM_BOT = BEAM_Y + BEAM_HT / 2;
const GND_Y = BEAM_BOT + SUP_H;

function tri(cx: number, baseY: number, h: number): string {
  const hw = h * 0.7;
  return `${cx},${baseY} ${cx - hw},${baseY + h} ${cx + hw},${baseY + h}`;
}

function arrowHead(x: number, tipY: number, size: number): string {
  return `${x},${tipY} ${x - size / 2},${tipY - size} ${x + size / 2},${tipY - size}`;
}

function gndLines(cx: number, y: number): string {
  const w = 26;
  let s = `<line x1="${cx - w / 2}" y1="${y}" x2="${cx + w / 2}" y2="${y}" stroke="#555" stroke-width="1.5"/>`;
  for (let i = 0; i <= w; i += 5) {
    const x0 = cx - w / 2 + i;
    s += `<line x1="${x0}" y1="${y}" x2="${x0 - 7}" y2="${y + 9}" stroke="#888" stroke-width="1"/>`;
  }
  return s;
}

export function getBeamSVGString(
  loadCase: LoadCase,
  spanLabel?: string,
  loadLabel?: string,
): string {
  const ARROW_LEN = 36;
  const ARROW_HEAD_SIZE = 8;
  const arrowTopY = BEAM_TOP - ARROW_LEN;

  // Load arrows
  let loadSVG = '';
  if (loadCase === 'center') {
    const cx = (BEAM_X1 + BEAM_X2) / 2;
    loadSVG = `
      <line x1="${cx}" y1="${arrowTopY}" x2="${cx}" y2="${BEAM_TOP - 1}" stroke="#dc2626" stroke-width="2.5"/>
      <polygon points="${arrowHead(cx, BEAM_TOP - 1, ARROW_HEAD_SIZE)}" fill="#dc2626"/>
      ${loadLabel ? `<text x="${cx}" y="${arrowTopY - 5}" text-anchor="middle" font-size="11" font-weight="700" fill="#dc2626">${loadLabel}</text>` : ''}
    `;
  } else {
    // Uniform: 7 arrows + top bar
    const count = 7;
    const step = (BEAM_X2 - BEAM_X1) / (count - 1);
    const midIdx = Math.floor(count / 2);
    loadSVG = `<line x1="${BEAM_X1}" y1="${arrowTopY}" x2="${BEAM_X2}" y2="${arrowTopY}" stroke="#dc2626" stroke-width="2"/>`;
    for (let i = 0; i < count; i++) {
      const x = BEAM_X1 + i * step;
      loadSVG += `
        <line x1="${x}" y1="${arrowTopY}" x2="${x}" y2="${BEAM_TOP - 1}" stroke="#dc2626" stroke-width="1.5"/>
        <polygon points="${arrowHead(x, BEAM_TOP - 1, ARROW_HEAD_SIZE * 0.8)}" fill="#dc2626"/>
      `;
      if (i === midIdx && loadLabel) {
        loadSVG += `<text x="${x}" y="${arrowTopY - 5}" text-anchor="middle" font-size="11" font-weight="700" fill="#dc2626">${loadLabel}</text>`;
      }
    }
  }

  // Span dimension line
  const dimY = GND_Y + 26;
  const spanDim = spanLabel ? `
    <line x1="${BEAM_X1}" y1="${dimY - 4}" x2="${BEAM_X1}" y2="${dimY + 4}" stroke="#374151" stroke-width="1"/>
    <line x1="${BEAM_X2}" y1="${dimY - 4}" x2="${BEAM_X2}" y2="${dimY + 4}" stroke="#374151" stroke-width="1"/>
    <line x1="${BEAM_X1}" y1="${dimY}" x2="${BEAM_X2}" y2="${dimY}" stroke="#374151" stroke-width="1"/>
    <text x="${(BEAM_X1 + BEAM_X2) / 2}" y="${dimY + 13}" text-anchor="middle" font-size="11" font-weight="600" fill="#374151">L = ${spanLabel}</text>
  ` : '';

  return `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" width="320" height="150" style="display:block;background:#f8fafc;border:1px solid #d0d0d0;border-radius:4px;">
    <!-- Beam bar -->
    <rect x="${BEAM_X1}" y="${BEAM_TOP}" width="${BEAM_X2 - BEAM_X1}" height="${BEAM_HT}" fill="#2563eb" rx="2"/>
    <!-- Pin support (left) -->
    <polygon points="${tri(BEAM_X1, BEAM_BOT, SUP_H)}" fill="#1e3a5f"/>
    ${gndLines(BEAM_X1, GND_Y)}
    <!-- Roller support (right) -->
    <polygon points="${tri(BEAM_X2, BEAM_BOT, SUP_H)}" fill="none" stroke="#1e3a5f" stroke-width="2"/>
    <circle cx="${BEAM_X2}" cy="${GND_Y + 5}" r="5" fill="none" stroke="#1e3a5f" stroke-width="2"/>
    ${gndLines(BEAM_X2, GND_Y + 10)}
    <!-- Labels -->
    <text x="${BEAM_X1}" y="${GND_Y + (spanLabel ? 16 : 22)}" text-anchor="middle" font-size="9" fill="#555">ピン</text>
    <text x="${BEAM_X2}" y="${GND_Y + (spanLabel ? 16 : 22)}" text-anchor="middle" font-size="9" fill="#555">ローラ</text>
    <!-- Load arrows -->
    ${loadSVG}
    <!-- Span dimension -->
    ${spanDim}
  </svg>`;
}
