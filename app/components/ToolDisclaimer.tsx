interface ToolDisclaimerProps {
  text: string;
}

export default function ToolDisclaimer({ text }: ToolDisclaimerProps) {
  return (
    <div className="tool-disclaimer" role="note" aria-label="免責事項">
      <span className="tool-disclaimer__icon" aria-hidden="true">⚠️</span>
      <p className="tool-disclaimer__text">{text}</p>
    </div>
  );
}
