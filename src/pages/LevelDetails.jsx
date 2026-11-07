import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import useTitle from '../hooks/useTitle';
import PageHeader from '../components/ui/PageHeader';
import { Card } from '../components/ui/Card';
import Input from '../components/ui/Input';
import Textarea from '../components/ui/Textarea';
import DatePicker from '../components/ui/DatePicker';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';
import Modal from '../components/ui/Modal';
import EmptyState from '../components/ui/EmptyState';
import { levelColors } from '../data/mockData';

const empty = {
  name: '',
  points: '',
  percent: '',
  description: '',
  effectiveFrom: '2026-11-01',
};

export default function LevelDetails() {
  const { id } = useParams();
  const isNew = id === 'new';
  const { levels, saveLevel, pushToast, loading } = useApp();
  const navigate = useNavigate();
  const level = levels.find((item) => item.id === id);
  const [form, setForm] = useState(empty);
  const [baseline, setBaseline] = useState(empty);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [saved, setSaved] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const keepSaved = useRef(false);
  useTitle(isNew ? 'Новый уровень' : level?.name || 'Уровень');

  useEffect(() => {
    const source = levels.find((item) => item.id === id);
    const next = source
      ? {
          name: source.name,
          points: String(source.points),
          percent: String(source.percent),
          description: source.description,
          effectiveFrom: source.effectiveFrom,
        }
      : empty;
    setForm(next);
    setBaseline(next);
    setErrors({});
    setFormError('');
    setSaved(keepSaved.current);
    keepSaved.current = false;
  }, [id]);

  const dirty = JSON.stringify(form) !== JSON.stringify(baseline);
  const ordered = useMemo(() => [...levels].sort((a, b) => a.points - b.points), [levels]);

  if (!isNew && !level && loading) {
    return <Card><EmptyState icon="levels" title="Загрузка" text="Получаем данные уровня с сервера." /></Card>;
  }

  if (!isNew && !level) {
    return (
      <Card>
        <EmptyState
          icon="levels"
          title="Уровень не найден"
          text="Запись отсутствует в программе."
          actionLabel="К списку уровней"
          onAction={() => navigate('/levels')}
        />
      </Card>
    );
  }

  const affected = level ? Math.round(level.participants * (312 / 2730)) : 0;
  const thresholdUp = level && Number(form.points) > level.points;

  const set = (key) => (event) => {
    const value = event?.target ? event.target.value : event;
    setForm((current) => ({ ...current, [key]: value }));
    setSaved(false);
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = 'Поле обязательно для заполнения';
    if (form.points === '' || Number.isNaN(Number(form.points)) || Number(form.points) < 0) {
      next.points = 'Укажите порог в баллах';
    }
    if (form.percent === '' || Number.isNaN(Number(form.percent)) || Number(form.percent) < 0 || Number(form.percent) > 100) {
      next.percent = 'Укажите процент от 0 до 100';
    }
    if (!form.effectiveFrom) next.effectiveFrom = 'Укажите дату в формате ДД.ММ.ГГГГ';
    if (form.description.length > 500) next.description = 'Описание должно содержать не более 500 символов';

    const points = Number(form.points);
    const index = ordered.findIndex((item) => item.id === id);
    const previous = index > 0 ? ordered[index - 1] : null;
    const following = index >= 0 ? ordered[index + 1] : null;
    const duplicate = levels.some((item) => item.id !== id && item.points === points);
    let alertText = '';
    if (
      duplicate
      || (previous && points <= previous.points)
      || (following && points >= following.points)
    ) {
      alertText = 'Порог перехода должен быть больше значения предыдущего уровня.';
    }
    setErrors(next);
    setFormError(alertText);
    return Object.keys(next).length === 0 && !alertText;
  };

  const requestSave = (event) => {
    event.preventDefault();
    if (!validate()) return;
    setConfirmOpen(true);
  };

  const commit = async () => {
    const palette = Object.values(levelColors);
    setSaving(true);
    try {
      const savedLevel = await saveLevel({
        id,
        name: form.name.trim(),
        points: Number(form.points),
        percent: Number(form.percent),
        participants: level?.participants || 0,
        color: level?.color || palette[levels.length % palette.length],
        effectiveFrom: form.effectiveFrom,
        description: form.description.trim(),
      }, isNew);
      setConfirmOpen(false);
      setSaved(true);
      setBaseline({ ...form, name: form.name.trim(), description: form.description.trim() });
      pushToast({ title: `Уровень «${form.name.trim()}» сохранён` });
      if (isNew) {
        keepSaved.current = true;
        navigate(`/levels/${savedLevel.id}`, { replace: true });
      }
    } catch (err) {
      setConfirmOpen(false);
      setFormError(err.message || 'Не удалось сохранить уровень');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="stack">
      <PageHeader
        title={isNew ? 'Новый уровень' : form.name || 'Уровень'}
        lead="Условия перехода применяются при ближайшем пересчёте уровней."
      />
      {saved ? (
        <Alert tone="success" title="Изменения сохранены" onClose={() => setSaved(false)}>
          {`Условия уровня «${form.name}» обновлены. Пересчёт выполнится 01.11.2026.`}
        </Alert>
      ) : null}
      {formError ? (
        <Alert tone="error" title="Не удалось сохранить" onClose={() => setFormError('')}>
          {formError}
        </Alert>
      ) : null}
      {!saved && !formError ? (
        <Alert tone="info" title="Пересчёт уровней">
          Следующий плановый пересчёт — 01.11.2026 в 03:00.
        </Alert>
      ) : null}
      {thresholdUp ? (
        <Alert tone="warning" title="Изменение условий">
          {`Повышение порога затронет ${affected} участников уровня «${level.name}».`}
        </Alert>
      ) : null}

      <Card className="form-card">
        <form className="card__pad" onSubmit={requestSave} noValidate>
          <div className="grid-form">
            <Input
              className="span-2"
              label="Название уровня"
              value={form.name}
              error={errors.name}
              hint="Отображается в карточке участника и в отчётах."
              onChange={set('name')}
            />
            <Input
              label="Минимальное количество баллов"
              inputMode="numeric"
              value={form.points}
              error={errors.points}
              hint="Порог перехода за 12 месяцев."
              onChange={set('points')}
            />
            <Input
              label="Процент начисления"
              inputMode="decimal"
              value={form.percent}
              error={errors.percent}
              hint="От суммы покупки."
              onChange={set('percent')}
            />
            <div className="span-2">
              <DatePicker
                label="Дата начала"
                value={form.effectiveFrom}
                error={errors.effectiveFrom}
                hint="Формат ДД.ММ.ГГГГ"
                onChange={(next) => {
                  setForm((current) => ({ ...current, effectiveFrom: next }));
                  setSaved(false);
                }}
              />
            </div>
            <Textarea
              className="span-2"
              label="Описание"
              value={form.description}
              error={errors.description}
              hint="Не более 500 символов."
              onChange={set('description')}
            />
          </div>
          <div className="form-actions">
            <Button variant="secondary" onClick={() => navigate('/levels')}>Отмена</Button>
            <Button type="submit" disabled={!dirty}>Сохранить</Button>
          </div>
        </form>
      </Card>

      <Modal
        open={confirmOpen}
        title={isNew ? 'Создать уровень?' : 'Сохранить изменения уровня?'}
        onClose={() => setConfirmOpen(false)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirmOpen(false)}>Отмена</Button>
            <Button onClick={commit} disabled={saving}>{saving ? 'Сохранение…' : 'Сохранить'}</Button>
          </>
        }
      >
        Новые условия перехода применяются ко всем участникам при ближайшем пересчёте уровней — 01.11.2026 в 03:00.
      </Modal>
    </div>
  );
}
