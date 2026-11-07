import { shiftIso } from '../utils/format';

export const currentUser = {
  name: 'Ирина Белова',
  initials: 'ИБ',
  role: 'Менеджер программы',
  email: 'i.belova@loyalty.local',
  phone: '+375 29 00 00 000',
  lastLogin: '05.10.2026 в 09:14',
  passwordChanged: '12.03.2026',
};

export const levelColors = {
  start: '#C5D1C3',
  regular: '#8FA88F',
  premium: '#4F7A62',
  vip: '#174D3A',
};

export const initialLevels = [
  {
    id: 'start',
    name: 'Старт',
    points: 0,
    percent: 1,
    participants: 4820,
    color: levelColors.start,
    effectiveFrom: '2024-03-01',
    description:
      'Стартовый уровень при регистрации. Начисление — 1% от суммы покупки. Порог перехода на следующий уровень — 5 000 баллов за 12 месяцев.',
  },
  {
    id: 'regular',
    name: 'Постоянный',
    points: 5000,
    percent: 3,
    participants: 4150,
    color: levelColors.regular,
    effectiveFrom: '2024-03-01',
    description:
      'Уровень для регулярных покупок. Начисление — 3% от суммы покупки. Порог перехода на «Премиум» — 15 000 баллов за 12 месяцев.',
  },
  {
    id: 'premium',
    name: 'Премиум',
    points: 15000,
    percent: 5,
    participants: 2730,
    color: levelColors.premium,
    effectiveFrom: '2024-03-01',
    description:
      'Порог перехода на уровень «Премиум» — 15 000 баллов за 12 месяцев. Начисление — 5% от суммы покупки.',
  },
  {
    id: 'vip',
    name: 'VIP',
    points: 30000,
    percent: 7,
    participants: 840,
    color: levelColors.vip,
    effectiveFrom: '2024-03-01',
    description:
      'Максимальный уровень программы. Начисление — 7% от суммы покупки. Порог — 30 000 баллов за 12 месяцев.',
  },
];

const people = [
  ['П-104582', 'Анна', 'Ковалёва', 'premium', 18420, 'active', '2026-10-04', 47, '2024-04-12'],
  ['П-104577', 'Максим', 'Орлов', 'vip', 34910, 'active', '2026-10-03', 96, '2023-11-02'],
  ['П-104561', 'Елена', 'Морозова', 'regular', 7260, 'inactive', '2026-08-12', 18, '2024-09-20'],
  ['П-104549', 'Дмитрий', 'Соколов', 'start', 1180, 'active', '2026-10-01', 6, '2026-02-14'],
  ['П-104532', 'Виктория', 'Романова', 'premium', 16050, 'blocked', '2026-09-28', 39, '2024-01-18'],
  ['П-104510', 'Сергей', 'Никитин', 'vip', 31200, 'active', '2026-10-04', 86, '2023-08-09'],
  ['П-104488', 'Ольга', 'Белова', 'premium', 17240, 'active', '2026-09-30', 41, '2024-06-03'],
  ['П-104470', 'Павел', 'Егоров', 'regular', 6400, 'active', '2026-09-22', 19, '2025-01-27'],
  ['П-104455', 'Мария', 'Кузнецова', 'start', 890, 'inactive', '2026-07-14', 4, '2025-11-11'],
  ['П-104441', 'Игорь', 'Лебедев', 'premium', 19880, 'blocked', '2026-09-02', 52, '2024-02-08'],
  ['П-104420', 'Наталья', 'Соколова', 'regular', 8120, 'active', '2026-10-01', 27, '2024-12-16'],
  ['П-104401', 'Артём', 'Волков', 'start', 240, 'active', '2026-10-05', 2, '2026-09-01'],
  ['П-104388', 'Светлана', 'Павлова', 'vip', 40120, 'active', '2026-09-29', 110, '2023-05-22'],
  ['П-104360', 'Кирилл', 'Новиков', 'regular', 4550, 'inactive', '2026-06-18', 11, '2025-03-30'],
  ['П-104344', 'Юлия', 'Федорова', 'premium', 15110, 'active', '2026-09-25', 33, '2024-08-19'],
  ['П-104320', 'Роман', 'Алексеев', 'start', 3100, 'active', '2026-08-30', 9, '2025-07-07'],
  ['П-104301', 'Татьяна', 'Орлова', 'regular', 9900, 'blocked', '2026-09-11', 22, '2024-10-05'],
  ['П-104288', 'Андрей', 'Морозов', 'vip', 28750, 'active', '2026-10-02', 74, '2023-12-28'],
  ['П-104270', 'Екатерина', 'Соловьёва', 'premium', 13340, 'inactive', '2026-05-20', 18, '2025-02-02'],
  ['П-104255', 'Никита', 'Васильев', 'start', 150, 'active', '2026-10-03', 1, '2026-08-16'],
  ['П-104240', 'Алина', 'Громова', 'regular', 5680, 'active', '2026-09-18', 15, '2025-04-21'],
  ['П-104228', 'Денис', 'Комаров', 'start', 2040, 'active', '2026-09-08', 7, '2025-09-14'],
  ['П-104211', 'Полина', 'Зайцева', 'premium', 22150, 'active', '2026-10-02', 58, '2024-03-11'],
  ['П-104198', 'Илья', 'Семёнов', 'vip', 33640, 'inactive', '2026-04-02', 64, '2023-09-30'],
];

function phoneFrom(index) {
  const base = 9001120000 + index * 137;
  const digits = String(base);
  return `+7 ${digits.slice(0, 3)} ${digits.slice(3, 6)}-${digits.slice(6, 8)}-${digits.slice(8, 10)}`;
}

function emailFrom(first, last, index) {
  const map = {
    Анна: 'anna',
    Максим: 'maxim',
    Елена: 'elena',
    Дмитрий: 'dmitry',
    Виктория: 'victoria',
    Сергей: 'sergey',
    Ольга: 'olga',
    Павел: 'pavel',
    Мария: 'maria',
    Игорь: 'igor',
    Наталья: 'natalia',
    Артём: 'artem',
    Светлана: 'svetlana',
    Кирилл: 'kirill',
    Юлия: 'yulia',
    Роман: 'roman',
    Татьяна: 'tatiana',
    Андрей: 'andrey',
    Екатерина: 'ekaterina',
    Никита: 'nikita',
    Алина: 'alina',
    Денис: 'denis',
    Полина: 'polina',
    Илья: 'ilya',
  };
  const local = map[first] || `user${index}`;
  return `${local}.${index}@loyalty.local`;
}

export const participants = people.map((row, index) => {
  const [id, first, last, levelId, points, status, lastActivity, purchases, registered] = row;
  return {
    id,
    firstName: first,
    lastName: last,
    name: `${first} ${last}`,
    levelId,
    points,
    status,
    lastActivity,
    purchases,
    registered,
    phone: phoneFrom(index),
    email: emailFrom(first, last, index + 1),
  };
});

export const statusMeta = {
  active: { label: 'Активна', tone: 'success', dot: 'fill' },
  inactive: { label: 'Неактивна', tone: 'neutral', dot: 'hollow' },
  blocked: { label: 'Заблокирована', tone: 'danger', dot: 'fill' },
  scheduled: { label: 'Запланирована', tone: 'warning', dot: 'fill' },
  finished: { label: 'Завершена', tone: 'neutral', dot: 'hollow' },
  paused: { label: 'Приостановлена', tone: 'warning', dot: 'hollow' },
  processing: { label: 'В обработке', tone: 'warning', dot: 'fill' },
  done: { label: 'Выполнено', tone: 'success', dot: 'fill' },
  error: { label: 'Ошибка', tone: 'danger', dot: 'fill' },
  cancelled: { label: 'Отменена', tone: 'neutral', dot: 'hollow' },
};

export const promotionStatuses = [
  { value: 'active', label: 'Активна' },
  { value: 'scheduled', label: 'Запланирована' },
  { value: 'paused', label: 'Приостановлена' },
  { value: 'finished', label: 'Завершена' },
];

export const initialPromotions = [
  {
    id: 'promo-extra',
    name: 'Дополнительные бонусы за покупки',
    status: 'active',
    levelId: 'all',
    start: '2026-09-01',
    end: '2026-11-30',
    bonusPercent: 2,
    description:
      'Дополнительно 2% бонусов при покупке от 100 000 ₽ в категориях «Одежда» и «Обувь». Условие суммируется с базовым процентом уровня.',
  },
  {
    id: 'promo-level',
    name: 'Бонус за достижение нового уровня',
    status: 'scheduled',
    levelId: 'premium',
    start: '2026-11-01',
    end: '2026-12-31',
    bonusPercent: 500,
    description:
      'Единовременное начисление при переходе на уровень «Премиум» или «VIP». Бонус применяется при ближайшем пересчёте уровней.',
  },
  {
    id: 'promo-personal',
    name: 'Персональное предложение',
    status: 'finished',
    levelId: 'regular',
    start: '2026-03-01',
    end: '2026-08-31',
    bonusPercent: 4,
    description:
      'Индивидуальные условия для участников уровня «Постоянный»: 4% вместо базовых 3% в период действия акции.',
  },
];

export const bonuses = [
  { id: 'op-901', participantId: 'П-104582', amount: 420, type: 'Начисление', date: '2026-10-04', reason: 'Покупка Ч-88341', status: 'done' },
  { id: 'op-902', participantId: 'П-104577', amount: -1500, type: 'Списание', date: '2026-10-03', reason: 'Оплата бонусами', status: 'done' },
  { id: 'op-903', participantId: 'П-104549', amount: 80, type: 'Начисление', date: '2026-10-01', reason: 'Дополнительные бонусы за покупки', status: 'processing' },
  { id: 'op-904', participantId: 'П-104561', amount: 200, type: 'Начисление', date: '2026-08-12', reason: 'Бонус за достижение нового уровня', status: 'error' },
  { id: 'op-905', participantId: 'П-104532', amount: -300, type: 'Списание', date: '2026-09-28', reason: 'Отмена покупки Ч-87902', status: 'cancelled' },
  { id: 'op-906', participantId: 'П-104388', amount: 960, type: 'Начисление', date: '2026-09-29', reason: 'Покупка Ч-88110', status: 'done' },
  { id: 'op-907', participantId: 'П-104211', amount: 540, type: 'Начисление', date: '2026-10-02', reason: 'Дополнительные бонусы за покупки', status: 'done' },
  { id: 'op-908', participantId: 'П-104420', amount: -120, type: 'Списание', date: '2026-10-01', reason: 'Оплата бонусами', status: 'processing' },
  { id: 'op-909', participantId: 'П-104288', amount: 710, type: 'Начисление', date: '2026-10-02', reason: 'Покупка Ч-88402', status: 'done' },
  { id: 'op-910', participantId: 'П-104441', amount: 150, type: 'Начисление', date: '2026-09-02', reason: 'Корректировка начисления', status: 'error' },
  { id: 'op-911', participantId: 'П-104401', amount: 24, type: 'Начисление', date: '2026-10-05', reason: 'Покупка Ч-88490', status: 'done' },
  { id: 'op-912', participantId: 'П-104301', amount: -80, type: 'Списание', date: '2026-09-11', reason: 'Сгорание бонусов', status: 'cancelled' },
];

export const initialSettings = {
  programName: 'Программа лояльности',
  currency: 'RUB',
  bonusUnit: 'балл',
  recalcPeriod: 'monthly',
  sessionMinutes: '30',
  twoFactor: false,
  since: '01.03.2024',
  accrualLabel: '1–7% от суммы покупки',
  bonusLifetime: '12 месяцев',
  recalcLabel: 'ежемесячно, 1-го числа',
  nextRecalc: '01.11.2026 в 03:00',
};

export const initialNotices = {
  system: true,
  email: false,
};

export const currencyOptions = [
  { value: 'BYN', label: 'Белорусский рубль' },
];

export const bonusUnitOptions = [
  { value: 'балл', label: 'Балл' },
  { value: 'бонус', label: 'Бонус' },
];

export const recalcOptions = [
  { value: 'monthly', label: 'Ежемесячно, 1-го числа' },
  { value: 'quarterly', label: 'Ежеквартально' },
  { value: 'yearly', label: 'Ежегодно' },
];

export const sessionOptions = [
  { value: '15', label: '15 минут' },
  { value: '30', label: '30 минут' },
  { value: '60', label: '60 минут' },
  { value: '480', label: '8 часов' },
];

export const activityOptions = [
  { value: 'all', label: 'Все' },
  { value: '7', label: 'За 7 дней' },
  { value: '30', label: 'За 30 дней' },
  { value: '90', label: 'За 90 дней' },
  { value: '365', label: 'За 12 месяцев' },
];

export const participantStatusOptions = [
  { value: 'all', label: 'Все' },
  { value: 'active', label: 'Активна' },
  { value: 'inactive', label: 'Неактивна' },
  { value: 'blocked', label: 'Заблокирована' },
];

export const operationTypeOptions = [
  { value: 'all', label: 'Все' },
  { value: 'Начисление', label: 'Начисление' },
  { value: 'Списание', label: 'Списание' },
];

export const operationStatusOptions = [
  { value: 'all', label: 'Все' },
  { value: 'done', label: 'Выполнено' },
  { value: 'processing', label: 'В обработке' },
  { value: 'error', label: 'Ошибка' },
  { value: 'cancelled', label: 'Отменена' },
];

export function buildHistory(participant) {
  const accrual = Math.max(20, Math.round(participant.points * 0.012));
  const redeem = Math.max(10, Math.round(participant.points * 0.004));
  return [
    {
      id: `${participant.id}-1`,
      date: participant.lastActivity,
      event: 'Покупка',
      reason: 'Начисление за покупку',
      amount: accrual,
      status: 'done',
    },
    {
      id: `${participant.id}-2`,
      date: shiftIso(participant.lastActivity, -14),
      event: 'Списание',
      reason: 'Оплата бонусами',
      amount: -redeem,
      status: participant.status === 'blocked' ? 'cancelled' : 'done',
    },
    {
      id: `${participant.id}-3`,
      date: shiftIso(participant.lastActivity, -28),
      event: 'Акция',
      reason: 'Дополнительные бонусы за покупки',
      amount: 150,
      status: participant.status === 'inactive' ? 'error' : 'done',
    },
    {
      id: `${participant.id}-4`,
      date: shiftIso(participant.lastActivity, -40),
      event: 'Пересчёт',
      reason: 'Ежемесячный пересчёт уровня',
      amount: 0,
      status: 'done',
    },
  ];
}

export const activityByPeriod = {
  1: {
    labels: ['1 нед.', '2 нед.', '3 нед.', '4 нед.'],
    accrual: [4200, 5100, 4700, 5600],
    redeem: [2100, 2400, 2200, 2800],
  },
  3: {
    labels: ['Авг', 'Сен', 'Окт'],
    accrual: [6100, 6900, 7400],
    redeem: [2800, 3300, 3600],
  },
  6: {
    labels: ['Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт'],
    accrual: [3400, 4100, 3900, 5200, 6100, 7400],
    redeem: [1800, 2100, 1900, 2400, 2800, 3100],
  },
  12: {
    labels: ['Ноя', 'Дек', 'Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт'],
    accrual: [2800, 3100, 2600, 3000, 3400, 3600, 3400, 4100, 3900, 5200, 6100, 7400],
    redeem: [1400, 1600, 1300, 1500, 1700, 1800, 1800, 2100, 1900, 2400, 2800, 3100],
  },
};

export const analyticsByPeriod = {
  1: {
    kpis: [
      { label: 'Активных участников', value: '8 420', delta: '67,1% от общего числа', tone: 'neutral' },
      { label: 'Покупок с бонусами', value: '18 640', delta: '+2,4% к прошлому месяцу', tone: 'up' },
      { label: 'Начислено баллов', value: '1 240 000', delta: 'за последние 30 дней', tone: 'neutral' },
      { label: 'Использовано бонусов', value: '68%', delta: '— за последние 30 дней', tone: 'neutral' },
    ],
    bonus: { accrued: 1240000, spent: 843200, expired: 62400, rate: 68 },
    transitions: [
      { from: 'Старт', to: 'Постоянный', count: 186 },
      { from: 'Постоянный', to: 'Премиум', count: 74 },
      { from: 'Премиум', to: 'VIP', count: 21 },
      { from: 'Премиум', to: 'Постоянный', count: 28 },
      { from: 'Постоянный', to: 'Старт', count: 15 },
    ],
  },
  3: {
    kpis: [
      { label: 'Активных участников', value: '8 610', delta: '68,7% от общего числа', tone: 'neutral' },
      { label: 'Покупок с бонусами', value: '54 220', delta: '+4,1% к предыдущему периоду', tone: 'up' },
      { label: 'Начислено баллов', value: '3 680 000', delta: 'за 3 месяца', tone: 'neutral' },
      { label: 'Использовано бонусов', value: '64%', delta: '— за 3 месяца', tone: 'neutral' },
    ],
    bonus: { accrued: 3680000, spent: 2355200, expired: 151000, rate: 64 },
    transitions: [
      { from: 'Старт', to: 'Постоянный', count: 540 },
      { from: 'Постоянный', to: 'Премиум', count: 210 },
      { from: 'Премиум', to: 'VIP', count: 58 },
      { from: 'Премиум', to: 'Постоянный', count: 76 },
      { from: 'Постоянный', to: 'Старт', count: 44 },
    ],
  },
  6: {
    kpis: [
      { label: 'Активных участников', value: '8 240', delta: '65,7% от общего числа', tone: 'neutral' },
      { label: 'Покупок с бонусами', value: '102 480', delta: '−1,2% к предыдущему периоду', tone: 'down' },
      { label: 'Начислено баллов', value: '7 150 000', delta: 'за 6 месяцев', tone: 'neutral' },
      { label: 'Использовано бонусов', value: '61%', delta: '— за 6 месяцев', tone: 'neutral' },
    ],
    bonus: { accrued: 7150000, spent: 4361500, expired: 286000, rate: 61 },
    transitions: [
      { from: 'Старт', to: 'Постоянный', count: 980 },
      { from: 'Постоянный', to: 'Премиум', count: 402 },
      { from: 'Премиум', to: 'VIP', count: 116 },
      { from: 'Премиум', to: 'Постоянный', count: 154 },
      { from: 'Постоянный', to: 'Старт', count: 91 },
    ],
  },
  12: {
    kpis: [
      { label: 'Активных участников', value: '8 420', delta: '+3,8% к сентябрю', tone: 'up' },
      { label: 'Покупок с бонусами', value: '214 900', delta: '+6,4% к прошлому году', tone: 'up' },
      { label: 'Начислено баллов', value: '14 820 000', delta: 'за 12 месяцев', tone: 'neutral' },
      { label: 'Использовано бонусов', value: '66%', delta: '— за 12 месяцев', tone: 'neutral' },
    ],
    bonus: { accrued: 14820000, spent: 9781200, expired: 540000, rate: 66 },
    transitions: [
      { from: 'Старт', to: 'Постоянный', count: 2140 },
      { from: 'Постоянный', to: 'Премиум', count: 860 },
      { from: 'Премиум', to: 'VIP', count: 240 },
      { from: 'Премиум', to: 'Постоянный', count: 310 },
      { from: 'Постоянный', to: 'Старт', count: 188 },
    ],
  },
};

export const dashboardActivityNote = 'Покупки с начислением или списанием бонусов';

export const distribution = [
  { id: 'start', name: 'Старт', value: 4820 },
  { id: 'regular', name: 'Постоянный', value: 4150 },
  { id: 'premium', name: 'Премиум', value: 2730 },
  { id: 'vip', name: 'VIP', value: 840 },
];

export const headerNotifications = [
  {
    id: 'n1',
    title: 'Пересчёт уровней',
    text: 'Следующий плановый пересчёт — 01.11.2026 в 03:00.',
  },
  {
    id: 'n2',
    title: 'Изменение условий',
    text: 'Повышение порога затронет 312 участников уровня «Премиум».',
  },
  {
    id: 'n3',
    title: 'Импорт участников',
    text: 'Последний импорт завершён 04.10.2026 без ошибок.',
  },
];
