import { ApiClient } from '../core/ApiClient.js';

export const getAll = () => ApiClient.get('/roles');
