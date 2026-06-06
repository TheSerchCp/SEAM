import { PrivateLayout } from '../../layout/PrivateLayout.js';
import { getAllPermissions, getPermissionsByRole, createPermission, removePermission, assignPermissionToRole, removePermissionFromRole } from '../../services/permissions.service.js';
import { getRoles } from '../../services/roles.service.js';
import { Table } from '../../shared/components/ui/Table.js';
import { SelectField } from '../../shared/components/ui/SelectField.js';
import { Modal } from '../../shared/components/Modal.js';
import { initSelectFields } from '../../shared/components/ui/SelectField.js';
import { EventBus } from '../../core/EventBus.js';
import { shouldUpdatePage } from '../../core/OperationListeners.js';
import { registerPageCleanup } from '../../core/Router.js';

const addButtonClasses = 'inline-flex items-center justify-center gap-2 rounded-lg border border-blue-500 bg-blue-500 px-3 py-2 text-xs sm:text-sm font-semibold text-white transition hover:bg-blue-600';
const assignButtonClasses = 'inline-flex items-center justify-center gap-1 rounded-md border border-emerald-500 bg-emerald-500 px-2 py-1.5 text-[10px] sm:text-xs font-semibold text-white transition hover:bg-emerald-600';
const deleteButtonClasses = 'inline-flex items-center justify-center gap-1 rounded-md border border-red-500 bg-red-500 px-2 py-1.5 text-[10px] sm:text-xs font-semibold text-white transition hover:bg-red-600';
const unassignButtonClasses = 'inline-flex items-center justify-center gap-1 rounded-md border border-amber-500 bg-amber-500 px-2 py-1.5 text-[10px] sm:text-xs font-semibold text-white transition hover:bg-amber-600';

const PERMISSION_COLUMNS = [
    { label: 'Nombre', key: 'nameUri' },
    { label: 'Descripción', key: 'description' },
];

const ROLE_PERMISSION_COLUMNS = [
    { label: 'Nombre', key: 'nameUri' },
    { label: 'Descripción', key: 'description' },
];

async function renderPage(roleOptions) {
    return `
        <div class="w-full space-y-5 rounded-xl border border-gray-700/60 bg-gray-900/80 p-4 sm:p-6 shadow-lg shadow-black/20">
            <!-- Header Section -->
            <div class="flex flex-col gap-3 border-b border-gray-700/40 pb-4 sm:gap-4 sm:pb-6">
                <div>
                    <span class="text-xs font-bold uppercase tracking-[0.25em] text-blue-400">Seguridad</span>
                    <h1 class="mt-2 text-xl font-bold text-white sm:text-2xl">Gestionar Permisos</h1>
                    <p class="mt-1 text-xs text-gray-400 sm:text-sm">Administra permisos y su asignación por rol</p>
                </div>
            </div>

            <!-- Role Selector & Add Button -->
            <div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div class="flex-1">
                    ${SelectField({
                        name: 'role-select',
                        label: 'Selecciona un rol',
                        value: '',
                        options: roleOptions,
                        placeholder: '-- Selecciona un rol --',
                    })}
                </div>
                <button id="btn-add-permission" class="${addButtonClasses} w-full sm:w-auto">
                    <i class="fa-solid fa-plus"></i>
                    <span class="hidden sm:inline">Agregar Permiso</span>
                    <span class="sm:hidden">Nuevo</span>
                </button>
            </div>

            <!-- Two Column Layout for Tables (Responsive) -->
            <div class="grid gap-4 lg:grid-cols-2">
                <!-- All Permissions Table -->
                <section class="overflow-hidden rounded-lg border border-gray-700/60 bg-gray-900 shadow-lg shadow-black/20">
                    <div class="flex items-center gap-2 border-b border-gray-700/40 bg-gray-800/60 px-3 py-3 sm:gap-3 sm:px-4 sm:py-4">
                        <span class="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400 text-sm sm:h-10 sm:w-10">
                            <i class="fa-solid fa-key"></i>
                        </span>
                        <div class="flex-1 min-w-0">
                            <h3 class="text-sm sm:text-base font-semibold text-white truncate">Permisos disponibles</h3>
                            <p class="text-xs text-gray-400 truncate">Para asignar o eliminar</p>
                        </div>
                    </div>
                    <div id="all-permissions-table" class="p-4">
                        <!-- Table will be inserted here -->
                    </div>
                </section>

                <!-- Role Permissions Table -->
                <section class="overflow-hidden rounded-lg border border-gray-700/60 bg-gray-900 shadow-lg shadow-black/20">
                    <div class="flex items-center gap-2 border-b border-gray-700/40 bg-gray-800/60 px-3 py-3 sm:gap-3 sm:px-4 sm:py-4">
                        <span class="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400 text-sm sm:h-10 sm:w-10">
                            <i class="fa-solid fa-shield"></i>
                        </span>
                        <div class="flex-1 min-w-0">
                            <h3 class="text-sm sm:text-base font-semibold text-white truncate">Permisos del rol</h3>
                            <p class="text-xs text-gray-400 truncate">Controla el acceso</p>
                        </div>
                    </div>
                    <div id="role-permissions-table" class="p-4">
                        <!-- Table will be inserted here -->
                    </div>
                </section>
            </div>

            <div id="modal-container"></div>
        </div>
    `;
}

export async function PermisosPage() {
    const roles = await getRoles();
    const roleOptions = roles.map(r => ({ value: r.idRole, label: r.roleName }));

    const content = await renderPage(roleOptions);
    const _unsubscribers = [];

    const initEvents = () => {
        const roleSelectInput = document.querySelector('input[name="role-select"]');
        const addBtn = document.getElementById('btn-add-permission');
        const modalContainer = document.getElementById('modal-container');
        const allPermTable = document.getElementById('all-permissions-table');
        const rolePermTable = document.getElementById('role-permissions-table');

        if (!addBtn || !allPermTable || !rolePermTable || !roleSelectInput) {
            setTimeout(initEvents, 50);
            return;
        }

        // Store references globally
        window.permissionsModalContainer = modalContainer;
        window.permissionsRoleOptions = roleOptions;
        window.permissionsRoleSelectInput = roleSelectInput;

        const getSelectedRole = () => roleSelectInput?.value ? Number(roleSelectInput.value) : null;

        const reloadPanels = async () => {
            const roleId = getSelectedRole();
            const [all, assigned] = await Promise.all([
                getAllPermissions(),
                roleId ? getPermissionsByRole(roleId) : Promise.resolve([])
            ]);

            const normalizedAll = all.map(p => ({ ...p, idPermission: p.idPermission || p.permissionId }));
            const normalizedAssigned = assigned.map(p => ({ ...p, idPermission: p.idPermission || p.permissionId }));

            const assignedIds = new Set(normalizedAssigned.map(p => p.idPermission));
            const available = roleId ? normalizedAll.filter(p => !assignedIds.has(p.idPermission)) : normalizedAll;

            allPermTable.innerHTML = Table({
                columns: PERMISSION_COLUMNS,
                rows: available,
                emptyMessage: 'No hay permisos disponibles',
                actions: (p) => `
                    ${roleId ? `<button class="${assignButtonClasses}" onclick="window.handleAssignPerm?.(${p.idPermission})" title="Asignar"><i class="fa-solid fa-arrow-right"></i><span class="hidden sm:inline">Asignar</span></button>` : ''}
                    <button class="${deleteButtonClasses}" onclick="window.handleDeletePerm?.(${p.idPermission})" title="Eliminar"><i class="fa-solid fa-trash"></i><span class="hidden sm:inline">Eliminar</span></button>`
            });

            rolePermTable.innerHTML = Table({
                columns: ROLE_PERMISSION_COLUMNS,
                rows: roleId ? normalizedAssigned : [],
                emptyMessage: roleId ? 'Sin permisos asignados' : 'Selecciona un rol',
                actions: (p) => `
                    <button class="${unassignButtonClasses}" onclick="window.handleUnassignPerm?.(${p.idPermission})" title="Quitar"><i class="fa-solid fa-arrow-left"></i><span class="hidden sm:inline">Quitar</span></button>
                    <button class="${deleteButtonClasses}" onclick="window.handleDeletePerm?.(${p.idPermission})" title="Eliminar"><i class="fa-solid fa-trash"></i><span class="hidden sm:inline">Eliminar</span></button>`
            });
        };

        addBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            const formHtml = `
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-200 mb-2">Nombre del permiso</label>
                        <input type="text" id="perm-name" placeholder="ej: ver_reportes" class="w-full rounded-lg border border-gray-600 bg-gray-800 px-3 py-2 text-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-200 mb-2">Descripción</label>
                        <input type="text" id="perm-desc" placeholder="ej: Permite visualizar reportes" class="w-full rounded-lg border border-gray-600 bg-gray-800 px-3 py-2 text-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
                    </div>
                </div>`;

            await Modal({
                title: 'Nuevo Permiso',
                body: formHtml,
                confirmBtnId: 'perm-confirm',
                onConfirm: async () => {
                    const name = document.getElementById('perm-name')?.value || '';
                    const desc = document.getElementById('perm-desc')?.value || '';
                    if (!name.trim()) {
                        alert('El nombre es obligatorio');
                        return { success: false };
                    }
                    try {
                        await createPermission({ nameUri: name, description: desc });
                        await reloadPanels();
                        return { success: true };
                    } catch (e) {
                        alert(e.message);
                        return { success: false };
                    }
                },
                confirmText: 'Crear',
            });
        });

        if (roleSelectInput) {
            roleSelectInput.addEventListener('change', reloadPanels);
        }
        
        const unsub = EventBus.on('page:reload', reloadPanels);
        _unsubscribers.push(unsub);

        // Escuchar cambios de datos en tiempo real desde socket
        const unsubSocket = EventBus.on('data:changed', async (payload) => {
            // Verificar si esta operación afecta a la página de permisos
            if (shouldUpdatePage('permissions', payload?.operation)) {
                console.log(`[permissions.page] Actualizando paneles por data:changed en operación: ${payload.operation}`);
                
                // Ignorar si fue iniciado por este cliente (ya emitió page:reload localmente)
                if (payload?.initiatorSocketId === EventBus.socketId) {
                    console.log(`[permissions.page] Ignorando data:changed porque fue iniciado por este cliente (ya tiene page:reload)`);
                    return;
                }
                
                // Para otros clientes, actualizar los paneles
                await reloadPanels();
            }
        });
        _unsubscribers.push(unsubSocket);
        
        setTimeout(reloadPanels, 0);
    };

    // Registrar función de limpieza
    registerPageCleanup(() => {
        _unsubscribers.forEach(unsub => unsub?.());
        _unsubscribers.length = 0;
        delete window.permissionsModalContainer;
        delete window.permissionsRoleOptions;
        delete window.permissionsRoleSelectInput;
    });

    setTimeout(() => {
        initSelectFields();
        initEvents();
    }, 0);

    return PrivateLayout(content);
}

window.handleAssignPerm = async function(permId) {
    if (!window.permissionsRoleSelectInput) {
        console.warn('Role selector no disponible');
        return;
    }
    
    const roleId = window.permissionsRoleSelectInput.value ? Number(window.permissionsRoleSelectInput.value) : null;
    
    if (!roleId) {
        alert('Por favor selecciona un rol primero');
        return;
    }

    try {
        await assignPermissionToRole(roleId, permId);
        window.permissionsRoleSelectInput.dispatchEvent(new Event('change'));
    } catch (e) {
        alert(e.message);
    }
};

window.handleUnassignPerm = async function(permId) {
    if (!window.permissionsRoleSelectInput) {
        console.warn('Role selector no disponible');
        return;
    }
    
    const roleId = window.permissionsRoleSelectInput.value ? Number(window.permissionsRoleSelectInput.value) : null;
    
    if (!roleId) {
        alert('Por favor selecciona un rol primero');
        return;
    }

    try {
        await removePermissionFromRole(roleId, permId);
        window.permissionsRoleSelectInput.dispatchEvent(new Event('change'));
    } catch (e) {
        alert(e.message);
    }
};

window.handleDeletePerm = async function(permId) {
    if (!window.permissionsModalContainer) {
        console.warn('Modal container no disponible');
        return;
    }

    await Modal({
        title: '¿Eliminar permiso?',
        body: '<p class="text-sm text-gray-300">Esta acción <strong>no se puede deshacer</strong>. ¿Estás seguro?</p>',
        confirmBtnId: 'perm-delete',
        onConfirm: async () => {
            try {
                await removePermission(permId);
                if (window.permissionsRoleSelectInput) {
                    window.permissionsRoleSelectInput.dispatchEvent(new Event('change'));
                }
                return { success: true };
            } catch (error) {
                return { success: false, error: error.message };
            }
        },
        confirmText: 'Eliminar',
        isDanger: true,
    });
};
