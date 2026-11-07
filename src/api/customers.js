import { http } from './http';

export function listCustomers() {
  return http.get('/customers').then((response) => response.data);
}

export function getCustomer(id) {
  return http.get(`/customers/${encodeURIComponent(id)}`).then((response) => response.data);
}

export function createCustomer(payload) {
  return http.post('/customers', payload).then((response) => response.data);
}

export function updateCustomer(id, payload) {
  return http.put(`/customers/${encodeURIComponent(id)}`, payload).then((response) => response.data);
}

export function deleteCustomer(id) {
  return http.delete(`/customers/${encodeURIComponent(id)}`);
}

export function getCustomerAccount(id) {
  return http.get(`/customers/${encodeURIComponent(id)}/loyalty-account`).then((response) => response.data);
}

export function getCustomerTransactions(id) {
  return http.get(`/customers/${encodeURIComponent(id)}/transactions`).then((response) => response.data);
}
