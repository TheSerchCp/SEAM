import { loadCSS } from '../utils/loadCss.js';

/**
 * Modal reutilizable. Genera HTML, lo inyecta y adjunta eventos automáticamente.
 * @param {{ title, body, onConfirm?, onCancel?, confirmText?, cancelText?, confirmBtnId? }} props
 * @returns {Promise<string>} HTML string
 */
export async function Modal({ title, body, onConfirm, onCancel, confirmText = "Guardar", cancelText = "Cancelar", confirmBtnId = null }) {
    await loadCSS("css/components/modal.css");

    const modalId = `modal-${Date.now()}`;

    const modalHtml = `
    <div id="${modalId}" class="modal" style="display: block;">
        <div class="modal-content">
            <div class="modal-header">
                <h2>${title}</h2>
                <span class="close">&times;</span>
            </div>
            <div class="modal-body">${body}</div>
            <div class="modal-footer">
                <button class="btn-default">${cancelText}</button>
                <button class="btn-success" ${confirmBtnId ? `id="${confirmBtnId}"` : ''}>${confirmText}</button>
            </div>
        </div>
    </div>`;

    const attachEvents = () => {
        const modal = document.getElementById(modalId);
        if (!modal) { setTimeout(attachEvents, 10); return; }

        const closeBtn   = modal.querySelector(".close");
        const cancelBtn  = modal.querySelector(".btn-default");
        const confirmBtn = modal.querySelector(".btn-success");

        const closeModal = () => { modal.remove(); if (onCancel) onCancel(); };

        if (closeBtn)  closeBtn.onclick  = closeModal;
        if (cancelBtn) cancelBtn.onclick = closeModal;

        if (confirmBtn) {
            confirmBtn.onclick = async () => {
                if (onConfirm) {
                    const shouldClose = await onConfirm();
                    if (shouldClose !== false) closeModal();
                }
            };
        }

        window.onclick = (e) => { if (e.target === modal) closeModal(); };
    };

    setTimeout(attachEvents, 0);
    return modalHtml;
}
