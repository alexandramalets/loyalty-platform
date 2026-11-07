import { http } from './http';

export function getSettings() {
  return http.get('/settings').then((response) => response.data);
}

export function updateSettings(payload) {
  return http.put('/settings', payload).then((response) => response.data);
}
