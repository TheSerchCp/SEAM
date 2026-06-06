import { Modal } from './Modal.js';
import { Form }  from './ui/Form.js';
import { initSelectFields } from './ui/SelectField.js';
import { FormValidator } from '../utils/FormValidator.js';

/**
 * FormModal — Modal con formulario auto-generado y validación integrada.
 * @param {{ title, formId?, fields, schema, confirmText?, cancelText?, onConfirm }} props
 */
export async function FormModal({ 
    title, 
    formId = 'dynamic-form', 
    fields = [], 
    schema = {},
    confirmText = 'Guardar', 
    cancelText = 'Cancelar', 
    onConfirm 
}) {
    const confirmBtnId = `${formId}-confirm`;
    const body = Form({ id: formId, fields });

    const modalHtml = await Modal({
        title,
        body,
        confirmText,
        cancelText,
        confirmBtnId,
        onConfirm: async () => {
            const form = document.getElementById(formId);
            if (!form) {
                console.error(`Formulario no encontrado: ${formId}`);
                return { success: false, error: 'Formulario no encontrado' };
            }
            
            const data = Object.fromEntries(new FormData(form));
            return await onConfirm(data);
        }
    });

    // Initialize select fields y validador después de renderizar
    setTimeout(() => {
        initSelectFields();
        
        // Inicializar validador con el botón
        if (Object.keys(schema).length > 0) {
            const validator = new FormValidator(formId, schema, { buttonId: confirmBtnId });
            validator.attach();
        }
    }, 50);

    return modalHtml;
}
