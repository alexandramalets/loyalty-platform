import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { statusMeta } from '../data/mockData';
import { formatDate } from '../utils/format';
import useTitle from '../hooks/useTitle';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';
import Table, { RowMenu } from '../components/ui/Table';
import { LevelBadge, StatusBadge } from '../components/ui/Badge';

export default function Promotions() {
  const { promotions, levels } = useApp();
  const navigate = useNavigate();
  useTitle('Акции и условия');

  return (
    <div>
      <PageHeader
        title="Акции и условия"
        lead="Условия начисления, сроки и статус акций программы."
        actions={<Button icon="plus" onClick={() => navigate('/promotions/new')}>Создать акцию</Button>}
      />
      <div className="table-card">
        <Table
          rows={promotions}
          onRowClick={(row) => navigate(`/promotions/${row.id}`)}
          columns={[
            { key: 'name', title: 'Название' },
            {
              key: 'period',
              title: 'Период',
              render: (row) => `${formatDate(row.start)} – ${formatDate(row.end)}`,
            },
            {
              key: 'level',
              title: 'Уровень',
              render: (row) => (
                row.levelId === 'all'
                  ? 'Все уровни'
                  : <LevelBadge level={levels.find((level) => level.id === row.levelId)} />
              ),
            },
            {
              key: 'status',
              title: 'Статус',
              render: (row) => <StatusBadge meta={statusMeta[row.status]} />,
            },
            {
              key: 'actions',
              title: '',
              align: 'right',
              render: (row) => (
                <div className="table-actions">
                  <Button variant="ghost" size="sm" onClick={() => navigate(`/promotions/${row.id}`)}>
                    Изменить
                  </Button>
                  <RowMenu items={[{ label: 'Открыть', onClick: () => navigate(`/promotions/${row.id}`) }]} />
                </div>
              ),
            },
          ]}
        />
      </div>
    </div>
  );
}
