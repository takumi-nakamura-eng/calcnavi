import type { Metadata } from 'next';
import ArticlesClient from './ArticlesClient';
import Breadcrumbs from '@/app/components/Breadcrumbs';
import { getAllArticles } from '@/lib/content/articles';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: '解説記事',
  description: '計算ツールに関連する基礎知識・解説記事をまとめています。',
  path: '/articles',
});

export const revalidate = 3600;

export default async function ArticlesPage({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string }>;
}) {
  const params = (await searchParams) ?? {};
  const articles = await getAllArticles();

  return (
    <div className="tools-wrap">
      <Breadcrumbs items={[{ name: 'ホーム', href: '/' }, { name: '解説記事' }]} />
      <div className="tools-page-head">
        <h1 className="tools-page-title">解説記事</h1>
        <p className="tools-page-desc">
          計算ツールに関連する基礎知識・解説記事をまとめています。
        </p>
      </div>
      <ArticlesClient initialArticles={articles} initialQuery={params.q ?? ''} />
    </div>
  );
}
