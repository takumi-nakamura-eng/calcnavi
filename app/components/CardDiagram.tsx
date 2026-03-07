import { resolveArticleCardDiagram, resolveToolCardDiagram } from './cardDiagramRenderers';

interface CardDiagramProps {
  diagramKey: string;
  variant: 'article' | 'tool';
  className?: string;
  svgMarkup?: string;
}

export default function CardDiagram({ diagramKey, variant, className, svgMarkup }: CardDiagramProps) {
  if (variant === 'article' && svgMarkup) {
    return <div className={className} dangerouslySetInnerHTML={{ __html: svgMarkup }} />;
  }
  const sketch =
    variant === 'article' ? resolveArticleCardDiagram(diagramKey) : resolveToolCardDiagram(diagramKey);
  return <div className={className}>{sketch}</div>;
}
