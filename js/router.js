import { HomePage } from "./pages/private/home.js";
import { UsersPage } from "./pages/private/users.js";
import { LoginPage } from "./pages/public/login.js";
import { state } from "./services/general/state.js";
import { Error404Page } from "./pages/error.404.js";

const routes = {
    "/": LoginPage,
    "/home": HomePage,
    "/usuarios": UsersPage,
    "/reportes": () => import("./pages/private/reportes.js").then(m => m.ReportesPage()),
    "/permisos": () => import("./pages/private/permisos.js").then(m => m.PermisosPage()),
    "/calificaciones": () => import("./pages/private/calificaciones.js").then(m => m.CalificacionesPage()),
    "/tareas": () => import("./pages/private/tareas.js").then(m => m.TareasPage()),
    "/proyectos": () => import("./pages/private/proyectos.js").then(m => m.ProyectosPage()),
    "/login": LoginPage,
};

export async function loadRoute() {
    const path = location.hash.slice(1) || "/";
    const pathSegments = path.split('/');
    const basePath = '/' + pathSegments[1];
    
    const page = routes[basePath] || routes[path];
    const app = document.getElementById("app");

    if(!page){
        app.innerHTML = await Error404Page();
        return;
    }

    // Proteger rutas privadas
    if(path !== "/login" && path !== "/" && !state.user) {
        const stored = localStorage.getItem('currentUser');
        if (!stored) {
            location.hash = "/login";
            return;
        }
        state.user = JSON.parse(stored);
    }

    if(state.user && (path === "/login" || path === "/")) {
        location.hash = "/home";
        return;
    }

    const pageContent = typeof page === 'function' ? await page() : await page;
    app.innerHTML = pageContent;
}

