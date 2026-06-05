import { InputField }    from './InputField.js';
import { SelectField }   from './SelectField.js';
import { TextareaField } from './TextareaField.js';

const renderers = {
    text:     (f) => InputField({ ...f, type: "text",     withError: true }),
    email:    (f) => InputField({ ...f, type: "email",    withError: true }),
    password: (f) => InputField({ ...f, type: "password", withError: true }),
    number:   (f) => InputField({ ...f, type: "number",   withError: true }),
    date:     (f) => InputField({ ...f, type: "date",     withError: true }),
    select:   (f) => SelectField({   ...f, withError: true }),
    textarea: (f) => TextareaField({ ...f, withError: true }),
};

/**
 * Form — genera un <form> completo a partir de un array de campos.
 * @param {{ id, fields, actions? }} props
 */
export function Form({ id, fields = [], actions = "" }) {
    const fieldsHtml = fields.map(f => renderers[f.type]?.(f) ?? "").join("");
    return `
    <form id="${id}">
        ${fieldsHtml}
        ${actions ? `<div class="flex flex-col">${actions}</div>` : ""}
    </form>`;
}
