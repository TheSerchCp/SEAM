import { state } from "../services/general/state.js";
import { loadCSS } from "../utils/loadCss.js";

export async function Header() {
 await loadCSS("css/components/header.css");
    return `
    
        <div class="header-style">

            <h2>
                Bienvenido ${state.user?.name || ""}
            </h2>

        </div>
    `;
}