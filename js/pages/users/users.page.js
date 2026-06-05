import { PrivateLayout } from "../../layout/PrivateLayout.js";
import { getUsers, getUserById, createUser, updateUser, removeUser } from '../../services/users.service.js';
import { getRoles } from '../../services/roles.service.js';
import { FormModal } from '../../shared/components/FormModal.js';
import { Modal } from '../../shared/components/Modal.js';
import { Table } from '../../shared/components/ui/Table.js';
import { FormValidator } from '../../shared/utils/FormValidator.js';

const USER_SCHEMA = {
    name: { required: true, text: true, minLength: 2 },
    email: { required: true, email: true },
    password: { required: true, password: true },
    confirmPassword: { required: true, password: true, match: "password" }
};

const USER_COLUMNS = [
    { label: "#", key: "idUser" },
    { label: "Nombre", key: "full_name" },
    { label: "Email", key: "email" },
    { label: "Rol", key: "roleName" },
];

export async function UsersPage() {
    const users = await getUsers();

    const htmlUser = `
    <div class="admin-page">
        <h1>Gestionar Usuarios</h1>
        <div class="flex">
            <button id="btn-addUser" class="btn-info">Agregar Usuario</button>
        </div>
        <hr>
        ${Table({
            columns: USER_COLUMNS,
            rows: users,
            tbodyId: "users-body",
            emptyMessage: "No hay usuarios registrados",
            actions: (u) => `
                <button class="btn-warning btn-small" onclick="editUser(${u.idUser})">Editar</button>
                <button class="btn-danger btn-small"  onclick="deleteUser(${u.idUser})">Eliminar</button>`
        })}
        <div id="modal-container"></div>
    </div>`;

    const initEvents = async () => {
        const addBtn = document.getElementById("btn-addUser");
        const modalContainer = document.getElementById("modal-container");
        if (!addBtn || !modalContainer) { setTimeout(initEvents, 50); return; }

        const roles = await getRoles();
        const roleOptions = roles.map(r => ({ value: r.idRole, label: r.roleName }));

        addBtn.onclick = async () => {
            let validator;

            modalContainer.innerHTML = await FormModal({
                title: "Agregar Usuario",
                formId: "user-form",
                fields: [
                    { type: "text", name: "name", label: "Nombre", required: true },
                    { type: "email", name: "email", label: "Email", required: true },
                    { type: "password", name: "password", label: "Contraseña", required: true },
                    { type: "password", name: "confirmPassword", label: "Confirmar Contraseña", required: true },
                    { type: "select", name: "role", label: "Rol", options: roleOptions, required: true }
                ],
                confirmText: "Agregar",
                onConfirm: async (data) => {
                    if (!validator.validate()) return false;
                    data.role = Number(data.role);
                    try {
                        await createUser({ full_name: data.name, email: data.email, password: data.password, roleId: data.role });
                        await reloadUsersTable();
                        return true;
                    } catch (e) {
                        alert(e.message);
                        return false;
                    }
                }
            });

            validator = new FormValidator("user-form", USER_SCHEMA, { buttonId: "user-form-confirm" });
            validator.attach();
        };
    };

    initEvents();
    return await PrivateLayout(htmlUser);
}

async function renderUsers() {
    const users = await getUsers();
    return Table({
        columns: USER_COLUMNS,
        rows: users,
        emptyMessage: "No hay usuarios registrados",
        actions: (u) => `
            <button class="btn-warning btn-small" onclick="editUser(${u.idUser})">Editar</button>
            <button class="btn-danger btn-small"  onclick="deleteUser(${u.idUser})">Eliminar</button>`
    });
}

async function reloadUsersTable() {
    const container = document.querySelector(".table-container");
    if (container) container.outerHTML = await renderUsers();
}

window.deleteUser = async function(id) {
    const modalContainer = document.getElementById("modal-container");
    const infoUser = await getUserById(id);

    modalContainer.innerHTML = await Modal({
        title: `Eliminar usuario: ${infoUser.full_name}`,
        body: `<p>Este usuario será removido del sistema. La acción no puede revertirse. ¿Estás seguro?</p>`,
        confirmText: "Eliminar",
        onConfirm: async () => {
            try {
                await removeUser(infoUser.idUser);
                await reloadUsersTable();
                return true;
            } catch (e) {
                alert(e.message);
                return false;
            }
        }
    });
};

window.editUser = async function(id) {
    const modalContainer = document.getElementById("modal-container");
    const [infoUser, roles] = await Promise.all([
        getUserById(id),
        getRoles()
    ]);
    const roleOptions = roles.map(r => ({ value: r.idRole, label: r.roleName }));

    let validator;

    modalContainer.innerHTML = await FormModal({
        title: "Editar Usuario",
        formId: "user-edit-form",
        fields: [
            { type: "text",     name: "name",            label: "Nombre",              value: infoUser.full_name, required: true },
            { type: "email",    name: "email",           label: "Email",               value: infoUser.email,     required: true },
            { type: "password", name: "password",        label: "Nueva Contraseña",    required: true },
            { type: "password", name: "confirmPassword", label: "Confirmar Contraseña",required: true },
            { type: "select", name: "role", label: "Rol", options: roleOptions, selected: infoUser.roleId, required: true }
        ],
        confirmText: "Guardar",
        onConfirm: async (data) => {
            if (!validator.validate()) return false;
            data.role = Number(data.role);
            try {
                await updateUser(infoUser.idUser, { full_name: data.name, email: data.email, password: data.password, roleId: data.role });
                await reloadUsersTable();
                return true;
            } catch (e) {
                alert(e.message);
                return false;
            }
        }
    });

    validator = new FormValidator("user-edit-form", USER_SCHEMA, { buttonId: "user-edit-form-confirm" });
    validator.attach();
};
