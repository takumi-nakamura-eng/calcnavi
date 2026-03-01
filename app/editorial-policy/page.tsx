import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: '編集ポリシー',
  description:
    'calcnavi の編集方針。引用方針、転載禁止、更新方針、免責事項を定義しています。',
  path: '/editorial-policy',
});

export default function EditorialPolicyPage() {
  return (
    <main className="container static-content">
      <h1 className="page-title">編集ポリシー</h1>
      <p className="page-description">
        calcnavi は機械実務の意思決定に使える情報提供を目的とし、低品質な量産を行いません。
      </p>

      <h2>引用方針</h2>
      <ul>
        <li>引用は必要最小限の短文に限定します。</li>
        <li>本文では要約を基本とし、引用箇所は出典URLと参照日を明示します。</li>
        <li>一次情報、公的資料、メーカー資料、学術情報を優先して参照します。</li>
      </ul>

      <h2>転載禁止</h2>
      <ul>
        <li>他サイト本文の無断転載・大量引用は行いません。</li>
        <li>図表は独自作成または利用条件を満たしたもののみ使用します。</li>
      </ul>

      <h2>更新方針</h2>
      <ul>
        <li>記事の更新日は frontmatter の updatedAt で管理します。</li>
        <li>規格・基準変更の可能性があるテーマは定期再確認します。</li>
        <li>出典は最低3件を原則とし、参照日を明記します。</li>
      </ul>

      <h2>免責</h2>
      <ul>
        <li>計算結果・解説は参考情報です。</li>
        <li>最終的な設計・施工判断は、利用者の責任で規格・専門家確認を行ってください。</li>
      </ul>
    </main>
  );
}
