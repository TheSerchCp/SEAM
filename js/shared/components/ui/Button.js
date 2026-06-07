const TOOLTIP_CONFIGS = {
    top: {
        box:   'absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-[9999]',
        arrow: 'absolute top-full left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-gray-800 border-r border-b border-gray-600 rotate-45',
    },
    bottom: {
        box:   'absolute top-full left-1/2 -translate-x-1/2 mt-2 z-[9999]',
        arrow: 'absolute bottom-full left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 bg-gray-800 border-l border-t border-gray-600 rotate-45',
    },
    left: {
        box:   'absolute right-full top-1/2 -translate-y-1/2 mr-2 z-[9999]',
        arrow: 'absolute left-full top-1/2 -translate-y-1/2 -translate-x-1/2 w-2 h-2 bg-gray-800 border-t border-r border-gray-600 rotate-45',
    },
    right: {
        box:   'absolute left-full top-1/2 -translate-y-1/2 ml-2 z-[9999]',
        arrow: 'absolute right-full top-1/2 -translate-y-1/2 translate-x-1/2 w-2 h-2 bg-gray-800 border-b border-l border-gray-600 rotate-45',
    },
};

/**
 * Button — botón reutilizable con soporte de tooltip.
 * @param {{
 *   className:       string,
 *   action:          string,   // expresión para onclick (ej: "window.fn?.(1)")
 *   icon:            string,   // clase de Font Awesome (ej: "fa-solid fa-pen")
 *   buttonText:      string,   // texto visible; se omite si no se pasa
 *   hasTooltip:      boolean,
 *   tooltipText:     string,   // usa buttonText si no se pasa
 *   tooltipPosition: 'top'|'bottom'|'left'|'right'
 *   id:              string,
 *   type:            string,
 *   disabled:        boolean,
 * }} props
 */
export function Button({
    className       = '',
    action          = '',
    icon            = '',
    buttonText      = '',
    hasTooltip      = false,
    tooltipText     = '',
    tooltipPosition = 'top',
    id              = '',
    type            = 'button',
    disabled        = false,
    wrapperClass    = '',
} = {}) {
    const label  = tooltipText || buttonText;
    const cfg    = TOOLTIP_CONFIGS[tooltipPosition] ?? TOOLTIP_CONFIGS.top;

    const tooltipHtml = (hasTooltip && label) ? `
        <span class="${cfg.box} px-2 py-1 text-xs font-medium bg-gray-800 border border-gray-600 text-gray-100 rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none shadow-lg shadow-black/30">
            ${label}
            <span class="${cfg.arrow}"></span>
        </span>` : '';

    return `
        <div class="relative inline-flex group ${wrapperClass}">
            <button
                type="${type}"
                ${id       ? `id="${id}"`           : ''}
                ${action   ? `onclick="${action}"`   : ''}
                ${label    ? `title="${label}"`      : ''}
                ${disabled ? 'disabled'              : ''}
                class="${className}">
                ${icon       ? `<i class="${icon}"></i>`     : ''}
                ${buttonText ? `<span>${buttonText}</span>`  : ''}
            </button>
            ${tooltipHtml}
        </div>`;
}
