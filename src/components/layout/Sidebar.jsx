import { NavLink } from 'react-router-dom';
import { cx } from '../../utils/format';
import Icon from '../ui/Icon';

const program = [
  { to: '/dashboard', label: 'Главная', icon: 'home', end: true },
  { to: '/levels', label: 'Уровни программы', icon: 'levels' },
  { to: '/participants', label: 'Участники', icon: 'user' },
  { to: '/promotions', label: 'Акции и условия', icon: 'tag' },
  { to: '/bonuses', label: 'Бонусы', icon: 'bonus' },
  { to: '/analytics', label: 'Аналитика', icon: 'analytics' },
];

const account = [
  { to: '/profile', label: 'Профиль', icon: 'user' },
  { to: '/settings', label: 'Настройки', icon: 'settings' },
];

function Item({ item }) {
  return (
    <NavLink
      to={item.to}
      end={item.end}
      className={({ isActive }) => cx('nav-item', isActive && 'is-active')}
    >
      <Icon name={item.icon} />
      <span>{item.label}</span>
    </NavLink>
  );
}

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <div className="brand-mark">ЛП</div>
        <div>
          <div className="sidebar__name">Лояльность</div>
          <div className="sidebar__sub">Управление программой</div>
        </div>
      </div>
      <nav className="sidebar__nav" aria-label="Разделы">
        <div className="sidebar__label">Программа</div>
        {program.map((item) => (
          <Item key={item.to} item={item} />
        ))}
        <div className="sidebar__label">Аккаунт</div>
        {account.map((item) => (
          <Item key={item.to} item={item} />
        ))}
      </nav>
      <div className="sidebar__help">
        <Icon name="help" />
        <div>
          <div className="sidebar__help-title">Справка и поддержка</div>
          <div className="sidebar__help-version">Версия 2.4.1</div>
        </div>
      </div>
    </aside>
  );
}
