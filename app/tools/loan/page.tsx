import type { Metadata } from 'next';
import LoanCalculator from '../../components/LoanCalculator';

export const metadata: Metadata = {
  title: 'ローン計算機 | 住宅・車ローンの月々返済額を試算',
  description:
    'ローン額・年利率・返済期間を入力するだけで、月々の返済額・総返済額・総利息額を即座に計算。詳細な返済スケジュール表も確認できます。',
};

export default function LoanPage() {
  return (
    <main className="container">
      <h1 className="page-title">ローン計算機</h1>
      <p className="page-description">
        ローン額・年利率・返済期間を入力して、月々の返済額を計算します（元利均等返済方式）。
      </p>
      <LoanCalculator />
      <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '2rem', lineHeight: 1.7 }}>
        ※ 計算結果はすべて参考値です。実際の返済額は金利・返済条件・金融機関によって異なります。
        最終的な判断は各金融機関の担当者またはファイナンシャルプランナーにご確認ください。
      </p>
    </main>
  );
}
