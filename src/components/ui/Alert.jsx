import { cx } from '../../utils/format';
import Icon from './Icon';

const icons = {
  success: 'success',
  warning: 'alert',
  error: 'error',
  info: 'info',
};

export default function Alert({ tone = 'info', title, children, onClose }) {
  return (
    <div className={cx('alert', `alert--${tone}`)} role={tone === 'error' ? 'alert' : 'status'}>
      <Icon name={icons[tone]} />
      <div className="alert__body">
        {title ? <div className="alert__title">{title}</div> : null}
        {children ? <div className="alert__text">{children}</div> : null}
      </div>
      {onClose ? (
        <button type="button" className="alert__close" aria-label="Закрыть" onClick={onClose}>
          <Icon name="close" size={14} />
        </button>
      ) : null}
    </div>
  );
}
