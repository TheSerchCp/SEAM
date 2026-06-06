import { HomePage } from '../pages/home/home.page.js';
import { UsersPage } from '../pages/users/users.page.js';
import { LoginPage } from '../pages/auth/auth.page.js';
import { session }   from '../state/session.state.js';
import { Error404Page } from '../pages/error/error.404.page.js';

const routes = {
    "/": LoginPage,
    "/home": HomePage,
    "/usuarios": UsersPage,
    "/reportes":       () => import('../pages/reportes/reportes.page.js').then(m => m.ReportesPage()),
    "/permisos":       () => import('../pages/permissions/permissions.page.js').then(m => m.PermisosPage()),
    "/calificaciones": () => import('../pages/calificaciones/calificaciones.page.js').then(m => m.CalificacionesPage()),
    "/tareas":         () => import('../pages/tareas/tareas.page.js').then(m => m.TareasPage()),
    "/proyectos":      () => import('../pages/proyectos/proyectos.page.js').then(m => m.ProyectosPage()),
    "/roles":          () => import('../pages/roles/roles.page.js').then(m => m.RolesPage()),
    "/login": LoginPage,
};

// Lista de funciones de limpieza registradas por la página activa.
// Se ejecutan al navegar a otra ruta para evitar handlers sobre DOM desmontado.
const _cleanupFns = [];

/**
 * Registra una función de limpieza que se ejecutará al abandonar la página actual.
 * Las páginas deben llamar a esta función para desuscribirse de EventBus, cancelar
 * timers, etc.
 * @param {() => void} fn
 */
export function registerPageCleanup(fn) {
    _cleanupFns.push(fn);
}

export async function loadRoute() {
    // Ejecutar y vaciar todas las funciones de limpieza de la página anterior
    while (_cleanupFns.length) {
        try { _cleanupFns.pop()(); } catch { /* no bloquear la navegación */ }
    }

    const path = location.hash.slice(1) || "/";
    const pathSegments = path.split('/');
    const basePath = '/' + pathSegments[1];

    const page = routes[basePath] || routes[path];
    const app = document.getElementById('app');

    if (!page) {
        app.innerHTML = await Error404Page();
        return;
    }

    if (path !== '/login' && path !== '/' && !session.user) {
        const stored = localStorage.getItem('currentUser');
        if (!stored) {
            location.hash = '/login';
            return;
        }
        const currentSession = JSON.parse(stored);
        session.user = currentSession.user ?? currentSession;
        session.token = currentSession.token ?? null;
        session.permissions = currentSession.permissions ? new Set(currentSession.permissions) : null;
        session.sidebarItems = currentSession.sidebarItems ?? null;
    }

    if (session.user && (path === '/login' || path === '/')) {
        location.hash = '/home';
        return;
    }

    const pageContent = typeof page === 'function' ? await page() : await page;
    app.innerHTML = pageContent;
}
