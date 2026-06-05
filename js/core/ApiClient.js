import { API_BASE } from '../config/api.js';
import { session }  from '../state/session.state.js';

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

        const config = { method, headers };
        if (body !== null) config.body = JSON.stringify(body);

        const res = await fetch(`${API_BASE}${path}`, config);

        let payload;
        try { payload = await res.json(); }
        catch { payload = {}; }

        if (!res.ok) {
            throw new Error(payload.message ?? `Error ${res.status} en ${method} ${path}`);
        }

        return payload.data ?? payload;
    },

    get(path)          { return this.request('GET', path); },
    post(path, body)   { return this.request('POST', path, body); },
    put(path, body)    { return this.request('PUT', path, body); },
    delete(path, body) { return this.request('DELETE', path, body); },
};
