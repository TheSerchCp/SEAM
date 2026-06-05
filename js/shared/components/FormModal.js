import { Modal } from './Modal.js';
import { Form }  from './ui/Form.js';

/**
 * FormModal — Modal con formulario auto-generado.
 * El botón confirmar obtiene el ID `${formId}-confirm` para integrarse con FormValidator.
 * @param {{ title, formId?, fields, confirmText?, cancelText?, onConfirm }} props
 */
export async function FormModal({ title, formId = "dynamic-form", fields = [], confirmText = "Guardar", cancelText = "Cancelar", onConfirm }) {
    const confirmBtnId = `${formId}-confirm`;
    const body = Form({ id: formId, fields });

    return Modal({
        title,
        body,
        confirmText,
        cancelText,
        confirmBtnId,
        onConfirm: async () => {
            const form = document.getElementById(formId);
            const data = Object.fromEntries(new FormData(form));
            return await onConfirm(data);
        }
    });
}
