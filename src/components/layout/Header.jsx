import { useMemo, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { cx } from '../../utils/format';
import useDismiss from '../../hooks/useDismiss';
import Icon from '../ui/Icon';
import Input from '../ui/Input';

export default function Header({ onLogout }) {
  const { user, levels, participants, promotions, bonuses, unread, markRead } = useApp();
  const displayUser = user || { name: 'Менеджер', initials: 'М', role: 'Менеджер программы', email: '' };
  const location = useLocation();
  const navigate = useNavigate();
  const crumbs = useCrumbs(location.pathname, { levels, participants, promotions });
  const [query, setQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [noticeOpen, setNoticeOpen] = useState(false);
  const searchRef = useRef(null);
  const userRef = useRef(null);
  const noticeRef = useRef(null);
  useDismiss(searchOpen, searchRef, () => setSearchOpen(false));
  useDismiss(userOpen, userRef, () => setUserOpen(false));
  useDismiss(noticeOpen, noticeRef, () => setNoticeOpen(false));

  const hits = useMemo(() => buildHits(query, participants, promotions, bonuses), [query, participants, promotions, bonuses]);

  const go = (to) => {
    setSearchOpen(false);
    setQuery('');
    navigate(to);
  };

  return (
    <header className="header">
      <nav className="crumbs" aria-label="Хлебные крошки">
        {crumbs.map((crumb, index) => {
          const last = index === crumbs.length - 1;
          return (
            <span key={`${crumb.label}-${index}`} className="crumbs__group">
              {index > 0 ? (
                <span className="crumbs__sep">
                  <Icon name="chevronRight" size={14} />
                </span>
              ) : null}
              {last || !crumb.to ? (
                <span className="crumbs__current">{crumb.label}</span>
              ) : (
                <Link to={crumb.to}>{crumb.label}</Link>
              )}
            </span>
          );
        })}
      </nav>

      <div className="header__search" ref={searchRef}>
        <Input
          icon="search"
          placeholder="Поиск участника, акции, операции"
          value={query}
          aria-label="Поиск участника, акции, операции"
          onChange={(event) => {
            setQuery(event.target.value);
            setSearchOpen(true);
          }}
          onFocus={() => setSearchOpen(true)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              if (hits[0]) go(hits[0].to);
              else if (query.trim()) go(`/participants?q=${encodeURIComponent(query.trim())}`);
            }
          }}
        />
        {searchOpen && query.trim() ? (
          <div className="menu" role="listbox">
            {hits.length === 0 ? (
              <div className="menu__empty">Ничего не найдено</div>
            ) : (
              hits.map((hit) => (
                <button key={hit.to + hit.label} type="button" className="menu__item" onClick={() => go(hit.to)}>
                  <span>
                    <span>{hit.label}</span>
                    <span className="search-hit__kind"> · {hit.kind}</span>
                  </span>
                </button>
              ))
            )}
          </div>
        ) : null}
      </div>

      <div className="header__bell" ref={noticeRef}>
        <button
          type="button"
          className={cx('icon-btn', noticeOpen && 'is-open')}
          aria-label="Уведомления"
          aria-expanded={noticeOpen}
          onClick={() => {
            setNoticeOpen((open) => !open);
            markRead();
          }}
        >
          <Icon name="bell" />
          {unread ? <span className="icon-btn__dot" /> : null}
        </button>
        {noticeOpen ? <NoticeMenu /> : null}
      </div>

      <div className="header__user" ref={userRef}>
        <button
          type="button"
          className={cx('user-chip', userOpen && 'is-open')}
          aria-expanded={userOpen}
          onClick={() => setUserOpen((open) => !open)}
        >
          <span className="avatar">{displayUser.initials}</span>
          <span className="user-chip__text">
            <span className="user-chip__name">{displayUser.name}</span>
            <span className="user-chip__role">{displayUser.role}</span>
          </span>
          <Icon name="chevron" />
        </button>
        {userOpen ? (
          <div className="menu user-menu">
            <div className="menu__meta">
              <div className="menu__meta-name">{displayUser.name}</div>
              <div className="menu__meta-sub">{displayUser.email}</div>
            </div>
            <Link className="menu__item" to="/profile" onClick={() => setUserOpen(false)}>
              <span className="menu__label"><Icon name="user" /> Профиль</span>
            </Link>
            <Link className="menu__item" to="/settings" onClick={() => setUserOpen(false)}>
              <span className="menu__label"><Icon name="settings" /> Настройки</span>
            </Link>
            <hr className="menu__rule" />
            <button
              type="button"
              className="menu__item menu__item--danger"
              onClick={() => {
                setUserOpen(false);
                onLogout();
              }}
            >
              <span className="menu__label"><Icon name="logout" /> Выйти</span>
            </button>
          </div>
        ) : null}
      </div>
    </header>
  );
}

function NoticeMenu() {
  const { notifications } = useApp();
  return (
    <div className="menu notice-menu">
      {notifications.map((item) => (
        <div key={item.id} className="notice-item">
          <div className="notice-item__title">{item.title}</div>
          <div className="notice-item__text">{item.text}</div>
        </div>
      ))}
    </div>
  );
}

function useCrumbs(pathname, data) {
  const home = { label: 'Главная', to: '/dashboard' };
  if (pathname === '/dashboard') return [{ label: 'Главная' }];
  if (pathname === '/levels') return [home, { label: 'Уровни программы' }];
  if (pathname === '/levels/new') return [home, { label: 'Уровни программы', to: '/levels' }, { label: 'Новый уровень' }];
  if (pathname.startsWith('/levels/')) {
    const level = data.levels.find((item) => item.id === pathname.split('/')[2]);
    return [home, { label: 'Уровни программы', to: '/levels' }, { label: level?.name || 'Уровень' }];
  }
  if (pathname === '/participants') return [home, { label: 'Участники' }];
  if (pathname.startsWith('/participants/')) {
    const person = data.participants.find((item) => item.id === decodeURIComponent(pathname.split('/')[2]));
    return [home, { label: 'Участники', to: '/participants' }, { label: person?.name || 'Участник' }];
  }
  if (pathname === '/promotions') return [home, { label: 'Акции и условия' }];
  if (pathname === '/promotions/new') return [home, { label: 'Акции и условия', to: '/promotions' }, { label: 'Новая акция' }];
  if (pathname.startsWith('/promotions/')) {
    const promo = data.promotions.find((item) => item.id === pathname.split('/')[2]);
    return [home, { label: 'Акции и условия', to: '/promotions' }, { label: promo?.name || 'Акция' }];
  }
  if (pathname === '/bonuses') return [home, { label: 'Бонусы' }];
  if (pathname === '/analytics') return [home, { label: 'Аналитика' }];
  if (pathname === '/profile') return [home, { label: 'Профиль' }];
  if (pathname === '/settings') return [home, { label: 'Настройки' }];
  return [home];
}

function buildHits(query, participants, promotions, bonuses) {
  const needle = query.trim().toLowerCase();
  if (!needle) return [];
  const hits = [];
  participants.forEach((person) => {
    const hay = `${person.name} ${person.id} ${person.phone}`.toLowerCase();
    if (hay.includes(needle)) {
      hits.push({ kind: 'Участник', label: person.name, to: `/participants/${person.id}` });
    }
  });
  promotions.forEach((promo) => {
    if (promo.name.toLowerCase().includes(needle)) {
      hits.push({ kind: 'Акция', label: promo.name, to: `/promotions/${promo.id}` });
    }
  });
  bonuses.forEach((bonus) => {
    if (`${bonus.reason} ${bonus.id}`.toLowerCase().includes(needle)) {
      hits.push({ kind: 'Операция', label: bonus.reason, to: '/bonuses' });
    }
  });
  return hits.slice(0, 8);
}
