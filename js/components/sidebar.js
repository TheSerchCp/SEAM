import { state } from "../services/general/state.js";
import { sidebarRepository } from "../repositories/SideBar/SIdebarRepository.js";

export async function Sidebar() {
    const user = localStorage.getItem('currentUser');
    if (user) {
        state.user = JSON.parse(user);
    }

    let menuOptions = [];

    if (state.user) {
        const roleId = state.user.roleId ?? state.user.idRole;
        menuOptions = await sidebarRepository.findItemsByRoleId(roleId);
    }

    return `
        <div>
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