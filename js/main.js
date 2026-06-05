import { loadRoute } from './core/Router.js';
import { session }   from './state/session.state.js';
import { EventBus }  from './core/EventBus.js';

// Hidratar estado desde localStorage
const stored = localStorage.getItem('currentUser');
if (stored) {
    try {
        const s = JSON.parse(stored);
        session.user         = s.user         ?? s;
        session.token        = s.token        ?? null;
        session.permissions  = s.permissions  ? new Set(s.permissions) : null;
        session.sidebarItems = s.sidebarItems ?? null;

        // Reconectar socket si hay token (recarga de página)
        if (session.token) EventBus.connect(session.token);
    } catch {
        localStorage.removeItem('currentUser');
    }
}

window.addEventListener('hashchange', loadRoute);
loadRoute();
