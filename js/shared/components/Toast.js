import { EventBus } from '../../core/EventBus.js';

export function Toast({ message = '', type = 'info', duration = 3000 } = {}) {
    const typeStyles = {
        success: { bg: 'bg-emerald-500/20 border-emerald-500/40', text: 'text-emerald-300', icon: 'fa-circle-check' },
        error: { bg: 'bg-red-500/20 border-red-500/40', text: 'text-red-300', icon: 'fa-circle-xmark' },
        warning: { bg: 'bg-amber-500/20 border-amber-500/40', text: 'text-amber-300', icon: 'fa-triangle-exclamation' },
        info: { bg: 'bg-blue-500/20 border-blue-500/40', text: 'text-blue-300', icon: 'fa-circle-info' }
    };

    const style = typeStyles[type] || typeStyles.info;

    const toastId = `toast-${Date.now()}`;
    const html = `
        <div id="${toastId}" class="animate-in slide-in-from-top-full duration-300 fixed top-20 right-4 z-50 max-w-sm rounded-lg border ${style.bg} bg-gradient-to-r from-gray-900/90 to-gray-800/90 px-4 py-3 shadow-xl shadow-black/40 backdrop-blur-sm">
            <div class="flex items-start gap-3">
                <i class="fa-solid ${style.icon} ${style.text} text-lg mt-0.5 flex-shrink-0"></i>
                <p class="${style.text} text-sm font-medium leading-relaxed flex-1">${message}</p>
                <button onclick="document.getElementById('${toastId}')?.remove()" class="${style.text} transition hover:opacity-70">
                    <i class="fa-solid fa-xmark text-lg"></i>
                </button>
            </div>
        </div>
    `;

    const container = document.getElementById('toast-container') || (() => {
        const div = document.createElement('div');
        div.id = 'toast-container';
        document.body.appendChild(div);
        return div;
    })();

    const toastEl = document.createElement('div');
    toastEl.innerHTML = html;
    container.appendChild(toastEl.firstElementChild);

    if (duration > 0) {
        setTimeout(() => {
            const el = document.getElementById(toastId);
            if (el) {
                el.classList.add('animate-out', 'slide-out-to-top-full', 'duration-300');
                setTimeout(() => el.remove(), 300);
            }
        }, duration);
    }

    return toastId;
}

// Convenience methods
export const showSuccess = (msg, duration = 3000) => Toast({ message: msg, type: 'success', duration });
export const showError = (msg, duration = 4000) => Toast({ message: msg, type: 'error', duration });
export const showWarning = (msg, duration = 3500) => Toast({ message: msg, type: 'warning', duration });
export const showInfo = (msg, duration = 3000) => Toast({ message: msg, type: 'info', duration });

// Initialize EventBus listeners for toast notifications
EventBus.on('toast:show', (payload) => {
    const { message, type = 'info', duration } = payload;
    if (message) Toast({ message, type, duration });
});

EventBus.on('toast:success', (payload) => {
    const { message, duration = 3000 } = payload;
    showSuccess(message, duration);
});

EventBus.on('toast:error', (payload) => {
    const { message, duration = 4000 } = payload;
    showError(message, duration);
});

EventBus.on('toast:warning', (payload) => {
    const { message, duration = 3500 } = payload;
    showWarning(message, duration);
});

EventBus.on('toast:info', (payload) => {
    const { message, duration = 3000 } = payload;
    showInfo(message, duration);
});
