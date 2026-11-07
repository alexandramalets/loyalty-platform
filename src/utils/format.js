export function cx(...parts) {
  return parts.filter(Boolean).join(' ');
}

export function formatInt(value) {
  return new Intl.NumberFormat('ru-RU').format(Number(value) || 0);
}

export function formatSigned(value) {
  const number = Number(value) || 0;
  const formatted = formatInt(Math.abs(number));
  if (number > 0) return `+${formatted}`;
  if (number < 0) return `−${formatted}`;
  return '0';
}

export function formatDecimal(value, digits = 2) {
  return new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(Number(value) || 0);
}

export function formatDate(iso) {
  if (!iso) return '';
  const [year, month, day] = iso.split('-');
  if (!year || !month || !day) return iso;
  return `${day}.${month}.${year}`;
}

export function formatDateTime(iso) {
  if (!iso) return '';
  const [date, time] = iso.split('T');
  return time ? `${formatDate(date)} в ${time.slice(0, 5)}` : formatDate(date);
}

export function parseDate(text) {
  const match = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(String(text || '').trim());
  if (!match) return null;
  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export function todayIso() {
  const date = new Date();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

export function shiftIso(iso, days) {
  const [year, month, day] = iso.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() + days);
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${m}-${d}`;
}

export function daysAgo(iso) {
  const [year, month, day] = iso.split('-').map(Number);
  const then = new Date(year, month - 1, day);
  const now = new Date(2026, 9, 5);
  return Math.round((now - then) / 86400000);
}

export const MONTHS = [
  'Январь',
  'Февраль',
  'Март',
  'Апрель',
  'Май',
  'Июнь',
  'Июль',
  'Август',
  'Сентябрь',
  'Октябрь',
  'Ноябрь',
  'Декабрь',
];

export const WEEKDAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
