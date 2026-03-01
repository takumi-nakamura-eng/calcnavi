import type { MDXComponents } from 'mdx/types';
import Quote from '@/app/components/mdx/Quote';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    Quote,
    ...components,
  };
}
