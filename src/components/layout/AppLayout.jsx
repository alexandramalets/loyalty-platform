import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import Sidebar from './Sidebar';
import Header from './Header';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import ToastViewport from '../ui/Toast';

export default function AppLayout() {
  const { logout, toasts, dismissToast, loading, error, refresh } = useApp();
  const navigate = useNavigate();
  const [logoutOpen, setLogoutOpen] = useState(false);

  return (
    <div className="layout">
      <Sidebar />
      <div className="shell">
        <Header onLogout={() => setLogoutOpen(true)} />
        <main className="content">
          {error ? (
            <div className="stack" style={{ marginBottom: 16 }}>
              <div className="alert alert--error" role="alert">
                <div className="alert__body">
                  <div className="alert__title">Сервер недоступен</div>
                  <div className="alert__text">{error}</div>
                </div>
                <button type="button" className="alert__close" onClick={() => refresh().catch(() => undefined)}>
                  Повторить
                </button>
              </div>
            </div>
          ) : null}
          {loading ? <p className="page-lead">Загрузка данных с сервера…</p> : null}
          <Outlet />
        </main>
      </div>
      <ToastViewport toasts={toasts} onDismiss={dismissToast} />
      <Modal
        open={logoutOpen}
        title="Выйти из системы?"
        onClose={() => setLogoutOpen(false)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setLogoutOpen(false)}>Отмена</Button>
            <Button
              variant="danger"
              onClick={async () => {
                setLogoutOpen(false);
                await logout();
                navigate('/login', { replace: true });
              }}
            >
              Выйти
            </Button>
          </>
        }
      >
        Текущая сессия будет завершена. Несохранённые изменения в формах будут потеряны.
      </Modal>
    </div>
  );
}
