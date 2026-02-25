import type { Metadata } from 'next';
import Nav from './components/Nav';
import { GoogleAnalytics } from '@next/third-parties/google';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'ローン計算機 | 住宅・車ローンの月々返済額を試算',
    template: '%s | ローン計算機',
  },
  description:
    '住宅ローンや車ローンの月々の返済額、総返済額、総利息額を無料で計算。元利均等返済方式による詳細な返済スケジュールも確認できます。',
  verification: {
    google: '_s1QVEtZdDk23z5f3faZKgRjWDcR1MuOGDZd_35LFDk',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>
        <Nav />
        {children}
        <GoogleAnalytics gaId="G-Q6PTFR8RMG" />
      </body>
    </html>
  );
}
