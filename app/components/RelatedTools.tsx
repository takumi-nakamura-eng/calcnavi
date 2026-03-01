'use client';

import Link from 'next/link';
import { trackRelatedClick } from '@/lib/analytics/events';
import CardDiagram from '@/app/components/CardDiagram';

export interface RelatedToolItem {
  id: string;
  title: string;
  desc: string;
  href: string;
  diagramKey: string;
}

export default function RelatedTools({
  items,
  source,
}: {
  items: RelatedToolItem[];
  source: string;
}) {
  return (
    <section className="related-block">
      <h2 className="home-section-title related-title">関連計算ツール</h2>
      {items.length === 0 ? (
        <p className="page-description">関連計算ツールは準備中です。</p>
      ) : (
        <div className="portal-cards">
          {items.map((tool) => (
            <Link
              key={tool.id}
              href={tool.href}
              className="portal-card"
              onClick={() =>
                trackRelatedClick({
                  source,
                  destinationType: 'tool',
                  destinationId: tool.id,
                })
              }
            >
              <CardDiagram variant="tool" diagramKey={tool.diagramKey} className="portal-card-diagram" />
              <span className="portal-card-title">{tool.title}</span>
              <span className="portal-card-desc">{tool.desc}</span>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
