function hdim(x1: number, x2: number, y: number, label: string): string {
  const cx = (x1 + x2) / 2;
  return `<line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke="#334155" stroke-width="1"/>
  <line x1="${x1}" y1="${y - 4}" x2="${x1}" y2="${y + 4}" stroke="#334155" stroke-width="1"/>
  <line x1="${x2}" y1="${y - 4}" x2="${x2}" y2="${y + 4}" stroke="#334155" stroke-width="1"/>
  <text x="${cx}" y="${y + 12}" text-anchor="middle" font-size="9.5" fill="#1f2937" font-weight="700">${label}</text>`;
}

export function getBoltSVGString(): string {
  const cy = 108;

  const headX = 52;
  const headW = 26;
  const headH = 56;

  const dPx = 20;
  const shankX1 = headX + headW;

  const plateX1 = shankX1;
  const plateX2 = plateX1 + 80;

  const pwX1 = plateX2;
  const pwX2 = pwX1 + 10;

  const swX1 = pwX2;
  const swX2 = swX1 + 10;

  const nutX1 = swX2;
  const nutX2 = nutX1 + 38;

  const tipX1 = nutX2;
  const tipX2 = tipX1 + 28;

  const shaftY = cy - dPx / 2;

  return `<svg viewBox="0 0 420 235" xmlns="http://www.w3.org/2000/svg" width="400" height="224" style="display:block;max-width:100%;background:#f8fafc;border:1px solid #cbd5e1;border-radius:6px;">
  <line x1="30" y1="${cy}" x2="392" y2="${cy}" stroke="#94a3b8" stroke-dasharray="4 3" stroke-width="1"/>

  <polygon points="${headX},${cy - headH / 2} ${headX + headW},${cy - headH / 2} ${headX + headW + 8},${cy - headH / 2 + 10} ${headX + headW + 8},${cy + headH / 2 - 10} ${headX + headW},${cy + headH / 2} ${headX},${cy + headH / 2} ${headX - 8},${cy + headH / 2 - 10} ${headX - 8},${cy - headH / 2 + 10}" fill="#94a3b8" stroke="#334155" stroke-width="1.2"/>

  <rect x="${shankX1}" y="${shaftY}" width="${tipX2 - shankX1}" height="${dPx}" fill="#64748b" stroke="#334155" stroke-width="1"/>
  <rect x="${plateX1}" y="${cy - 29}" width="${plateX2 - plateX1}" height="58" fill="#dbeafe" stroke="#1d4ed8" stroke-width="1.2"/>
  <rect x="${pwX1}" y="${cy - 37}" width="${pwX2 - pwX1}" height="74" fill="#cbd5e1" stroke="#334155" stroke-width="1"/>
  <rect x="${swX1}" y="${cy - 33}" width="${swX2 - swX1}" height="66" fill="#e2e8f0" stroke="#334155" stroke-width="1" stroke-dasharray="4 2"/>
  <polygon points="${nutX1},${cy - 25} ${nutX2},${cy - 25} ${nutX2 + 7},${cy - 17} ${nutX2 + 7},${cy + 17} ${nutX2},${cy + 25} ${nutX1},${cy + 25}" fill="#a3b8cf" stroke="#334155" stroke-width="1.2"/>

  ${Array.from({ length: 5 }).map((_, i) => {
    const x = tipX1 + 3 + i * ((tipX2 - tipX1 - 6) / 4);
    return `<line x1="${x}" y1="${shaftY}" x2="${x}" y2="${shaftY + dPx}" stroke="#cbd5e1" stroke-width="1"/>`;
  }).join('')}

  <text x="${headX + headW / 2}" y="${cy - 34}" text-anchor="middle" font-size="9" fill="#334155" font-weight="700">ボルト頭</text>
  <text x="${(plateX1 + plateX2) / 2}" y="${cy - 34}" text-anchor="middle" font-size="9" fill="#1d4ed8" font-weight="700">締結体</text>
  <text x="${(pwX1 + pwX2) / 2}" y="${cy - 43}" text-anchor="middle" font-size="9" fill="#334155" font-weight="700">平座金</text>
  <text x="${(swX1 + swX2) / 2 + 7}" y="${cy - 43}" text-anchor="middle" font-size="9" fill="#334155" font-weight="700">ばね座金</text>
  <text x="${(nutX1 + nutX2) / 2 + 4}" y="${cy - 31}" text-anchor="middle" font-size="9" fill="#334155" font-weight="700">ナット</text>

  ${hdim(plateX1, plateX2, 170, 't')}
  ${hdim(pwX1, pwX2, 184, 'Hpw')}
  ${hdim(swX1, swX2, 198, 'Hsw')}
  ${hdim(nutX1, nutX2, 212, 'Hnut')}
  ${hdim(tipX1, tipX2, 156, '>3p')}
  ${hdim(shankX1, tipX2, 46, 'L_required（首下長さ）')}
  </svg>`;
}
