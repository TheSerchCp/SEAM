import { state } from "../services/general/state.js";

const optionsByRole = {
    admin: [
        {name: "Home", link: "home"},
        {name: "Usuarios", link: "usuarios"},
        {name: "Reportes", link: "reportes"},
        {name: "Permisos", link: "permisos"},
    ],

    profesor: [
        {name: "Home", link: "home"},
        {name: "Calificaciones", link: "calificaciones"},
        {name: "Tareas", link: "tareas"}
    ],

    alumno: [
        {name: "Home", link: "home"},
        {name: "Mi Historial", link: "home"}
    ]
};

export async function Sidebar() {
    // Cargar usuario desde localStorage si no existe
    if (!state.user) {
        const stored = localStorage.getItem('currentUser');
        if (stored) {
            state.user = JSON.parse(stored);
        }
    }

    const menuOptions = state.user ? optionsByRole[state.user.role] : [];

    return `
        <div class="sidebar">
        <ul>
           ${menuOptions.map(item => `
                <li>
                    <button class="btn-link" onclick="location.hash='#/${item.link}'">
                    ${item.name}
                    </button>
                </li>
            `).join("")}
        </ul>
            <button id="logout-button" class="btn-link" onclick="logout()">Cerrar sesión</button>
        </div>
    `;
}

window.logout = function() {
    localStorage.removeItem('currentUser');
    state.user = null;
    location.hash = "/login";
};

document.addEventListener("click", (e) => {});