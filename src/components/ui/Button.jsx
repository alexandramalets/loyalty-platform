import { cx } from '../../utils/format';
import Icon from './Icon';

export default function Button({
  variant = 'primary',
  size,
  icon,
  block,
  className,
  type = 'button',
  children,
  ...props
}) {
  return (
    <button
      type={type}
      className={cx(
        'btn',
        `btn--${variant}`,
        size && `btn--${size}`,
        block && 'btn--block',
        className,
      )}
      {...props}
    >
      {icon ? (
        <span className="btn__icon">
          <Icon name={icon} size={size === 'sm' ? 14 : 16} />
        </span>
      ) : null}
      {children}
    </button>
  );
}
