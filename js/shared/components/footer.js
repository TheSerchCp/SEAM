import { loadCSS } from '../utils/loadCss.js';

export async function Footer() {
    await loadCSS("css/components/footer.css");
    return `<p class="footer-text">&copy; ${new Date().getFullYear()} SEAM</p>`;
}
