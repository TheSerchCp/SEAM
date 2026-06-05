import { API_BASE } from '../config/api.js';

/**
 * EventBus — pub/sub interno + puente con Socket.IO.
 *
 * Uso interno:
 *   EventBus.on('mi:evento', cb)
 *   EventBus.emit('mi:evento', datos)
 *
 * Socket.IO:
 *   EventBus.connect(token)     → conecta el socket con JWT
 *   EventBus.disconnect()       → desconecta el socket
 *
 * El socket re-emite internamente 'operation:progress' con el payload del backend:
 *   { operation, status: 'start'|'processing'|'success'|'error', message, data }
 */

const _listeners = new Map();

export const EventBus = {

    on(event, cb) {
        if (!_listeners.has(event)) _listeners.set(event, new Set());
        _listeners.get(event).add(cb);
    },

    off(event, cb) {
        _listeners.get(event)?.delete(cb);
    },

    emit(event, payload) {
        _listeners.get(event)?.forEach(cb => cb(payload));
    },

    /** Conecta Socket.IO con el JWT del usuario y puente los eventos al bus interno. */
    connect(token) {
        if (typeof io === 'undefined') {
            console.warn('Socket.IO no disponible — asegúrate de incluir el script de cliente.');
            return;
        }

        if (this._socket) this._socket.disconnect();

        const socketUrl = API_BASE.replace('/api/v1', '');

        this._socket = io(socketUrl, { auth: { token } });

        this._socket.on('connect', () =>
            console.log(`🔌 Socket conectado: ${this._socket.id}`));

        this._socket.on('disconnect', () =>
            console.log('🔌 Socket desconectado'));

        // Puente: evento del backend → bus interno
        this._socket.on('operation:progress', (payload) => {
            EventBus.emit('operation:progress', payload);
        });
    },

    disconnect() {
        this._socket?.disconnect();
        this._socket = null;
    },

    _socket: null,
};
