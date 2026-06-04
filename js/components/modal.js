import { loadCSS } from "../utils/loadCss.js";

export async function Modal({
    title, body, onConfirm, onCancel, confirmText = "Guardar", cancelText = "Cancelar"
}){

    await loadCSS("css/components/modal.css");
    
    const modalId = `modal-${Date.now()}`;

    const modalHtml = `
    <div id="${modalId}" class="modal" style="display: block;">
        <div class="modal-content">
            <div class="modal-header">
                <h2>${title}</h2>
                <span class="close">&times;</span>
            </div>
            <div class="modal-body">
                ${body}
            </div>
            <div class="modal-footer">
                <button class="btn-default">${cancelText}</button>
                <button class="btn-success">${confirmText}</button>
            </div>
        </div>
    </div>`;

    // Usamos un intervalo corto para asegurar que el modal esté en el DOM antes de asignar eventos
    const attachEvents = () => {
        const modal = document.getElementById(modalId);
        if(!modal) {
            setTimeout(attachEvents, 10);
            return;
        }

        const closeBtn = modal.querySelector(".close");
        const cancelBtn = modal.querySelector(".btn-default");
        const confirmBtn = modal.querySelector(".btn-success");

        const closeModal = () => {
            modal.remove();
            if(onCancel) onCancel();
        };

        if(closeBtn) closeBtn.onclick = closeModal;
        if(cancelBtn) cancelBtn.onclick = closeModal;
        
        if(confirmBtn) {
            confirmBtn.onclick = () => {
                // No cerramos el modal aquí si queremos validar antes de que onConfirm decida
                if(onConfirm) onConfirm();
                // Si onConfirm no lanza errores o cancela, removemos
               //closeModal()
            };
        }

        window.onclick = (e) => {
            if(e.target === modal){
                closeModal();
            }
        }
    };

    setTimeout(attachEvents, 0);

    return modalHtml;
}
