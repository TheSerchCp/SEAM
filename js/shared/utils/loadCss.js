const _loaded = new Set();

/**
 * Inyecta una hoja de estilos CSS en el <head> una sola vez.
 * Las llamadas repetidas con el mismo href no generan elementos duplicados.
 * @param {string} href - Ruta al archivo CSS (relativa al index.html)
 */
export function loadCSS(href) {
    if (_loaded.has(href)) return;
    _loaded.add(href);
    const link = document.createElement('link');
    link.rel  = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
}
