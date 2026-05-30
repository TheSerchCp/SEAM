import { loadCSS } from "../../utils/loadCss.js";
import { state } from "../../services/general/state.js";
import { PublicLayout } from "../../layout/public.layout.js";

export async function LoginPage() {
   await loadCSS("css/pages/public/login/login.css");
    return PublicLayout(`
        <div class="login-container">
            <div class="card">
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
                    </div>

                    <div class="flex flex-col">
                        <label for="password">Contraseña</label>

                        <input type="password" 
                        id="password" 
                        name="password"
                        class="input-base">
                    </div>

                    <button class="btn-info">Ingresar</button>
                    </form>
                </div>
                
            </div>
        </div>
    `);
}




//Escuchar los eventos del formulario con listeners
document.addEventListener("submit", async (e) => {
    if(e.target.id !== "login-form"){
        return;
    } 

    e.preventDefault();

    const formData = new FormData(e.target);
    const formJson = Object.fromEntries(formData);
    console.log("Datos de form login en json: ", formJson)

    if(!validateLogin(formJson)){
        return;
    }

    state.user = findUserByEmail(formJson.email.trim());
    location.hash = "/home";
})



function validateLogin(data){
    if(!data.email.trim()){
        alert("El campo email es requerido");
        return false;
    }
   if(!data.email.trim().includes("@")){
    alert("El campo email es invalido");
    return false;
   }

   if(!data.password.trim()){
    alert("El campo contraseña es requerido");
    return false;
   }

   const user = findUserByEmail(data.email.trim());
   
   if(!user){
       alert("El usuario no existe");
       return false;
   }

   if(user.password != data.password.trim() || user.email !== data.email.trim()){
       alert("Correo o contraseña incorrectos");
       return false;
   }

    return true;
}


function findUserByEmail(email){
    return state.users.find(user => user.email === email);
}