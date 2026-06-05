import { session }         from '../../state/session.state.js';
import { getSidebarItems } from '../../services/sidebar.service.js';
import { logout }          from '../../services/auth.service.js';

export async function Sidebar() {
    const menuOptions = session.user ? getSidebarItems() : [];

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
            <button class="btn-link" onclick="logout()">Cerrar sesión</button>
        </div>
    `;
}

window.logout = function () {
    logout();
    location.hash = "/login";
};

document.addEventListener("click", () => {});
