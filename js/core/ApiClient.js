import { API_BASE } from '../config/api.js';
import { session }  from '../state/session.state.js';
import { EventBus } from './EventBus.js';
import * as AuthService from '../services/auth.service.js';

function getToken() {
    return session.token ?? null;
}

export const ApiClient = {
    async request(method, path, body = null) {
        const token = getToken();
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers.Authorization = `Bearer ${token}`;

        const socketId = EventBus.socketId;
        if (socketId) headers['X-Socket-ID'] = socketId;

        const config = { method, headers };
        if (body !== null) config.body = JSON.stringify(body);

        try {
            const res = await fetch(`${API_BASE}${path}`, config);

            let payload;
            try { payload = await res.json(); }
            catch { payload = {}; }

            if (!res.ok) {
                const errorMsg = payload.message ?? `Error ${res.status} en ${method} ${path}`;
                
                if (res.status === 401) {
                    AuthService.logout();
                    EventBus.emit('toast:error', { 
                        message: 'Token inválido o expirado. Por favor, inicia sesión de nuevo.', 
                        duration: 4000 
                    });
                    setTimeout(() => {
                        window.location.href = '/index.html';
                    }, 500);
                    return null;
                }
                
                if (method !== 'GET') {
                    EventBus.emit('toast:error', { message: errorMsg, duration: 4000 });
                }
                return null;
            }

            if (method !== 'GET' && payload.message) {
                EventBus.emit('toast:success', { message: payload.message, duration: 3000 });
            }

            return payload.data ?? payload;
        } catch (error) {
            if (error instanceof TypeError) {
                EventBus.emit('toast:error', { 
                    message: 'Error de conexión. Por favor, intenta de nuevo.', 
                    duration: 4000 
                });
            }
            return null;
        }
    },

    get(path)          { return this.request('GET', path); },
    post(path, body)   { return this.request('POST', path, body); },
    put(path, body)    { return this.request('PUT', path, body); },
    delete(path, body) { return this.request('DELETE', path, body); },
};
