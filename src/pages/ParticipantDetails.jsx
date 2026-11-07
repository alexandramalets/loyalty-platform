import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { getCustomerTransactions } from '../api/customers';
import { statusMeta } from '../data/mockData';
import { formatDate, formatInt, formatSigned } from '../utils/format';
import useTitle from '../hooks/useTitle';
import PageHeader from '../components/ui/PageHeader';
import { Card, CardHead, InfoRows } from '../components/ui/Card';
import { LevelBadge, StatusBadge } from '../components/ui/Badge';
import Table from '../components/ui/Table';
import EmptyState from '../components/ui/EmptyState';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';

export default function ParticipantDetails() {
  const { id } = useParams();
  const { participants, levels, loading } = useApp();
  const navigate = useNavigate();
  const person = participants.find((item) => item.id === decodeURIComponent(id));
  const level = levels.find((item) => item.id === person?.levelId);
  const [history, setHistory] = useState([]);
  const [historyError, setHistoryError] = useState('');
  useTitle(person?.name || 'Участник');

  useEffect(() => {
    if (!person) return undefined;
    getCustomerTransactions(person.id)
      .then(setHistory)
      .catch((err) => setHistoryError(err.message || 'Не удалось загрузить историю'));
    return undefined;
  }, [person]);

  if (!person && loading) {
    return <Card><EmptyState title="Загрузка" text="Получаем карточку участника с сервера." /></Card>;
  }

  if (!person) {
    return (
      <Card>
        <EmptyState
          title="Участник не найден"
          text="Проверьте идентификатор или вернитесь к реестру."
          actionLabel="К списку участников"
          onAction={() => navigate('/participants')}
        />
      </Card>
    );
  }

  const ordered = [...levels].sort((a, b) => a.points - b.points);
  const next = ordered.find((item) => item.points > person.points);

  return (
    <div className="stack">
      <PageHeader
        title={person.name}
        lead={`${person.id} · регистрация ${formatDate(person.registered)}`}
        actions={<StatusBadge meta={statusMeta[person.status]} />}
      />
      <div className="grid-2">
        <Card>
          <CardHead title="Персональные данные" />
          <InfoRows
            rows={[
              { label: 'ID', value: person.id },
              { label: 'Телефон', value: person.phone },
              { label: 'Эл. почта', value: person.email },
              { label: 'Дата регистрации', value: formatDate(person.registered) },
              { label: 'Последняя активность', value: formatDate(person.lastActivity) },
            ]}
          />
        </Card>
        <Card>
          <CardHead title="Уровень и баллы" subtitle={level ? `Начисление ${level.percent}% от суммы покупки` : ''} />
          <InfoRows
            rows={[
              { label: 'Уровень', value: <LevelBadge level={level} /> },
              { label: 'Баллы', value: formatInt(person.points) },
              { label: 'Покупки', value: formatInt(person.purchases) },
              { label: 'Статус', value: <StatusBadge meta={statusMeta[person.status]} /> },
              {
                label: 'До следующего уровня',
                value: next ? `${formatInt(Math.max(next.points - person.points, 0))} баллов` : 'Максимальный уровень',
              },
            ]}
          />
        </Card>
      </div>
      <Card>
        <CardHead title="История активности" subtitle="Начисления, списания и пересчёт уровня" />
        {historyError ? <Alert tone="error" title="Ошибка">{historyError}</Alert> : null}
        <Table
          rows={history}
          columns={[
            { key: 'date', title: 'Дата', render: (row) => formatDate(row.date) },
            { key: 'event', title: 'Событие' },
            { key: 'reason', title: 'Основание' },
            {
              key: 'amount',
              title: 'Баллы',
              align: 'right',
              render: (row) => (
                <span className={row.amount < 0 ? 'num-minus' : row.amount > 0 ? 'num-plus' : undefined}>{formatSigned(row.amount)}</span>
              ),
            },
            { key: 'status', title: 'Статус', render: (row) => <StatusBadge meta={statusMeta[row.status]} /> },
          ]}
        />
        <div className="card__foot">
          <Button variant="ghost" size="sm" onClick={() => navigate('/participants')}>К списку</Button>
          <Button variant="ghost" size="sm" onClick={() => navigate('/bonuses')}>
            Все операции с бонусами
          </Button>
        </div>
      </Card>
    </div>
  );
}
