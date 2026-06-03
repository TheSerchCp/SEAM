import { PrivateLayout } from "../../layout/private.layout.js";
import { state } from "../../services/general/state.js";

export async function HomePage() {
    // Cargar usuario desde localStorage si no existe en state
    if (!state.user) {
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
            state.user = JSON.parse(storedUser);
        }
    }

    let content = '';

    if (state.user?.role === 'admin') {
        content = renderAdminHome();
    } else if (state.user?.role === 'profesor') {
        content = renderProfesorHome();
    } else if (state.user?.role === 'alumno') {
        content = renderAlumnoHome();
    }

    return PrivateLayout(content);
}

function renderAdminHome() {
    const totalGrupos = state.grupos.length;
    const totalAlumnos = state.grupos.reduce((sum, g) => sum + g.alumnos, 0);
    const totalReprobados = state.grupos.reduce((sum, g) => sum + g.reprobados, 0);
    const promediaGeneral = (state.grupos.reduce((sum, g) => sum + g.promedio, 0) / state.grupos.length).toFixed(2);

    return `
        <div class="dashboard">
            <h1>Dashboard Admin</h1>
            <p>Bienvenido, ${state.user.name}</p>

            <div class="metrics-grid">
                <div class="metric-card">
                    <h3>${totalGrupos}</h3>
                    <p>Total de Grupos</p>
                </div>
                <div class="metric-card">
                    <h3>${totalAlumnos}</h3>
                    <p>Total de Alumnos</p>
                </div>
                <div class="metric-card">
                    <h3>${totalReprobados}</h3>
                    <p>Reprobados</p>
                </div>
                <div class="metric-card">
                    <h3>${promediaGeneral}</h3>
                    <p>Promedio General</p>
                </div>
            </div>

            <h2>Grupos</h2>
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Grupo</th>
                            <th>Alumnos</th>
                            <th>Promedio</th>
                            <th>Reprobados</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${state.grupos.map(g => `
                            <tr>
                                <td>${g.nombre}</td>
                                <td>${g.alumnos}</td>
                                <td>${g.promedio}</td>
                                <td>${g.reprobados}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>

            <div class="button-group">
                <a href="#/usuarios" class="btn-info">Gestionar Usuarios</a>
                <a href="#/reportes" class="btn-default">Ver Reportes</a>
                <a href="#/permisos" class="btn-warning">Asignar Permisos</a>
            </div>
        </div>
    `;
}

function renderProfesorHome() {
    const misGrupos = state.grupos.filter(g => g.profesor_id === state.user.id);

    return `
        <div class="dashboard">
            <h1>Panel Profesor</h1>
            <p>Bienvenido, ${state.user.name}</p>

            <h2>Mis Grupos</h2>
            <div class="cards-grid">
                ${misGrupos.map(g => `
                    <div class="group-card">
                        <h3>${g.nombre}</h3>
                        <p>Alumnos: ${g.alumnos}</p>
                        <p>Promedio: ${g.promedio}</p>
                        <div class="button-group-small">
                            <button class="btn-info btn-small" onclick="location.hash = '#/calificaciones/${g.id}'">Calificaciones</button>
                            <button class="btn-success btn-small" onclick="location.hash = '#/tareas/${g.id}'">Tareas</button>
                            <button class="btn-warning btn-small" onclick="location.hash = '#/proyectos/${g.id}'">Proyectos</button>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function renderAlumnoHome() {
    const misCalificaciones = state.calificaciones.filter(c => c.alumno_id === state.user.id);

    return `
        <div class="dashboard">
            <h1>Mi Historial Académico</h1>
            <p>Bienvenido, ${state.user.name}</p>

            <h2>Calificaciones por Semestre</h2>
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Materia</th>
                            <th>Nota</th>
                            <th>Semestre</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${misCalificaciones.map(c => `
                            <tr>
                                <td>${c.materia}</td>
                                <td>${c.nota}</td>
                                <td>${c.semestre}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>

            <h2>Tareas Pendientes</h2>
            <div class="tasks-list">
                ${state.tareas.map(t => `
                    <div class="task-item">
                        <h4>${t.titulo}</h4>
                        <p>${t.descripcion}</p>
                        <p><strong>Fecha: ${t.fecha_entrega}</strong></p>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}