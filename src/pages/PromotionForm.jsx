import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { promotionStatuses } from '../data/mockData';
import useTitle from '../hooks/useTitle';
import PageHeader from '../components/ui/PageHeader';
import { Card } from '../components/ui/Card';
import Input from '../components/ui/Input';
import Textarea from '../components/ui/Textarea';
import Select from '../components/ui/Select';
import DatePicker from '../components/ui/DatePicker';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';
import Modal from '../components/ui/Modal';
import EmptyState from '../components/ui/EmptyState';

const blank = {
  name: '',
  status: 'scheduled',
  levelId: 'all',
  start: '',
  end: '',
  bonusPercent: '',
  description: '',
};

export default function PromotionForm() {
  const { id } = useParams();
  const isNew = !id || id === 'new';
  const { promotions, levels, savePromotion, pushToast, loading } = useApp();
  const navigate = useNavigate();
  const promo = promotions.find((item) => item.id === id);
  const [form, setForm] = useState(blank);
  const [baseline, setBaseline] = useState(blank);
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  useTitle(isNew ? 'Новая акция' : promo?.name || 'Акция');

  useEffect(() => {
    const source = promotions.find((item) => item.id === id);
    const next = source
      ? {
          name: source.name,
          status: source.status,
          levelId: source.levelId,
          start: source.start,
          end: source.end,
          bonusPercent: String(source.bonusPercent),
          description: source.description,
        }
      : blank;
    setForm(next);
    setBaseline(next);
    setErrors({});
    setSaved(false);
  }, [id]);

  if (!isNew && !promo && loading) {
    return <Card><EmptyState title="Загрузка" text="Получаем данные акции с сервера." /></Card>;
  }

  if (!isNew && !promo) {
    return (
      <Card>
        <EmptyState
          title="Акция не найдена"
          text="Запись отсутствует в списке акций."
          actionLabel="К списку акций"
          onAction={() => navigate('/promotions')}
        />
      </Card>
    );
  }

  const dirty = JSON.stringify(form) !== JSON.stringify(baseline);
  const levelOptions = [
    { value: 'all', label: 'Все уровни' },
    ...levels.map((level) => ({ value: level.id, label: level.name })),
  ];

  const set = (key) => (event) => {
    const value = event?.target ? event.target.value : event;
    setForm((current) => ({ ...current, [key]: value }));
    setSaved(false);
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = 'Поле обязательно для заполнения';
    if (!form.start) next.start = 'Укажите дату в формате ДД.ММ.ГГГГ';
    if (!form.end) next.end = 'Укажите дату в формате ДД.ММ.ГГГГ';
    if (form.start && form.end && form.start > form.end) {
      next.start = 'Дата начала не может быть позже даты окончания';
    }
    if (form.bonusPercent === '' || Number.isNaN(Number(form.bonusPercent)) || Number(form.bonusPercent) < 0) {
      next.bonusPercent = 'Укажите размер бонуса';
    }
    if (form.description.length > 500) next.description = 'Описание должно содержать не более 500 символов';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const requestSave = (event) => {
    event.preventDefault();
    if (!validate()) return;
    setConfirmOpen(true);
  };

  const commit = async () => {
    setSaving(true);
    try {
      const savedPromo = await savePromotion({
        id,
        name: form.name.trim(),
        status: form.status,
        levelId: form.levelId,
        start: form.start,
        end: form.end,
        bonusPercent: Number(form.bonusPercent),
        description: form.description.trim(),
      }, isNew);
      setConfirmOpen(false);
      setSaved(true);
      setFormError('');
      setBaseline(form);
      pushToast({ title: `Акция «${form.name.trim()}» сохранена` });
      if (isNew) navigate(`/promotions/${savedPromo.id}`, { replace: true });
    } catch (err) {
      setConfirmOpen(false);
      setFormError(err.message || 'Не удалось сохранить акцию');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="stack">
      <PageHeader
        title={isNew ? 'Новая акция' : form.name || 'Акция'}
        lead="Условия, срок действия и уровень, на который распространяется акция."
      />
      {saved ? (
        <Alert tone="success" title="Изменения сохранены" onClose={() => setSaved(false)}>
          {`Акция «${form.name}» обновлена.`}
        </Alert>
      ) : null}
      {formError ? (
        <Alert tone="error" title="Не удалось сохранить" onClose={() => setFormError('')}>
          {formError}
        </Alert>
      ) : null}
      <Card className="form-card">
        <form className="card__pad" onSubmit={requestSave} noValidate>
          <div className="grid-form">
            <Input
              className="span-2"
              label="Название акции"
              value={form.name}
              error={errors.name}
              onChange={set('name')}
            />
            <Select
              label="Статус"
              value={form.status}
              options={promotionStatuses}
              onChange={set('status')}
            />
            <Select
              label="Уровень"
              value={form.levelId}
              options={levelOptions}
              onChange={set('levelId')}
            />
            <DatePicker
              label="Дата начала"
              value={form.start}
              error={errors.start}
              hint="Формат ДД.ММ.ГГГГ"
              onChange={set('start')}
            />
            <DatePicker
              label="Дата окончания"
              value={form.end}
              error={errors.end}
              hint="Формат ДД.ММ.ГГГГ"
              onChange={set('end')}
            />
            <Input
              label="Размер бонуса"
              inputMode="decimal"
              value={form.bonusPercent}
              error={errors.bonusPercent}
              hint="Процент от покупки или разовое начисление в баллах."
              onChange={set('bonusPercent')}
            />
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
            <Button variant="secondary" onClick={() => navigate('/promotions')}>Отмена</Button>
            <Button type="submit" disabled={!dirty}>Сохранить</Button>
          </div>
        </form>
      </Card>
      <Modal
        open={confirmOpen}
        title="Сохранить изменения?"
        onClose={() => setConfirmOpen(false)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirmOpen(false)}>Отмена</Button>
            <Button onClick={commit} disabled={saving}>{saving ? 'Сохранение…' : 'Сохранить'}</Button>
          </>
        }
      >
        Новые условия акции применяются с указанной даты начала. Участники выбранного уровня увидят изменения при следующем начислении.
      </Modal>
    </div>
  );
}
