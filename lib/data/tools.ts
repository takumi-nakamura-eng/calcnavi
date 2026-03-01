export interface ToolItem {
  id: string;
  title: string;
  desc: string;
  href: string;
  available: boolean;
  category: string;
  keywords: string[];
  relatedArticleSlugs: string[];
}

export const TOOLS: ToolItem[] = [
  {
    id: 'loan',
    title: '住宅ローン計算機',
    desc: '月々の返済額・総返済額・総利息を試算。詳細な返済スケジュール表も確認できます。',
    href: '/tools/loan',
    available: true,
    category: 'ローン',
    keywords: ['住宅ローン', '返済額', '金利', '元利均等'],
    relatedArticleSlugs: [],
  },
  {
    id: 'bolt-length',
    title: 'ボルト長さ計算',
    desc: 'ナット・座金の組み合わせから必要なボルト長さと推奨購入長さを計算します。',
    href: '/tools/bolt',
    available: true,
    category: 'ねじ・締結',
    keywords: ['ボルト', 'ナット', '座金', 'ピッチ', '3山'],
    relatedArticleSlugs: ['coarse-thread', 'washer-role', 'three-threads', 'nut-basics'],
  },
  {
    id: 'beam',
    title: '単純梁（単純支持）計算',
    desc: '曲げ応力・最大たわみを計算し OK/NG 判定。中央集中荷重・等分布荷重に対応。',
    href: '/tools/beams/simple-supported',
    available: true,
    category: '梁・断面',
    keywords: ['単純梁', 'たわみ', '曲げ応力', '断面係数', '断面二次モーメント'],
    relatedArticleSlugs: [],
  },
  {
    id: 'section-properties',
    title: '断面性能計算',
    desc: 'H形鋼・角形鋼管・丸形鋼管など6断面形状の断面二次モーメント・断面係数・断面積・重量を計算します。',
    href: '/tools/section-properties',
    available: true,
    category: '梁・断面',
    keywords: ['断面二次モーメント', '断面係数', '断面積', '重量', 'H形鋼'],
    relatedArticleSlugs: [],
  },
  {
    id: 'anchor',
    title: 'アンカーボルト強度計算',
    desc: 'アンカーボルトの引張・せん断強度を試算します。',
    href: '#',
    available: false,
    category: 'ねじ・締結',
    keywords: ['アンカーボルト', '引張強度', 'せん断強度'],
    relatedArticleSlugs: [],
  },
  {
    id: 'unit',
    title: '単位換算ツール',
    desc: 'mm↔inch、N↔kgf など建設・機械系でよく使う単位を変換します。',
    href: '#',
    available: false,
    category: '基礎計算',
    keywords: ['単位換算', 'mm', 'inch', 'N', 'kgf'],
    relatedArticleSlugs: [],
  },
];

export function getToolById(id: string): ToolItem | undefined {
  return TOOLS.find((tool) => tool.id === id);
}

export function getToolByHref(href: string): ToolItem | undefined {
  return TOOLS.find((tool) => tool.href === href);
}
