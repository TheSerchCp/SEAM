import { loadCSS } from "../../utils/loadCss.js";
import { state } from "../../services/general/state.js";
import { PublicLayout } from "../../layout/public.layout.js";
import { Loader } from "../../components/loader.js";
import { validators } from "../../utils/Validators.js";
import { loginRepository } from "../../repositories/login/LoginRepository.js";

export async function LoginPage() {
   await loadCSS("css/pages/public/login/login.css");
   //<button type="button" class="btn-link" id="btn-register">¿No tienes una cuenta? Registrate</button>
   const loginTemplate = `
        <div class="login-container" id="login-container">
            <div class="card" id="login-card">
                <div class="card-header">
                    <h2>Login</h2>
                </div>
                <div class="card-body">
                    <form id="login-form">

                    <div class="flex flex-col">
                        <label for="email">Correo</label>

                        <input type="text" 
                        id="email" 
                        name="email"
                        class="input-base">
                        <p class="p-error-message" id="email-error"></p>
                    </div>

                    <div class="flex flex-col">
                        <label for="password">Contraseña</label>

                        <input type="password" 
                        id="password" 
                        name="password"
                        class="input-base">
                        <p class="p-error-message" id="password-error"></p>
                    </div>

                    <div class="flex flex-col justify-center justify-items-center">
                        <button type="button" class="btn-info" id="btn-login">Ingresar</button>
                        
                    </div>
                    </form>
                </div>
            </div>
            <div class="card" id="register-card">
                <div class="card-header">
                    <h2>Registro</h2>
                </div>
                <div class="card-body">
                    <form id="register-form">

                    <div class="flex flex-col">
                        <label for="email">Correo</label>

                        <input type="text" 
                        id="email" 
                        name="email"
                        class="input-base">
                        <p class="p-error-message" id="email-error"></p>
                    </div>

                    <div class="flex flex-col">
                        <label for="password">Contraseña</label>

                        <input type="password" 
                        id="password" 
                        name="password"
                        class="input-base">
                        <p class="p-error-message" id="password-error"></p>
                    </div>
                        <div class="flex flex-col">
                        <label for="password">Confirmar Contraseña</label>

                        <input type="password" 
                        id="confirmPassword" 
                        name="confirmPassword"
                        class="input-base">
                        <p class="p-error-message" id="confirmPassword-error"></p>
                    </div>

                    <div class="flex flex-col justify-center justify-items-center">
                        <button type="button" class="btn-info" id="btn-register">Registrarse</button>
                        <button type="button" class="btn-link" id="btn-back">¿Ya tienes una cuenta? Inicia sesión</button>
                    </div>
                    </form>
                </div>
            </div>
            <div id="loader-container"></div>
        </div>
    `;

    const events = () => {
            const container = document.getElementById("login-container");
            const btnRegister = document.getElementById("btn-register");
            const btnLogin = document.getElementById("btn-login");
            const formLogin = document.getElementById("login-form");

            const formRegister = document.getElementById("register-form");
            const registerCard = document.getElementById("register-card");
            const loginCard = document.getElementById("login-card");
            const btnBack = document.getElementById("btn-back");
            
            if(!btnLogin || !btnRegister){
                setTimeout(() => {
                    events();
                }, 0);
            }
             
            //Por defecto ocultar el card de registro
            registerCard.remove();

            btnRegister.addEventListener("click", (e) => {
                e.preventDefault();
                //LImpiar formulario al ir a registro
                formLogin.reset();
                //Ocultar card de login y mostrar el de registro
                loginCard.remove();
                container.appendChild(registerCard);
            });

            btnLogin.addEventListener("click", async (e) => {
                const loader = await Loader({text: "Validando credenciales..."});
                

                e.preventDefault();

                const formData = new FormData(formLogin);
                const formJson = Object.fromEntries(formData);
                console.log("Datos de form login en json: ", formJson)

                //Validar formulario login
                if(!validateLogin(formJson, btnLogin, btnBack)){
                    const loader = await Loader({});
                    loader.hide();
                    return;
                }else{
                loader.show();
                
                setTimeout(() => {
                    //Realizar consulta para verificar credenciales
                    loginRepository.login(formJson.email.trim(), formJson.password.trim()).then(user => {
                        if(user){
                            console.log("Usuario encontrado: ", user);
                            state.user = user;
                            localStorage.setItem('currentUser', JSON.stringify(user));
                            loader.hide();
                            location.hash = "/home";
                        }else{
                            console.warn("Credenciales inválidas");
                            loader.hide();
                        }
                    })
                }, 1000);
                }
            })

            btnBack.addEventListener("click", (e) => {
                e.preventDefault();
                //Limpiar formulario al ir a login
                formRegister.reset();
                //Ocultar card de registro y mostrar el de login
                container.appendChild(loginCard);
                registerCard.remove();
            })

            //Eventos listenes en forms, para validar en tiempo real sus inputs
            formLogin.addEventListener("input", (e) => {
                const formData = new FormData(formLogin);
                const formJson = Object.fromEntries(formData);
               if(e.target.matches("input")){
                validateLogin(formJson, btnLogin, btnBack);
               }
            });

            formRegister.addEventListener("input", (e) => {
                const formData = new FormData(formRegister);
                const formJson = Object.fromEntries(formData);
                if(e.target.matches("input")){
                    validateRegister(formJson, btnRegister, btnBack);
                }
            });
    }

    setTimeout(() => {
        events();
    },0)
    return PublicLayout(loginTemplate);
}   


function validateLogin(data,btnPrimary,btnSecondary){
    let formLoginValid = false;
    const validEmail = validateEmail(data.email, document.getElementById("email-error"));
    const validPassword = validatePassword(data.password, document.getElementById("password-error"));
    if(validEmail && validPassword){
        formLoginValid = true;
                    btnPrimary.disabled = false;
                    btnSecondary.disabled = false;
        }else{
            formLoginValid = false;
            btnPrimary.disabled = true;
            btnSecondary.disabled = true;
        }
        return formLoginValid;
}

function validateRegister(data, btnPrimary, btnSecondary){
    let formRegisterValid = false;
    const validEmail = validateEmail(data.email, document.getElementById("email-error"));
    const validPassword = validatePassword(data.password, document.getElementById("password-error"));
    const validConfirmPassword = validateConfirmPassword(data.password, data.confirmPassword, document.getElementById("confirmPassword-error"));

    if(validEmail && validPassword && validConfirmPassword){
        formRegisterValid = true;
        btnPrimary.disabled = false;
        btnSecondary.disabled = false;

        //Agregar el usuario al state
    }else{
        formRegisterValid = false;
        btnPrimary.disabled = true;
        btnSecondary.disabled = true;
    }

    return formRegisterValid;
}

const validateEmail = (email,p) => {
    let emailValid = false;
    if(email.trim() === ""){
        p.textContent = "El campo email es requerido";
        p.style.display = "block";
        emailValid = false;
    }else if(!validators.validateEmail(email.trim())){
        p.textContent = "El campo email es invalido";
        p.style.display = "block";
        emailValid = false;
    }else{
        p.textContent = "";
        p.style.display = "none";
        emailValid = true;
    }
    return emailValid;
};

const validatePassword = (password,p) => {
    let passwordValid = false;
    if(password.trim() === ""){
        p.textContent = "El campo contraseña es requerido";
        p.style.display = "block";
        passwordValid = false;
    }else if(!validators.validatePassword(password.trim())){
        p.textContent = "El campo contraseña debe tener al menos 6 caracteres, una mayúscula, una minúscula y un número";
        p.style.display = "block";
        passwordValid = false;
        return false;
    }else{
        p.textContent = "";
        p.style.display = "none";
        passwordValid = true;
    }
    return passwordValid;
};

const validateConfirmPassword = (password,confirmPassword,p) => {
    let confirmPasswordValid = false;
    if(confirmPassword.trim() === ""){
        p.textContent = "El campo confirmar contraseña es requerido";
        p.style.display = "block";
        confirmPasswordValid = false;
    }else if(!validators.validatePassword(confirmPassword.trim())){
        p.textContent = "El campo confirmar contraseña debe tener al menos 6 caracteres, una mayúscula, una minúscula y un número";
        p.style.display = "block";
        confirmPasswordValid = false;
        return false;
    }else if(password.trim() !== confirmPassword.trim()){
        p.textContent = "Las contraseñas no coinciden";
        p.style.display = "block";
        confirmPasswordValid = false;
        return false;
    }else{
        p.textContent = "";
        p.style.display = "none";
        confirmPasswordValid = true;
    }
    return confirmPasswordValid;
}

function findUserByEmail(email){
    return state.users.find(user => user.email === email);
}