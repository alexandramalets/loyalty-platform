import { cx } from '../../utils/format';

export function Card({ children, className }) {
  return <section className={cx('card', className)}>{children}</section>;
}

export function CardHead({ title, subtitle, action }) {
  return (
    <header className="card__head">
      <div>
        <h2 className="section-title">{title}</h2>
        {subtitle ? <p className="card__sub">{subtitle}</p> : null}
      </div>
      {action || null}
    </header>
  );
}

export function InfoRows({ rows }) {
  return (
    <dl className="info-list">
      {rows.map((row) => (
        <div className="info-list__row" key={row.label}>
          <dt>{row.label}</dt>
          <dd>{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}
