import { http } from './http';

export function listLevels() {
  return http.get('/loyalty-levels').then((response) => response.data);
}

export function getLevel(id) {
  return http.get(`/loyalty-levels/${encodeURIComponent(id)}`).then((response) => response.data);
}

export function createLevel(payload) {
  return http.post('/loyalty-levels', payload).then((response) => response.data);
}

export function updateLevel(id, payload) {
  return http.put(`/loyalty-levels/${encodeURIComponent(id)}`, payload).then((response) => response.data);
}

export function deleteLevel(id) {
  return http.delete(`/loyalty-levels/${encodeURIComponent(id)}`);
}
