import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '六角ナット基礎知識',
  description:
    '六角ナット（JIS B 1181）の基礎知識。ナット高さm、1種・2種・3種の違い、本アプリの前提と注意事項を解説します。',
};

export default function NutLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="container">
      <article className="prose">{children}</article>
    </main>
  );
}
