import { BetaAnalyticsDataClient } from '@google-analytics/data';

/**
 * GA4 Data API でパスごとのページビュー数を取得する。
 * 環境変数 GA_PROPERTY_ID / GA_CLIENT_EMAIL / GA_PRIVATE_KEY が未設定の場合は {} を返す。
 */
export async function getPageViews(paths: string[]): Promise<Record<string, number>> {
  const { GA_PROPERTY_ID, GA_CLIENT_EMAIL, GA_PRIVATE_KEY } = process.env;
  if (!GA_PROPERTY_ID || !GA_CLIENT_EMAIL || !GA_PRIVATE_KEY) return {};

  const client = new BetaAnalyticsDataClient({
    credentials: {
      client_email: GA_CLIENT_EMAIL,
      private_key: GA_PRIVATE_KEY.replace(/\\n/g, '\n'),
    },
  });

  const [response] = await client.runReport({
    property: `properties/${GA_PROPERTY_ID}`,
    dateRanges: [{ startDate: '2020-01-01', endDate: 'today' }],
    dimensions: [{ name: 'pagePath' }],
    metrics: [{ name: 'screenPageViews' }],
    dimensionFilter: {
      orGroup: {
        expressions: paths.map((path) => ({
          filter: {
            fieldName: 'pagePath',
            stringFilter: { value: path, matchType: 'EXACT' },
          },
        })),
      },
    },
  });

  const views: Record<string, number> = {};
  for (const row of response.rows ?? []) {
    const path = row.dimensionValues?.[0]?.value ?? '';
    const count = parseInt(row.metricValues?.[0]?.value ?? '0', 10);
    views[path] = count;
  }
  return views;
}
