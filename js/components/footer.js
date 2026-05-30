import { loadCSS } from "../utils/loadCss.js";

export async function Footer() {
    await loadCSS("css/components/footer.css");

    return `
    
        <footer class="footer">

            Mi sistema SPA

        </footer>
    `;
}