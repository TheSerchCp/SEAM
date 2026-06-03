import { loadCSS } from '../utils/loadCss.js';

export async function Loader({text = "Cargando..."} = {}) {
    await loadCSS("css/components/loader.css");

    const template = `
        <div id="loader" class="overlay flex flex-col loader">
            <div id="loader-container">
                <span></span>
                <span></span>
                <span></span>
            </div>
            <p id="loader-text">${text}</p>
        </div>
    `;

    return {
        html: template,
        
        show(newText) {
            let loader = document.getElementById('loader');
            
            if (!loader) {
                const div = document.createElement('div');
                div.innerHTML = template;
                document.body.appendChild(div.firstElementChild);
            }
            
            const loaderText = document.getElementById('loader-text');
            if (loaderText && newText) {
                loaderText.textContent = newText;
            }
            
            loader = document.getElementById('loader');
            if (loader) {
                loader.style.display = 'flex';
            }
        },
        
        hide() {
            const loader = document.getElementById('loader');
            if (loader) {
                loader.style.display = 'none';
            }
        }
    };
}