import { cx } from '../../utils/format';
import Icon from './Icon';

export default function Input({
  label,
  hint,
  error,
  icon,
  trailing,
  id,
  className,
  ...props
}) {
  const inputId = id || (label ? `field-${label}` : undefined);
  return (
    <label className={cx('field', className)} htmlFor={inputId}>
      {label ? <span className="field__label">{label}</span> : null}
      <span className="field__control">
        {icon ? (
          <span className="field__icon">
            <Icon name={icon} />
          </span>
        ) : null}
        <input
          id={inputId}
          className={cx(
            'field__input',
            icon && 'has-icon',
            trailing && 'has-trailing',
            error && 'is-error',
          )}
          {...props}
        />
        {trailing ? <span className="field__trailing">{trailing}</span> : null}
      </span>
      {error ? <span className="field__error">{error}</span> : null}
      {!error && hint ? <span className="field__hint">{hint}</span> : null}
    </label>
  );
}
