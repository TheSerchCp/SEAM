export function loadCSS(href) {

const existingLink = document.querySelector(`link[href="${href}"]`);
    if (existingLink) {
        return;
    }

    return new Promise((resolve, reject) => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = href;

        link.onload = () => {
            resolve();
        }

        link.onerror = (err) => {
            console.error("Error al cargar el css:", {url: href, detalles: err} );
            reject(new Error(`Error al cargar el css: ${href}`));
        }
        
        document.head.appendChild(link);

    });
}