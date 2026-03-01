'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { TOOLS } from '@/lib/data/tools';

export default function ToolsClient() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') ?? '';
  const [query, setQuery] = useState(initialQuery);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return TOOLS.filter((t) => {
      if (!t.available) return false;
      if (!q) return true;

      return (
        t.title.toLowerCase().includes(q) ||
        t.desc.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        t.keywords.some((keyword) => keyword.toLowerCase().includes(q))
      );
    });
  }, [query]);

  return (
    <>
      <div className="tools-filter-bar">
        <input
          className="tools-search"
          type="search"
          placeholder="キーワード検索..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="ツールを検索"
        />
      </div>

      <div className="tools-grid">
        {filtered.length === 0 && (
          <p className="tools-empty">「{query}」に一致するツールが見つかりませんでした。</p>
        )}
        {filtered.map((tool) => (
          <Link key={tool.id} href={tool.href} className="tools-card">
            <span className="tools-card-title">{tool.title}</span>
            <span className="tools-card-desc">{tool.desc}</span>
          </Link>
        ))}
      </div>
    </>
  );
}
