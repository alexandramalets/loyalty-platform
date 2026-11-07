import { http } from './http';

export function listPromotions() {
  return http.get('/promotions').then((response) => response.data);
}

export function getPromotion(id) {
  return http.get(`/promotions/${encodeURIComponent(id)}`).then((response) => response.data);
}

export function createPromotion(payload) {
  return http.post('/promotions', payload).then((response) => response.data);
}

export function updatePromotion(id, payload) {
  return http.put(`/promotions/${encodeURIComponent(id)}`, payload).then((response) => response.data);
}

export function deletePromotion(id) {
  return http.delete(`/promotions/${encodeURIComponent(id)}`);
}
