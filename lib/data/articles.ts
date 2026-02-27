export interface ArticleItem {
  id: string;
  title: string;
  desc: string;
  href: string;
  available: boolean;
}

export const ARTICLES: ArticleItem[] = [
  {
    id: 'nut-basics',
    title: 'ナットの基礎知識',
    desc: 'ナットの種類・規格・選び方を解説。JIS B 1181 に基づく 1種・2種・3種の違いなど。',
    href: '/articles/nut-basics',
    available: true,
  },
  {
    id: 'coarse-thread',
    title: '並目とは',
    desc: 'メートル並目ねじの意味・ピッチの考え方・細目との違いを短く整理します。',
    href: '/articles/coarse-thread',
    available: true,
  },
  {
    id: 'washer-role',
    title: '座金の役割',
    desc: '平座金・ばね座金を中心に、座金を何のために入れるのかを説明します。',
    href: '/articles/washer-role',
    available: true,
  },
  {
    id: 'three-threads',
    title: '先端3山出しの意味',
    desc: 'ナットからねじ山を3山出すと言われる理由を製造面の観点から整理します。',
    href: '/articles/three-threads',
    available: true,
  },
  {
    id: 'bolt-strength',
    title: 'ボルトの強度区分',
    desc: 'ボルトの強度区分（4.8・8.8・10.9 等）と用途の目安を解説します。',
    href: '#',
    available: false,
  },
  {
    id: 'loan-basics',
    title: '住宅ローンの基礎知識',
    desc: '元利均等・元金均等の違いや金利の仕組みをわかりやすく解説します。',
    href: '#',
    available: false,
  },
];
