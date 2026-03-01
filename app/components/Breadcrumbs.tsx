import Link from 'next/link';

export interface BreadcrumbItem {
  name: string;
  href?: string;
}

export default function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav className="breadcrumbs" aria-label="パンくず">
      <div className="breadcrumbs-row">
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <span key={`${item.name}-${idx}`} className="breadcrumbs-item">
              {idx > 0 && <span className="breadcrumbs-sep">{'>'}</span>}
              {item.href && !isLast ? (
                <Link href={item.href}>{item.name}</Link>
              ) : (
                <span aria-current={isLast ? 'page' : undefined}>{item.name}</span>
              )}
            </span>
          );
        })}
      </div>
    </nav>
  );
}
