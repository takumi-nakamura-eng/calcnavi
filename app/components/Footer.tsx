import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-links">
          <Link href="/">Home</Link>
          <Link href="/tools">計算ツール</Link>
          <Link href="/articles">解説記事</Link>
          <Link href="/contact">お問い合わせ</Link>
        </div>
        <div className="footer-links">
          <Link href="/privacy">プライバシーポリシー</Link>
          <Link href="/terms">利用規約</Link>
          <Link href="/disclaimer">免責事項</Link>
        </div>
        <p className="footer-copy">© {new Date().getFullYear()} calcnavi（計算ナビ）</p>
      </div>
    </footer>
  );
}
