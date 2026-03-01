import type { Metadata } from 'next';
import LoanCalculator from '../../components/LoanCalculator';
import AdSlot from '@/app/components/ads/AdSlot';
import RelatedArticles from '@/app/components/RelatedArticles';
import { getAllArticles } from '@/lib/content/articles';
import { getToolById } from '@/lib/data/tools';
import { SITE_NAME, SITE_URL } from '@/lib/site';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'ローン計算機',
  description:
    'ローン額・年利率・返済期間を入力するだけで、月々の返済額・総返済額・総利息額を即座に計算。詳細な返済スケジュール表も確認できます。',
  path: '/tools/loan',
});

export default async function LoanPage() {
  const tool = getToolById('loan');
  const allArticles = await getAllArticles();
  const relatedArticles = allArticles.filter((article) =>
    tool?.relatedArticleSlugs.includes(article.slug),
  );

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'ローン計算機',
    operatingSystem: 'Web',
    applicationCategory: 'FinanceApplication',
    description:
      'ローン額・金利・返済期間から月々の返済額、総返済額、総利息を計算する無料ツール。',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'JPY',
    },
    url: `${SITE_URL}/tools/loan`,
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
    },
  };

  return (
    <main className="container">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <h1 className="page-title">ローン計算機</h1>
      <p className="page-description">
        ローン額・年利率・返済期間を入力して、月々の返済額を計算します（元利均等返済方式）。
      </p>
      <LoanCalculator />
      <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '2rem', lineHeight: 1.7 }}>
        ※ 計算結果はすべて参考値です。実際の返済額は金利・返済条件・金融機関によって異なります。
        最終的な判断は各金融機関の担当者またはファイナンシャルプランナーにご確認ください。
      </p>

      <AdSlot slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOOL} className="tool-ad" />
      <RelatedArticles
        source="tool:loan"
        items={relatedArticles.map((article) => ({
          slug: article.slug,
          title: article.title,
          description: article.description,
          href: article.href,
        }))}
      />
    </main>
  );
}
