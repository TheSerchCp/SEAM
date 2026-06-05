/**
 * InputField — genera un campo de input con su label y contenedor de error.
 * @param {{ type, name, label, placeholder?, value?, required?, disabled?, withError? }} props
 */
export function InputField({ type = "text", name, label, placeholder = "", value = "", required = false, disabled = false, withError = false }) {
    return `
    <div class="flex flex-col">
        <label for="${name}">${label}${required ? ' <span class="required">*</span>' : ''}</label>
        <input
            class="input-base"
            type="${type}"
            id="${name}"
            name="${name}"
            placeholder="${placeholder}"
            ${value !== undefined && value !== "" ? `value="${value}"` : ""}
            ${required  ? "required"  : ""}
            ${disabled  ? "disabled"  : ""}
        >
        ${withError ? `<p id="${name}-error" class="p-error-message" style="display:none;"></p>` : ""}
    </div>`;
}