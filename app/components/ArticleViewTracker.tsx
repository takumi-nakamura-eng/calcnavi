'use client';

import { useEffect } from 'react';
import { trackArticleOpen } from '@/lib/analytics/events';

export default function ArticleViewTracker({
  slug,
  category,
}: {
  slug: string;
  category: string;
}) {
  useEffect(() => {
    trackArticleOpen({ slug, category });
  }, [slug, category]);

  return null;
}
