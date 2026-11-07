import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { getAnalytics } from '../api/analytics';
import useTitle from '../hooks/useTitle';
import PageHeader from '../components/ui/PageHeader';
import KpiStrip from '../components/ui/KpiStrip';
import { Card, CardHead, InfoRows } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Segmented from '../components/ui/Segmented';
import ActivityChart from '../components/charts/ActivityChart';
import LevelBars from '../components/charts/LevelBars';
import Alert from '../components/ui/Alert';

const periods = [
  { value: '1', label: '1 мес.' },
  { value: '3', label: '3 мес.' },
  { value: '6', label: '6 мес.' },
  { value: '12', label: '12 мес.' },
];

export default function Dashboard() {
  const { levels, settings } = useApp();
  const navigate = useNavigate();
  const [period, setPeriod] = useState('6');
  const [report, setReport] = useState(null);
  const [error, setError] = useState('');
  useTitle(settings.programName);

  useEffect(() => {
    setError('');
    getAnalytics(period)
      .then(setReport)
      .catch((err) => setError(err.message || 'Не удалось загрузить аналитику'));
  }, [period]);

  const percents = levels.map((level) => level.percent);
  const accrual = percents.length
    ? `${Math.min(...percents)}–${Math.max(...percents)}% от суммы покупки`
    : settings.accrualLabel;

  const bars = useMemo(
    () => (report?.distribution || levels.map((level) => ({
      id: level.id,
      name: level.name,
      value: level.participants,
      color: level.color,
    }))),
    [report, levels],
  );

  const series = report?.activity;

  return (
    <div className="stack">
      <PageHeader
        title={settings.programName}
        lead={report?.updatedAt || 'Данные загружаются с сервера'}
      />
      {error ? <Alert tone="error" title="Ошибка загрузки">{error}</Alert> : null}
      <KpiStrip
        items={report?.kpis || [
          { label: 'Всего участников', value: '…', delta: 'загрузка', tone: 'neutral' },
          { label: 'Активных участников', value: '…', delta: 'загрузка', tone: 'neutral' },
          { label: 'Начислено баллов', value: '…', delta: 'загрузка', tone: 'neutral' },
          { label: 'Использовано бонусов', value: '…', delta: 'загрузка', tone: 'neutral' },
        ]}
      />
      <div className="grid-2">
        <Card>
          <CardHead
            title="Активность участников"
            subtitle="Покупки с начислением или списанием бонусов"
            action={<Segmented label="Период" value={period} onChange={setPeriod} options={periods} />}
          />
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
        <Card>
          <CardHead
            title="Параметры программы"
            subtitle={`Действует с ${settings.since}`}
            action={<Button variant="ghost" size="sm" onClick={() => navigate('/settings')}>Изменить</Button>}
          />
          <InfoRows
            rows={[
              { label: 'Уровней в программе', value: String(levels.length) },
              { label: 'Начисление', value: accrual },
              { label: 'Срок действия бонусов', value: settings.bonusLifetime },
              { label: 'Пересчёт уровней', value: settings.recalcLabel },
            ]}
          />
        </Card>
      </div>
      <Card>
        <CardHead title="Распределение участников" subtitle="По текущим уровням программы" />
        <LevelBars items={bars} />
      </Card>
    </div>
  );
}
