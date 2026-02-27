export interface ToolItem {
  id: string;
  title: string;
  desc: string;
  href: string;
  available: boolean;
}

export const TOOLS: ToolItem[] = [
  {
    id: 'loan',
    title: '住宅ローン計算機',
    desc: '月々の返済額・総返済額・総利息を試算。詳細な返済スケジュール表も確認できます。',
    href: '/tools/loan',
    available: true,
  },
  {
    id: 'bolt-length',
    title: 'ボルト長さ計算',
    desc: 'ナット・座金の組み合わせから必要なボルト長さと推奨購入長さを計算します。',
    href: '/tools/bolt',
    available: true,
  },
  {
    id: 'beam',
    title: '梁のたわみ計算',
    desc: '単純梁・片持ち梁のたわみ量を計算します。',
    href: '#',
    available: false,
  },
  {
    id: 'anchor',
    title: 'アンカーボルト強度計算',
    desc: 'アンカーボルトの引張・せん断強度を試算します。',
    href: '#',
    available: false,
  },
  {
    id: 'unit',
    title: '単位換算ツール',
    desc: 'mm↔inch、N↔kgf など建設・機械系でよく使う単位を変換します。',
    href: '#',
    available: false,
  },
];
