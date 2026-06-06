import { PrivateLayout } from '../../layout/PrivateLayout.js';
import { session } from '../../state/session.state.js';

const pageCard = 'rounded-2xl border border-gray-700 bg-gray-900/90 p-6 shadow-xl shadow-black/10';
const inputSmall = 'w-24 rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20';
const saveButton = 'inline-flex items-center justify-center gap-2 rounded-lg border border-emerald-500 bg-emerald-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-600';
const backButton = 'inline-flex items-center justify-center gap-2 rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-sm font-semibold text-gray-100 transition hover:bg-gray-700';

export async function CalificacionesPage() {
    const grupoId = parseInt(location.hash.split('/')[2]);
    const grupo = session.grupos.find(g => g.id === grupoId);

    const content = `
        <div class="space-y-6">
            <section class="${pageCard}">
                <span class="text-xs font-semibold uppercase tracking-[0.3em] text-indigo-400">Calificaciones</span>
                <h1 class="mt-2 text-3xl font-bold text-white">Gestionar calificaciones · Grupo ${grupo?.nombre || ''}</h1>
                <p class="mt-2 text-sm text-gray-400">Actualiza rápidamente las notas del grupo seleccionado.</p>
            </section>

            <section class="overflow-hidden rounded-2xl border border-gray-700 bg-gray-900 shadow-xl shadow-black/10">
                <div class="flex items-center gap-3 border-b border-gray-800 bg-gray-800/80 px-5 py-4">
                    <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400"><i class="fa-solid fa-square-poll-vertical"></i></span>
                    <div>
                        <h2 class="text-lg font-semibold text-white">Listado de alumnos</h2>
                        <p class="text-sm text-gray-400">Edita y guarda una calificación por materia.</p>
                    </div>
                </div>
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-800">
                        <thead class="bg-gray-800/90">
                            <tr>
                                ${['Alumno', 'Materia', 'Nota', 'Acciones'].map(label => `<th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-gray-300">${label}</th>`).join('')}
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-800 bg-gray-900/80">
                            ${session.calificaciones.filter(c => c.grupo_id === grupoId).map(c => `
                                <tr class="transition hover:bg-gray-800/70">
                                    <td class="px-4 py-3 text-sm font-medium text-white">${session.users.find(u => u.id === c.alumno_id)?.name || 'N/A'}</td>
                                    <td class="px-4 py-3 text-sm text-gray-200">${c.materia}</td>
                                    <td class="px-4 py-3 text-sm text-gray-200"><input type="number" value="${c.nota}" class="${inputSmall}" min="0" max="10" step="0.1"></td>
                                    <td class="px-4 py-3 text-sm text-gray-200">
                                        <button class="${saveButton}" onclick="saveGrade(${c.id})"><i class="fa-solid fa-floppy-disk"></i><span>Guardar</span></button>
                                    </td>
                                </tr>`).join('')}
                        </tbody>
                    </table>
                </div>
            </section>

            <button class="${backButton}" onclick="location.hash = '#/home'"><i class="fa-solid fa-arrow-left"></i><span>Volver</span></button>
        </div>
    `;
    return PrivateLayout(content);
}

window.saveGrade = function(gradeId) {
    alert('Calificación guardada exitosamente');
};
