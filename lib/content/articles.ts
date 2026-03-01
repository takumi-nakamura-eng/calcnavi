import 'server-only';

import fs from 'node:fs/promises';
import path from 'node:path';
import { cache } from 'react';
import { evaluate } from '@mdx-js/mdx';
import * as runtime from 'react/jsx-runtime';

const ARTICLES_DIR = path.join(process.cwd(), 'content/articles');

export interface ArticleMeta {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  updatedAt: string;
  category: string;
  tags: string[];
  toolRefs: string[];
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

  const record: Record<string, string | string[]> = {};
  let currentListKey: string | null = null;

  for (const rawLine of block.split('\n')) {
    const line = rawLine.trimEnd();
    if (!line.trim()) continue;

    const listMatch = line.match(/^\s*-\s*(.+)$/);
    if (listMatch && currentListKey) {
      const item = stripQuotes(listMatch[1].trim());
      const list = record[currentListKey];
      if (Array.isArray(list)) {
        list.push(item);
      }
      continue;
    }

    const keyValueMatch = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
    if (!keyValueMatch) continue;

    const [, key, rawValue] = keyValueMatch;

    if (!rawValue) {
      record[key] = [];
      currentListKey = key;
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
  }

  const requiredKeys = [
    'title',
    'description',
    'publishedAt',
    'updatedAt',
    'category',
    'tags',
    'toolRefs',
  ] as const;

  for (const key of requiredKeys) {
    if (!(key in record)) {
      throw new Error(`Frontmatter is missing key: ${key}`);
    }
  }

  return {
    data: {
      title: String(record.title),
      description: String(record.description),
      publishedAt: String(record.publishedAt),
      updatedAt: String(record.updatedAt),
      category: String(record.category),
      tags: Array.isArray(record.tags) ? record.tags : [],
      toolRefs: Array.isArray(record.toolRefs) ? record.toolRefs : [],
    },
    body,
  };
}

async function readArticleFile(slug: string): Promise<Article | null> {
  const filePath = path.join(ARTICLES_DIR, `${slug}.mdx`);

  try {
    const source = await fs.readFile(filePath, 'utf8');
    const { data, body } = parseFrontmatter(source);

    return {
      meta: {
        slug,
        href: `/articles/${slug}`,
        ...data,
      },
      body,
    };
  } catch {
    return null;
  }
}

export const getAllArticles = cache(async (): Promise<ArticleMeta[]> => {
  const entries = await fs.readdir(ARTICLES_DIR, { withFileTypes: true });
  const slugs = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith('.mdx'))
    .map((entry) => entry.name.replace(/\.mdx$/, ''));

  const articles = await Promise.all(slugs.map((slug) => readArticleFile(slug)));

  return articles
    .filter((item): item is Article => item !== null)
    .map((article) => article.meta)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
});

export const getArticleBySlug = cache(async (slug: string): Promise<Article | null> => {
  return readArticleFile(slug);
});

export const getRelatedArticles = cache(
  async (slug: string, limit = 3): Promise<ArticleMeta[]> => {
    const current = await getArticleBySlug(slug);
    if (!current) return [];

    const all = await getAllArticles();
    const currentTags = new Set(current.meta.tags);

    const scored = all
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

    return scored;
  },
);

export const getArticleComponent = cache(async (slug: string) => {
  const article = await getArticleBySlug(slug);
  if (!article) return null;

  const evaluated = await evaluate(article.body, {
    ...runtime,
  });

  return evaluated.default;
});
