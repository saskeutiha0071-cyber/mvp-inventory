import axios from 'axios';

const API = axios.create({ baseURL: process.env.REACT_APP_API_URL || '/api' });

export const fetchItems = (params) => API.get('/items', { params }).then(r => r.data);
export const getItem = (id) => API.get(`/items/${id}`).then(r => r.data);
export const createItem = (payload) => API.post('/items', payload).then(r => r.data);
export const updateItem = (id, payload) => API.put(`/items/${id}`, payload).then(r => r.data);
export const deleteItem = (id) => API.delete(`/items/${id}`);
