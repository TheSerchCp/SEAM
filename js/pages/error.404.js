import { loadCSS } from "../utils/loadCss.js";
import {PrivateLayout} from "../layout/private.layout.js";

export async function Error404Page() {
    //await loadCSS("css/pages/error.404.css");
    return PrivateLayout(`
        <div class="layout">
            <div class="header">
                <h1>Contenido no disponible</h1>
            </div>
            <div class="main-container">
                <main class="content">
                    <h1>El contenido que estas accediendo no se encuentra disponible por el momento</h1>
                </main>
            </div>

            <footer class="footer">
                <p>Sergio Cortes Popoca</p>
            </footer>
        </div>
    `);
}