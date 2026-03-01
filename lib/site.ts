export const SITE_NAME = 'calcnavi';
export const SITE_DESCRIPTION =
  '機械設計・施工に役立つ計算ツールと解説をまとめたサイト。ボルト計算・梁計算・断面性能計算を無料で提供しています。';

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ?? 'https://www.calcnavi.com';
