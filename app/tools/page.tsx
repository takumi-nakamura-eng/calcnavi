'use client';

import { useState } from 'react';
import Link from 'next/link';
import { TOOLS } from '@/lib/data/tools';

export default function ToolsPage() {
  const [query, setQuery] = useState('');

  const filtered = TOOLS.filter((t) => {
    if (!t.available) return false;
    const q = query.trim().toLowerCase();
    return !q || t.title.toLowerCase().includes(q) || t.desc.toLowerCase().includes(q);
  });

  return (
    <div className="tools-wrap">
      <div className="tools-page-head">
        <h1 className="tools-page-title">計算ツール</h1>
        <p className="tools-page-desc">設計・施工・暮らしに役立つ計算ツールを提供しています。</p>
      </div>

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
    </div>
  );
}
