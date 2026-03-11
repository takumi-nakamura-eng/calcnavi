import type { ReactNode } from 'react';

interface ResponsiveTableProps {
  headers: string[];
  rows: ReactNode[][];
}

export default function ResponsiveTable({ headers, rows }: ResponsiveTableProps) {
  return (
    <div className="responsive-table">
      <div className="responsive-table__desktop" aria-hidden={false}>
        <table className="article-table">
          <thead>
            <tr>
              {headers.map((header) => (
                <th key={header}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={`desktop-row-${rowIndex}`}>
                {row.map((cell, cellIndex) => (
                  <td key={`desktop-cell-${rowIndex}-${cellIndex}`}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="responsive-table__mobile">
        {rows.map((row, rowIndex) => (
          <div key={`mobile-row-${rowIndex}`} className="responsive-table__card">
            {headers.map((header, cellIndex) => (
              // Keep the original column order and pair each cell with its header on mobile.
              <div key={`mobile-cell-${rowIndex}-${cellIndex}`} className="responsive-table__item">
                <div className="responsive-table__label">{header}</div>
                <div className="responsive-table__value">{row[cellIndex] ?? '-'}</div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
