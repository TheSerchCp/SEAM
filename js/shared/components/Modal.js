export async function Modal({
    title = 'Confirmar',
    body = '',
    onConfirm = null,
    onCancel = null,
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
    confirmBtnId = null,
    isDanger = false,
} = {}) {
    const confirmBtnColor = isDanger 
        ? 'bg-red-600 hover:bg-red-700 border-red-600' 
        : 'bg-blue-600 hover:bg-blue-700 border-blue-600';

    const modalHtml = `
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div class="relative w-full max-w-md overflow-hidden rounded-xl border border-gray-700/60 bg-gray-900/95 shadow-2xl shadow-black/50 animate-in fade-in zoom-in-95 duration-200">
                <!-- Header -->
                <div class="border-b border-gray-700/40 px-6 py-4">
                    <h2 class="text-lg font-bold text-white">${title}</h2>
                </div>

                <!-- Body -->
                <div class="px-6 py-6 text-gray-200">
                    ${body}
                </div>

                <!-- Footer -->
                <div class="flex gap-3 border-t border-gray-700/40 bg-gray-800/30 px-6 py-4">
                    <button 
                        id="btn-cancel"
                        class="flex-1 rounded-lg border border-gray-600 bg-gray-800 px-4 py-2.5 text-sm font-semibold text-gray-200 transition hover:bg-gray-700 hover:border-gray-500">
                        ${cancelText}
                    </button>
                    <button 
                        id="btn-confirm"
                        ${confirmBtnId ? `id="${confirmBtnId}"` : ''}
                        class="flex-1 rounded-lg border ${confirmBtnColor} px-4 py-2.5 text-sm font-semibold text-white transition">
                        ${confirmText}
                    </button>
                </div>
            </div>
        </div>
    `;

    // Inyectar HTML al DOM
    const tempContainer = document.createElement('div');
    tempContainer.innerHTML = modalHtml;
    const modal = tempContainer.firstElementChild;
    document.body.appendChild(modal);

    // Adjuntar event listeners
    const cancelBtn = modal.querySelector('#btn-cancel');
    const confirmBtn = modal.querySelector('#btn-confirm') || (confirmBtnId ? modal.querySelector(`#${confirmBtnId}`) : null);
    const backdrop = modal;

    // Cerrar al hacer click en cancelar
    if (cancelBtn) {
        cancelBtn.addEventListener('click', (e) => {
            e.preventDefault();
            modal.remove();
            if (typeof onCancel === 'function') onCancel();
        });
    }

    // Cerrar al hacer click en el backdrop
    backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) {
            modal.remove();
            if (typeof onCancel === 'function') onCancel();
        }
    });

    // Confirmar
    if (confirmBtn && typeof onConfirm === 'function') {
        confirmBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            confirmBtn.disabled = true;
            try {
                const result = await onConfirm();
                if (result?.success !== false) {
                    modal.remove();
                }
            } finally {
                confirmBtn.disabled = false;
            }
        });
    } else if (confirmBtn) {
        confirmBtn.addEventListener('click', () => {
            modal.remove();
        });
    }
}