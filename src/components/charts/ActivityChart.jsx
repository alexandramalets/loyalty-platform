import { formatInt } from '../../utils/format';

export default function ActivityChart({ labels, series, max = 8000 }) {
  const width = 640;
  const height = 210;
  const pad = { l: 56, r: 8, t: 12, b: 28 };
  const innerW = width - pad.l - pad.r;
  const innerH = height - pad.t - pad.b;
  const ticks = [max, max * 0.75, max * 0.5, max * 0.25, 0];
  const x = (index) =>
    pad.l + (labels.length <= 1 ? innerW / 2 : (innerW * index) / (labels.length - 1));
  const y = (value) => pad.t + innerH - (value / max) * innerH;

  return (
    <div>
      <svg className="chart" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="График активности">
        {ticks.map((tick) => (
          <g key={tick}>
            <line
              x1={pad.l}
              x2={width - pad.r}
              y1={y(tick)}
              y2={y(tick)}
              stroke="#D8D4CC"
              strokeWidth="1"
            />
            <text className="chart__label" x={pad.l - 8} y={y(tick) + 4} textAnchor="end">
              {formatInt(tick)}
            </text>
          </g>
        ))}
        {series.map((item) => {
          const line = item.values
            .map((value, index) => `${index === 0 ? 'M' : 'L'} ${x(index)} ${y(value)}`)
            .join(' ');
          const area = `${line} L ${x(item.values.length - 1)} ${y(0)} L ${x(0)} ${y(0)} Z`;
          return (
            <g key={item.name}>
              <path d={area} fill={item.color} opacity="0.16" />
              <path d={line} fill="none" stroke={item.color} strokeWidth="1.6" />
            </g>
          );
        })}
        {labels.map((label, index) => (
          <text
            key={label}
            className="chart__label"
            x={x(index)}
            y={height - 6}
            textAnchor={index === 0 ? 'start' : index === labels.length - 1 ? 'end' : 'middle'}
          >
            {label}
          </text>
        ))}
      </svg>
      <div className="legend">
        {series.map((item) => (
          <span key={item.name} className="legend__item">
            <span className="legend__swatch" style={{ background: item.color }} />
            {item.name}
          </span>
        ))}
      </div>
    </div>
  );
}
