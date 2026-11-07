import { cx } from '../../utils/format';

export default function Radio({ label, error, className, ...props }) {
  return (
    <label className={cx('radio', error && 'is-error', className)}>
      <input type="radio" {...props} />
      <span className="radio__mark" />
      {label ? <span>{label}</span> : null}
    </label>
  );
}
