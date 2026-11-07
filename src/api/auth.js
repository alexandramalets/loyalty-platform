import { http } from './http';

export function login(email, password) {
  return http.post('/auth/login', { email, password }).then((response) => response.data);
}

export function logout() {
  return http.post('/auth/logout').catch(() => undefined);
}

export function me() {
  return http.get('/auth/me').then((response) => response.data);
}
