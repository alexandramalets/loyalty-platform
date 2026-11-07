import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import useTitle from '../hooks/useTitle';
import Input from '../components/ui/Input';
import Checkbox from '../components/ui/Checkbox';
import Button from '../components/ui/Button';

export default function Login() {
  const { login } = useApp();
  const navigate = useNavigate();
  useTitle('Вход');
  const [email, setEmail] = useState('i.belova@loyalty.local');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    const next = {};
    if (!email.trim()) next.email = 'Поле обязательно для заполнения';
    if (!password.trim()) next.password = 'Поле обязательно для заполнения';
    setErrors(next);
    if (Object.keys(next).length) return;
    setSubmitting(true);
    try {
      if (remember) localStorage.setItem('loyalty-remember', email.trim());
      await login(email.trim(), password);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setErrors({ password: err.message || 'Неверная эл. почта или пароль' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login">
      <div className="login__card">
        <div className="login__brand">
          <div className="brand-mark">ЛП</div>
          <div>
            <div className="sidebar__name">Лояльность</div>
            <div className="sidebar__sub">Управление программой</div>
          </div>
        </div>
        <h1 className="page-title">Вход</h1>
        <p className="page-lead">Система управления программой лояльности.</p>
        <form className="login__form" onSubmit={submit} noValidate>
          <Input
            label="Эл. почта"
            type="email"
            autoComplete="username"
            value={email}
            error={errors.email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <Input
            label="Пароль"
            type="password"
            autoComplete="current-password"
            value={password}
            error={errors.password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <Checkbox
            label="Запомнить меня"
            checked={remember}
            onChange={(event) => setRemember(event.target.checked)}
          />
          <Button type="submit" block disabled={submitting}>{submitting ? 'Вход…' : 'Войти'}</Button>
        </form>
        <div className="login__version">Версия 2.4.1</div>
      </div>
    </div>
  );
}
