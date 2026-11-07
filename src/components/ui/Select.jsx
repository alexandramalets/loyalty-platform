import { useId, useRef, useState } from 'react';
import { cx } from '../../utils/format';
import useDismiss from '../../hooks/useDismiss';
import Icon from './Icon';

export default function Select({
  label,
  hint,
  error,
  value,
  onChange,
  options,
  placeholder = 'Выберите',
  disabled,
  compactLabel,
  clearable,
  className,
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const listId = useId();
  useDismiss(open, rootRef, () => setOpen(false));

  const selected = options.find((option) => option.value === value);
  const isCompact = compactLabel !== undefined;
  const isSet = clearable && value && value !== 'all';
  const text = isCompact && compactLabel
    ? `${compactLabel}: ${selected?.label || placeholder}`
    : selected?.label || placeholder;

  return (
    <div className={cx('field', isCompact && 'select--compact', isSet && 'is-set', className)} ref={rootRef}>
      {label ? <span className="field__label">{label}</span> : null}
      <div className={cx('select', error && 'is-error')}>
        <button
          type="button"
          className={cx('select__button', open && 'is-open', error && 'is-error')}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listId}
          disabled={disabled}
          onClick={() => setOpen((current) => !current)}
        >
          <span className="select__value">{text}</span>
          <span className="select__chevron">
            {isSet ? (
              <span
                className="select__clear"
                role="button"
                tabIndex={0}
                aria-label="Сбросить"
                onClick={(event) => {
                  event.stopPropagation();
                  onChange('all');
                  setOpen(false);
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    event.stopPropagation();
                    onChange('all');
                    setOpen(false);
                  }
                }}
              >
                <Icon name="close" size={14} />
              </span>
            ) : (
              <Icon name="chevron" size={16} />
            )}
          </span>
        </button>
        {open ? (
          <div className="menu" id={listId} role="listbox">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={option.value === value}
                className={cx('menu__item', option.value === value && 'is-active')}
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
              >
                <span>{option.label}</span>
                {option.value === value ? <Icon name="check" size={14} /> : null}
              </button>
            ))}
          </div>
        ) : null}
      </div>
      {error ? <span className="field__error">{error}</span> : null}
      {!error && hint ? <span className="field__hint">{hint}</span> : null}
    </div>
  );
}
