import { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { getAnalytics } from '../api/analytics';
import { formatInt } from '../utils/format';
import useTitle from '../hooks/useTitle';
import PageHeader from '../components/ui/PageHeader';
import Segmented from '../components/ui/Segmented';
import KpiStrip from '../components/ui/KpiStrip';
import { Card, CardHead } from '../components/ui/Card';
import ActivityChart from '../components/charts/ActivityChart';
import LevelBars from '../components/charts/LevelBars';
import Table from '../components/ui/Table';
import Alert from '../components/ui/Alert';

const periods = [
  { value: '1', label: '1 мес.' },
  { value: '3', label: '3 мес.' },
  { value: '6', label: '6 мес.' },
  { value: '12', label: '12 мес.' },
];

export default function Analytics() {
  const { levels } = useApp();
  const [period, setPeriod] = useState('6');
  const [report, setReport] = useState(null);
  const [error, setError] = useState('');
  useTitle('Аналитика');

  useEffect(() => {
    setError('');
    getAnalytics(period)
      .then(setReport)
      .catch((err) => setError(err.message || 'Не удалось загрузить аналитику'));
  }, [period]);

  const series = report?.activity;
  const spentShare = report && report.bonus.accrued
    ? (report.bonus.spent / report.bonus.accrued) * 100
    : 0;
  const expiredShare = report && report.bonus.accrued
    ? (report.bonus.expired / report.bonus.accrued) * 100
    : 0;
  const totalMoves = report?.transitions.reduce((sum, row) => sum + row.count, 0) || 0;

  return (
    <div className="stack">
      <PageHeader
        title="Аналитика"
        lead="Показатели программы за выбранный период."
        actions={<Segmented label="Период" value={period} onChange={setPeriod} options={periods} />}
      />
      {error ? <Alert tone="error" title="Ошибка загрузки">{error}</Alert> : null}
      <KpiStrip items={report?.kpis || []} />
      <div className="grid-2">
        <Card>
          <CardHead title="Распределение участников" subtitle="По текущим уровням программы" />
          <LevelBars
            items={(report?.distribution || levels).map((level) => ({
              id: level.id,
              name: level.name,
              value: level.value ?? level.participants,
              color: level.color,
            }))}
          />
        </Card>
        <Card>
          <CardHead title="Динамика активности" subtitle="Покупки с начислением или списанием бонусов" />
          <div className="chart-card__body">
            {series ? (
              <ActivityChart
                labels={series.labels}
                series={[
                  { name: 'Начисление', color: '#174D3A', values: series.accrual },
                  { name: 'Списание', color: '#8FA88F', values: series.redeem },
                ]}
              />
            ) : null}
          </div>
        </Card>
      </div>
      <div className="grid-2">
        <Card>
          <CardHead title="Использование бонусов" subtitle="Начислено, списано и сгорело за период" />
          <div className="usage">
            <div className="usage__value">{report?.bonus.rate ?? 0}%</div>
            <div className="usage__caption">Доля списанных баллов от начисленных</div>
            <div className="usage__track" aria-hidden="true">
              <div className="usage__spent" style={{ width: `${spentShare}%` }} />
              <div className="usage__expired" style={{ width: `${expiredShare}%` }} />
            </div>
            <div className="legend">
              <span className="legend__item">
                <span className="legend__swatch" style={{ background: '#174D3A' }} />
                Списано · {formatInt(report?.bonus.spent || 0)}
              </span>
              <span className="legend__item">
                <span className="legend__swatch" style={{ background: '#B68135' }} />
                Сгорело · {formatInt(report?.bonus.expired || 0)}
              </span>
              <span className="legend__item">
                <span className="legend__swatch" style={{ background: '#C5D1C3' }} />
                Остаток · {formatInt((report?.bonus.accrued || 0) - (report?.bonus.spent || 0) - (report?.bonus.expired || 0))}
              </span>
            </div>
          </div>
        </Card>
        <Card>
          <CardHead title="Переходы между уровнями" subtitle={`Всего переходов: ${formatInt(totalMoves)}`} />
          <Table
            rows={(report?.transitions || []).map((row, index) => ({ ...row, id: String(index) }))}
            columns={[
              { key: 'from', title: 'Откуда' },
              { key: 'to', title: 'Куда' },
              { key: 'count', title: 'Участники', align: 'right', render: (row) => formatInt(row.count) },
              {
                key: 'share',
                title: 'Доля',
                align: 'right',
                render: (row) => `${totalMoves ? Math.round((row.count / totalMoves) * 100) : 0}%`,
              },
            ]}
          />
        </Card>
      </div>
    </div>
  );
}
