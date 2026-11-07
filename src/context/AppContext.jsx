import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { login as loginRequest, logout as logoutRequest } from '../api/auth';
import { listCustomers } from '../api/customers';
import { createLevel, listLevels, updateLevel } from '../api/levels';
import { createPromotion, listPromotions, updatePromotion } from '../api/promotions';
import { getSettings, updateSettings } from '../api/settings';
import { listTransactions } from '../api/transactions';
import { recalcOptions } from '../data/mockData';

const AppContext = createContext(null);

function applySettings(payload) {
  return {
    programName: payload.programName,
    currency: payload.currency,
    bonusUnit: payload.bonusUnit,
    recalcPeriod: payload.recalcPeriod,
    sessionMinutes: payload.sessionMinutes,
    twoFactor: payload.twoFactor,
    since: payload.since,
    accrualLabel: payload.accrualLabel,
    bonusLifetime: payload.bonusLifetime,
    recalcLabel: payload.recalcLabel,
    nextRecalc: payload.nextRecalc,
  };
}

export function AppProvider({ children }) {
  const [auth, setAuth] = useState(() => sessionStorage.getItem('loyalty-auth') === '1');
  const [user, setUser] = useState(null);
  const [levels, setLevels] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [bonuses, setBonuses] = useState([]);
  const [settings, setSettings] = useState({
    programName: 'Программа лояльности',
    currency: 'BYN',
    bonusUnit: 'балл',
    recalcPeriod: 'monthly',
    sessionMinutes: '30',
    twoFactor: false,
    since: '01.03.2024',
    accrualLabel: '1–7% от суммы покупки',
    bonusLifetime: '12 месяцев',
    recalcLabel: 'ежемесячно, 1-го числа',
    nextRecalc: '01.11.2026 в 03:00',
  });
  const [notices, setNotices] = useState({ system: true, email: false });
  const [toasts, setToasts] = useState([]);
  const [unread, setUnread] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const dismissToast = useCallback((id) => {
    setToasts((list) => list.filter((toast) => toast.id !== id));
  }, []);

  const pushToast = useCallback((toast) => {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    setToasts((list) => [...list, { id, tone: 'success', ...toast }]);
    window.setTimeout(() => dismissToast(id), 4600);
  }, [dismissToast]);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [nextLevels, nextParticipants, nextPromotions, nextBonuses, nextSettings] = await Promise.all([
        listLevels(),
        listCustomers(),
        listPromotions(),
        listTransactions(),
        getSettings(),
      ]);
      setLevels(nextLevels);
      setParticipants(nextParticipants);
      setPromotions(nextPromotions);
      setBonuses(nextBonuses);
      setSettings(applySettings(nextSettings));
      setNotices(nextSettings.notices);
    } catch (err) {
      setError(err.message || 'Не удалось загрузить данные с сервера');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!auth) return undefined;
    refresh().catch(() => undefined);
    return undefined;
  }, [auth, refresh]);

  const value = useMemo(() => ({
    auth,
    user,
    participants,
    bonuses,
    notifications: [
      {
        id: 'n1',
        title: 'Пересчёт уровней',
        text: `Следующий плановый пересчёт — ${settings.nextRecalc}.`,
      },
      {
        id: 'n2',
        title: 'Уровни программы',
        text: `В программе действует ${levels.length} уровней лояльности.`,
      },
      {
        id: 'n3',
        title: 'Участники',
        text: `В реестре ${participants.length} покупателей.`,
      },
    ],
    levels,
    promotions,
    settings,
    notices,
    toasts,
    unread,
    loading,
    error,
    refresh,
    async login(email, password) {
      const response = await loginRequest(email, password);
      sessionStorage.setItem('loyalty-auth', '1');
      sessionStorage.setItem('loyalty-token', response.token);
      sessionStorage.setItem('loyalty-user', JSON.stringify(response.user));
      setUser(response.user);
      setAuth(true);
      return response.user;
    },
    async logout() {
      await logoutRequest();
      sessionStorage.removeItem('loyalty-auth');
      sessionStorage.removeItem('loyalty-token');
      sessionStorage.removeItem('loyalty-user');
      setUser(null);
      setAuth(false);
    },
    pushToast,
    dismissToast,
    markRead() {
      setUnread(false);
    },
    async saveLevel(level, isNew = false) {
      const payload = {
        name: level.name,
        points: level.points,
        percent: level.percent,
        color: level.color,
        effectiveFrom: level.effectiveFrom,
        description: level.description,
      };
      const saved = isNew || !level.id ? await createLevel(payload) : await updateLevel(level.id, payload);
      await refresh();
      return saved;
    },
    async savePromotion(promotion, isNew = false) {
      const payload = {
        name: promotion.name,
        status: promotion.status,
        levelId: promotion.levelId,
        start: promotion.start,
        end: promotion.end,
        bonusPercent: promotion.bonusPercent,
        description: promotion.description,
      };
      const saved = isNew || !promotion.id ? await createPromotion(payload) : await updatePromotion(promotion.id, payload);
      await refresh();
      return saved;
    },
    async saveSettings(next) {
      const recalc = recalcOptions.find((option) => option.value === next.recalcPeriod);
      const saved = await updateSettings({
        programName: next.programName,
        currency: next.currency,
        bonusUnit: next.bonusUnit,
        recalcPeriod: next.recalcPeriod,
        sessionMinutes: next.sessionMinutes,
        twoFactor: next.twoFactor,
        bonusLifetime: next.bonusLifetime,
        nextRecalc: next.nextRecalc,
        noticeSystem: notices.system,
        noticeEmail: notices.email,
      });
      setSettings({
        ...applySettings(saved),
        recalcLabel: recalc ? recalc.label.toLowerCase() : saved.recalcLabel,
      });
      setNotices(saved.notices);
      return saved;
    },
    async saveNotices(next) {
      const saved = await updateSettings({
        programName: settings.programName,
        currency: settings.currency,
        bonusUnit: settings.bonusUnit,
        recalcPeriod: settings.recalcPeriod,
        sessionMinutes: settings.sessionMinutes,
        twoFactor: settings.twoFactor,
        bonusLifetime: settings.bonusLifetime,
        nextRecalc: settings.nextRecalc,
        noticeSystem: next.system,
        noticeEmail: next.email,
      });
      setSettings(applySettings(saved));
      setNotices(saved.notices);
      return saved;
    },
  }), [
    auth,
    user,
    participants,
    bonuses,
    levels,
    promotions,
    settings,
    notices,
    toasts,
    unread,
    loading,
    error,
    refresh,
    pushToast,
    dismissToast,
  ]);

  useEffect(() => {
    const stored = sessionStorage.getItem('loyalty-user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        setUser(null);
      }
    }
  }, []);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
