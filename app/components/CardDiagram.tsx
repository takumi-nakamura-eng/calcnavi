interface CardDiagramProps {
  diagramKey: string;
  variant: 'article' | 'tool';
  className?: string;
  svgMarkup?: string;
}

function BoltSketch() {
  return (
    <svg viewBox="0 0 240 140" aria-hidden="true">
      <defs>
        <linearGradient id="bolt-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f8fafc" />
          <stop offset="100%" stopColor="#e2e8f0" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="240" height="140" rx="14" fill="url(#bolt-bg)" />
      <polygon points="40,72 62,55 92,55 92,89 62,89" fill="#64748b" />
      <rect x="92" y="63" width="100" height="18" rx="6" fill="#475569" />
      <line x1="105" y1="63" x2="105" y2="81" stroke="#cbd5e1" strokeWidth="1.5" />
      <line x1="118" y1="63" x2="118" y2="81" stroke="#cbd5e1" strokeWidth="1.5" />
      <line x1="131" y1="63" x2="131" y2="81" stroke="#cbd5e1" strokeWidth="1.5" />
      <line x1="144" y1="63" x2="144" y2="81" stroke="#cbd5e1" strokeWidth="1.5" />
      <line x1="157" y1="63" x2="157" y2="81" stroke="#cbd5e1" strokeWidth="1.5" />
      <line x1="170" y1="63" x2="170" y2="81" stroke="#cbd5e1" strokeWidth="1.5" />
      <circle cx="201" cy="72" r="12" fill="#94a3b8" />
    </svg>
  );
}

function BeamSketch() {
  return (
    <svg viewBox="0 0 240 140" aria-hidden="true">
      <rect x="0" y="0" width="240" height="140" rx="14" fill="#eff6ff" />
      <rect x="36" y="66" width="168" height="12" rx="5" fill="#2563eb" />
      <polygon points="44,78 32,96 56,96" fill="#334155" />
      <polygon points="196,78 184,96 208,96" fill="none" stroke="#334155" strokeWidth="2" />
      <circle cx="196" cy="101" r="4" fill="none" stroke="#334155" strokeWidth="2" />
      <line x1="120" y1="36" x2="120" y2="62" stroke="#dc2626" strokeWidth="2.5" />
      <polygon points="120,69 114,60 126,60" fill="#dc2626" />
      <line x1="44" y1="112" x2="196" y2="112" stroke="#475569" strokeWidth="1.2" />
      <text x="120" y="126" textAnchor="middle" fontSize="11" fill="#334155">
        L
      </text>
    </svg>
  );
}

function SectionSketch() {
  return (
    <svg viewBox="0 0 240 140" aria-hidden="true">
      <rect x="0" y="0" width="240" height="140" rx="14" fill="#f8fafc" />
      <rect x="60" y="30" width="120" height="16" rx="4" fill="#334155" />
      <rect x="110" y="46" width="20" height="48" fill="#334155" />
      <rect x="60" y="94" width="120" height="16" rx="4" fill="#334155" />
      <line x1="40" y1="70" x2="200" y2="70" stroke="#2563eb" strokeDasharray="5 4" />
      <line x1="58" y1="22" x2="182" y2="22" stroke="#64748b" />
      <line x1="58" y1="22" x2="58" y2="28" stroke="#64748b" />
      <line x1="182" y1="22" x2="182" y2="28" stroke="#64748b" />
      <text x="120" y="18" textAnchor="middle" fontSize="11" fill="#475569">
        B
      </text>
    </svg>
  );
}

function GenericSketch() {
  return (
    <svg viewBox="0 0 240 140" aria-hidden="true">
      <rect x="0" y="0" width="240" height="140" rx="14" fill="#f1f5f9" />
      <rect x="30" y="26" width="180" height="88" rx="10" fill="#ffffff" stroke="#cbd5e1" />
      <line x1="45" y1="50" x2="195" y2="50" stroke="#cbd5e1" strokeWidth="2" />
      <line x1="45" y1="68" x2="170" y2="68" stroke="#cbd5e1" strokeWidth="2" />
      <line x1="45" y1="86" x2="155" y2="86" stroke="#cbd5e1" strokeWidth="2" />
    </svg>
  );
}

function resolveArticleSketch(diagramKey: string) {
  const key = diagramKey.toLowerCase();
  if (
    key.includes('thread') ||
    key.includes('nut') ||
    key.includes('washer') ||
    key.includes('bolt')
  ) {
    return <BoltSketch />;
  }
  if (
    key.includes('beam') ||
    key.includes('deflection') ||
    key.includes('stress') ||
    key.includes('channel')
  ) {
    return <BeamSketch />;
  }
  if (
    key.includes('section') ||
    key.includes('modulus') ||
    key.includes('inertia') ||
    key.includes('tube')
  ) {
    return <SectionSketch />;
  }
  return <GenericSketch />;
}

function resolveToolSketch(diagramKey: string) {
  switch (diagramKey) {
    case 'bolt-length':
      return <BoltSketch />;
    case 'beam':
      return <BeamSketch />;
    case 'section-properties':
      return <SectionSketch />;
    default:
      return <GenericSketch />;
  }
}

export default function CardDiagram({ diagramKey, variant, className, svgMarkup }: CardDiagramProps) {
  if (variant === 'article' && svgMarkup) {
    return <div className={className} dangerouslySetInnerHTML={{ __html: svgMarkup }} />;
  }
  const sketch = variant === 'article' ? resolveArticleSketch(diagramKey) : resolveToolSketch(diagramKey);
  return <div className={className}>{sketch}</div>;
}
