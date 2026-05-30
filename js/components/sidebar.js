import { state } from "../services/general/state.js";
import { loadCSS } from "../utils/loadCss.js";

const optionsByRole = {

    admin: [
       {name: "Home", link: "home"},
        {name: "Users", link: "users"},
        {name: "Permission", link: "permission"},
    ],

    user: [
        {name: "Dashboard", link: "dashboard"},
        {name: "Courses", link: "courses"}
    ]
};

export async function Sidebar() {
    await loadCSS("css/components/sidebar.css");

    const menuOptions = state.user ? optionsByRole[state.user.role] : optionsByRole[state.users[0].role];

    return `
        <div class="sidebar">
        <ul>
           ${menuOptions.map(item => `
                <li>
                    <button class="btn-link" onclick="location.href='#/${item.link}'">
                    ${item.name}
                    </button>
                </li>
            `).join("")}
        </ul>
            <button id="logout-button" class="btn-link" >Cerrar sesión</button>
        </div>
    `;

}


document.addEventListener("click", (e) => {});