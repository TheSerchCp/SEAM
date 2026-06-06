import { EventBus } from '../../core/EventBus.js';

let _initialized = false;

function _ensureDOM() {
    if (document.getElementById('global-loader')) return;

    const div = document.createElement('div');
    div.innerHTML = `
        <div id="global-loader" class="fixed inset-0 z-[9999] hidden flex-col items-center justify-center gap-4 bg-gray-950/90 px-6 backdrop-blur-sm">
            <div class="flex h-16 w-16 items-center justify-center rounded-full border border-cyan-400/30 bg-cyan-400/10 text-2xl text-cyan-300 shadow-lg shadow-cyan-500/10">
                <i class="fa-solid fa-spinner animate-spin"></i>
            </div>
            <div class="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.3em] text-gray-200">
                <span class="h-2.5 w-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
                <span class="h-2.5 w-2.5 rounded-full bg-cyan-300 animate-pulse [animation-delay:150ms]"></span>
                <span class="h-2.5 w-2.5 rounded-full bg-cyan-200 animate-pulse [animation-delay:300ms]"></span>
            </div>
            <p id="loader-text" class="text-center text-sm font-medium text-gray-100 sm:text-base">Cargando...</p>
        </div>`;
    document.body.appendChild(div.firstElementChild);
}

export const Loader = {
    show(message = 'Cargando...') {
        _ensureDOM();
        const el = document.getElementById('global-loader');
        const text = document.getElementById('loader-text');
        if (text) text.textContent = message;
        if (el) el.classList.remove('hidden');
        if (el) el.classList.add('flex');
    },

    update(message) {
        const text = document.getElementById('loader-text');
        if (text) text.textContent = message;
    },

    hide() {
        const el = document.getElementById('global-loader');
        if (el) {
            el.classList.remove('flex');
            el.classList.add('hidden');
        }
    },
};

if (!_initialized) {
    _initialized = true;
    EventBus.on('operation:progress', ({ status, message }) => {
        if (status === 'start' || status === 'processing') Loader.show(message);
        if (status === 'success' || status === 'error') Loader.hide();
    });
}
