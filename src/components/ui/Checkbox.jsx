import { cx } from '../../utils/format';
import Icon from './Icon';

export default function Checkbox({ label, error, className, ...props }) {
  return (
    <label className={cx('check', error && 'is-error', className)}>
      <input type="checkbox" {...props} />
      <span className="check__box">
        <Icon name="check" size={12} />
      </span>
      {label ? <span>{label}</span> : null}
    </label>
  );
}
