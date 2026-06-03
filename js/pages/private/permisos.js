import { PrivateLayout } from "../../layout/private.layout.js";
import { state } from "../../services/general/state.js";

export async function PermisosPage() {
    const content = `
        <div class="admin-page">
            <h1>Asignar Permisos</h1>
            
            <div class="form-section">
                <h2>Seleccionar Usuario</h2>
                <select id="user-select" class="input-base">
                    <option value="">-- Selecciona un usuario --</option>
                    ${state.users.map(u => `<option value="${u.id}">${u.name} (${u.role})</option>`).join('')}
                </select>
            </div>

            <div id="permissions-form" style="display:none;" class="form-section">
                <h2>Permisos Disponibles</h2>
                <div class="permissions-list">
                    <label class="permission-item">
                        <input type="checkbox" name="perm_crear_usuarios"> Crear Usuarios
                    </label>
                    <label class="permission-item">
                        <input type="checkbox" name="perm_editar_usuarios"> Editar Usuarios
                    </label>
                    <label class="permission-item">
                        <input type="checkbox" name="perm_eliminar_usuarios"> Eliminar Usuarios
                    </label>
                    <label class="permission-item">
                        <input type="checkbox" name="perm_ver_reportes"> Ver Reportes
                    </label>
                    <label class="permission-item">
                        <input type="checkbox" name="perm_gestionar_grupos"> Gestionar Grupos
                    </label>
                </div>
                <button class="btn-success" onclick="savePermissions()">Guardar Permisos</button>
            </div>
        </div>
    `;
    return PrivateLayout(content);
}

window.savePermissions = function() {
    alert('Permisos guardados exitosamente');
};

document.addEventListener('change', (e) => {
    if (e.target.id === 'user-select') {
        const form = document.getElementById('permissions-form');
        form.style.display = e.target.value ? 'block' : 'none';
    }
});
