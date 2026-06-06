import { API_BASE } from '../config/api.js';
import { session }  from '../state/session.state.js';
import { EventBus } from './EventBus.js';

/**
 * Obtiene el token JWT guardado en localStorage tras el login.
 * @returns {string|null}
 */
function getToken() {
    return session.token ?? null;
}

/**
 * ApiClient
 * Wrapper sobre fetch que centraliza:
 *  - URL base de la API
 *  - Cabecera Authorization con el JWT
 *  - Serialización/deserialización JSON
 *  - Manejo unificado de errores HTTP
 *  - Emitir toasts de éxito/error automáticamente
 *
 * Lanza un Error con el mensaje devuelto por la API si el status no es 2xx.
 */
export const ApiClient = {

    /**
     * Realiza una petición HTTP a la API.
     * @param {'GET'|'POST'|'PUT'|'DELETE'} method
     * @param {string} path   - Ruta relativa, ej: '/users' o '/users/5'
     * @param {object|null} body  - Cuerpo JSON (solo para POST/PUT)
     * @returns {Promise<*>}  - Propiedad `data` de la respuesta
     */
    async request(method, path, body = null) {
        const token = getToken();
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers.Authorization = `Bearer ${token}`;

        // Incluir el socket ID para que el backend dirija los eventos de progreso
        // al socket exacto de esta pestaña (en lugar de a todos los sockets del usuario)
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
                // Emitir toast de error para acciones que modifican (no GET)
                if (method !== 'GET') {
                    EventBus.emit('toast:error', { message: errorMsg, duration: 4000 });
                }
                throw new Error(errorMsg);
            }

            // Emitir toast de éxito para acciones que modifican (no GET)
            if (method !== 'GET' && payload.message) {
                EventBus.emit('toast:success', { message: payload.message, duration: 3000 });
            }

            return payload.data ?? payload;
        } catch (error) {
            // Si es un error de red, emitir toast
            if (error instanceof TypeError) {
                EventBus.emit('toast:error', { 
                    message: 'Error de conexión. Por favor, intenta de nuevo.', 
                    duration: 4000 
                });
            }
            throw error;
        }
    },

    get(path)          { return this.request('GET', path); },
    post(path, body)   { return this.request('POST', path, body); },
    put(path, body)    { return this.request('PUT', path, body); },
    delete(path, body) { return this.request('DELETE', path, body); },
};
