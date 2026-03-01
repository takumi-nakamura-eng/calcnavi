'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';


export default function Nav() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  const close = () => setOpen(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    close();
    router.push(q ? `/tools?q=${encodeURIComponent(q)}` : '/tools');
  };

  return (
    <nav className="nav">
      <div className="nav-inner">
        <Link href="/" className="nav-logo" onClick={close}>
          <span className="nav-logo-texts">
            <span className="nav-logo-en">calcnavi</span>
            <span className="nav-logo-ja">計算ナビ</span>
          </span>
        </Link>

        <button
          className="nav-hamburger"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'メニューを閉じる' : 'メニューを開く'}
          aria-expanded={open}
        >
          <span />
          <span />
          <span />
        </button>

        <form className="nav-search" onSubmit={handleSearch} role="search">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="キーワード検索"
            aria-label="サイト内検索"
          />
        </form>

        <div className={`nav-links${open ? ' nav-links--open' : ''}`}>
          <Link href="/" onClick={close}>Home</Link>
          <Link href="/tools" onClick={close}>計算ツール</Link>
          <Link href="/articles" onClick={close}>解説記事</Link>
          <Link href="/history" onClick={close}>履歴</Link>
          <Link href="/contact" onClick={close}>お問い合わせ</Link>
        </div>
      </div>
    </nav>
  );
}
