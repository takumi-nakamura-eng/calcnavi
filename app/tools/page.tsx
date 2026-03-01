import type { Metadata } from 'next';
import { Suspense } from 'react';
import ToolsClient from './ToolsClient';
import Breadcrumbs from '@/app/components/Breadcrumbs';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: '計算ツール',
  description: '設計・施工・暮らしに役立つ計算ツールを提供しています。',
  path: '/tools',
});

export default function ToolsPage() {
  return (
    <div className="tools-wrap">
      <Breadcrumbs items={[{ name: 'ホーム', href: '/' }, { name: '計算ツール' }]} />
      <div className="tools-page-head">
        <h1 className="tools-page-title">計算ツール</h1>
        <p className="tools-page-desc">設計・施工・暮らしに役立つ計算ツールを提供しています。</p>
      </div>
      <Suspense fallback={<p className="tools-empty">読み込み中...</p>}>
        <ToolsClient />
      </Suspense>
    </div>
  );
}
