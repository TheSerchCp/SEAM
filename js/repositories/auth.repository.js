import { ApiClient } from '../core/ApiClient.js';

export const login    = (email, password) => {
    try { return ApiClient.post('/auth/login', { email, password }); }
    catch { return null; }
};
export const register = (data) => ApiClient.post('/auth/register', data);
