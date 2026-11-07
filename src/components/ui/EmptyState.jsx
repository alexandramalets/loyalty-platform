import Icon from './Icon';
import Button from './Button';

export default function EmptyState({ title, text, actionLabel, onAction, icon = 'search' }) {
  return (
    <div className="empty">
      <div className="empty__icon">
        <Icon name={icon} />
      </div>
      <div className="empty__title">{title}</div>
      {text ? <div className="empty__text">{text}</div> : null}
      {actionLabel ? (
        <Button variant="secondary" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}
