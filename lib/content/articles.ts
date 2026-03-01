import 'server-only';

import fs from 'node:fs/promises';
import path from 'node:path';
import { cache } from 'react';
import { evaluate } from '@mdx-js/mdx';
import * as runtime from 'react/jsx-runtime';

const ARTICLES_DIR = path.join(process.cwd(), 'content/articles');

export interface ArticleFaqItem {
  q: string;
  a: string;
}

export interface ArticleMeta {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  updatedAt: string;
  category: string;
  tags: string[];
  toolRefs: string[];
  diagramKey: string;
  faq: ArticleFaqItem[];
  thumbnailSvg?: string;
  href: string;
}

export interface Article {
  meta: ArticleMeta;
  body: string;
}

interface ParsedFrontmatter {
  title: string;
  description: string;
  publishedAt: string;
  updatedAt: string;
  category: string;
  tags: string[];
  toolRefs: string[];
  diagramKey: string;
  faq: ArticleFaqItem[];
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function transformMarkdownTables(source: string): string {
  const lines = source.split('\n');
  const out: string[] = [];
  let i = 0;
  let inCodeBlock = false;

  while (i < lines.length) {
    const line = lines[i];
    if (line.trimStart().startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      out.push(line);
      i += 1;
      continue;
    }

    if (!inCodeBlock) {
      const header = lines[i];
      const separator = lines[i + 1];
      const headerMatch = /^\s*\|.*\|\s*$/.test(header ?? '');
      const separatorMatch = /^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?\s*$/.test(
        separator ?? '',
      );

      if (headerMatch && separatorMatch) {
        const parseCells = (row: string) =>
          row
            .trim()
            .replace(/^\|/, '')
            .replace(/\|$/, '')
            .split('|')
            .map((cell) => cell.trim());

        const headerCells = parseCells(header);
        const bodyRows: string[][] = [];
        i += 2;

        while (i < lines.length && /^\s*\|.*\|\s*$/.test(lines[i])) {
          bodyRows.push(parseCells(lines[i]));
          i += 1;
        }

        out.push('<table className="article-table">');
        out.push('<thead><tr>');
        for (const cell of headerCells) {
          out.push(`<th>${escapeHtml(cell)}</th>`);
        }
        out.push('</tr></thead>');
        out.push('<tbody>');
        for (const row of bodyRows) {
          out.push('<tr>');
          for (const cell of row) {
            out.push(`<td>${escapeHtml(cell)}</td>`);
          }
          out.push('</tr>');
        }
        out.push('</tbody></table>');
        continue;
      }
    }

    out.push(line);
    i += 1;
  }

  return out.join('\n');
}

function stripQuotes(value: string): string {
  return value.replace(/^['\"]|['\"]$/g, '');
}

function parseFrontmatter(source: string): { data: ParsedFrontmatter; body: string } {
  const match = source.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!match) {
    throw new Error('Missing frontmatter block');
  }

  const block = match[1];
  const body = source.slice(match[0].length);
  const record: Record<string, string | string[] | ArticleFaqItem[]> = {};
  let currentListKey: string | null = null;

  for (const rawLine of block.split('\n')) {
    const line = rawLine.trimEnd();
    if (!line.trim()) continue;

    const keyValueMatch = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
    if (keyValueMatch) {
      const [, key, rawValue] = keyValueMatch;
      if (!rawValue) {
        currentListKey = key;
        record[key] = key === 'faq' ? [] : [];
        continue;
      }

      currentListKey = null;

      if (rawValue.startsWith('[') && rawValue.endsWith(']')) {
        const list = rawValue
          .slice(1, -1)
          .split(',')
          .map((part) => stripQuotes(part.trim()))
          .filter(Boolean);
        record[key] = list;
        continue;
      }

      record[key] = stripQuotes(rawValue.trim());
      continue;
    }

    if (!currentListKey) continue;

    if (currentListKey === 'faq') {
      const qMatch = line.match(/^\s*-\s*q:\s*(.+)$/);
      if (qMatch) {
        const faqList = record.faq as ArticleFaqItem[];
        faqList.push({ q: stripQuotes(qMatch[1].trim()), a: '' });
        continue;
      }

      const aMatch = line.match(/^\s*a:\s*(.+)$/);
      if (aMatch) {
        const faqList = record.faq as ArticleFaqItem[];
        const last = faqList[faqList.length - 1];
        if (last) last.a = stripQuotes(aMatch[1].trim());
      }
      continue;
    }

    const listMatch = line.match(/^\s*-\s*(.+)$/);
    if (listMatch) {
      const list = record[currentListKey];
      if (Array.isArray(list)) {
        (list as string[]).push(stripQuotes(listMatch[1].trim()));
      }
    }
  }

  const requiredKeys = [
    'title',
    'description',
    'publishedAt',
    'updatedAt',
    'category',
    'tags',
    'toolRefs',
    'diagramKey',
    'faq',
  ] as const;

  for (const key of requiredKeys) {
    if (!(key in record)) {
      throw new Error(`Frontmatter is missing key: ${key}`);
    }
  }

  const faq = Array.isArray(record.faq) ? (record.faq as ArticleFaqItem[]) : [];

  return {
    data: {
      title: String(record.title),
      description: String(record.description),
      publishedAt: String(record.publishedAt),
      updatedAt: String(record.updatedAt),
      category: String(record.category),
      tags: Array.isArray(record.tags) ? (record.tags as string[]) : [],
      toolRefs: Array.isArray(record.toolRefs) ? (record.toolRefs as string[]) : [],
      diagramKey: String(record.diagramKey),
      faq,
    },
    body,
  };
}

function validateArticleContent(slug: string, meta: ParsedFrontmatter, body: string): void {
  const missing: string[] = [];

  if (!meta.diagramKey.trim()) missing.push('diagramKey');
  if (meta.faq.length < 2 || meta.faq.some((item) => !item.q.trim() || !item.a.trim())) {
    missing.push('faq(2件以上)');
  }

  if (!/^##\s+図解/m.test(body) || !/<svg[\s>]/m.test(body)) {
    missing.push('図解(SVG)');
  }

  if (!/^##\s+比較表/m.test(body) || !/\|.+\|.+\|\n\|[-:|\s]+\|/m.test(body)) {
    missing.push('比較表');
  }

  if (!/^##\s+計算例/m.test(body)) {
    missing.push('計算例');
  }

  if (!/^##\s+FAQ/m.test(body)) {
    missing.push('FAQセクション');
  }

  if (missing.length > 0) {
    throw new Error(`Article ${slug}.mdx is missing required blocks: ${missing.join(', ')}`);
  }
}

function extractFirstSvg(body: string): string | undefined {
  const match = body.match(/<svg[\s\S]*?<\/svg>/);
  return match ? match[0] : undefined;
}

async function readArticleFile(slug: string): Promise<Article | null> {
  const filePath = path.join(ARTICLES_DIR, `${slug}.mdx`);
  const source = await fs.readFile(filePath, 'utf8');
  const { data, body } = parseFrontmatter(source);
  validateArticleContent(slug, data, body);

  return {
    meta: {
      slug,
      href: `/articles/${slug}`,
      thumbnailSvg: extractFirstSvg(body),
      ...data,
    },
    body,
  };
}

export const getAllArticles = cache(async (): Promise<ArticleMeta[]> => {
  const entries = await fs.readdir(ARTICLES_DIR, { withFileTypes: true });
  const slugs = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith('.mdx') && !entry.name.startsWith('_'))
    .map((entry) => entry.name.replace(/\.mdx$/, ''));

  const articles = await Promise.all(slugs.map((slug) => readArticleFile(slug)));

  return articles
    .filter((item): item is Article => item !== null)
    .map((article) => article.meta)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
});

export const getArticleBySlug = cache(async (slug: string): Promise<Article | null> => {
  try {
    return await readArticleFile(slug);
  } catch {
    return null;
  }
});

export const getRelatedArticles = cache(
  async (slug: string, limit = 3): Promise<ArticleMeta[]> => {
    const current = await getArticleBySlug(slug);
    if (!current) return [];

    const all = await getAllArticles();
    const currentTags = new Set(current.meta.tags);

    return all
      .filter((article) => article.slug !== slug)
      .map((article) => {
        const sharedTagCount = article.tags.filter((tag) => currentTags.has(tag)).length;
        const sharedCategory = article.category === current.meta.category ? 1 : 0;
        return { article, score: sharedTagCount * 2 + sharedCategory };
      })
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return b.article.publishedAt.localeCompare(a.article.publishedAt);
      })
      .slice(0, limit)
      .map((row) => row.article);
  },
);

export const getArticleComponent = cache(async (slug: string) => {
  const article = await getArticleBySlug(slug);
  if (!article) return null;

  const evaluated = await evaluate(transformMarkdownTables(article.body), {
    ...runtime,
  });

  return evaluated.default;
});
