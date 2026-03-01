'use client';

import type React from 'react';
import { trackOutboundClick } from '@/lib/analytics/events';

type AnchorProps = React.AnchorHTMLAttributes<HTMLAnchorElement>;

export default function MdxOutboundLink(props: AnchorProps & { source?: string }) {
  const { href, onClick, source = 'article:mdx-link', ...rest } = props;

  const handleClick: React.MouseEventHandler<HTMLAnchorElement> = (event) => {
    onClick?.(event);
    if (!href || typeof window === 'undefined') return;

    const isExternal = /^https?:\/\//.test(href) && !href.startsWith(window.location.origin);
    if (!isExternal) return;

    trackOutboundClick({ url: href, source });
  };

  return <a href={href} onClick={handleClick} {...rest} />;
}
