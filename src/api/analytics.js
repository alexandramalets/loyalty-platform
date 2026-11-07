import { http } from './http';

export function getAnalytics(period) {
  return http.get('/analytics', { params: { period } }).then((response) => response.data);
}
