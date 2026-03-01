'use client';

import { useEffect } from 'react';
import { trackScroll75 } from '@/lib/analytics/events';

export default function ArticleEngagementTracker({
  slug,
}: {
  slug: string;
}) {
  useEffect(() => {
    const sessionKey = `scroll75:${slug}`;
    if (sessionStorage.getItem(sessionKey) === '1') return;

    let fired = false;

    const onScroll = () => {
      if (fired) return;
      const scrollTop = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll <= 0) return;
      const ratio = scrollTop / maxScroll;
      if (ratio >= 0.75) {
        fired = true;
        sessionStorage.setItem(sessionKey, '1');
        trackScroll75({ pageType: 'article', slug });
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [slug]);

  return null;
}
