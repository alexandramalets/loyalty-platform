import { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  bonusUnitOptions,
  currencyOptions,
  recalcOptions,
  sessionOptions,
} from '../data/mockData';
import useTitle from '../hooks/useTitle';
import PageHeader from '../components/ui/PageHeader';
import { Card, CardHead } from '../components/ui/Card';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Toggle from '../components/ui/Toggle';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';

export default function Settings() {
  const { settings, notices, saveSettings, saveNotices, pushToast } = useApp();
  useTitle('Настройки');
  const [draft, setDraft] = useState(settings);
  const [draftNotices, setDraftNotices] = useState(notices);
  const [saved, setSaved] = useState(false);
  const [nameError, setNameError] = useState('');
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const dirty = JSON.stringify({
    programName: draft.programName,
    currency: draft.currency,
    bonusUnit: draft.bonusUnit,
    recalcPeriod: draft.recalcPeriod,
    sessionMinutes: draft.sessionMinutes,
    twoFactor: draft.twoFactor,
    notices: draftNotices,
  }) !== JSON.stringify({
    programName: settings.programName,
    currency: settings.currency,
    bonusUnit: settings.bonusUnit,
    recalcPeriod: settings.recalcPeriod,
    sessionMinutes: settings.sessionMinutes,
    twoFactor: settings.twoFactor,
    notices,
  });

  const save = async (event) => {
    event.preventDefault();
    if (!draft.programName.trim()) {
      setNameError('Поле обязательно для заполнения');
      return;
    }
    setNameError('');
    setSaving(true);
    setFormError('');
    try {
      await saveSettings({ ...settings, ...draft, programName: draft.programName.trim() });
      await saveNotices(draftNotices);
      setSaved(true);
      pushToast({ title: 'Настройки сохранены' });
    } catch (err) {
      setFormError(err.message || 'Не удалось сохранить настройки');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="stack" onSubmit={save} noValidate>
      <PageHeader
        title="Настройки"
        lead="Параметры программы, уведомления и параметры сессии."
      />
      {saved ? (
        <Alert tone="success" title="Изменения сохранены" onClose={() => setSaved(false)}>
          Параметры программы обновлены.
        </Alert>
      ) : null}
      {formError ? (
        <Alert tone="error" title="Не удалось сохранить" onClose={() => setFormError('')}>
          {formError}
        </Alert>
      ) : null}
      <Card className="form-card">
        <CardHead title="Программа" subtitle="Название, валюта и единица бонусов" />
        <div className="card__pad grid-form">
          <Input
            className="span-2"
            label="Название программы"
            value={draft.programName}
            error={nameError}
            onChange={(event) => {
              setDraft({ ...draft, programName: event.target.value });
              setSaved(false);
            }}
          />
          <Select
            label="Валюта"
            value={draft.currency}
            options={currencyOptions}
            onChange={(currency) => {
              setDraft({ ...draft, currency });
              setSaved(false);
            }}
          />
          <Select
            label="Единица бонусов"
            value={draft.bonusUnit}
            options={bonusUnitOptions}
            onChange={(bonusUnit) => {
              setDraft({ ...draft, bonusUnit });
              setSaved(false);
            }}
          />
        </div>
      </Card>
      <Card className="form-card">
        <CardHead title="Уровни" subtitle="Период, в котором пересчитываются пороги и статусы" />
        <div className="card__pad">
          <Select
            label="Период обновления уровня"
            value={draft.recalcPeriod}
            options={recalcOptions}
            onChange={(recalcPeriod) => {
              setDraft({ ...draft, recalcPeriod });
              setSaved(false);
            }}
          />
        </div>
      </Card>
      <Card className="form-card">
        <CardHead
          title="Уведомления"
          subtitle="Каналы, по которым система сообщает о событиях программы"
        />
        <div className="setting-row">
          <div>
            <div className="setting-row__title">Системные уведомления</div>
            <div className="setting-row__text">
              Сообщения в интерфейсе о завершении пересчёта уровней и ошибках импорта
            </div>
          </div>
          <Toggle
            label="Системные уведомления"
            checked={draftNotices.system}
            onChange={() => {
              setDraftNotices({ ...draftNotices, system: !draftNotices.system });
              setSaved(false);
            }}
          />
        </div>
        <div className="setting-row">
          <div>
            <div className="setting-row__title">Email-уведомления</div>
            <div className="setting-row__text">
              Еженедельная сводка и уведомления об окончании акций
            </div>
          </div>
          <Toggle
            label="Email-уведомления"
            checked={draftNotices.email}
            onChange={() => {
              setDraftNotices({ ...draftNotices, email: !draftNotices.email });
              setSaved(false);
            }}
          />
        </div>
      </Card>
      <Card className="form-card">
        <CardHead title="Сессия и безопасность" />
        <div className="card__pad">
          <Select
            label="Время сессии"
            value={draft.sessionMinutes}
            options={sessionOptions}
            hint="Завершение сеанса при отсутствии действий."
            onChange={(sessionMinutes) => {
              setDraft({ ...draft, sessionMinutes });
              setSaved(false);
            }}
          />
        </div>
        <div className="setting-row">
          <div>
            <div className="setting-row__title">Двухфакторная аутентификация</div>
            <div className="setting-row__text">Дополнительное подтверждение при входе в систему</div>
          </div>
          <Toggle
            label="Двухфакторная аутентификация"
            checked={draft.twoFactor}
            onChange={() => {
              setDraft({ ...draft, twoFactor: !draft.twoFactor });
              setSaved(false);
            }}
          />
        </div>
        <div className="form-actions form-actions--inset">
          <Button
            variant="secondary"
            disabled={!dirty}
            onClick={() => {
              setDraft(settings);
              setDraftNotices(notices);
              setNameError('');
              setSaved(false);
            }}
          >
            Отмена
          </Button>
          <Button type="submit" disabled={!dirty || saving}>{saving ? 'Сохранение…' : 'Сохранить'}</Button>
        </div>
      </Card>
    </form>
  );
}
