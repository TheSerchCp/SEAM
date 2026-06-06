import { PrivateLayout } from '../../layout/PrivateLayout.js';
import { session } from '../../state/session.state.js';

const sectionCard = 'rounded-2xl border border-gray-700 bg-gray-900/90 p-6 shadow-xl shadow-black/10';
const tableWrap = 'overflow-hidden rounded-2xl border border-gray-700 bg-gray-900 shadow-xl shadow-black/10';
const actionLink = {
    info: 'inline-flex items-center justify-center gap-2 rounded-xl border border-blue-500 bg-blue-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-600',
    default: 'inline-flex items-center justify-center gap-2 rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-sm font-semibold text-gray-100 transition hover:bg-gray-700',
    warning: 'inline-flex items-center justify-center gap-2 rounded-xl border border-amber-500 bg-amber-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-amber-600',
    success: 'inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-500 bg-emerald-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600'
};

export async function HomePage() {
    if (!session.user) {
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
            const currentSession = JSON.parse(storedUser);
            session.user = currentSession.user ?? currentSession;
        }
    }

    let content = '';

    if (session.user?.role === 'admin') {
        content = renderAdminHome();
    } else if (session.user?.role === 'profesor') {
        content = renderProfesorHome();
    } else if (session.user?.role === 'alumno') {
        content = renderAlumnoHome();
    }

    return PrivateLayout(content);
}

function renderAdminHome() {
    const totalGrupos = session.grupos.length;
    const totalAlumnos = session.grupos.reduce((sum, g) => sum + g.alumnos, 0);
    const totalReprobados = session.grupos.reduce((sum, g) => sum + g.reprobados, 0);
    const promedioGeneral = (session.grupos.reduce((sum, g) => sum + g.promedio, 0) / session.grupos.length).toFixed(2);

    const metrics = [
        { icon: 'fa-people-group', value: totalGrupos, label: 'Total de grupos' },
        { icon: 'fa-user-graduate', value: totalAlumnos, label: 'Total de alumnos' },
        { icon: 'fa-triangle-exclamation', value: totalReprobados, label: 'Reprobados' },
        { icon: 'fa-chart-line', value: promedioGeneral, label: 'Promedio general' }
    ];

    return `
        <div class="space-y-8">
            <section class="${sectionCard}">
                <div class="flex flex-col gap-2 border-b border-gray-800 pb-5">
                    <span class="text-xs font-semibold uppercase tracking-[0.3em] text-blue-400">Dashboard</span>
                    <h1 class="text-3xl font-bold text-white">Panel administrativo</h1>
                    <p class="text-sm text-gray-400">Bienvenido, ${session.user.name}</p>
                </div>

                <div class="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    ${metrics.map(metric => `
                        <div class="rounded-2xl border border-gray-700 bg-gray-800/80 p-5 transition hover:-translate-y-1 hover:border-blue-500/40 hover:bg-gray-800">
                            <div class="flex items-center justify-between gap-4">
                                <span class="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                                    <i class="fa-solid ${metric.icon}"></i>
                                </span>
                                <span class="text-3xl font-bold text-white">${metric.value}</span>
                            </div>
                            <p class="mt-4 text-sm font-medium text-gray-400">${metric.label}</p>
                        </div>`).join('')}
                </div>
            </section>

            <section class="${sectionCard}">
                <div class="flex items-center gap-3 pb-5">
                    <span class="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
                        <i class="fa-solid fa-table-list"></i>
                    </span>
                    <div>
                        <h2 class="text-xl font-semibold text-white">Resumen por grupo</h2>
                        <p class="text-sm text-gray-400">Indicadores principales del ciclo actual</p>
                    </div>
                </div>
                <div class="${tableWrap}">
                    <div class="overflow-x-auto">
                        <table class="min-w-full divide-y divide-gray-800">
                            <thead class="bg-gray-800/90">
                                <tr>
                                    ${['Grupo', 'Alumnos', 'Promedio', 'Reprobados'].map(label => `<th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-gray-300">${label}</th>`).join('')}
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-800 bg-gray-900/80">
                                ${session.grupos.map(g => `
                                    <tr class="transition hover:bg-gray-800/70">
                                        <td class="px-4 py-3 text-sm font-medium text-white">${g.nombre}</td>
                                        <td class="px-4 py-3 text-sm text-gray-200">${g.alumnos}</td>
                                        <td class="px-4 py-3 text-sm text-gray-200">${g.promedio}</td>
                                        <td class="px-4 py-3 text-sm text-gray-200">${g.reprobados}</td>
                                    </tr>`).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div class="mt-6 grid gap-3 md:grid-cols-3">
                    <a href="#/usuarios" class="${actionLink.info}"><i class="fa-solid fa-users"></i><span>Gestionar Usuarios</span></a>
                    <a href="#/reportes" class="${actionLink.default}"><i class="fa-solid fa-chart-pie"></i><span>Ver Reportes</span></a>
                    <a href="#/permisos" class="${actionLink.warning}"><i class="fa-solid fa-key"></i><span>Asignar Permisos</span></a>
                </div>
            </section>
        </div>
    `;
}

function renderProfesorHome() {
    const misGrupos = session.grupos.filter(g => g.profesor_id === session.user.id);

    return `
        <div class="space-y-8">
            <section class="${sectionCard}">
                <span class="text-xs font-semibold uppercase tracking-[0.3em] text-blue-400">Profesor</span>
                <h1 class="mt-2 text-3xl font-bold text-white">Panel docente</h1>
                <p class="mt-2 text-sm text-gray-400">Bienvenido, ${session.user.name}</p>
            </section>

            <section class="space-y-4">
                <div class="flex items-center gap-3">
                    <span class="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                        <i class="fa-solid fa-chalkboard-user"></i>
                    </span>
                    <div>
                        <h2 class="text-xl font-semibold text-white">Mis grupos</h2>
                        <p class="text-sm text-gray-400">Accesos rápidos para gestionar tus clases</p>
                    </div>
                </div>
                <div class="grid gap-4 lg:grid-cols-2">
                    ${misGrupos.map(g => `
                        <article class="rounded-2xl border border-gray-700 bg-gray-900/90 p-6 shadow-xl shadow-black/10 transition hover:-translate-y-1 hover:border-blue-500/30">
                            <div class="flex items-start justify-between gap-4">
                                <div>
                                    <h3 class="text-xl font-semibold text-white">${g.nombre}</h3>
                                    <p class="mt-2 text-sm text-gray-400">Alumnos: ${g.alumnos}</p>
                                    <p class="text-sm text-gray-400">Promedio: ${g.promedio}</p>
                                </div>
                                <span class="rounded-full border border-gray-700 bg-gray-800 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gray-300">Grupo</span>
                            </div>
                            <div class="mt-6 grid gap-3 sm:grid-cols-3">
                                <button class="${actionLink.info}" onclick="location.hash = '#/calificaciones/${g.id}'"><i class="fa-solid fa-square-poll-vertical"></i><span>Calificaciones</span></button>
                                <button class="${actionLink.success}" onclick="location.hash = '#/tareas/${g.id}'"><i class="fa-solid fa-list-check"></i><span>Tareas</span></button>
                                <button class="${actionLink.warning}" onclick="location.hash = '#/proyectos/${g.id}'"><i class="fa-solid fa-diagram-project"></i><span>Proyectos</span></button>
                            </div>
                        </article>`).join('')}
                </div>
            </section>
        </div>
    `;
}

function renderAlumnoHome() {
    const misCalificaciones = session.calificaciones.filter(c => c.alumno_id === session.user.id);

    return `
        <div class="space-y-8">
            <section class="${sectionCard}">
                <span class="text-xs font-semibold uppercase tracking-[0.3em] text-blue-400">Alumno</span>
                <h1 class="mt-2 text-3xl font-bold text-white">Mi historial académico</h1>
                <p class="mt-2 text-sm text-gray-400">Bienvenido, ${session.user.name}</p>
            </section>

            <section class="${sectionCard}">
                <div class="flex items-center gap-3 pb-5">
                    <span class="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400"><i class="fa-solid fa-book-open-reader"></i></span>
                    <div>
                        <h2 class="text-xl font-semibold text-white">Calificaciones por semestre</h2>
                        <p class="text-sm text-gray-400">Consulta tus resultados más recientes</p>
                    </div>
                </div>
                <div class="${tableWrap}">
                    <div class="overflow-x-auto">
                        <table class="min-w-full divide-y divide-gray-800">
                            <thead class="bg-gray-800/90">
                                <tr>
                                    ${['Materia', 'Nota', 'Semestre'].map(label => `<th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-gray-300">${label}</th>`).join('')}
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-800 bg-gray-900/80">
                                ${misCalificaciones.map(c => `
                                    <tr class="transition hover:bg-gray-800/70">
                                        <td class="px-4 py-3 text-sm font-medium text-white">${c.materia}</td>
                                        <td class="px-4 py-3 text-sm text-gray-200">${c.nota}</td>
                                        <td class="px-4 py-3 text-sm text-gray-200">${c.semestre}</td>
                                    </tr>`).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            <section class="${sectionCard}">
                <div class="flex items-center gap-3 pb-5">
                    <span class="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400"><i class="fa-solid fa-list-check"></i></span>
                    <div>
                        <h2 class="text-xl font-semibold text-white">Tareas pendientes</h2>
                        <p class="text-sm text-gray-400">Mantente al día con tus entregas</p>
                    </div>
                </div>
                <div class="space-y-4">
                    ${session.tareas.map(t => `
                        <article class="rounded-2xl border-l-4 border-blue-500 bg-gray-800/80 p-5 transition hover:border-cyan-400 hover:bg-gray-800">
                            <div class="flex items-center justify-between gap-3">
                                <h4 class="text-lg font-semibold text-white">${t.titulo}</h4>
                                <span class="rounded-full bg-gray-900 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gray-300">Pendiente</span>
                            </div>
                            <p class="mt-3 text-sm text-gray-300">${t.descripcion}</p>
                            <p class="mt-3 text-sm font-semibold text-cyan-300"><i class="fa-regular fa-calendar mr-2"></i>Fecha: ${t.fecha_entrega}</p>
                        </article>`).join('')}
                </div>
            </section>
        </div>
    `;
}
