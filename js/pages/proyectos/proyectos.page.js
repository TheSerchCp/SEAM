import { PrivateLayout } from '../../layout/PrivateLayout.js';
import { Table } from '../../shared/components/ui/Table.js';
import { InputField } from '../../shared/components/ui/InputField.js';
import { TextareaField } from '../../shared/components/ui/TextareaField.js';

const pageCard = 'rounded-2xl border border-gray-700 bg-gray-900/90 p-5 shadow-xl shadow-black/10 sm:p-6';
const createButton = 'inline-flex items-center justify-center gap-2 rounded-xl border border-amber-500 bg-amber-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-amber-600';
const backButton = 'inline-flex items-center justify-center gap-2 rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-sm font-semibold text-gray-100 transition hover:bg-gray-700';
const PROJECT_COLUMNS = [
    { label: 'Proyecto', key: 'nombre' },
    { label: 'Descripción', key: 'descripcion' },
    { label: 'Entrega', key: 'fecha_entrega' },
];

export async function ProyectosPage() {
    const grupoId = Number.parseInt(location.hash.split('/')[2] || '0', 10);
    const projectRows = [];

    const content = `
        <div class="space-y-6">
            <section class="${pageCard}">
                <span class="text-xs font-semibold uppercase tracking-[0.3em] text-amber-400">Proyectos</span>
                <h1 class="mt-2 text-2xl font-bold text-white sm:text-3xl">Gestionar proyectos · Grupo ${grupoId}</h1>
                <p class="mt-2 text-sm text-gray-400">Centraliza propuestas, entregas y seguimiento con formularios más claros y una tabla lista para móvil.</p>
            </section>

            <section class="${pageCard}">
                <div class="mb-5 flex items-center gap-3">
                    <span class="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400"><i class="fa-solid fa-diagram-project"></i></span>
                    <div>
                        <h2 class="text-xl font-semibold text-white">Crear nuevo proyecto</h2>
                        <p class="text-sm text-gray-400">Define el nombre, contexto y fecha compromiso.</p>
                    </div>
                </div>
                <form id="proyecto-form" class="grid gap-4 md:grid-cols-2">
                    <div class="md:col-span-2">
                        ${InputField({ name: 'nombre', label: 'Nombre del Proyecto', placeholder: 'Ej. Plataforma de calificaciones', required: true })}
                    </div>
                    <div class="md:col-span-2">
                        ${TextareaField({ name: 'descripcion', label: 'Descripción', placeholder: 'Objetivo, alcance y entregables del proyecto', rows: 4, required: true, showCounter: true })}
                    </div>
                    <div class="md:max-w-xs">
                        ${InputField({ type: 'date', name: 'fecha_entrega', label: 'Fecha de Entrega', required: true })}
                    </div>
                    <div class="flex items-end">
                        <button type="submit" class="${createButton}"><i class="fa-solid fa-floppy-disk"></i><span>Crear Proyecto</span></button>
                    </div>
                </form>
            </section>

            <section class="${pageCard}">
                <div class="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div class="flex items-center gap-3">
                        <span class="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400"><i class="fa-regular fa-folder-open"></i></span>
                        <div>
                            <h2 class="text-xl font-semibold text-white">Proyectos del grupo</h2>
                            <p class="text-sm text-gray-400">Vista preparada para crecer sin romper la lectura en pantallas pequeñas.</p>
                        </div>
                    </div>
                    <span class="inline-flex w-fit items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-300">
                        <i class="fa-solid fa-table"></i>
                        Responsive
                    </span>
                </div>

                ${Table({
                    columns: PROJECT_COLUMNS,
                    rows: projectRows,
                    emptyMessage: 'No hay proyectos creados aún.'
                })}
            </section>

            <button class="${backButton}" onclick="location.hash = '#/home'"><i class="fa-solid fa-arrow-left"></i><span>Volver</span></button>
        </div>
    `;
    return PrivateLayout(content);
}

document.addEventListener('submit', (e) => {
    if (e.target.id === 'proyecto-form') {
        e.preventDefault();
        alert('Proyecto creado exitosamente');
        location.hash = location.hash;
    }
});
