import { buildArticleDiagramStyle, type ArticleDiagramProps } from './shared';

export function DeflectionLimitLOverNSvg({
  width = 560,
  height = 200,
  maxWidth,
  ariaLabel = '許容たわみ L/200・L/300・L/400 の選び方',
  role = 'img',
  ariaHidden,
  framed = true,
  className,
}: ArticleDiagramProps) {
  return (
    <svg
      viewBox="0 0 560 200"
      preserveAspectRatio="xMidYMid meet"
      width={width}
      height={height}
      aria-label={ariaHidden ? undefined : ariaLabel}
      aria-hidden={ariaHidden}
      role={role}
      className={className}
      style={buildArticleDiagramStyle({ maxWidth, framed })}
    >
      <defs>
        <linearGradient id="deflection-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#eff6ff" />
          <stop offset="100%" stopColor="#dbeafe" />
        </linearGradient>
      </defs>

      <rect x="0" y="0" width="560" height="200" rx="18" fill="url(#deflection-bg)" />
      <rect x="20" y="18" width="520" height="164" rx="18" fill="rgba(255,255,255,0.72)" />

      <circle cx="64" cy="54" r="18" fill="#2563eb" />
      <text x="64" y="60" textAnchor="middle" fontSize="18" fontWeight="700" fill="#ffffff">
        δ
      </text>

      <text x="96" y="58" fontSize="11" fontWeight="700" fill="#1d4ed8">
        許容たわみ
      </text>
      <text x="40" y="96" fontSize="22" fontWeight="700" fill="#0f172a">
        L/200・L/300・L/400
      </text>
      <text x="40" y="122" fontSize="22" fontWeight="700" fill="#0f172a">
        の選び方
      </text>

      <rect x="40" y="144" width="56" height="20" rx="10" fill="#ffffff" />
      <text x="68" y="157" textAnchor="middle" fontSize="10" fontWeight="700" fill="#1d4ed8">
        梁
      </text>
      <rect x="102" y="144" width="64" height="20" rx="10" fill="#ffffff" />
      <text x="134" y="157" textAnchor="middle" fontSize="10" fontWeight="700" fill="#1d4ed8">
        たわみ
      </text>
      <rect x="172" y="144" width="72" height="20" rx="10" fill="#ffffff" />
      <text x="208" y="157" textAnchor="middle" fontSize="10" fontWeight="700" fill="#1d4ed8">
        一次判断
      </text>

      <g transform="translate(314 46)">
        <rect x="0" y="0" width="194" height="108" rx="16" fill="#ffffff" fillOpacity="0.8" />
        <line x1="24" y1="64" x2="170" y2="64" stroke="#0f172a" strokeWidth="8" strokeLinecap="round" />
        <polygon points="42,64 30,82 54,82" fill="#475569" />
        <polygon points="152,64 140,82 164,82" fill="none" stroke="#475569" strokeWidth="2" />
        <circle cx="152" cy="88" r="4" fill="none" stroke="#475569" strokeWidth="2" />
        <path d="M24 64 Q97 40 170 64" fill="none" stroke="#2563eb" strokeWidth="3.5" strokeLinecap="round" />
      </g>
    </svg>
  );
}
