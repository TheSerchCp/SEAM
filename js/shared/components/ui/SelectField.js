// ============================================
// SelectField Helper Functions
// ============================================

function createState(initialValue, isMultiple) {
    const values = new Set(initialValue ? initialValue.split(',').filter(Boolean) : []);
    return { values, isMultiple };
}

function findOption(options, value) {
    return options.find(o => String(o.value) === String(value));
}

function getSelectedLabels(state, options) {
    return Array.from(state.values)
        .map(val => findOption(options, val)?.label)
        .filter(Boolean);
}

function applyClasses(element, toAdd = [], toRemove = []) {
    if (!element) return;
    element.classList.add(...toAdd);
    element.classList.remove(...toRemove);
}

// ============================================
// Display Update Functions
// ============================================

function updateMultiDisplay(display, badgesContainer, state, options, placeholder) {
    const labels = getSelectedLabels(state, options);
    
    if (labels.length === 0) {
        display.textContent = placeholder;
        applyClasses(display, ['text-gray-400']);
    } else {
        display.textContent = `${labels.length} seleccionado${labels.length > 1 ? 's' : ''}`;
        applyClasses(display, [], ['text-gray-400']);
    }

    if (badgesContainer) {
        badgesContainer.innerHTML = labels.map(label => {
            const value = findOption(options, label)?.value;
            return `
                <span class="inline-flex items-center gap-2 rounded-full bg-blue-500/20 border border-blue-500/40 px-3 py-1.5 text-xs font-medium text-blue-300">
                    ${label}
                    <button type="button" class="hover:text-blue-200 transition remove-badge" data-value="${value}">
                        <i class="fa-solid fa-xmark text-xs"></i>
                    </button>
                </span>
            `;
        }).join('');

        attachBadgeListeners(badgesContainer, state);
    }
}

function updateSingleDisplay(display, state, options, placeholder) {
    const selected = findOption(options, Array.from(state.values)[0]);
    if (selected) {
        display.textContent = selected.label;
        applyClasses(display, [], ['text-gray-400']);
    } else {
        display.textContent = placeholder;
        applyClasses(display, ['text-gray-400']);
    }
}

function attachBadgeListeners(container, state) {
    container.querySelectorAll('.remove-badge').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            state.values.delete(btn.dataset.value);
        });
    });
}

// ============================================
// Checkbox Update Functions
// ============================================

function updateCheckboxes(dropdown, state) {
    dropdown.querySelectorAll('[data-value]').forEach(opt => {
        const isSelected = state.values.has(String(opt.dataset.value));
        
        if (state.isMultiple) {
            const checkbox = opt.querySelector('input[type="checkbox"]');
            const checkIcon = opt.querySelector('.fa-check');
            if (checkbox) checkbox.checked = isSelected;
            if (checkIcon) {
                applyClasses(checkIcon, isSelected ? [] : ['hidden'], isSelected ? ['hidden'] : []);
            }
            applyClasses(opt, isSelected ? ['bg-blue-500/10'] : [], isSelected ? [] : ['bg-blue-500/10']);
        } else {
            applyClasses(opt, 
                isSelected ? ['bg-blue-500/10', 'text-blue-300'] : [], 
                isSelected ? [] : ['bg-blue-500/10', 'text-blue-300']
            );
        }
    });
}

// ============================================
// Dropdown Position and Animation
// ============================================

function positionDropdown(trigger, dropdown) {
    const rect = trigger.getBoundingClientRect();
    dropdown.style.top = (rect.bottom + 8) + 'px';
    dropdown.style.left = rect.left + 'px';
    dropdown.style.width = rect.width + 'px';
}

function openDropdown(trigger, dropdown, icon) {
    positionDropdown(trigger, dropdown);
    dropdown.style.display = 'block';
    setTimeout(() => {
        applyClasses(dropdown, [], ['hidden']);
        dropdown.style.visibility = 'visible';
        dropdown.style.opacity = '1';
        dropdown.style.pointerEvents = 'auto';
    }, 0);
    icon.classList.add('rotate-180');
    return true;
}

function closeDropdown(dropdown, icon) {
    dropdown.style.visibility = 'hidden';
    dropdown.style.opacity = '0';
    dropdown.style.pointerEvents = 'none';
    setTimeout(() => {
        dropdown.style.display = 'none';
    }, 200);
    icon.classList.remove('rotate-180');
    return false;
}

// ============================================
// Event Handlers
// ============================================

function attachOptionListeners(dropdown, state, hiddenInput, callbacks) {
    dropdown.querySelectorAll('[data-value]').forEach(opt => {
        opt.addEventListener('click', (e) => {
            e.preventDefault();
            const value = String(opt.dataset.value);
            
            if (state.isMultiple) {
                state.values.has(value) ? state.values.delete(value) : state.values.add(value);
            } else {
                state.values.clear();
                state.values.add(value);
                callbacks.closeDropdown();
            }
            
            callbacks.updateDisplay();
            callbacks.updateCheckboxes();
            callbacks.updateHiddenInput();
        });
    });
}

function attachClickAwayListener(trigger, dropdown, callbacks) {
    document.addEventListener('click', (e) => {
        if (!trigger.contains(e.target) && !dropdown.contains(e.target)) {
            if (dropdown.style.visibility === 'visible') {
                callbacks.closeDropdown();
            }
        }
    });
}

// ============================================
// Main Initialization
// ============================================

function initializeSelectField(selectId, triggerId, dropdownId, options, isMultiple, placeholder, name) {
    const trigger = document.getElementById(triggerId);
    const dropdown = document.getElementById(dropdownId);
    const hiddenInput = document.getElementById(selectId);
    const display = document.getElementById(`display-${selectId}`);
    const icon = document.getElementById(`icon-${selectId}`);
    const badgesContainer = document.getElementById(`badges-${selectId}`);
    
    if (!trigger || !dropdown) return;

    const state = createState(hiddenInput?.value || '', isMultiple);
    let isOpen = false;

    const callbacks = {
        updateDisplay: () => {
            isMultiple 
                ? updateMultiDisplay(display, badgesContainer, state, options, placeholder)
                : updateSingleDisplay(display, state, options, placeholder);
        },
        updateCheckboxes: () => updateCheckboxes(dropdown, state),
        updateHiddenInput: () => {
            if (hiddenInput) {
                hiddenInput.value = Array.from(state.values).join(',');
                hiddenInput.dispatchEvent(new Event('input', { bubbles: true }));
                hiddenInput.dispatchEvent(new Event('change', { bubbles: true }));
            }
        },
        toggleDropdown: (e) => {
            if (e) e.preventDefault();
            isOpen = isOpen ? closeDropdown(dropdown, icon) : openDropdown(trigger, dropdown, icon);
        },
        closeDropdown: () => {
            isOpen = closeDropdown(dropdown, icon);
        },
    };

    trigger.addEventListener('click', callbacks.toggleDropdown);
    trigger.addEventListener('blur', () => hiddenInput?.dispatchEvent(new Event('focusout', { bubbles: true })));
    trigger.addEventListener('focus', () => hiddenInput?.dispatchEvent(new Event('focus', { bubbles: true })));

    window.addEventListener('scroll', () => isOpen && positionDropdown(trigger, dropdown), true);
    window.addEventListener('resize', () => isOpen && positionDropdown(trigger, dropdown));

    attachOptionListeners(dropdown, state, hiddenInput, callbacks);
    attachClickAwayListener(trigger, dropdown, callbacks);

    callbacks.updateCheckboxes();
    callbacks.updateDisplay();
}

// ============================================
// Error Management
// ============================================

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
        applyClasses(trigger,
            ['border-gray-600', 'focus:border-blue-500', 'focus:ring-blue-500/20'],
            ['border-red-500', 'focus:border-red-500', 'focus:ring-red-500/10']
        );
    }
}

function setSelectError(selectId, errorMessage) {
    const errorContainer = document.getElementById(`${selectId}-error`);
    const errorIcon = document.getElementById(`${selectId}-error-icon`);
    const trigger = document.getElementById(`trigger-${selectId}`);

    if (errorContainer) {
        errorContainer.innerHTML = `<i class="fa-solid fa-circle-exclamation mr-1"></i>${errorMessage}`;
        errorContainer.classList.remove('hidden');
    }
    if (errorIcon) errorIcon.classList.remove('hidden');
    if (trigger) {
        applyClasses(trigger,
            ['border-red-500', 'focus:border-red-500', 'focus:ring-red-500/10'],
            ['border-gray-600', 'focus:border-blue-500', 'focus:ring-blue-500/20']
        );
    }
}

// Expose functions to window
window.clearError = clearError;
window.setSelectError = setSelectError;

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
            
            <div class="relative w-full">
                <button
                    id="${triggerId}"
                    type="button"
                    ${disabled ? 'disabled' : ''}
                    class="${triggerClasses}">
                    <span id="display-${selectId}" class="text-gray-400">${placeholder}</span>
                    <i class="fa-solid fa-chevron-down text-xs text-gray-400 transition" id="icon-${selectId}"></i>
                </button>

                ${withError || hasError ? `
                    <span id="${name}-error-icon" class="pointer-events-none absolute inset-y-0 right-12 ${hasError ? 'flex' : 'hidden'} items-center text-red-400">
                        <i class="fa-solid fa-circle-xmark"></i>
                    </span>
                ` : ''}
            </div>

            <div 
                id="${dropdownId}"
                style="display: none; visibility: hidden; opacity: 0; pointer-events: none; position: fixed; z-index: 9999;"
                class="transition-all duration-200">
                <div class="w-full max-h-64 overflow-y-auto rounded-lg border border-gray-600 bg-gray-800 shadow-xl shadow-black/40">
                    ${options.map(opt => `
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

            <input 
                type="hidden" 
                id="${selectId}"
                name="${name}"
                value="${valueArray.join(',')}"
                data-select-trigger="${triggerId}"
                ${required ? 'required' : ''}>

            ${multiple ? `
                <div id="badges-${selectId}" class="flex flex-wrap gap-2"></div>
            ` : ''}

            ${withError || hasError ? `
                <p id="${name}-error" class="text-xs font-medium ${hasError ? 'text-red-400' : 'hidden text-red-400'}">
                    ${hasError ? `<i class="fa-solid fa-circle-exclamation mr-1"></i>${error}` : ''}
                </p>
            ` : ''}
        </div>
    `;
}

export function initSelectFields() {
    const selectElements = document.querySelectorAll('[data-select-init]:not([data-initialized])');
    selectElements.forEach(el => {
        el.dataset.initialized = 'true';
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
