import { useState } from 'react';
import { useApp } from '../context/AppContext';
import useTitle from '../hooks/useTitle';
import PageHeader from '../components/ui/PageHeader';
import { Card, CardHead, InfoRows } from '../components/ui/Card';
import Toggle from '../components/ui/Toggle';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';

const documents = {
  terms: {
    title: 'Пользовательское соглашение',
    text: 'Соглашение регулирует доступ менеджера к системе управления программой лояльности. Пользователь работает только с данными, которые нужны для сопровождения уровней, участников, акций и бонусов, и не передаёт учётные данные третьим лицам. Действия в системе фиксируются в журнале операций.',
  },
  privacy: {
    title: 'Политика конфиденциальности',
    text: 'Система обрабатывает имя, контактные данные и время входа сотрудника, а также сведения об участниках, необходимые для начисления и списания бонусов. Данные используются только для работы программы лояльности и не применяются для иных целей.',
  },
};

export default function Profile() {
  const { user, notices, settings, saveNotices, saveSettings, pushToast } = useApp();
  const profile = user || {
    name: 'Менеджер',
    initials: 'М',
    role: 'Менеджер программы',
    email: '',
    phone: '',
    lastLogin: '—',
    passwordChanged: '—',
  };
  const [doc, setDoc] = useState(null);
  useTitle('Профиль');

  const toggleNotice = async (key) => {
    const next = { ...notices, [key]: !notices[key] };
    try {
      await saveNotices(next);
      pushToast({ title: 'Настройки уведомлений сохранены' });
    } catch (err) {
      pushToast({ title: err.message || 'Не удалось сохранить уведомления', tone: 'error' });
    }
  };

  const toggleFactor = async () => {
    const enabled = !settings.twoFactor;
    try {
      await saveSettings({ ...settings, twoFactor: enabled });
      pushToast({
        title: enabled
          ? 'Двухфакторная аутентификация включена'
          : 'Двухфакторная аутентификация выключена',
      });
    } catch (err) {
      pushToast({ title: err.message || 'Не удалось сохранить настройки', tone: 'error' });
    }
  };

  return (
    <div className="stack">
      <PageHeader title="Профиль" lead="Учётная запись менеджера программы." />
      <div className="grid-2">
        <Card>
          <div className="profile-id">
            <div className="avatar avatar--lg">{profile.initials}</div>
            <div>
              <div className="profile-id__name">{profile.name}</div>
              <div className="profile-id__role">{profile.role}</div>
            </div>
          </div>
          <InfoRows
            rows={[
              { label: 'Эл. почта', value: profile.email },
              { label: 'Телефон', value: profile.phone },
              { label: 'Последний вход', value: profile.lastLogin },
            ]}
          />
        </Card>
        <Card>
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
              checked={notices.system}
              onChange={() => toggleNotice('system')}
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
              checked={notices.email}
              onChange={() => toggleNotice('email')}
            />
          </div>
        </Card>
      </div>
      <div className="grid-2">
        <Card>
          <CardHead title="Безопасность" />
          <InfoRows
            rows={[
              { label: 'Пароль', value: `Изменён ${profile.passwordChanged}` },
              { label: 'Последний вход', value: profile.lastLogin },
              {
                label: 'Двухфакторная аутентификация',
                value: settings.twoFactor ? 'Включена' : 'Выключена',
              },
            ]}
          />
          <div className="setting-row">
            <div>
              <div className="setting-row__title">Двухфакторная аутентификация</div>
              <div className="setting-row__text">
                Дополнительное подтверждение при входе в систему
              </div>
            </div>
            <Toggle
              label="Двухфакторная аутентификация"
              checked={settings.twoFactor}
              onChange={toggleFactor}
            />
          </div>
        </Card>
        <Card>
          <CardHead title="Документы" />
          <div className="link-row">
            <button type="button" className="linkish" onClick={() => setDoc('terms')}>
              Пользовательское соглашение
            </button>
            <button type="button" className="linkish" onClick={() => setDoc('privacy')}>
              Политика конфиденциальности
            </button>
          </div>
        </Card>
      </div>
      <Modal
        open={Boolean(doc)}
        title={doc ? documents[doc].title : ''}
        onClose={() => setDoc(null)}
        footer={<Button variant="secondary" onClick={() => setDoc(null)}>Закрыть</Button>}
      >
        {doc ? documents[doc].text : ''}
      </Modal>
    </div>
  );
}
