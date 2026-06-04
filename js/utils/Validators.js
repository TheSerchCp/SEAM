export const validators = {
        validateEmail: (email) => {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            console.log("Validando email: ", email, " - Resultado: ", re.test(email));
            return re.test(email);
        },
        validatePassword: (password) => {
            // Al menos 8 caracteres, una letra mayúscula, una letra minúscula y un número
            const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
            return re.test(password);
        },
        validateText: (text) => {
            //Solo espacios y letras,letras acentuadas y ñ
            const re = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
            return re.test(text);
        }
}