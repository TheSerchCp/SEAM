import { loadCSS } from "../utils/loadCss.js";
import { PrivateLayout } from "../layout/private.layout.js";

export async function Error404Page() {
    await loadCSS("css/pages/error.404.page.css");
    return PrivateLayout(`
        <div class="error-container">
            <h1 class="error-code">404</h1>
            <h2 class="error-title">Página no encontrada</h2>
            <p class="error-message">El contenido que intentas acceder no está disponible o la ruta no existe.</p>
            <button class="btn-info" onclick="location.hash = '#/home'">Volver al Inicio</button>
        </div>
    `);
}
