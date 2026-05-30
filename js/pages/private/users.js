import { PrivateLayout } from "../../layout/private.layout.js";
import { Modal } from "../../components/modal.js";

let usersList = [];

export async function UsersPage() {

    const htmlUser = `
    <div>
        <h1>Usuarios</h1>
            <div class="flex">
                <button id="btn-addUser" class="btn-info" >Agregar Usuario</button>
            </div>

        <hr>

        <div>
        ${renderUsers()}
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
                        <input class="input-base" 
                        type="text" 
                        name="name" placeholder="Nombre" >
                        <input class="input-base" 
                        type="email" 
                        name="email" placeholder="Email" >
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

                    usersList.push({
                        id: usersList.length > 0 ? usersList[usersList.length - 1].id + 1 : 1,
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
    if (usersList.length > 0) {
        return usersList.map(us => `
        <div class="card">
            <h3>${us.name}</h3>
            <p>${us.email}</p>
            <button class="btn-danger" onclick="deleteUser(${us.id})">
                Eliminar
            </button>
        </div>
        `).join("");
    } else {
        return "<p>No hay usuarios registrados</p>";
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
    return true;
}

// Exponemos deleteUser al objeto window para que el onclick del HTML pueda encontrarlo
async function deleteUser  (id)  {
    usersList = usersList.filter(user => user.id !== id);
    await reloadUsersPage();
};

async function reloadUsersPage() {
    const app = document.getElementById("app");
    if (app) {
        app.innerHTML = await UsersPage();
    }
}
