'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ARTICLES } from '@/lib/data/articles';

export default function ArticlesPage() {
  const [query, setQuery] = useState('');

  const filtered = ARTICLES.filter((a) => {
    if (!a.available) return false;
    const q = query.trim().toLowerCase();
    return !q || a.title.toLowerCase().includes(q) || a.desc.toLowerCase().includes(q);
  });

  return (
    <div className="tools-wrap">
      <div className="tools-page-head">
        <h1 className="tools-page-title">解説記事</h1>
        <p className="tools-page-desc">計算ツールに関連する基礎知識・解説記事をまとめています。</p>
      </div>

      <div className="tools-filter-bar">
        <input
          className="tools-search"
          type="search"
          placeholder="キーワード検索..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="記事を検索"
        />
      </div>

      <div className="tools-grid">
        {filtered.length === 0 && (
          <p className="tools-empty">「{query}」に一致する記事が見つかりませんでした。</p>
        )}
        {filtered.map((article) => (
          <Link key={article.id} href={article.href} className="tools-card">
            <span className="tools-card-title">{article.title}</span>
            <span className="tools-card-desc">{article.desc}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
