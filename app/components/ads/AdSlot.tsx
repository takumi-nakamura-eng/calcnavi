'use client';

import { useEffect } from 'react';
import Script from 'next/script';

declare global {
  interface Window {
    adsbygoogle?: Array<Record<string, unknown>>;
  }
}

export default function AdSlot({
  slot,
  format = 'auto',
  className,
}: {
  slot?: string;
  format?: 'auto' | 'rectangle' | 'horizontal' | 'vertical';
  className?: string;
}) {
  const enabled = process.env.NEXT_PUBLIC_ENABLE_ADSENSE === 'true';
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

  useEffect(() => {
    if (!enabled || !client || !slot) return;
    try {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
    } catch {
      // no-op on ad-blocked environments
    }
  }, [enabled, client, slot]);

  if (!enabled || !client || !slot) return null;

  return (
    <div className={`ad-slot ${className ?? ''}`.trim()}>
      <Script
        id="adsense-script"
        strategy="afterInteractive"
        async
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`}
        crossOrigin="anonymous"
      />
      <ins
        className="adsbygoogle"
        style={{ display: 'block', minHeight: 280 }}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
