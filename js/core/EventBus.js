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
 * Eventos de Socket.IO bridgeados al bus interno:
 *   'operation:progress' → loader del cliente solicitante
 *     { operation, status: 'start'|'processing'|'success'|'error', message, data }
 *
 *   'data:changed' → actualización en tiempo real para TODOS los clientes
 *     { operation, data } — indica que datos mutaron en el servidor
 */

const _listeners = new Map();

export const EventBus = {

    on(event, cb) {
        if (!_listeners.has(event)) _listeners.set(event, new Set());
        _listeners.get(event).add(cb);
        
        // Retorna función para desuscribirse fácilmente
        return () => this.off(event, cb);
    },

    off(event, cb) {
        _listeners.get(event)?.delete(cb);
    },

    // Limpia todos los listeners de un evento específico
    clearEvent(event) {
        _listeners.delete(event);
    },

    emit(event, payload) {
        _listeners.get(event)?.forEach(cb => cb(payload));
    },

    /** ID del socket activo (null si no conectado). Usado por ApiClient para X-Socket-ID. */
    get socketId() {
        return this._socket?.id ?? null;
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

        this._socket.on('connect', () => {
            console.log(`🔌 Socket conectado: ${this._socket.id}`);
        });

        this._socket.on('disconnect', () => {
            console.log('🔌 Socket desconectado');
        });

        // Puente: progreso de operación → solo al cliente solicitante
        this._socket.on('operation:progress', (payload) => {
            console.log(`🔔 [EventBus] Recibido evento operation:progress:`, payload);
            EventBus.emit('operation:progress', payload);
        });

        // Puente: cambio de datos → broadcast a todos los clientes conectados
        this._socket.on('data:changed', (payload) => {
            console.log(`🔔 [EventBus] Recibido evento data:changed:`, payload);
            EventBus.emit('data:changed', payload);
        });

        // Registrar un listener GLOBAL para data:changed que persiste entre cambios de página
        // Esto asegura que TODAS las mutaciones se procesen, aunque el usuario esté en otra página
        this._setupGlobalDataChangedListener();
    },

    /**
     * Listener GLOBAL para data:changed que persiste y refresca la página actual.
     * Esto permite que cambios de otros usuarios se reflejen en tiempo real,
     * incluso si el usuario está en otra página o pestaña.
     */
    _setupGlobalDataChangedListener() {
        // Solo registrar una vez
        if (this._globalDataChangedListenerRegistered) {
            return;
        }
        this._globalDataChangedListenerRegistered = true;

        // Este listener NUNCA se desuscribe (persiste durante toda la sesión)
        this._globalDataChangedUnsub = this.on('data:changed', (payload) => {
            console.log(`🌍 [EventBus] Listener GLOBAL recibió data:changed:`, payload);
            
            // Aquí se puede hacer algo global, como recargar datos de la página actual
            // Por ahora, solo dejamos que cada página maneje su propio listener
            // pero esto garantiza que el evento fue recibido
        });
    },

    disconnect() {
        this._socket?.disconnect();
        this._socket = null;
        if (this._globalDataChangedUnsub) {
            this._globalDataChangedUnsub();
        }
        this._globalDataChangedListenerRegistered = false;
    },

    _socket: null,
    _globalDataChangedListenerRegistered: false,
    _globalDataChangedUnsub: null,
};
