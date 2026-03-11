import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ArticlesClient from '@/app/articles/ArticlesClient';
import Breadcrumbs from '@/app/components/Breadcrumbs';
import { getAllArticles } from '@/lib/content/articles';
import { buildMetadata } from '@/lib/seo';

export const revalidate = 3600;

export async function generateStaticParams() {
  const articles = await getAllArticles();
  const tags = Array.from(new Set(articles.flatMap((article) => article.tags)));
  return tags.map((tag) => ({ tag }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>;
}): Promise<Metadata> {
  const { tag } = await params;
  return buildMetadata({
    title: `タグ: ${tag}`,
    description: `${tag} に関連する解説記事一覧です。`,
    path: `/tags/${encodeURIComponent(tag)}`,
  });
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;
  const articles = await getAllArticles();
  const filtered = articles.filter((article) => article.tags.includes(tag));

  if (filtered.length === 0) notFound();

  return (
    <div className="tools-wrap">
      <Breadcrumbs
        items={[
          { name: 'ホーム', href: '/' },
          { name: '解説記事', href: '/articles' },
          { name: `タグ: ${tag}` },
        ]}
      />
      <div className="tools-page-head">
        <h1 className="tools-page-title">タグ: {tag}</h1>
        <p className="tools-page-desc">{tag} を含む解説記事を一覧表示しています。</p>
      </div>
      <ArticlesClient initialArticles={filtered} initialTag={tag} />
    </div>
  );
}
