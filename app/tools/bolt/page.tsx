import type { Metadata } from 'next';
import Link from 'next/link';
import BoltCalculator from './BoltCalculator';

export const metadata: Metadata = {
  title: 'ボルト長さ計算 | ナット・座金込みの必要長さを計算',
  description:
    'ボルト呼び径・ナット・座金の組み合わせから必要なボルト長さ（先端3山確保）と推奨購入長さを計算します。M6〜M24対応。',
};

export default function BoltPage() {
  return (
    <main className="container">
      <h1 className="page-title">ボルト長さ計算</h1>
      <p className="page-description">
        ナット・座金の組み合わせから、先端3山確保に必要なボルト長さと推奨購入長さを計算します（M6〜M24）。
      </p>
      <BoltCalculator />
      <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '2rem', lineHeight: 1.7 }}>
        ※ 本ツールの結果は参考値です。最終確認は規格・メーカー・専門家にお問い合わせください。
      </p>

      <section style={{ marginTop: '3rem' }}>
        <h2 className="home-section-title" style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>関連解説記事</h2>
        <div className="portal-cards">
          <Link href="/articles/coarse-thread" className="portal-card">
            <span className="portal-card-title">並目とは</span>
            <span className="portal-card-desc">メートル並目ねじの意味・ピッチの考え方・細目との違いを整理します。</span>
          </Link>
          <Link href="/articles/washer-role" className="portal-card">
            <span className="portal-card-title">座金の役割</span>
            <span className="portal-card-desc">平座金・ばね座金を中心に、座金を何のために入れるのかを説明します。</span>
          </Link>
          <Link href="/articles/three-threads" className="portal-card">
            <span className="portal-card-title">先端3山出しの意味</span>
            <span className="portal-card-desc">ナットからねじ山を3山出すと言われる理由を製造面の観点から整理します。</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
