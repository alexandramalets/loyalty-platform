import { formatInt } from '../../utils/format';
import { pageWindow } from './Table';
import Select from './Select';
import Icon from './Icon';

export default function Pagination({ page, pageSize, total, onPageChange, onPageSizeChange }) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, totalPages);
  const from = total === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const to = Math.min(total, safePage * pageSize);
  const pages = pageWindow(safePage, totalPages);

  return (
    <div className="pager">
      <div className="pager__meta">
        Показано {formatInt(from)}–{formatInt(to)} из {formatInt(total)}
      </div>
      <div className="pager__controls">
        <div className="pager__size">
          <span>Строк на странице</span>
          <Select
            compactLabel=""
            value={String(pageSize)}
            onChange={(next) => onPageSizeChange(Number(next))}
            options={[
              { value: '10', label: '10' },
              { value: '25', label: '25' },
              { value: '50', label: '50' },
            ]}
          />
        </div>
        <div className="pager__pages">
          <button
            type="button"
            className="pager__btn"
            aria-label="Предыдущая страница"
            disabled={safePage <= 1}
            onClick={() => onPageChange(safePage - 1)}
          >
            <Icon name="chevronLeft" />
          </button>
          {pages.map((item, index) =>
            item === '…' ? (
              <span key={`gap-${index}`} className="pager__gap">
                …
              </span>
            ) : (
              <button
                key={item}
                type="button"
                className={item === safePage ? 'pager__btn is-current' : 'pager__btn'}
                aria-current={item === safePage ? 'page' : undefined}
                onClick={() => onPageChange(item)}
              >
                {item}
              </button>
            ),
          )}
          <button
            type="button"
            className="pager__btn"
            aria-label="Следующая страница"
            disabled={safePage >= totalPages}
            onClick={() => onPageChange(safePage + 1)}
          >
            <Icon name="chevronRight" />
          </button>
        </div>
      </div>
    </div>
  );
}
