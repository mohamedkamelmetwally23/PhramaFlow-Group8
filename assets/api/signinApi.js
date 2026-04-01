import { apiRequest } from './apiClient.js';

export const getUsersData = async () => await apiRequest('users');

export const getUserById = async (id) => await apiRequest(`users/${id}`);
