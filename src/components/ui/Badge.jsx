import { cx } from '../../utils/format';

const dotColor = {
  success: 'var(--color-primary)',
  warning: 'var(--color-accent)',
  danger: 'var(--color-error)',
  neutral: 'var(--color-text-disabled)',
};

export function StatusBadge({ meta }) {
  if (!meta) return null;
  return (
    <span className={cx('badge', `badge--${meta.tone}`)}>
      <span
        className={cx('badge__dot', meta.dot === 'hollow' && 'badge__dot--hollow')}
        style={{ background: meta.dot === 'hollow' ? 'transparent' : dotColor[meta.tone], color: dotColor[meta.tone] }}
      />
      {meta.label}
    </span>
  );
}

export function LevelBadge({ level }) {
  if (!level) return '—';
  return (
    <span className="badge">
      <span className="badge__swatch" style={{ background: level.color }} />
      {level.name}
    </span>
  );
}
