import { PrivateLayout } from "../../layout/PrivateLayout.js";
import { getAllPermissions, getPermissionsByRole, createPermission, removePermission, assignPermissionToRole, removePermissionFromRole } from '../../services/permissions.service.js';
import { getRoles } from '../../services/roles.service.js';
import { Modal } from '../../shared/components/Modal.js';

export async function PermisosPage() {
    const roles = await getRoles();

    const content = `
        <div class="admin-page">
            <h1>Gestionar Permisos</h1>

            <div class="flex" style="align-items:center; gap:1rem; margin-bottom:1rem;">
                <label>Rol:</label>
                <select id="role-select" class="input-base" style="width:200px;">
                    <option value="">-- Selecciona un rol --</option>
                    ${roles.map(r => `<option value="${r.idRole}">${r.roleName}</option>`).join("")}
                </select>
                <button id="btn-add-permission" class="btn-info">+ Agregar Permiso</button>
            </div>

            <hr>

            <div class="flex" style="gap:1.5rem; align-items:flex-start;">

                <div style="flex:1;">
                    <h3>Permisos registrados</h3>
                    <div class="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Descripción</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody id="all-permissions-body">
                                <tr><td colspan="3">Selecciona un rol</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div style="flex:1;">
                    <h3>Permisos asignados al rol</h3>
                    <div class="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Descripción</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody id="role-permissions-body">
                                <tr><td colspan="3">Selecciona un rol</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>

            <div id="modal-container"></div>
        </div>
    `;

    const initEvents = () => {
        const roleSelect = document.getElementById("role-select");
        const addBtn = document.getElementById("btn-add-permission");
        const modalContainer = document.getElementById("modal-container");
        const allBody = document.getElementById("all-permissions-body");
        const roleBody = document.getElementById("role-permissions-body");

        if (!roleSelect || !addBtn || !allBody || !roleBody) {
            setTimeout(initEvents, 50);
            return;
        }

        const getSelectedRole = () => roleSelect.value ? Number(roleSelect.value) : null;

        const reloadPanels = async () => {
            const roleId = getSelectedRole();
            const [all, assigned] = await Promise.all([
                getAllPermissions(),
                roleId ? getPermissionsByRole(roleId) : Promise.resolve([])
            ]);

            const assignedIds = new Set(assigned.map(p => p.permissionId));
            const available = roleId ? all.filter(p => !assignedIds.has(p.idPermission)) : all;

            allBody.innerHTML = available.length
                ? available.map(p => `
                    <tr>
                        <td>${p.nameUri}</td>
                        <td>${p.description}</td>
                        <td>
                            ${roleId
                                ? `<button class="btn-success btn-small" data-action="assign" data-id="${p.idPermission}">→</button>`
                                : ""}
                            <button class="btn-danger btn-small" data-action="delete-perm" data-id="${p.idPermission}">Eliminar</button>
                        </td>
                    </tr>`).join("")
                : `<tr><td colspan="3">No hay permisos registrados</td></tr>`;

            roleBody.innerHTML = !roleId
                ? `<tr><td colspan="3">Selecciona un rol</td></tr>`
                : assigned.length
                    ? assigned.map(p => `
                        <tr>
                            <td>${p.nameUri}</td>
                            <td>${p.description}</td>
                            <td>
                                <button class="btn-warning btn-small" data-action="unassign" data-id="${p.permissionId}">←</button>
                            </td>
                        </tr>`).join("")
                    : `<tr><td colspan="3">Sin permisos asignados</td></tr>`;
        };

        allBody.addEventListener("click", async (e) => {
            const btn = e.target.closest("button[data-action]");
            if (!btn) return;
            const action = btn.dataset.action;
            const id = Number(btn.dataset.id);
            const roleId = getSelectedRole();

            if (action === "assign" && roleId) {
                btn.disabled = true;
                try {
                    await assignPermissionToRole(roleId, id);
                    await reloadPanels();
                } catch (e) {
                    btn.disabled = false;
                    alert(e.message);
                    return;
                }
            }
            if (action === "delete-perm") {
                if (confirm("¿Eliminar este permiso permanentemente?")) {
                    try {
                        await removePermission(id);
                        await reloadPanels();
                    } catch (e) {
                        alert(e.message);
                        return;
                    }
                }
            }
        });

        roleBody.addEventListener("click", async (e) => {
            const btn = e.target.closest("button[data-action='unassign']");
            if (!btn) return;
            const roleId = getSelectedRole();
            if (!roleId) return;
            btn.disabled = true;
            try {
                await removePermissionFromRole(roleId, Number(btn.dataset.id));
                await reloadPanels();
            } catch (e) {
                btn.disabled = false;
                alert(e.message);
                return;
            }
        });

        roleSelect.addEventListener("change", reloadPanels);
        reloadPanels();

        addBtn.onclick = async () => {
            const modalHtml = await Modal({
                title: "Agregar Permiso",
                body: `
                    <form id="permission-form">
                        <div class="flex flex-col">
                            <label>Nombre (URI)</label>
                            <input class="input-base" type="text" name="nameUri" placeholder="ej: crear_usuarios" required>
                        </div>
                        <div class="flex flex-col">
                            <label>Descripción</label>
                            <input class="input-base" type="text" name="description" placeholder="Descripción del permiso">
                        </div>
                    </form>`,
                confirmText: "Agregar",
                onConfirm: async () => {
                    const form = document.getElementById("permission-form");
                    const data = Object.fromEntries(new FormData(form));
                    if (!data.nameUri.trim()) { alert("Nombre requerido"); return false; }
                    try {
                        await createPermission(data);
                        await reloadPanels();
                        return true;
                    } catch (e) {
                        alert(e.message);
                        return false;
                    }
                }
            });
            modalContainer.innerHTML = modalHtml;
        };
    };

    initEvents();
    return await PrivateLayout(content);
}
