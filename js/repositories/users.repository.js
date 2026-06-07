import { ApiClient } from '../core/ApiClient.js';

export const getAllUsers    = ()           => ApiClient.get('/users');
export const getUserById    = (id)         => ApiClient.get(`/users/${id}`);
export const createUser     = (data)       => ApiClient.post('/auth/register', data);
export const updateUser     = (id, data)   => ApiClient.put(`/users/${id}`, data);
export const deleteUserById = (id)         => ApiClient.delete(`/users/${id}`);
export const disableEnableUser = (id, enable) => ApiClient.put(`/users/${id}/state`, { isActive: enable });
