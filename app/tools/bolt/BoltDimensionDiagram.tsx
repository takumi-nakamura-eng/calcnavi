'use client';

function Hdim({ x1, x2, y, label }: { x1: number; x2: number; y: number; label: string }) {
  return (
    <g>
      <line x1={x1} y1={y} x2={x2} y2={y} stroke="#334155" strokeWidth="1.1" />
      <line x1={x1} y1={y - 4} x2={x1} y2={y + 4} stroke="#334155" strokeWidth="1.1" />
      <line x1={x2} y1={y - 4} x2={x2} y2={y + 4} stroke="#334155" strokeWidth="1.1" />
      <text x={(x1 + x2) / 2} y={y + 13} textAnchor="middle" fontSize="11" fontWeight={700} fill="#1f2937">
        {label}
      </text>
    </g>
  );
}

export default function BoltDimensionDiagram() {
  const cy = 126;

  const headX = 76;
  const headW = 30;
  const headH = 66;

  const dPx = 24;
  const shankX1 = headX + headW;

  const plateX1 = shankX1;
  const plateX2 = plateX1 + 92;

  const pwX1 = plateX2;
  const pwX2 = pwX1 + 12;

  const swX1 = pwX2;
  const swX2 = swX1 + 12;

  const nutX1 = swX2;
  const nutX2 = nutX1 + 46;

  const tipX1 = nutX2;
  const tipX2 = tipX1 + 34;

  const shaftY = cy - dPx / 2;

  return (
    <svg
      viewBox="0 0 520 270"
      width="100%"
      aria-label="ボルト締結の概略図"
      style={{ display: 'block', maxWidth: 680 }}
    >
      <rect x="0" y="0" width="520" height="270" rx="10" fill="#f8fafc" stroke="#cbd5e1" />

      <line x1="52" y1={cy} x2="470" y2={cy} stroke="#94a3b8" strokeDasharray="4 3" />

      <polygon
        points={`${headX},${cy - headH / 2} ${headX + headW},${cy - headH / 2} ${headX + headW + 9},${cy - headH / 2 + 12} ${headX + headW + 9},${cy + headH / 2 - 12} ${headX + headW},${cy + headH / 2} ${headX},${cy + headH / 2} ${headX - 9},${cy + headH / 2 - 12} ${headX - 9},${cy - headH / 2 + 12}`}
        fill="#94a3b8"
        stroke="#334155"
        strokeWidth="1.4"
      />

      <rect
        x={shankX1}
        y={shaftY}
        width={tipX2 - shankX1}
        height={dPx}
        fill="#64748b"
        stroke="#334155"
        strokeWidth="1"
      />

      <rect x={plateX1} y={cy - 34} width={plateX2 - plateX1} height="68" fill="#dbeafe" stroke="#1d4ed8" strokeWidth="1.3" />
      <rect x={pwX1} y={cy - 44} width={pwX2 - pwX1} height="88" fill="#cbd5e1" stroke="#334155" strokeWidth="1.2" />
      <rect x={swX1} y={cy - 39} width={swX2 - swX1} height="78" fill="#e2e8f0" stroke="#334155" strokeDasharray="4 2" strokeWidth="1.2" />

      <polygon
        points={`${nutX1},${cy - 30} ${nutX2},${cy - 30} ${nutX2 + 8},${cy - 20} ${nutX2 + 8},${cy + 20} ${nutX2},${cy + 30} ${nutX1},${cy + 30}`}
        fill="#a3b8cf"
        stroke="#334155"
        strokeWidth="1.3"
      />

      <g>
        {Array.from({ length: 6 }).map((_, i) => {
          const x = tipX1 + 4 + i * ((tipX2 - tipX1 - 8) / 5);
          return <line key={i} x1={x} y1={shaftY} x2={x} y2={shaftY + dPx} stroke="#cbd5e1" strokeWidth="1.1" />;
        })}
      </g>

      <text x={headX + headW / 2} y={cy - 42} textAnchor="middle" fontSize="10" fill="#334155" fontWeight={700}>ボルト頭</text>
      <text x={(plateX1 + plateX2) / 2} y={cy - 42} textAnchor="middle" fontSize="10" fill="#1d4ed8" fontWeight={700}>締結体</text>
      <text x={(pwX1 + pwX2) / 2} y={cy - 52} textAnchor="middle" fontSize="10" fill="#334155" fontWeight={700}>平座金</text>
      <text x={(swX1 + swX2) / 2 + 8} y={cy - 52} textAnchor="middle" fontSize="10" fill="#334155" fontWeight={700}>ばね座金</text>
      <text x={(nutX1 + nutX2) / 2 + 4} y={cy - 38} textAnchor="middle" fontSize="10" fill="#334155" fontWeight={700}>ナット</text>

      <Hdim x1={plateX1} x2={plateX2} y={200} label="t" />
      <Hdim x1={pwX1} x2={pwX2} y={216} label="Hpw" />
      <Hdim x1={swX1} x2={swX2} y={232} label="Hsw" />
      <Hdim x1={nutX1} x2={nutX2} y={248} label="Hnut" />
      <Hdim x1={tipX1} x2={tipX2} y={184} label=">3p" />
      <Hdim x1={shankX1} x2={tipX2} y={54} label="L_required（首下長さ）" />
    </svg>
  );
}
