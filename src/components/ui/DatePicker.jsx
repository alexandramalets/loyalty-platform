import { useEffect, useMemo, useRef, useState } from 'react';
import { MONTHS, WEEKDAYS, cx, formatDate, parseDate, todayIso } from '../../utils/format';
import useDismiss from '../../hooks/useDismiss';
import Icon from './Icon';

export default function DatePicker({ label, hint, error, value, onChange, disabled }) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState(value ? formatDate(value) : '');
  const rootRef = useRef(null);

  useEffect(() => {
    setText(value ? formatDate(value) : '');
  }, [value]);
  useDismiss(open, rootRef, () => setOpen(false));

  const view = useMemo(() => {
    const source = value || todayIso();
    const [year, month] = source.split('-').map(Number);
    return { year, month: month - 1 };
  }, [value]);
  const [cursor, setCursor] = useState(view);

  const shown = open ? cursor : view;
  const cells = monthCells(shown.year, shown.month);
  const today = todayIso();

  const commitText = (next) => {
    setText(next);
    if (!next.trim()) {
      onChange('');
      return;
    }
    const iso = parseDate(next);
    if (iso) onChange(iso);
  };

  return (
    <div className="field" ref={rootRef}>
      {label ? <span className="field__label">{label}</span> : null}
      <span className="field__control">
        <input
          className={cx('field__input', 'has-trailing', error && 'is-error')}
          value={text}
          disabled={disabled}
          placeholder="ДД.ММ.ГГГГ"
          inputMode="numeric"
          onChange={(event) => commitText(event.target.value)}
          onBlur={() => {
            if (!text.trim()) return;
            const iso = parseDate(text);
            if (iso) setText(formatDate(iso));
          }}
          aria-invalid={Boolean(error)}
        />
        <button
          type="button"
          className="field__trailing"
          aria-label="Открыть календарь"
          disabled={disabled}
          onClick={() => {
            setCursor(view);
            setOpen((current) => !current);
          }}
        >
          <Icon name="calendar" />
        </button>
        {open ? (
          <div className="calendar" role="dialog" aria-label="Выбор даты">
            <div className="calendar__head">
              <button
                type="button"
                className="icon-btn"
                aria-label="Предыдущий месяц"
                onClick={() =>
                  setCursor((current) => {
                    const date = new Date(current.year, current.month - 1, 1);
                    return { year: date.getFullYear(), month: date.getMonth() };
                  })
                }
              >
                <Icon name="chevronLeft" />
              </button>
              <div className="calendar__title">
                {MONTHS[shown.month]} {shown.year}
              </div>
              <button
                type="button"
                className="icon-btn"
                aria-label="Следующий месяц"
                onClick={() =>
                  setCursor((current) => {
                    const date = new Date(current.year, current.month + 1, 1);
                    return { year: date.getFullYear(), month: date.getMonth() };
                  })
                }
              >
                <Icon name="chevronRight" />
              </button>
            </div>
            <div className="calendar__grid">
              {WEEKDAYS.map((day) => (
                <div key={day} className="calendar__dow">
                  {day}
                </div>
              ))}
              {cells.map((day, index) => {
                const iso = day
                  ? `${shown.year}-${String(shown.month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                  : '';
                return (
                  <button
                    key={`${iso || 'empty'}-${index}`}
                    type="button"
                    className={cx(
                      'calendar__day',
                      iso && iso === today && 'is-today',
                      iso && iso === value && 'is-selected',
                    )}
                    disabled={!day}
                    onClick={() => {
                      onChange(iso);
                      setText(formatDate(iso));
                      setOpen(false);
                    }}
                  >
                    {day || ''}
                  </button>
                );
              })}
            </div>
            <div className="calendar__foot">
              <button
                type="button"
                className="linkish"
                onClick={() => {
                  const iso = todayIso();
                  onChange(iso);
                  setText(formatDate(iso));
                  setOpen(false);
                }}
              >
                Сегодня
              </button>
              <button
                type="button"
                className="linkish"
                onClick={() => {
                  onChange('');
                  setText('');
                  setOpen(false);
                }}
              >
                Очистить
              </button>
            </div>
          </div>
        ) : null}
      </span>
      {error ? <span className="field__error">{error}</span> : null}
      {!error && hint ? <span className="field__hint">{hint}</span> : null}
    </div>
  );
}

function monthCells(year, month) {
  const first = new Date(year, month, 1);
  let offset = first.getDay() - 1;
  if (offset < 0) offset = 6;
  const count = new Date(year, month + 1, 0).getDate();
  const cells = Array.from({ length: offset }, () => null);
  for (let day = 1; day <= count; day += 1) cells.push(day);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}
