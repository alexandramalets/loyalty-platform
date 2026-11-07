import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { accrueBonuses, writeOffBonuses } from '../api/transactions';
import { operationStatusOptions, operationTypeOptions, statusMeta } from '../data/mockData';
import { formatDate, formatSigned } from '../utils/format';
import useTitle from '../hooks/useTitle';
import PageHeader from '../components/ui/PageHeader';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';
import Table from '../components/ui/Table';
import Pagination from '../components/ui/Pagination';
import { StatusBadge } from '../components/ui/Badge';
import EmptyState from '../components/ui/EmptyState';
import Modal from '../components/ui/Modal';
import Alert from '../components/ui/Alert';

const emptyOp = {
  customerId: '',
  kind: 'accrual',
  strategy: 'FIXED',
  amount: '',
  purchaseAmount: '',
  reason: '',
};

export default function Bonuses() {
  const { bonuses, participants, refresh, pushToast } = useApp();
  const navigate = useNavigate();
  useTitle('Бонусы');
  const [query, setQuery] = useState('');
  const [type, setType] = useState('all');
  const [status, setStatus] = useState('all');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyOp);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const nameById = (id) => participants.find((person) => person.id === id)?.name || id;

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return bonuses.filter((row) => {
      const name = nameById(row.participantId);
      const hay = `${name} ${row.reason} ${row.id}`.toLowerCase();
      if (needle && !hay.includes(needle)) return false;
      if (type !== 'all' && row.type !== type) return false;
      if (status !== 'all' && row.status !== status) return false;
      return true;
    });
  }, [bonuses, participants, query, type, status]);

  const rows = filtered.slice((page - 1) * pageSize, page * pageSize);
  const filtersActive = Boolean(query.trim()) || type !== 'all' || status !== 'all';
  const reset = () => {
    setQuery('');
    setType('all');
    setStatus('all');
    setPage(1);
  };

  const submit = async () => {
    if (!form.customerId) {
      setFormError('Выберите участника');
      return;
    }
    if (!form.reason.trim()) {
      setFormError('Укажите основание операции');
      return;
    }
    setSaving(true);
    setFormError('');
    try {
      if (form.kind === 'write-off') {
        await writeOffBonuses({
          customerId: form.customerId,
          amount: Number(form.amount),
          reason: form.reason.trim(),
        });
      } else {
        await accrueBonuses({
          customerId: form.customerId,
          strategy: form.strategy,
          amount: form.strategy === 'FIXED' ? Number(form.amount) : undefined,
          purchaseAmount: form.strategy === 'PURCHASE' ? Number(form.purchaseAmount) : undefined,
          reason: form.reason.trim(),
        });
      }
      await refresh();
      setOpen(false);
      setForm(emptyOp);
      pushToast({ title: 'Операция сохранена' });
    } catch (err) {
      setFormError(err.message || 'Не удалось выполнить операцию');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Бонусы"
        lead="Операции начисления и списания по участникам программы."
        actions={<Button icon="plus" onClick={() => setOpen(true)}>Новая операция</Button>}
      />
      <div className="filter-bar">
        <Input
          className="filter-bar__search"
          icon="search"
          placeholder="Поиск по участнику или основанию"
          aria-label="Поиск по участнику или основанию"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setPage(1);
          }}
        />
        <Select
          compactLabel="Операция"
          value={type}
          options={operationTypeOptions}
          onChange={(next) => {
            setType(next);
            setPage(1);
          }}
        />
        <Select
          compactLabel="Статус"
          value={status}
          options={operationStatusOptions}
          onChange={(next) => {
            setStatus(next);
            setPage(1);
          }}
        />
        <Button variant="ghost" disabled={!filtersActive} onClick={reset}>Сбросить фильтры</Button>
      </div>
      <div className="table-card">
        {filtered.length === 0 ? (
          <EmptyState
            title="Операции не найдены"
            text="По заданным условиям нет записей. Измените запрос или сбросьте фильтры."
            actionLabel="Сбросить фильтры"
            onAction={reset}
          />
        ) : (
          <>
            <Table
              rows={rows}
              onRowClick={(row) => navigate(`/participants/${row.participantId}`)}
              columns={[
                { key: 'date', title: 'Дата', render: (row) => formatDate(row.date) },
                { key: 'participant', title: 'Участник', render: (row) => nameById(row.participantId) },
                { key: 'type', title: 'Операция' },
                {
                  key: 'amount',
                  title: 'Количество',
                  align: 'right',
                  render: (row) => (
                    <span className={row.amount < 0 ? 'num-minus' : row.amount > 0 ? 'num-plus' : undefined}>{formatSigned(row.amount)}</span>
                  ),
                },
                { key: 'reason', title: 'Основание' },
                {
                  key: 'status',
                  title: 'Статус',
                  render: (row) => <StatusBadge meta={statusMeta[row.status]} />,
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
      <Modal
        open={open}
        title="Новая бонусная операция"
        onClose={() => !saving && setOpen(false)}
        footer={
          <>
            <Button variant="secondary" disabled={saving} onClick={() => setOpen(false)}>Отмена</Button>
            <Button onClick={submit} disabled={saving}>{saving ? 'Сохранение…' : 'Провести'}</Button>
          </>
        }
      >
        {formError ? <Alert tone="error" title="Ошибка">{formError}</Alert> : null}
        <div className="grid-form" style={{ marginTop: 12 }}>
          <Select
            label="Участник"
            value={form.customerId}
            options={[{ value: '', label: 'Выберите' }, ...participants.map((person) => ({ value: person.id, label: `${person.name} · ${person.points} б.` }))]}
            onChange={(customerId) => setForm((current) => ({ ...current, customerId }))}
          />
          <Select
            label="Тип"
            value={form.kind}
            options={[
              { value: 'accrual', label: 'Начисление' },
              { value: 'write-off', label: 'Списание' },
            ]}
            onChange={(kind) => setForm((current) => ({ ...current, kind }))}
          />
          {form.kind === 'accrual' ? (
            <Select
              label="Стратегия"
              value={form.strategy}
              options={[
                { value: 'FIXED', label: 'Фиксированная сумма' },
                { value: 'PURCHASE', label: 'Процент от покупки' },
              ]}
              onChange={(strategy) => setForm((current) => ({ ...current, strategy }))}
            />
          ) : null}
          {form.kind === 'write-off' || form.strategy === 'FIXED' ? (
            <Input
              label="Баллы"
              inputMode="numeric"
              value={form.amount}
              onChange={(event) => setForm((current) => ({ ...current, amount: event.target.value }))}
            />
          ) : (
            <Input
              label="Сумма покупки"
              inputMode="numeric"
              value={form.purchaseAmount}
              onChange={(event) => setForm((current) => ({ ...current, purchaseAmount: event.target.value }))}
            />
          )}
          <Input
            className="span-2"
            label="Основание"
            value={form.reason}
            onChange={(event) => setForm((current) => ({ ...current, reason: event.target.value }))}
          />
        </div>
      </Modal>
    </div>
  );
}
