import { useRef, useState } from 'react';
import { cx } from '../../utils/format';
import useDismiss from '../../hooks/useDismiss';
import Icon from './Icon';

export default function Table({ columns, rows, rowKey = 'id', onRowClick }) {
  return (
    <div className="table-scroll">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key} className={column.align === 'right' ? 'is-right' : undefined}>
                {column.sortable ? (
                  <button type="button" className="table-sort" onClick={column.onSort}>
                    {column.title}
                    <Icon name="sort" size={12} />
                  </button>
                ) : (
                  column.title
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row[rowKey]}
              className={onRowClick ? 'is-clickable' : undefined}
              onClick={(event) => {
                if (event.target.closest('button, a, input')) return;
                onRowClick?.(row);
              }}
            >
              {columns.map((column) => (
                <td key={column.key} className={column.align === 'right' ? 'is-right' : undefined}>
                  {column.render ? column.render(row) : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function RowMenu({ items }) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const rootRef = useRef(null);
  useDismiss(open, rootRef, () => setOpen(false));

  return (
    <span ref={rootRef}>
      <button
        type="button"
        className="btn btn--secondary btn--icon btn--sm"
        aria-label="Ещё"
        aria-expanded={open}
        onClick={(event) => {
          const rect = event.currentTarget.getBoundingClientRect();
          setPos({ top: rect.bottom + 4, left: rect.right });
          setOpen((current) => !current);
        }}
      >
        <Icon name="more" />
      </button>
      {open ? (
        <div
          className="menu menu--fixed"
          style={{ top: pos.top, left: pos.left, transform: 'translateX(-100%)' }}
        >
          {items.map((item) => (
            <button
              key={item.label}
              type="button"
              className="menu__item"
              onClick={() => {
                setOpen(false);
                item.onClick();
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      ) : null}
    </span>
  );
}

export function pageWindow(page, totalPages) {
  if (totalPages <= 1) return [1];
  const items = [1];
  const start = Math.max(2, page - 1);
  const end = Math.min(totalPages - 1, page + 1);
  if (start > 2) items.push('…');
  for (let current = start; current <= end; current += 1) items.push(current);
  if (end < totalPages - 1) items.push('…');
  if (totalPages > 1) items.push(totalPages);
  return items;
}
