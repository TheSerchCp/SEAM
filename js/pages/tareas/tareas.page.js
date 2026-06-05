import { PrivateLayout } from "../../layout/PrivateLayout.js";
import { session } from '../../state/session.state.js';

export async function TareasPage() {
    const grupoId = parseInt(location.hash.split('/')[2]);
    const grupo = session.grupos.find(g => g.id === grupoId);

    const content = `
        <div class="admin-page">
            <h1>Gestionar Tareas - Grupo ${grupo?.nombre || ''}</h1>
            
            <div class="form-section">
                <h2>Crear Nueva Tarea</h2>
                <form id="tarea-form">
                    <div class="flex flex-col">
                        <label>Título</label>
                        <input type="text" name="titulo" class="input-base" required>
                    </div>
                    <div class="flex flex-col">
                        <label>Descripción</label>
                        <textarea name="descripcion" class="input-base" rows="4" required></textarea>
                    </div>
                    <div class="flex flex-col">
                        <label>Fecha de Entrega</label>
                        <input type="date" name="fecha_entrega" class="input-base" required>
                    </div>
                    <button type="submit" class="btn-success">Crear Tarea</button>
                </form>
            </div>

            <h2>Tareas del Grupo</h2>
            <div class="tasks-list">
                ${session.tareas.filter(t => t.grupo_id === grupoId).map(t => `
                    <div class="task-item">
                        <h4>${t.titulo}</h4>
                        <p>${t.descripcion}</p>
                        <p><strong>Entrega: ${t.fecha_entrega}</strong></p>
                        <button class="btn-danger btn-small" onclick="deleteTarea(${t.id})">Eliminar</button>
                    </div>
                `).join('')}
            </div>

            <button class="btn-default" onclick="location.hash = '#/home'">Volver</button>
        </div>
    `;
    return PrivateLayout(content);
}

window.deleteTarea = function(tareasId) {
    if (confirm('¿Deseas eliminar esta tarea?')) {
        alert('Tarea eliminada');
        location.hash = location.hash;
    }
};

document.addEventListener('submit', (e) => {
    if (e.target.id === 'tarea-form') {
        e.preventDefault();
        alert('Tarea creada exitosamente');
        location.hash = location.hash;
    }
});
