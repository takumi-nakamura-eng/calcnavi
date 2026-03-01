'use client';

import { sendGAEvent } from '@next/third-parties/google';

type RelatedDestinationType = 'article' | 'tool';

function safeSend(eventName: string, params: Record<string, string | number>) {
  try {
    sendGAEvent('event', eventName, params);
  } catch {
    // no-op when GA script is unavailable
  }
}

export function trackToolCalculate(payload: {
  toolId: string;
  category: string;
}) {
  safeSend('tool_calculate', {
    tool_id: payload.toolId,
    category: payload.category,
  });
}

export function trackArticleOpen(payload: {
  slug: string;
  category: string;
}) {
  safeSend('article_open', {
    article_slug: payload.slug,
    category: payload.category,
  });
}

export function trackRelatedClick(payload: {
  source: string;
  destinationType: RelatedDestinationType;
  destinationId: string;
}) {
  safeSend('related_click', {
    source: payload.source,
    destination_type: payload.destinationType,
    destination_id: payload.destinationId,
  });
}

export function trackOutboundClick(payload: {
  url: string;
  source: string;
}) {
  safeSend('outbound_click', {
    url: payload.url,
    source: payload.source,
  });
}
