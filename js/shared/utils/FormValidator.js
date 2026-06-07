import { validators } from './Validators.js';

const RULES = {
    required:  (val)            => val.trim() !== ''                       || 'Este campo es requerido',
    minLength: (val, n)         => val.trim().length >= n                  || `Mínimo ${n} caracteres`,
    maxLength: (val, n)         => val.trim().length <= n                  || `Máximo ${n} caracteres`,
    email:     (val)            => validators.validateEmail(val.trim())    || 'Email inválido',
    password:  (val)            => validators.validatePassword(val.trim()) || 'Mínimo 8 caracteres, una mayúscula, una minúscula y un número',
    text:      (val)            => validators.validateText(val.trim())     || 'Solo se permiten letras',
    match:     (val, field, fd) => val === fd.get(field)                   || 'Los campos no coinciden',
    route: (val)            => validators.validateRoute(val.trim())     || 'Formato de ruta inválido',
    custom:    (val, fn, fd)    => fn(val, fd),
};

const baseFieldClasses = ['border-red-500', 'border-emerald-500', 'focus:border-red-500', 'focus:border-emerald-500', 'focus:ring-red-500/10', 'focus:ring-emerald-500/10'];

/**
 * Clase para validar formularios HTML de forma centralizada.
 * @param {string} formId  - id del <form>
 * @param {object} schema  - { fieldName: { ruleName: param } }
 * @param {object} options - { validateOnInput, validateOnBlur, errorIdSuffix, buttonId }
 */
export class FormValidator {
    constructor(formId, schema, options = {}) {
        this.formId = formId;
        this.schema = schema;
        this.errorClass = options.errorClass ?? 'hidden text-xs font-medium text-red-400';
        this.errorSuffix = options.errorIdSuffix ?? '-error';
        this.onInput = options.validateOnInput !== false;
        this.onBlur = options.validateOnBlur !== false;
        this._buttonId = options.buttonId ?? null;
        this._attached = false;
    }

    get form() { return document.getElementById(this.formId); }

    attach() {
        const form = this.form;
        if (!form || this._attached) return;

        const btn = this._buttonId ? document.getElementById(this._buttonId) : null;
        const syncButton = () => { if (btn) btn.disabled = !this._silentValidate(); };

        if (btn) btn.disabled = !this._silentValidate();

        if (this.onInput) {
            form.addEventListener('input', (e) => {
                if (e.target.name && this.schema[e.target.name]) this._validateField(e.target.name);
                syncButton();
            });
        }
        if (this.onBlur) {
            form.addEventListener('focusout', (e) => {
                if (e.target.name && this.schema[e.target.name]) this._validateField(e.target.name);
                syncButton();
            });
        }
        this._attached = true;
    }

    validate() {
        let allValid = true;
        for (const fieldName of Object.keys(this.schema))
            if (!this._validateField(fieldName)) allValid = false;
        return allValid;
    }

    clearErrors() {
        for (const fieldName of Object.keys(this.schema)) this._setError(fieldName, '');
    }

    _silentValidate() {
        const form = this.form;
        if (!form) return false;
        for (const fieldName of Object.keys(this.schema)) {
            const value = form.elements[fieldName]?.value ?? '';
            const formData = new FormData(form);
            const rules = this.schema[fieldName];

            if (value.trim() === '' && !rules.required) continue;

            for (const [ruleName, param] of Object.entries(rules)) {
                const ruleFn = RULES[ruleName];
                if (!ruleFn) continue;
                const result = (ruleName === 'match' || ruleName === 'custom')
                    ? ruleFn(value, param, formData) : ruleFn(value, param);
                if (result !== true) return false;
            }
        }
        return true;
    }

    _validateField(fieldName) {
        const form = this.form;
        if (!form) return true;
        const value = form.elements[fieldName]?.value ?? '';
        const formData = new FormData(form);
        const rules = this.schema[fieldName];

        if (value.trim() === '' && !rules.required) {
            this._setError(fieldName, '');
            return true;
        }

        for (const [ruleName, param] of Object.entries(rules)) {
            const ruleFn = RULES[ruleName];
            if (!ruleFn) continue;
            const result = (ruleName === 'match' || ruleName === 'custom')
                ? ruleFn(value, param, formData) : ruleFn(value, param);
            if (result !== true) {
                this._setError(fieldName, result);
                return false;
            }
        }

        this._setError(fieldName, '');
        this._setFieldState(fieldName, 'success');
        return true;
    }

    _setError(fieldName, message) {
        const el = document.getElementById(`${fieldName}${this.errorSuffix}`);
        if (el) {
            el.innerHTML = message ? `<i class="fa-solid fa-circle-exclamation mr-1"></i>${message}` : '';
            el.classList.toggle('hidden', !message);
        }

        this._setFieldState(fieldName, message ? 'error' : 'neutral');
    }

    _setFieldState(fieldName, state) {
        const field = this.form?.elements[fieldName];
        if (!field) return;

        // Para SelectField custom: el input es hidden; aplicar bordes al trigger button
        const triggerId = field.dataset?.selectTrigger;
        const targetEl = triggerId ? document.getElementById(triggerId) : null;

        if (targetEl) {
            const selectClear = [
                'border-red-500', 'border-emerald-500', 'border-gray-600',
                'focus:border-red-500', 'focus:border-emerald-500', 'focus:border-blue-500',
                'focus:ring-red-500/10', 'focus:ring-emerald-500/10', 'focus:ring-blue-500/20',
            ];
            targetEl.classList.remove(...selectClear);

            if (state === 'error') {
                targetEl.classList.add('border-red-500', 'focus:border-red-500', 'focus:ring-red-500/10');
                field.setAttribute('aria-invalid', 'true');
            } else if (state === 'success' && String(field.value ?? '').trim()) {
                targetEl.classList.add('border-emerald-500', 'focus:border-emerald-500', 'focus:ring-emerald-500/10');
                field.removeAttribute('aria-invalid');
            } else {
                targetEl.classList.add('border-gray-600', 'focus:border-blue-500', 'focus:ring-blue-500/20');
                field.removeAttribute('aria-invalid');
            }
        } else {
            field.classList.remove(...baseFieldClasses);

            if (state === 'error') {
                field.classList.add('border-red-500', 'focus:border-red-500', 'focus:ring-red-500/10');
                field.setAttribute('aria-invalid', 'true');
            } else if (state === 'success' && String(field.value ?? '').trim()) {
                field.classList.add('border-emerald-500', 'focus:border-emerald-500', 'focus:ring-emerald-500/10');
                field.removeAttribute('aria-invalid');
            } else {
                field.removeAttribute('aria-invalid');
            }
        }

        const errorIcon = document.getElementById(`${fieldName}-error-icon`);
        const successIcon = document.getElementById(`${fieldName}-success-icon`);

        if (errorIcon) errorIcon.classList.toggle('hidden', state !== 'error');
        if (successIcon) successIcon.classList.toggle('hidden', state !== 'success' || !String(field.value ?? '').trim());
    }
}
