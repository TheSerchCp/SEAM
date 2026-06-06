import { PrivateLayout } from '../../layout/PrivateLayout.js';
import { generateReport } from '../../services/reportes.service.js';

const pageCard = 'rounded-2xl border border-gray-700 bg-gray-900/90 p-6 shadow-xl shadow-black/10';
const buttonStyles = {
    info: 'inline-flex items-center justify-center gap-2 rounded-xl border border-blue-500 bg-blue-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-600',
    success: 'inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-500 bg-emerald-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600',
    warning: 'inline-flex items-center justify-center gap-2 rounded-xl border border-amber-500 bg-amber-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-amber-600'
};

export async function ReportesPage() {
    const content = `
        <div class="space-y-6 rounded-2xl border border-gray-700 bg-gray-900/90 p-6 shadow-xl shadow-black/10">
            <div class="border-b border-gray-800 pb-5">
                <span class="text-xs font-semibold uppercase tracking-[0.3em] text-blue-400">Analítica</span>
                <h1 class="mt-2 text-3xl font-bold text-white">Reportes</h1>
                <p class="mt-2 text-sm text-gray-400">Genera vistas rápidas para desempeño, asistencia y riesgo académico.</p>
            </div>

            <div class="grid gap-3 md:grid-cols-3">
                <button class="${buttonStyles.info}" onclick="generateReport('desempenio')"><i class="fa-solid fa-chart-line"></i><span>Reporte Desempeño</span></button>
                <button class="${buttonStyles.success}" onclick="generateReport('asistencia')"><i class="fa-solid fa-user-check"></i><span>Reporte Asistencia</span></button>
                <button class="${buttonStyles.warning}" onclick="generateReport('reprobados')"><i class="fa-solid fa-triangle-exclamation"></i><span>Reporte Reprobados</span></button>
            </div>

            <div id="reports-container" class="rounded-2xl border border-gray-700 bg-gray-800/70 p-6 text-sm text-gray-300">
                <div class="flex items-center gap-3">
                    <span class="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-900 text-gray-400"><i class="fa-regular fa-folder-open"></i></span>
                    <p>No hay reportes generados aún</p>
                </div>
            </div>
        </div>
    `;
    return PrivateLayout(content);
}

window.generateReport = function(type) {
    generateReport(type);
    location.hash = '/reportes';
    alert(`Reporte de ${type} generado exitosamente`);
};
