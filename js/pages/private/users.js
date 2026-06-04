import { PrivateLayout } from "../../layout/private.layout.js";
import { state } from "../../services/general/state.js";
import { Modal } from "../../components/modal.js";
import { userRepository } from "../../repositories/users/UserRepository.js";

export async function UsersPage() {

    const htmlUser = `
    <div class="admin-page">
        <h1>Gestionar Usuarios</h1>
        <div class="flex">
            <button id="btn-addUser" class="btn-info" >Agregar Usuario</button>
        </div>

        <hr>

        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Rol</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    ${await renderUsers()}
                </tbody>
            </table>
        </div>

        <div id="modal-container"></div>
    </div>
    `;

    // Función recursiva para esperar a que los elementos existan en el DOM
    const initEvents = async () => {
        const addBtn = document.getElementById("btn-addUser");
        const modalContainer = document.getElementById("modal-container");

        const roles = await getRoles();
        if (!addBtn || !modalContainer) {
            setTimeout(initEvents, 50);
            return;
        }
        
        console.log("ROles: ", roles)
        addBtn.onclick = async () => {
            const modalHtml = await Modal({
                title: "Agregar Usuario",
                body: `
                    <form id="user-form">
                        <div class="flex flex-col">
                            <label>Nombre</label>
                            <input class="input-base" 
                            type="text" 
                            name="name" placeholder="Nombre" required>
                        </div>
                        <div class="flex flex-col">
                            <label>Email</label>
                            <input class="input-base" 
                            type="email" 
                            name="email" placeholder="Email" required>
                        </div>
                        <div class="flex flex-col">
                            <label>Contraseña</label>
                            <input class="input-base" 
                            type="password" 
                            name="password" placeholder="Contraseña" required>
                        </div>
                        <div class="flex flex-col">
                            <label>Rol</label>
                            <select name="role" class="input-base" required>
                            ${roles.map(rol =>
                                `<option value="${rol.idRole}">${rol.roleName}</option>`
                            ).join("")}
                            </select>
                        </div>
                    </form>
                    `,
                confirmText: "Agregar",
                onConfirm: async () => {
                    const form = document.getElementById("user-form");
                    const formData = new FormData(form);
                    const data = Object.fromEntries(formData);
                    data.role = Number(data.role);
                    console.log("Data de form registro usuario: ", data)
                    if (!validateUser(data)) {
                        console.warn("Datos invalidos al registrar")
                    }else{
                    const register =  await userRepository.registerUser(data);
                    console.log("Registro usuario: ", register)
                    await reloadUsersPage();
                    }
                }
            });
            modalContainer.innerHTML = modalHtml;
        };
    };

    initEvents();

    return await PrivateLayout(htmlUser);
}

async function getRoles() {
    return await userRepository.getRoles();
}

async function renderUsers() {
  let users =   await userRepository.getAllUsers();

    if (users.length > 0) {
        return users.map(us => `
        <tr>
            <td>${us.idUser}</td>
            <td>${us.full_name}</td>
            <td>${us.email}</td>
            <td>${us.roleName}</td>
            <td>
                <button class="btn-warning btn-small" onclick="editUser(${us.idUser})">Editar</button>
                <button class="btn-danger btn-small" onclick="deleteUser(${us.idUser})">Eliminar</button>
            </td>
        </tr>
        `).join("");
    } else {
        return "<tr><td colspan='4'>No hay usuarios registrados</td></tr>";
    }
}

function renderRoles(roles){
    if(roles){
    return  roles.map(rol =>
        `<option value="${rol.idRole}">${rol.roleName}</option>`
    ).join("")
    }else{
        return `<option value="NoRole">No hay roles registrados.</option>`
    }
}

function validateUser(data) {
    if (!data.name.trim()) {
        alert("Nombre requerido");
        return false;
    }
    if (!data.email.includes("@")) {
        alert("Email inválido");
        return false;
    }
    if (!data.password.trim()) {
        alert("Contraseña requerida");
        return false;
    }
    return true;
}

window.deleteUser = async function(id)  {
    if (confirm('¿Deseas eliminar este usuario?')) {
        state.users = state.users.filter(user => user.id !== id);
        await reloadUsersPage();
    }
};

window.editUser = function(id) {
    alert('Función de edición - próximamente');
};

async function reloadUsersPage() {
    const app = document.getElementById("app");
    if (app) {
        app.innerHTML = await UsersPage();
    }
}
