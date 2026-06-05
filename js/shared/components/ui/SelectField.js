/**
 * SelectField — genera un <select> con su label y contenedor de error.
 * @param {{ name, label, options, selected?, required?, withError? }} props
 * options: Array<{ value, label }>
 */
export function SelectField({ name, label, options = [], selected = "", required = false, withError = false }) {
    const opts = options.map(o =>
        `<option value="${o.value}" ${String(o.value) === String(selected) ? "selected" : ""}>${o.label}</option>`
    ).join("");
    return `
    <div class="flex flex-col">
        <label for="${name}">${label}${required ? ' <span class="required">*</span>' : ''}</label>
        <select class="input-base" id="${name}" name="${name}" ${required ? "required" : ""}>
            <option value="">-- Selecciona --</option>
            ${opts}
        </select>
        ${withError ? `<p id="${name}-error" class="p-error-message" style="display:none;"></p>` : ""}
    </div>`;
}