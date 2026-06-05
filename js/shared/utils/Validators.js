/**
 * Colección de funciones de validación reutilizables.
 * Cada función recibe el valor a validar y retorna true (válido) o false (inválido).
 */
export const validators = {

    /** Verifica formato de email */
    validateEmail(value) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    },

    /** Mínimo 8 caracteres, al menos una mayúscula, una minúscula y un número */
    validatePassword(value) {
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(value);
    },

    /** Solo letras, espacios, acentos y ñ */
    validateText(value) {
        return /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/.test(value);
    },
};
