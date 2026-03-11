'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import type { ArticleMeta } from '@/lib/content/articles';
import CardDiagram from '@/app/components/CardDiagram';
import { formatContentDate } from '@/lib/contentDates';

export default function ArticlesClient({
  initialArticles,
  initialQuery = '',
  initialTag,
}: {
  initialArticles: ArticleMeta[];
  initialQuery?: string;
  initialTag?: string;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = useMemo(
    () => ['all', ...Array.from(new Set(initialArticles.map((article) => article.category)))],
    [initialArticles],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return initialArticles.filter((article) => {
      if (selectedCategory !== 'all' && article.category !== selectedCategory) return false;
      if (!q) return true;
      return (
        article.title.toLowerCase().includes(q) ||
        article.description.toLowerCase().includes(q) ||
        article.tags.some((tag) => tag.toLowerCase().includes(q)) ||
        article.category.toLowerCase().includes(q)
      );
    });
  }, [initialArticles, query, selectedCategory]);

  return (
    <>
      <nav className="article-filter-nav" aria-label="記事カテゴリ">
        {categories.map((category) => {
          const active = category === selectedCategory;
          return (
            <button
              key={category}
              type="button"
              className={`article-filter-chip${active ? ' article-filter-chip--active' : ''}`}
              onClick={() => setSelectedCategory(category)}
              aria-pressed={active}
            >
              {category === 'all' ? 'すべて' : category}
            </button>
          );
        })}
      </nav>

      <div className="tools-filter-bar">
        <label className="article-search-field">
          <span className="sr-only">
            {initialTag ? `タグ ${initialTag} の記事を検索` : '記事を検索'}
          </span>
          <input
            className="tools-search article-search-input"
            type="search"
            placeholder="キーワード検索..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label={initialTag ? `タグ ${initialTag} の記事を検索` : '記事を検索'}
          />
        </label>
      </div>

      <div className="tools-grid">
        {filtered.length === 0 && (
          <p className="tools-empty">「{query}」に一致する記事が見つかりませんでした。</p>
        )}

        {filtered.map((article) => (
          <Link key={article.slug} href={article.href} className="tools-card">
            <CardDiagram variant="article" diagramKey={article.diagramKey} className="tools-card-diagram" />
            <h3 className="tools-card-title">{article.title}</h3>
            <p className="tools-card-desc">{article.description}</p>
            <div className="article-card-meta">
              <span>{article.category}</span>
              <span>更新: {formatContentDate(article.updatedAt)}</span>
            </div>
            <div className="article-card-tags">
              {article.tags.map((tag) => (
                <span key={`${article.slug}-${tag}`} className="article-tag-chip article-tag-chip--muted">
                  {tag}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
