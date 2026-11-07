import { http } from './http';

export function listTransactions() {
  return http.get('/transactions').then((response) => response.data);
}

export function accrueBonuses(payload) {
  return http.post('/transactions/accrual', payload).then((response) => response.data);
}

export function writeOffBonuses(payload) {
  return http.post('/transactions/write-off', payload).then((response) => response.data);
}
