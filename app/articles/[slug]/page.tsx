import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ArticleViewTracker from '@/app/components/ArticleViewTracker';
import RelatedArticles from '@/app/components/RelatedArticles';
import RelatedTools from '@/app/components/RelatedTools';
import AdSlot from '@/app/components/ads/AdSlot';
import { TOOLS } from '@/lib/data/tools';
import {
  getAllArticles,
  getArticleBySlug,
  getArticleComponent,
  getRelatedArticles,
} from '@/lib/content/articles';
import { SITE_NAME, SITE_URL } from '@/lib/site';
import { buildMetadata } from '@/lib/seo';

export const revalidate = 3600;

export async function generateStaticParams() {
  const articles = await getAllArticles();
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) {
    return buildMetadata({
      title: '記事が見つかりません',
      description: '指定された記事が見つかりませんでした。',
      path: `/articles/${slug}`,
      type: 'article',
    });
  }

  return buildMetadata({
    title: article.meta.title,
    description: article.meta.description,
    path: article.meta.href,
    type: 'article',
  });
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const MDXContent = await getArticleComponent(slug);
  if (!MDXContent) notFound();

  const relatedArticles = await getRelatedArticles(slug, 3);
  const relatedTools = TOOLS.filter(
    (tool) => tool.available && article.meta.toolRefs.includes(tool.id),
  );

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.meta.title,
    description: article.meta.description,
    datePublished: article.meta.publishedAt,
    dateModified: article.meta.updatedAt,
    inLanguage: 'ja',
    mainEntityOfPage: `${SITE_URL}${article.meta.href}`,
    author: {
      '@type': 'Organization',
      name: SITE_NAME,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
    },
  };

  return (
    <main className="container">
      <ArticleViewTracker slug={article.meta.slug} category={article.meta.category} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      <h1 className="page-title">{article.meta.title}</h1>
      <p className="page-description">{article.meta.description}</p>

      <div className="article-meta">
        <span>公開日: {formatDate(article.meta.publishedAt)}</span>
        <span>更新日: {formatDate(article.meta.updatedAt)}</span>
        <span>カテゴリ: {article.meta.category}</span>
      </div>

      <article className="static-content article-content">
        <MDXContent />
      </article>

      <AdSlot slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_ARTICLE} className="article-ad" />

      <RelatedTools
        source={`article:${article.meta.slug}`}
        items={relatedTools.map((tool) => ({
          id: tool.id,
          title: tool.title,
          desc: tool.desc,
          href: tool.href,
        }))}
      />

      <RelatedArticles
        source={`article:${article.meta.slug}`}
        items={relatedArticles.map((item) => ({
          slug: item.slug,
          title: item.title,
          description: item.description,
          href: item.href,
        }))}
      />
    </main>
  );
}
