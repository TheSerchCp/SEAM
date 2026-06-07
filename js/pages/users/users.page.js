import { PrivateLayout } from '../../layout/PrivateLayout.js';
import { getUsers, getUserById, createUser, updateUser, removeUser, toggleUserState } from '../../services/users.service.js';
import { getRoles } from '../../services/roles.service.js';
import { FormModal } from '../../shared/components/FormModal.js';
import { Modal } from '../../shared/components/Modal.js';
import { Table } from '../../shared/components/ui/Table.js';
import { Button } from '../../shared/components/ui/Button.js';
import { FormValidator } from '../../shared/utils/FormValidator.js';
import { EventBus } from '../../core/EventBus.js';
import { shouldUpdatePage } from '../../core/OperationListeners.js';
import { registerPageCleanup } from '../../core/Router.js';

const USER_SCHEMA = {
    name: { required: true, text: true, minLength: 2 },
    email: { required: true, email: true },
    password: { required: true, password: true },
    confirmPassword: { required: true, password: true, match: 'password' },
    idRole: { required: true },
};

const USER_EDIT_SCHEMA = {
    name: { required: true, text: true, minLength: 2 },
    email: { required: true, email: true },
    password: { password: true },
    confirmPassword: {
        custom: (val, _, formData) => {
            const pwd = formData.get('password') ?? '';
            if (!pwd.trim()) return true;
            if (!val.trim()) return 'Confirma la nueva contraseña';
            return val === pwd || 'Los campos no coinciden';
        }
    },
    idRole: { required: true },
};

const USER_COLUMNS = [
    { label: '#', key: 'idUser' },
    { label: 'Nombre', key: 'full_name' },
    { label: 'Email', key: 'email' },
    { label: 'Rol', key: 'roleName' },
];

const addButtonClasses = 'inline-flex items-center justify-center gap-2 rounded-lg border border-blue-500 bg-blue-500 px-3 py-2 text-xs sm:text-sm font-semibold text-white transition hover:bg-blue-600 active:bg-blue-700 hover:cursor-pointer';
const editButtonClasses = 'inline-flex items-center justify-center gap-1 rounded-md border border-amber-500 bg-amber-500 px-2 py-1.5 text-[10px] sm:text-xs font-semibold text-white transition hover:bg-amber-600 hover:cursor-pointer';
const deleteButtonClasses = 'inline-flex items-center justify-center gap-1 rounded-md border border-red-500 bg-red-500 px-2 py-1.5 text-[10px] sm:text-xs font-semibold text-white transition hover:bg-red-600 hover:cursor-pointer';
const stateButtonClasses = (isActive) => `inline-flex items-center justify-center gap-1 rounded-md border hover:cursor-pointer ${isActive ? 'border-green-500 bg-green-500 hover:bg-green-600' : 'border-gray-500 bg-gray-500 hover:bg-gray-600'} px-2 py-1.5 text-[10px] sm:text-xs font-semibold text-white transition`;

async function renderPage() {
    const users = await getUsers();

    return `
        <div class="w-full space-y-5 rounded-xl border border-gray-700/60 bg-gray-900/80 p-4 sm:p-6 shadow-xl shadow-black/20">
            <!-- Header Section -->
            <div class="flex flex-col gap-3 border-b border-gray-700/40 pb-4 sm:gap-4 sm:pb-6">
                <div class="flex flex-col gap-2 sm:gap-3">
                    <span class="text-xs font-bold uppercase tracking-[0.25em] text-blue-400">Administración</span>
                    <div class="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 class="text-xl font-bold text-white sm:text-2xl">Gestionar Usuarios</h1>
                            <p class="mt-1 text-xs text-gray-400 sm:text-sm">Administra los usuarios del sistema</p>
                        </div>
                        ${Button({
                            id:              'btn-addUser',
                            className:       addButtonClasses,
                            icon:            'fa-solid fa-user-plus',
                            buttonText:      'Agregar',
                            hasTooltip:      true,
                            tooltipText:     'Agregar usuario',
                            tooltipPosition: 'bottom',
                        })}
                    </div>
                </div>
            </div>

            <!-- Table Container -->
            <div class="flex flex-col gap-3">
                <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 class="text-sm font-semibold text-white sm:text-base">Listado</h2>
                        <p class="text-xs text-gray-500">Desliza para ver todas las columnas</p>
                    </div>
                    <span class="w-fit rounded-full border border-blue-500/20 bg-blue-500/10 px-2.5 py-1 text-xs font-semibold text-blue-300 flex items-center gap-1.5">
                        <i class="fa-solid fa-users text-xs"></i>
                        <span>${users.length} registrados</span>
                    </span>
                </div>
                <div id="users-table-wrap" class="w-full overflow-hidden">
                    ${Table({
                        columns: USER_COLUMNS,
                        rows: users,
                        tbodyId: 'users-body',
                        emptyMessage: 'No hay usuarios registrados',
                        actions: (user) => `
                            ${Button({ className: editButtonClasses,                  action: `window.editUser?.(${user.idUser})`,                         icon: 'fa-solid fa-pen',     buttonText: 'Editar',    hasTooltip: true, tooltipText: 'Editar usuario',             tooltipPosition: 'top' })}
                            ${Button({ className: stateButtonClasses(user.isActive), action: `window.toggleUser?.(${user.idUser},${!user.isActive})`, icon: `fa-solid fa-toggle-${user.isActive ? 'on' : 'off'}`,        hasTooltip: true, tooltipText: user.isActive ? 'Desactivar' : 'Activar', tooltipPosition: 'top' })}
                            ${Button({ className: deleteButtonClasses,                action: `window.deleteUser?.(${user.idUser})`,                       icon: 'fa-solid fa-trash',   buttonText: 'Eliminar',  hasTooltip: true, tooltipText: 'Eliminar usuario',           tooltipPosition: 'top' })}`
                    })}
                </div>
            </div>

            <div id="modal-container"></div>
        </div>`;
}

export async function UsersPage() {
    const html = await renderPage();
    const _unsubscribers = [];

    const initEvents = async () => {
        const addBtn = document.getElementById('btn-addUser');
        const modalContainer = document.getElementById('modal-container');
        if (!addBtn || !modalContainer) { setTimeout(initEvents, 50); return; }

        const roles = await getRoles();
        const roleOptions = roles.map(role => ({ value: role.idRole, label: role.roleName }));

        // Store references globally
        window.usersModalContainer = modalContainer;
        window.usersRoleOptions = roleOptions;
        window.usersEditSchema = USER_EDIT_SCHEMA;

        // Función para actualizar la tabla
        const updateUsersTable = async () => {
            const newHtml = await renderPage();
            const wrapper = document.getElementById('users-table-wrap');
            
            if (!wrapper) {
                console.warn('[users.page] No se encontró #users-table-wrap');
                return;
            }
            
            // Reemplazar SOLO el contenedor de la tabla, no el padre
            const container = document.createElement('div');
            container.innerHTML = newHtml;
            const newWrapper = container.querySelector('#users-table-wrap');
            
            if (newWrapper) {
                wrapper.replaceWith(newWrapper);
                setTimeout(initEvents, 0);
            }
        };

        // Listener para recargar la página cuando se emita page:reload
        const unsub = EventBus.on('page:reload', updateUsersTable);
        _unsubscribers.push(unsub);

        // Escuchar cambios de datos en tiempo real desde socket
        const unsubSocket = EventBus.on('data:changed', async (payload) => {
            // Verificar si esta operación afecta a la página de usuarios
            if (shouldUpdatePage('users', payload?.operation)) {
                console.log(`[users.page] Actualizando tabla por data:changed en operación: ${payload.operation}`);
                
                // Ignorar si fue iniciado por este cliente (ya emitió page:reload localmente)
                if (payload?.initiatorSocketId === EventBus.socketId) {
                    console.log(`[users.page] Ignorando data:changed porque fue iniciado por este cliente (ya tiene page:reload)`);
                    return;
                }
                
                // Para otros clientes, actualizar la tabla
                await updateUsersTable();
            }
        });
        _unsubscribers.push(unsubSocket);

        addBtn.addEventListener('click', async () => {
            modalContainer.innerHTML = await FormModal({
                title: 'Agregar Usuario',
                formId: 'user-form',
                fields: [
                    { name: 'name', label: 'Nombre', type: 'text', placeholder: 'Juan Pérez', required: true },
                    { name: 'email', label: 'Email', type: 'email', placeholder: 'juan@example.com', required: true },
                    { name: 'password', label: 'Contraseña', type: 'password', placeholder: '••••••••', required: true },
                    { name: 'confirmPassword', label: 'Confirmar Contraseña', type: 'password', placeholder: '••••••••', required: true },
                    { name: 'idRole', label: 'Rol', type: 'select', options: roleOptions, required: true },
                ],
                type: 'success',
                schema: USER_SCHEMA,
                onConfirm: async (formData) => {
                    try {
                        console.log("Datyos de formulario: ", formData)
                        const userData = {
                            full_name: formData.name,
                            email: formData.email,
                            password: formData.password,
                            roleId: parseInt(formData.idRole),
                        };
                        await createUser(userData);
                        EventBus.emit('page:reload');
                        return { success: true };
                    } catch (error) {
                        return { success: false, error: error.message };
                    }
                },
            });
        });
    };

    // Registrar función de limpieza
    registerPageCleanup(() => {
        _unsubscribers.forEach(unsub => unsub?.());
        _unsubscribers.length = 0;
        delete window.usersModalContainer;
        delete window.usersRoleOptions;
        delete window.usersEditSchema;
    });

    setTimeout(initEvents, 0);

    return PrivateLayout(html);
}

window.editUser = async function(idUser) {
    if (!window.usersModalContainer) {
        console.warn('Modal container no disponible, reintentando...');
        setTimeout(() => window.editUser(idUser), 100);
        return;
    }

    const modalContainer = window.usersModalContainer;
    const user = await getUserById(idUser);

    modalContainer.innerHTML = await FormModal({
        title: 'Editar Usuario',
        formId: 'user-form-edit',
        fields: [
            { name: 'name', label: 'Nombre', type: 'text', value: user.full_name, required: true },
            { name: 'email', label: 'Email', type: 'email', value: user.email, required: true },
            { name: 'password', label: 'Nueva Contraseña (dejar vacío para no cambiar)', type: 'password', placeholder: '••••••••' },
            { name: 'confirmPassword', label: 'Confirmar Contraseña', type: 'password', placeholder: '••••••••' },
            { name: 'idRole', label: 'Rol', type: 'select', value: user.roleId, options: window.usersRoleOptions, required: true },
        ],
        schema: window.usersEditSchema,
        onConfirm: async (formData) => {
            try {
                const userData = {
                    full_name: formData.name,
                    email: formData.email,
                    roleId: parseInt(formData.idRole),
                };
                if (formData.password?.trim()) {
                    userData.password = formData.password;
                }
                await updateUser(idUser, userData);
                EventBus.emit('page:reload');
                return { success: true };
            } catch (error) {
                return { success: false, error: error.message };
            }
        },
    });
};

window.deleteUser = async function(idUser) {
    if (!window.usersModalContainer) {
        console.warn('Modal container no disponible, reintentando...');
        setTimeout(() => window.deleteUser(idUser), 100);
        return;
    }

    await Modal({
        title: '¿Eliminar usuario?',
        body: '<p class="text-sm text-gray-300">Esta acción <strong>no se puede deshacer</strong>. ¿Estás seguro?</p>',
        onConfirm: async () => {
            try {
                await removeUser(idUser);
                EventBus.emit('page:reload');
                return { success: true };
            } catch (error) {
                return { success: false, error: error.message };
            }
        },
        confirmText: 'Eliminar',
        type: 'danger',
    });
};

window.toggleUser = async function(idUser, enable) {
    if (!window.usersModalContainer) {
        console.warn('Modal container no disponible, reintentando...');
        setTimeout(() => window.toggleUser(idUser, enable), 100);
        return;
    }

    try {
           await Modal({
        title: `${enable ? 'Activar' : 'Desactivar'} usuario`,
        body: `<p class="text-sm text-gray-300">¿Estás seguro de que deseas ${enable ? 'activar' : 'desactivar'} este usuario?</p>`,
        onConfirm: async () => {
            try {
                await toggleUserState(idUser, Number(enable));
                EventBus.emit('page:reload');
                return { success: true };
            } catch (error) {
                return { success: false, error: error.message };
            }
        },
        confirmText: `${enable ? 'Activar' : 'Desactivar'}`,
        type: `${enable ? 'success' : 'danger'}`,
    });
    } catch (error) {
        await Modal({
            title: 'Error',
            body: `<p class="text-sm text-gray-300">No fue posible ${enable ? 'activar' : 'desactivar'} el usuario. Intenta nuevamente.</p>`,
            confirmText: 'Cerrar',
        });
    }
}
