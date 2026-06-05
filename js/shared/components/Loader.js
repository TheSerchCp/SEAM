import { loadCSS } from '../utils/loadCss.js';
import { EventBus } from '../../core/EventBus.js';

/**
 * Loader — singleton global de progreso.
 *
 * Se muestra/actualiza/oculta automáticamente escuchando 'operation:progress'
 * del EventBus (eventos de Socket.IO del backend).
 *
 * También puede usarse manualmente:
 *   Loader.show('Procesando...')
 *   Loader.update('Paso 2...')
 *   Loader.hide()
 */

let _initialized = false;

function _ensureDOM() {
    if (document.getElementById('global-loader')) return;

    loadCSS('css/components/loader.css');

    const div = document.createElement('div');
    div.innerHTML = `
        <div id="global-loader" class="overlay flex flex-col loader" style="display:none;">
            <div id="loader-container">
                <span></span>
                <span></span>
                <span></span>
            </div>
            <p id="loader-text">Cargando...</p>
        </div>`;
    document.body.appendChild(div.firstElementChild);
}

export const Loader = {

    show(message = 'Cargando...') {
        _ensureDOM();
        const el   = document.getElementById('global-loader');
        const text = document.getElementById('loader-text');
        if (text) text.textContent = message;
        if (el)   el.style.display = 'flex';
    },

    update(message) {
        const text = document.getElementById('loader-text');
        if (text) text.textContent = message;
    },

    hide() {
        const el = document.getElementById('global-loader');
        if (el) el.style.display = 'none';
    },
};

// Suscripción automática a eventos de progreso del backend (una sola vez)
if (!_initialized) {
    _initialized = true;
    EventBus.on('operation:progress', ({ status, message }) => {
        if (status === 'start' || status === 'processing') Loader.show(message);
        if (status === 'success' || status === 'error')    Loader.hide();
    });
}

