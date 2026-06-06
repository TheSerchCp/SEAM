const textareaBaseClasses = 'w-full rounded-xl border-2 border-gray-600 bg-gray-800/90 px-4 py-3 text-sm text-white placeholder:text-gray-500 transition focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:border-gray-700 disabled:bg-gray-900/70 disabled:text-gray-500';
const messageBaseClasses = 'text-xs font-medium';

/**
 * TextareaField — genera un <textarea> con su label y contenedor de error.
 */
export function TextareaField({ name, label = '', placeholder = '', value = '', rows = 4, required = false, withError = false, error = '', disabled = false, maxLength = '', showCounter = false }) {
    const hasError = Boolean(error);
    const textareaClasses = `${textareaBaseClasses} ${hasError ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10' : ''}`;
    const shouldShowCounter = showCounter || Boolean(maxLength);
    const initialCount = String(value ?? '').length;

    return `
        <div class="flex flex-col gap-2">
            ${label ? `
                <label for="${name}" class="text-sm font-medium text-gray-200">
                    ${label}
                    ${required ? '<span class="ml-1 text-red-500">*</span>' : ''}
                </label>` : ''}
            <div id="${name}-wrapper" class="relative">
                <textarea
                    class="${textareaClasses} min-h-[120px] resize-y"
                    id="${name}"
                    name="${name}"
                    placeholder="${placeholder}"
                    rows="${rows}"
                    ${required ? 'required' : ''}
                    ${disabled ? 'disabled' : ''}
                    ${maxLength ? `maxlength="${maxLength}"` : ''}
                    ${hasError ? 'aria-invalid="true"' : ''}
                >${value}</textarea>
                ${withError ? `
                    <span id="${name}-error-icon" class="pointer-events-none absolute right-4 top-4 ${hasError ? 'flex' : 'hidden'} items-center text-red-400">
                        <i class="fa-solid fa-circle-xmark"></i>
                    </span>` : ''}
            </div>
            ${(withError || shouldShowCounter) ? `
                <div class="flex items-center justify-between gap-3">
                    ${withError ? `
                        <p id="${name}-error" class="${messageBaseClasses} ${hasError ? 'text-red-400' : 'hidden text-red-400'}">
                            ${hasError ? `<i class="fa-solid fa-circle-exclamation mr-1"></i>${error}` : ''}
                        </p>` : '<span></span>'}
                    ${shouldShowCounter ? `
                        <span id="${name}-char-count" data-char-count-for="${name}" class="ml-auto text-xs text-gray-400">
                            ${initialCount}${maxLength ? `/${maxLength}` : ' caracteres'}
                        </span>` : ''}
                </div>` : hasError ? `
                <p class="${messageBaseClasses} text-red-400">
                    <i class="fa-solid fa-circle-exclamation mr-1"></i>${error}
                </p>` : ''}
        </div>`;
}

if (typeof window !== 'undefined' && typeof document !== 'undefined' && !window.__seamTextareaCounterBound) {
    window.__seamTextareaCounterBound = true;
    document.addEventListener('input', (event) => {
        const field = event.target;
        if (!(field instanceof HTMLTextAreaElement) || !field.id) return;
        const counter = document.querySelector(`[data-char-count-for="${field.id}"]`);
        if (!counter) return;
        const limit = field.getAttribute('maxlength');
        counter.textContent = limit ? `${field.value.length}/${limit}` : `${field.value.length} caracteres`;
    });
}
