import { cx } from '../../utils/format';

export default function Textarea({ label, hint, error, id, className, ...props }) {
  const inputId = id || (label ? `area-${label}` : undefined);
  return (
    <label className={cx('field', className)} htmlFor={inputId}>
      {label ? <span className="field__label">{label}</span> : null}
      <textarea
        id={inputId}
        className={cx('field__textarea', error && 'is-error')}
        {...props}
      />
      {error ? <span className="field__error">{error}</span> : null}
      {!error && hint ? <span className="field__hint">{hint}</span> : null}
    </label>
  );
}
