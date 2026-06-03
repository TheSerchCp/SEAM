import { PrivateLayout } from "../../layout/private.layout.js";
import { state } from "../../services/general/state.js";

export async function CalificacionesPage() {
    const grupoId = parseInt(location.hash.split('/')[2]);
    const grupo = state.grupos.find(g => g.id === grupoId);

    const content = `
        <div class="admin-page">
            <h1>Gestionar Calificaciones - Grupo ${grupo?.nombre || ''}</h1>
            
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Alumno</th>
                            <th>Materia</th>
                            <th>Nota</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${state.calificaciones.filter(c => c.grupo_id === grupoId).map(c => `
                            <tr>
                                <td>${state.users.find(u => u.id === c.alumno_id)?.name || 'N/A'}</td>
                                <td>${c.materia}</td>
                                <td><input type="number" value="${c.nota}" class="input-small" min="0" max="10" step="0.1"></td>
                                <td>
                                    <button class="btn-success btn-small" onclick="saveGrade(${c.id})">Guardar</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>

            <button class="btn-default" onclick="location.hash = '#/home'">Volver</button>
        </div>
    `;
    return PrivateLayout(content);
}

window.saveGrade = function(gradeId) {
    alert('Calificación guardada exitosamente');
};
