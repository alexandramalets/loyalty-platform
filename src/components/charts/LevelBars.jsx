import { formatInt } from '../../utils/format';

export default function LevelBars({ items }) {
  const max = Math.max(...items.map((item) => item.value), 1);
  return (
    <div className="bars">
      {items.map((item) => (
        <div className="bars__row" key={item.id || item.name}>
          <span className="bars__name">
            <span className="legend__swatch" style={{ background: item.color }} />
            {item.name}
          </span>
          <div className="bars__track">
            <div
              className="bars__fill"
              style={{ width: `${(item.value / max) * 100}%`, background: item.color }}
            />
          </div>
          <span className="bars__value">{formatInt(item.value)}</span>
        </div>
      ))}
    </div>
  );
}
