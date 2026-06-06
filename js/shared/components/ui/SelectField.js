// ============================================
// SelectField Logic Functions
// ============================================

function initializeSelectField(selectId, triggerId, dropdownId, options, isMultiple, placeholder, name) {
    const trigger = document.getElementById(triggerId);
    const dropdown = document.getElementById(dropdownId);
    const hiddenInput = document.getElementById(selectId);
    const display = document.getElementById(`display-${selectId}`);
    const icon = document.getElementById(`icon-${selectId}`);
    const badgesContainer = document.getElementById(`badges-${selectId}`);
    
    if (!trigger || !dropdown) return;

    let isOpen = false;
    const initialValue = hiddenInput?.value || '';
    let selectedValues = new Set(initialValue ? initialValue.split(',').filter(Boolean) : []);

    function updateDisplay() {
        if (isMultiple) {
            const selectedLabels = Array.from(selectedValues)
                .map(val => options.find(o => String(o.value) === String(val))?.label)
                .filter(Boolean);
            
            if (selectedLabels.length === 0) {
                display.textContent = placeholder;
                display.classList.add('text-gray-400');
            } else {
                display.textContent = `${selectedLabels.length} seleccionado${selectedLabels.length > 1 ? 's' : ''}`;
                display.classList.remove('text-gray-400');
            }

            // Update badges
            if (badgesContainer) {
                badgesContainer.innerHTML = selectedLabels.map(label => {
                    const value = options.find(o => o.label === label)?.value;
                    return `
                        <span class="inline-flex items-center gap-2 rounded-full bg-blue-500/20 border border-blue-500/40 px-3 py-1.5 text-xs font-medium text-blue-300">
                            ${label}
                            <button type="button" class="hover:text-blue-200 transition remove-badge" data-value="${value}">
                                <i class="fa-solid fa-xmark text-xs"></i>
                            </button>
                        </span>
                    `;
                }).join('');

                badgesContainer.querySelectorAll('.remove-badge').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        e.preventDefault();
                        selectedValues.delete(btn.dataset.value);
                        updateCheckboxes();
                        updateDisplay();
                        if (hiddenInput) {
                            hiddenInput.value = Array.from(selectedValues).join(',');
                            hiddenInput.dispatchEvent(new Event('input', { bubbles: true }));
                        }
                    });
                });
            }
        } else {
            const selected = options.find(o => String(o.value) === Array.from(selectedValues)[0]);
            if (selected) {
                display.textContent = selected.label;
                display.classList.remove('text-gray-400');
            } else {
                display.textContent = placeholder;
                display.classList.add('text-gray-400');
            }
        }
    }

    function updateCheckboxes() {
        const optionButtons = dropdown.querySelectorAll('[data-value]');
        optionButtons.forEach(opt => {
            const isSelected = selectedValues.has(String(opt.dataset.value));
            if (isMultiple) {
                const checkbox = opt.querySelector('input[type="checkbox"]');
                const checkIcon = opt.querySelector('.fa-check');
                if (checkbox) checkbox.checked = isSelected;
                if (checkIcon) {
                    if (isSelected) {
                        checkIcon.classList.remove('hidden');
                        opt.classList.add('bg-blue-500/10');
                    } else {
                        checkIcon.classList.add('hidden');
                        opt.classList.remove('bg-blue-500/10');
                    }
                }
            } else {
                if (isSelected) {
                    opt.classList.add('bg-blue-500/10', 'text-blue-300');
                } else {
                    opt.classList.remove('bg-blue-500/10', 'text-blue-300');
                }
            }
        });
    }

    function positionDropdown() {
        const rect = trigger.getBoundingClientRect();
        dropdown.style.top = (rect.bottom + 8) + 'px';
        dropdown.style.left = rect.left + 'px';
        dropdown.style.width = rect.width + 'px';
    }

    function openDropdown() {
        positionDropdown();
        isOpen = true;
        dropdown.style.display = 'block';
        setTimeout(() => {
            dropdown.style.visibility = 'visible';
            dropdown.style.opacity = '1';
            dropdown.style.pointerEvents = 'auto';
        }, 0);
        icon.classList.add('rotate-180');
    }

    function closeDropdown() {
        isOpen = false;
        dropdown.style.visibility = 'hidden';
        dropdown.style.opacity = '0';
        dropdown.style.pointerEvents = 'none';
        setTimeout(() => {
            dropdown.style.display = 'none';
        }, 200);
        icon.classList.remove('rotate-180');
    }

    function toggleDropdown(e) {
        if (e) e.preventDefault();
        isOpen ? closeDropdown() : openDropdown();
    }

    trigger.addEventListener('click', toggleDropdown);
    
    // Add focus/blur for validation
    trigger.addEventListener('blur', () => {
        if (hiddenInput) {
            hiddenInput.dispatchEvent(new Event('focusout', { bubbles: true }));
        }
    });

    trigger.addEventListener('focus', () => {
        if (hiddenInput) {
            hiddenInput.dispatchEvent(new Event('focus', { bubbles: true }));
        }
    });

    window.addEventListener('scroll', () => {
        if (isOpen) positionDropdown();
    }, true);
    window.addEventListener('resize', () => {
        if (isOpen) positionDropdown();
    });

    const optionButtons = dropdown.querySelectorAll('[data-value]');
    optionButtons.forEach(opt => {
        opt.addEventListener('click', (e) => {
            e.preventDefault();
            const value = String(opt.dataset.value);
            
            if (isMultiple) {
                selectedValues.has(value) ? selectedValues.delete(value) : selectedValues.add(value);
            } else {
                selectedValues.clear();
                selectedValues.add(value);
                closeDropdown();
            }
            
            updateCheckboxes();
            updateDisplay();
            if (hiddenInput) {
                hiddenInput.value = Array.from(selectedValues).join(',');
                // Dispatch both input and change for validators
                hiddenInput.dispatchEvent(new Event('input', { bubbles: true }));
                hiddenInput.dispatchEvent(new Event('change', { bubbles: true }));
            }
        });
    });

    document.addEventListener('click', (e) => {
        if (!trigger.contains(e.target) && !dropdown.contains(e.target)) {
            if (isOpen) closeDropdown();
        }
    });

    updateCheckboxes();
    updateDisplay();
}

function clearError(selectId) {
    const errorContainer = document.getElementById(`${selectId}-error`);
    const errorIcon = document.getElementById(`${selectId}-error-icon`);
    const trigger = document.getElementById(`trigger-${selectId}`);

    if (errorContainer) {
        errorContainer.innerHTML = '';
        errorContainer.classList.add('hidden');
    }
    if (errorIcon) errorIcon.classList.add('hidden');
    if (trigger) {
        trigger.classList.remove('border-red-500', 'focus:border-red-500', 'focus:ring-red-500/10');
        trigger.classList.add('border-gray-600', 'focus:border-blue-500', 'focus:ring-blue-500/20');
    }
}

window.initSelectFields = function() {
    const selectElements = document.querySelectorAll('[data-select-init]');
    selectElements.forEach(el => {
        const selectId = el.dataset.selectId;
        const triggerId = el.dataset.triggerId;
        const dropdownId = el.dataset.dropdownId;
        const optionsJson = el.dataset.options;
        const isMultiple = el.dataset.multiple === 'true';
        const placeholder = el.dataset.placeholder || 'Selecciona una opción';
        const name = el.dataset.name || '';
        
        try {
            const options = JSON.parse(optionsJson);
            initializeSelectField(selectId, triggerId, dropdownId, options, isMultiple, placeholder, name);
        } catch (e) {
            console.error('Error initializing select field:', e);
        }
    });
};

window.setSelectError = function(selectId, errorMessage) {
    const errorContainer = document.getElementById(`${selectId}-error`);
    const errorIcon = document.getElementById(`${selectId}-error-icon`);
    const trigger = document.getElementById(`trigger-${selectId}`);

    if (errorContainer) {
        errorContainer.innerHTML = `<i class="fa-solid fa-circle-exclamation mr-1"></i>${errorMessage}`;
        errorContainer.classList.remove('hidden');
    }
    if (errorIcon) errorIcon.classList.remove('hidden');
    if (trigger) {
        trigger.classList.remove('border-gray-600', 'focus:border-blue-500', 'focus:ring-blue-500/20');
        trigger.classList.add('border-red-500', 'focus:border-red-500', 'focus:ring-red-500/10');
    }
};

// ============================================
// SelectField Component
// ============================================

export function SelectField({
    name = '',
    label = '',
    value = '',
    options = [],
    required = false,
    disabled = false,
    placeholder = 'Selecciona una opción',
    multiple = false,
    className = '',
    withError = false,
    error = '',
} = {}) {
    const selectId = `select-${name}-${Date.now()}`;
    const triggerId = `trigger-${selectId}`;
    const dropdownId = `dropdown-${selectId}`;
    
    const hasError = Boolean(error);
    const valueArray = Array.isArray(value) ? value.map(String) : (value ? [String(value)] : []);
    const optionsJson = JSON.stringify(options);

    const triggerClasses = `w-full flex items-center justify-between rounded-lg border-2 transition hover:border-gray-500 hover:bg-gray-750 focus:outline-none focus:ring-4 disabled:opacity-50 disabled:cursor-not-allowed text-left px-4 py-2.5 text-sm text-gray-200 ${
        hasError 
            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10' 
            : 'border-gray-600 focus:border-blue-500 focus:ring-blue-500/20'
    } bg-gray-800`;

    return `
        <div class="flex flex-col gap-2 ${className}" data-select-init="true" data-select-id="${selectId}" data-trigger-id="${triggerId}" data-dropdown-id="${dropdownId}" data-options='${optionsJson}' data-multiple="${multiple}" data-placeholder="${placeholder}" data-name="${name}">
            ${label ? `
                <label for="${triggerId}" class="text-sm font-semibold text-gray-200 flex items-center gap-1">
                    ${label}
                    ${required ? '<span class="text-red-400">*</span>' : ''}
                </label>
            ` : ''}
            
            <!-- Custom Select Trigger -->
            <div class="relative w-full">
                <button
                    id="${triggerId}"
                    type="button"
                    ${disabled ? 'disabled' : ''}
                    class="${triggerClasses}">
                    <span id="display-${selectId}" class="text-gray-400">${placeholder}</span>
                    <i class="fa-solid fa-chevron-down text-xs text-gray-400 transition" id="icon-${selectId}"></i>
                </button>

                <!-- Error/Success Icons -->
                ${withError || hasError ? `
                    <span id="${selectId}-error-icon" class="pointer-events-none absolute inset-y-0 right-12 ${hasError ? 'flex' : 'hidden'} items-center text-red-400">
                        <i class="fa-solid fa-circle-xmark"></i>
                    </span>
                ` : ''}
            </div>

            <!-- Custom Dropdown Menu (Fixed Position) -->
            <div 
                id="${dropdownId}"
                style="display: none; visibility: hidden; opacity: 0; pointer-events: none; position: fixed; z-index: 9999;"
                class="transition-all duration-200">
                <div class="w-full max-h-64 overflow-y-auto rounded-lg border border-gray-600 bg-gray-800 shadow-xl shadow-black/40">
                    ${options.map((opt, idx) => `
                        <button
                            type="button"
                            data-value="${opt.value}"
                            data-label="${opt.label}"
                            class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-200 hover:bg-blue-500/20 border-b border-gray-700/40 last:border-b-0 transition select-option">
                            ${multiple ? `
                                <div class="w-4 h-4 rounded border border-gray-600 bg-gray-700 flex items-center justify-center transition">
                                    <i class="fa-solid fa-check text-xs text-blue-400 hidden"></i>
                                </div>
                            ` : ''}
                            <span class="flex-1 text-left">${opt.label}</span>
                        </button>
                    `).join('')}
                </div>
            </div>

            <!-- Hidden Input for Form Submission (Este es el que valida FormValidator) -->
            <input 
                type="hidden" 
                id="${selectId}"
                name="${name}"
                value="${valueArray.join(',')}"
                ${required ? 'required' : ''}>

            <!-- Selected Badges (for multi-select) -->
            ${multiple ? `
                <div id="badges-${selectId}" class="flex flex-wrap gap-2">
                    <!-- Badges will be inserted here -->
                </div>
            ` : ''}

            <!-- Error Message -->
            ${withError ? `
                <p id="${selectId}-error" class="text-xs font-medium ${hasError ? 'text-red-400' : 'hidden text-red-400'}">
                    ${hasError ? `<i class="fa-solid fa-circle-exclamation mr-1"></i>${error}` : ''}
                </p>
            ` : hasError ? `
                <p class="text-xs font-medium text-red-400">
                    <i class="fa-solid fa-circle-exclamation mr-1"></i>${error}
                </p>
            ` : ''}
        </div>
    `;
}

export function initSelectFields() {
    const selectElements = document.querySelectorAll('[data-select-init]');
    selectElements.forEach(el => {
        const selectId = el.dataset.selectId;
        const triggerId = el.dataset.triggerId;
        const dropdownId = el.dataset.dropdownId;
        const optionsJson = el.dataset.options;
        const isMultiple = el.dataset.multiple === 'true';
        const placeholder = el.dataset.placeholder || 'Selecciona una opción';
        const name = el.dataset.name || '';
        
        try {
            const options = JSON.parse(optionsJson);
            initializeSelectField(selectId, triggerId, dropdownId, options, isMultiple, placeholder, name);
        } catch (e) {
            console.error('Error initializing select field:', e);
        }
    });
}
