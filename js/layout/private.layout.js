import { Sidebar } from "../components/sidebar.js";
import { Header } from "../components/header.js";
import { Footer } from "../components/footer.js";

import { loadCSS } from "../utils/loadCss.js";

export async function PrivateLayout(content) {
    await loadCSS("css/layout/private.layout.css");
    return `
        <div class="layout">
            <header class="header">
                ${await Header()}
            </header>

            <div class="main-container">
                <aside class="sidebar">${await Sidebar()}</aside>
                <main class="content">${content}</main>
            </div>
            
            <footer class="footer">
                ${await Footer()}
            </footer>
        </div>
    `;
}