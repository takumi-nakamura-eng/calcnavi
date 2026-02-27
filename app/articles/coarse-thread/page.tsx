import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '並目とは | メートル並目ねじの基礎',
  description: '並目（メートル並目ねじ）の意味、細目との違い、ピッチの考え方を短く整理します。',
};

export default function CoarseThreadPage() {
  return (
    <main className="container">
      <h1 className="page-title">並目とは</h1>
      <p className="page-description">
        メートル並目ねじの意味・ピッチの考え方・細目との違いをまとめました。
      </p>

      <div className="static-content">
        <h2>並目（メートル並目ねじ）とは</h2>
        <p>
          並目はメートルねじの標準ピッチです。「M16」「M12」のように呼び径だけで表記される場合、
          特に指定がない限り並目を指すのが一般的です※1。部品を発注・購入する際にピッチ指定を省略した場合も、
          多くのケースで並目が選ばれます。
        </p>

        <h2>ピッチ（p）とは</h2>
        <p>
          ピッチ（p）はねじ山の頂から隣の頂までの距離（mm）を指します※2。
          たとえばM10の並目ではピッチは1.5mm、M16では2.0mmです。ピッチが小さいほどねじ山は細かくなります。
          ボルト長さ計算では先端余長の算出に使われます（先端余長 = 3 × p）。
        </p>

        <h2>並目と細目の比較</h2>
        <p>
          同じ呼び径に対して「並目」と「細目」の2種類が存在する場合があります。
        </p>
        <ul>
          <li><strong>並目</strong>：各呼び径に対して1種類の標準ピッチ。汎用品として広く流通しており、入手性が高い。</li>
          <li><strong>細目</strong>：同じ呼び径でも並目よりピッチが細かい。精密調整・薄肉部品・振動環境向けに用いられるが、流通量が限られる場合がある。</li>
        </ul>

        <h2>互換に注意</h2>
        <p>
          同じ「M10」でも並目（ピッチ1.5mm）と細目（例：ピッチ1.25mm）ではピッチが異なります※1。
          並目ボルトに細目ナットを組み合わせる、または細目ボルトを並目タップ穴に締め込むと
          正しく締結できません。使用前に呼び径とピッチの両方を確認してください。
        </p>

        <h2>参考</h2>
        <ul>
          <li>
            ※1{' '}
            <a href="https://yamakinweb.com/column/%E3%81%AD%E3%81%98%E3%81%AE%E3%80%8C%E4%B8%A6%E7%9B%AE%E3%80%8D%E3%81%A8%E3%80%8C%E7%B4%B0%E7%9B%AE%E3%80%8D%E3%81%A8%E3%81%AF%EF%BC%9F/" target="_blank" rel="noopener noreferrer">
              ヤマキン「ねじの『並目』と『細目』とは？」
            </a>
          </li>
          <li>
            ※2{' '}
            <a href="https://wilco.jp/docs/technical-data/post_02.html" target="_blank" rel="noopener noreferrer">
              WILCO「ねじのピッチとは？」
            </a>
          </li>
          <li>
            <a href="https://www.nbk1560.com/en-US/resources/specialscrew/article/nedzicom-topics-12-reference-dimensions/" target="_blank" rel="noopener noreferrer">
              NBK「ねじの基準寸法」（呼び径とピッチ対応表）
            </a>
          </li>
        </ul>

        <h2>免責</h2>
        <p>
          本記事は参考情報です。実設計・調達では規格・メーカー資料・専門家にご確認ください。
        </p>
      </div>
    </main>
  );
}
