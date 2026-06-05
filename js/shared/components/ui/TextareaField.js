/**
 * TextareaField — genera un <textarea> con su label y contenedor de error.
 */
export function TextareaField({ name, label, placeholder = "", value = "", rows = 4, required = false, withError = false }) {
    return `
    <div class="flex flex-col">
        <label for="${name}">${label}${required ? ' <span class="required">*</span>' : ''}</label>
        <textarea
            class="input-base"
            id="${name}"
            name="${name}"
            placeholder="${placeholder}"
            rows="${rows}"
            ${required ? "required" : ""}
        >${value}</textarea>
        ${withError ? `<p id="${name}-error" class="p-error-message" style="display:none;"></p>` : ""}
    </div>`;
}