import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { activityOptions, participantStatusOptions, statusMeta } from '../data/mockData';
import { daysAgo, formatDate, formatInt } from '../utils/format';
import useTitle from '../hooks/useTitle';
import PageHeader from '../components/ui/PageHeader';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';
import Table, { RowMenu } from '../components/ui/Table';
import Pagination from '../components/ui/Pagination';
import { LevelBadge, StatusBadge } from '../components/ui/Badge';
import EmptyState from '../components/ui/EmptyState';

export default function Participants() {
  const { participants, levels } = useApp();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  useTitle('Участники');
  const [query, setQuery] = useState(params.get('q') || '');
  const [levelId, setLevelId] = useState('all');
  const [status, setStatus] = useState('all');
  const [activity, setActivity] = useState('all');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortDir, setSortDir] = useState(null);

  useEffect(() => {
    setQuery(params.get('q') || '');
    setPage(1);
  }, [params]);

  const levelOptions = [
    { value: 'all', label: 'Все' },
    ...levels.map((level) => ({ value: level.id, label: level.name })),
  ];

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    let rows = participants.filter((person) => {
      const hay = `${person.name} ${person.id} ${person.phone}`.toLowerCase();
      if (needle && !hay.includes(needle)) return false;
      if (levelId !== 'all' && person.levelId !== levelId) return false;
      if (status !== 'all' && person.status !== status) return false;
      if (activity !== 'all' && daysAgo(person.lastActivity) > Number(activity)) return false;
      return true;
    });
    if (sortDir) {
      rows = [...rows].sort((a, b) => (sortDir === 'asc' ? a.points - b.points : b.points - a.points));
    }
    return rows;
  }, [participants, query, levelId, status, activity, sortDir]);

  const pageRows = filtered.slice((page - 1) * pageSize, page * pageSize);
  const filtersActive = Boolean(query.trim()) || levelId !== 'all' || status !== 'all' || activity !== 'all';

  const reset = () => {
    setQuery('');
    setLevelId('all');
    setStatus('all');
    setActivity('all');
    setPage(1);
  };

  const open = (person) => navigate(`/participants/${person.id}`);

  return (
    <div>
      <PageHeader
        title="Участники"
        lead="Реестр участников: уровень, баллы, покупки и статус."
      />
      <div className="filter-bar">
        <Input
          className="filter-bar__search"
          icon="search"
          placeholder="Поиск по ФИО, ID или телефону"
          aria-label="Поиск по ФИО, ID или телефону"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setPage(1);
          }}
        />
        <Select
          compactLabel="Уровень"
          clearable
          value={levelId}
          options={levelOptions}
          onChange={(next) => {
            setLevelId(next);
            setPage(1);
          }}
        />
        <Select
          compactLabel="Статус"
          value={status}
          options={participantStatusOptions}
          onChange={(next) => {
            setStatus(next);
            setPage(1);
          }}
        />
        <Select
          compactLabel="Активность"
          value={activity}
          options={activityOptions}
          onChange={(next) => {
            setActivity(next);
            setPage(1);
          }}
        />
        <Button variant="ghost" disabled={!filtersActive} onClick={reset}>
          Сбросить фильтры
        </Button>
      </div>

      <div className="table-card">
        {filtered.length === 0 ? (
          <EmptyState
            title="Участники не найдены"
            text="По заданным условиям нет записей. Измените запрос или сбросьте фильтры."
            actionLabel="Сбросить фильтры"
            onAction={reset}
          />
        ) : (
          <>
            <Table
              rows={pageRows}
              onRowClick={open}
              columns={[
                { key: 'id', title: 'ID' },
                { key: 'name', title: 'ФИО' },
                {
                  key: 'level',
                  title: 'Уровень',
                  render: (row) => <LevelBadge level={levels.find((level) => level.id === row.levelId)} />,
                },
                {
                  key: 'points',
                  title: 'Баллы',
                  align: 'right',
                  sortable: true,
                  onSort: () => {
                    setSortDir((current) => (current === 'desc' ? 'asc' : 'desc'));
                    setPage(1);
                  },
                  render: (row) => formatInt(row.points),
                },
                {
                  key: 'purchases',
                  title: 'Покупки',
                  align: 'right',
                  render: (row) => formatInt(row.purchases),
                },
                {
                  key: 'lastActivity',
                  title: 'Последняя активность',
                  render: (row) => formatDate(row.lastActivity),
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
                      <Button variant="ghost" size="sm" onClick={() => open(row)}>Изменить</Button>
                      <RowMenu items={[{ label: 'Открыть карточку', onClick: () => open(row) }]} />
                    </div>
                  ),
                },
              ]}
            />
            <Pagination
              page={page}
              pageSize={pageSize}
              total={filtered.length}
              onPageChange={setPage}
              onPageSizeChange={(size) => {
                setPageSize(size);
                setPage(1);
              }}
            />
          </>
        )}
      </div>
    </div>
  );
}
