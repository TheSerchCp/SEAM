import { PrivateLayout } from "../../layout/private.layout.js";
import { state } from "../../services/general/state.js";
import { Modal } from "../../components/modal.js";

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
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Rol</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    ${renderUsers()}
                </tbody>
            </table>
        </div>

        <div id="modal-container"></div>
    </div>
    `;

    // Función recursiva para esperar a que los elementos existan en el DOM
    const initEvents = () => {
        const addBtn = document.getElementById("btn-addUser");
        const modalContainer = document.getElementById("modal-container");

        if (!addBtn || !modalContainer) {
            setTimeout(initEvents, 50);
            return;
        }

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
                                <option value="alumno">Alumno</option>
                                <option value="profesor">Profesor</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                    </form>
                    `,
                confirmText: "Agregar",
                onConfirm: async () => {
                    const form = document.getElementById("user-form");
                    const formData = new FormData(form);
                    const data = Object.fromEntries(formData);

                    if (!validateUser(data)) {
                        return;
                    }

                    state.users.push({
                        id: Math.max(...state.users.map(u => u.id)) + 1,
                        ...data
                    });

                    await reloadUsersPage();
                }
            });
            modalContainer.innerHTML = modalHtml;
        };
    };

    initEvents();

    return await PrivateLayout(htmlUser);
}

function renderUsers() {
    if (state.users.length > 0) {
        return state.users.map(us => `
        <tr>
            <td>${us.name}</td>
            <td>${us.email}</td>
            <td>${us.role}</td>
            <td>
                <button class="btn-warning btn-small" onclick="editUser(${us.id})">Editar</button>
                <button class="btn-danger btn-small" onclick="deleteUser(${us.id})">Eliminar</button>
            </td>
        </tr>
        `).join("");
    } else {
        return "<tr><td colspan='4'>No hay usuarios registrados</td></tr>";
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
