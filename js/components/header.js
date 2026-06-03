import { state } from "../services/general/state.js";

export async function Header() {
    return `
        <div class="header-style">
            <h2>
                Bienvenido ${state.user?.name || ""}
            </h2>
        </div>
    `;
}