import { cx } from '../../utils/format';
import Icon from './Icon';

export default function ToastViewport({ toasts, onDismiss }) {
  if (!toasts.length) return null;
  return (
    <div className="toaster" aria-live="polite">
      {toasts.map((toast) => (
        <div key={toast.id} className={cx('toast', `toast--${toast.tone || 'success'}`)}>
          <span className="toast__icon">
            <Icon name={toast.tone === 'error' ? 'error' : 'success'} />
          </span>
          <div className="toast__text">
            {toast.title}
            {toast.onRetry ? (
              <button type="button" className="linkish toast__retry" onClick={toast.onRetry}>
                Повторить
              </button>
            ) : null}
          </div>
          <button type="button" className="icon-btn" aria-label="Закрыть" onClick={() => onDismiss(toast.id)}>
            <Icon name="close" size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
