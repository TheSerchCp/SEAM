import { PrivateLayout } from '../../layout/PrivateLayout.js';
import { session } from '../../state/session.state.js';
import { Table } from '../../shared/components/ui/Table.js';
import { InputField } from '../../shared/components/ui/InputField.js';
import { TextareaField } from '../../shared/components/ui/TextareaField.js';

const pageCard = 'rounded-2xl border border-gray-700 bg-gray-900/90 p-5 shadow-xl shadow-black/10 sm:p-6';
const createButton = 'inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-500 bg-emerald-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600';
const dangerSmall = 'inline-flex items-center justify-center gap-1.5 rounded-lg border border-red-500 bg-red-500 px-2.5 py-2 text-[11px] font-semibold text-white transition hover:bg-red-600';
const backButton = 'inline-flex items-center justify-center gap-2 rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-sm font-semibold text-gray-100 transition hover:bg-gray-700';
const TASK_COLUMNS = [
    { label: 'Título', key: 'titulo' },
    { label: 'Descripción', key: 'descripcion' },
    { label: 'Entrega', key: 'fecha_entrega' },
];

export async function TareasPage() {
    const grupoId = Number.parseInt(location.hash.split('/')[2] || '0', 10);
    const grupo = session.grupos.find(item => item.id === grupoId);
    const tasks = session.tareas.filter(task => task.grupo_id === grupoId);

    const content = `
        <div class="space-y-6">
            <section class="${pageCard}">
                <span class="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-400">Tareas</span>
                <h1 class="mt-2 text-2xl font-bold text-white sm:text-3xl">Gestionar tareas · Grupo ${grupo?.nombre || ''}</h1>
                <p class="mt-2 text-sm text-gray-400">Crea actividades y revisa entregas en una vista responsive con scroll horizontal solo cuando sea necesario.</p>
            </section>

            <section class="${pageCard}">
                <div class="mb-5 flex items-center gap-3">
                    <span class="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400"><i class="fa-solid fa-square-plus"></i></span>
                    <div>
                        <h2 class="text-xl font-semibold text-white">Crear nueva tarea</h2>
                        <p class="text-sm text-gray-400">Completa los campos para registrar una actividad.</p>
                    </div>
                </div>
                <form id="tarea-form" class="grid gap-4 md:grid-cols-2">
                    <div class="md:col-span-2">
                        ${InputField({ name: 'titulo', label: 'Título', placeholder: 'Ej. Investigación final', required: true })}
                    </div>
                    <div class="md:col-span-2">
                        ${TextareaField({ name: 'descripcion', label: 'Descripción', placeholder: 'Describe la actividad y los entregables', rows: 4, required: true, showCounter: true })}
                    </div>
                    <div class="md:max-w-xs">
                        ${InputField({ type: 'date', name: 'fecha_entrega', label: 'Fecha de Entrega', required: true })}
                    </div>
                    <div class="flex items-end">
                        <button type="submit" class="${createButton}"><i class="fa-solid fa-floppy-disk"></i><span>Crear Tarea</span></button>
                    </div>
                </form>
            </section>

            <section class="${pageCard}">
                <div class="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div class="flex items-center gap-3">
                        <span class="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400"><i class="fa-solid fa-list-check"></i></span>
                        <div>
                            <h2 class="text-xl font-semibold text-white">Tareas del grupo</h2>
                            <p class="text-sm text-gray-400">Tabla compacta y adaptable para consultas rápidas.</p>
                        </div>
                    </div>
                    <span class="inline-flex w-fit items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-300">
                        <i class="fa-solid fa-layer-group"></i>
                        ${tasks.length} registradas
                    </span>
                </div>

                ${Table({
                    columns: TASK_COLUMNS,
                    rows: tasks,
                    emptyMessage: 'No hay tareas registradas para este grupo.',
                    actions: (task) => `<button class="${dangerSmall}" onclick="deleteTarea(${task.id})"><i class="fa-solid fa-trash"></i><span>Eliminar</span></button>`
                })}
            </section>

            <button class="${backButton}" onclick="location.hash = '#/home'"><i class="fa-solid fa-arrow-left"></i><span>Volver</span></button>
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
