const baseWrapperClasses = 'relative';
const inputBaseClasses = 'w-full rounded-xl border-2 border-gray-600 bg-gray-800/90 px-4 py-3 text-sm text-white placeholder:text-gray-500 transition focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:border-gray-700 disabled:bg-gray-900/70 disabled:text-gray-500';
const messageBaseClasses = 'text-xs font-medium';

/**
 * InputField — genera un campo de input con su label y contenedor de error.
 * @param {{ type, name, label?, placeholder?, value?, required?, disabled?, withError?, error?, success? }} props
 */
export function InputField({ type = 'text', name, label = '', placeholder = '', value = '', required = false, disabled = false, withError = false, error = '', success = false }) {
    const hasError = Boolean(error);
    const hasSuccess = Boolean(success) && !hasError;
    const paddedInputClasses = `${inputBaseClasses} ${(withError || hasError || hasSuccess) ? 'pr-11' : ''} ${hasError ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10' : hasSuccess ? 'border-emerald-500 focus:border-emerald-500 focus:ring-emerald-500/10' : ''}`;

    return `
        <div class="flex flex-col gap-2">
            ${label ? `
                <label for="${name}" class="text-sm font-medium text-gray-200">
                    ${label}
                    ${required ? '<span class="ml-1 text-red-500">*</span>' : ''}
                </label>` : ''}
            <div id="${name}-wrapper" class="${baseWrapperClasses}">
                <input
                    class="${paddedInputClasses}"
                    type="${type}"
                    id="${name}"
                    name="${name}"
                    placeholder="${placeholder}"
                    ${value !== undefined && value !== '' ? `value="${value}"` : ''}
                    ${required ? 'required' : ''}
                    ${disabled ? 'disabled' : ''}
                    ${hasError ? 'aria-invalid="true"' : ''}
                >
                ${(withError || hasError || hasSuccess) ? `
                    <span id="${name}-success-icon" class="pointer-events-none absolute inset-y-0 right-4 ${hasSuccess ? 'flex' : 'hidden'} items-center text-emerald-400">
                        <i class="fa-solid fa-circle-check"></i>
                    </span>
                    <span id="${name}-error-icon" class="pointer-events-none absolute inset-y-0 right-4 ${hasError ? 'flex' : 'hidden'} items-center text-red-400">
                        <i class="fa-solid fa-circle-xmark"></i>
                    </span>` : ''}
            </div>
            ${withError ? `
                <p id="${name}-error" class="${messageBaseClasses} ${hasError ? 'text-red-400' : 'hidden text-red-400'}">
                    ${hasError ? `<i class="fa-solid fa-circle-exclamation mr-1"></i>${error}` : ''}
                </p>` : hasError ? `
                <p class="${messageBaseClasses} text-red-400">
                    <i class="fa-solid fa-circle-exclamation mr-1"></i>${error}
                </p>` : ''}
        </div>`;
}
