import { cx } from '../../utils/format';
import Icon from './Icon';

export default function KpiStrip({ items }) {
  return (
    <section className="kpi">
      {items.map((item) => (
        <div className="kpi__item" key={item.label}>
          <div className="kpi__label">{item.label}</div>
          <div className="kpi__value">{item.value}</div>
          <div className={cx('kpi__delta', item.tone && item.tone !== 'neutral' && `kpi__delta--${item.tone}`)}>
            {item.tone === 'up' ? <Icon name="arrowUp" size={12} /> : null}
            {item.tone === 'down' ? <Icon name="arrowDown" size={12} /> : null}
            <span>{item.delta}</span>
          </div>
        </div>
      ))}
    </section>
  );
}
