import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { formatInt } from '../utils/format';
import useTitle from '../hooks/useTitle';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';
import Table, { RowMenu } from '../components/ui/Table';
import { LevelBadge } from '../components/ui/Badge';

export default function Levels() {
  const { levels } = useApp();
  const navigate = useNavigate();
  useTitle('Уровни программы');

  return (
    <div>
      <PageHeader
        title="Уровни программы"
        lead="Порог перехода и процент начисления. Пересчёт — ежемесячно, 1-го числа."
        actions={<Button icon="plus" onClick={() => navigate('/levels/new')}>Добавить уровень</Button>}
      />
      <div className="table-card">
        <Table
          rows={levels}
          onRowClick={(row) => navigate(`/levels/${row.id}`)}
          columns={[
            {
              key: 'name',
              title: 'Уровень',
              render: (row) => <LevelBadge level={row} />,
            },
            {
              key: 'points',
              title: 'Порог, баллы',
              align: 'right',
              render: (row) => formatInt(row.points),
            },
            {
              key: 'percent',
              title: 'Начисление',
              align: 'right',
              render: (row) => `${row.percent}%`,
            },
            {
              key: 'participants',
              title: 'Участники',
              align: 'right',
              render: (row) => formatInt(row.participants),
            },
            {
              key: 'actions',
              title: '',
              align: 'right',
              render: (row) => (
                <div className="table-actions">
                  <Button variant="ghost" size="sm" onClick={() => navigate(`/levels/${row.id}`)}>
                    Изменить
                  </Button>
                  <RowMenu items={[{ label: 'Открыть', onClick: () => navigate(`/levels/${row.id}`) }]} />
                </div>
              ),
            },
          ]}
        />
      </div>
    </div>
  );
}
