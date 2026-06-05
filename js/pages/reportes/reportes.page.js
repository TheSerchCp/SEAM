import { PrivateLayout } from "../../layout/PrivateLayout.js";
import { generateReport } from '../../services/reportes.service.js';

export async function ReportesPage() {
    const content = `
        <div class="admin-page">
            <h1>Reportes</h1>
            
            <div class="button-group">
                <button class="btn-info" onclick="generateReport('desempenio')">Reporte Desempeño</button>
                <button class="btn-success" onclick="generateReport('asistencia')">Reporte Asistencia</button>
                <button class="btn-warning" onclick="generateReport('reprobados')">Reporte Reprobados</button>
            </div>

            <h2>Reportes Generados</h2>
            <div id="reports-container" class="reports-list">
                <p>No hay reportes generados aún</p>
            </div>
        </div>
    `;
    return PrivateLayout(content);
}

window.generateReport = function(type) {
    generateReport(type);
    location.hash = "/reportes";
    alert(`Reporte de ${type} generado exitosamente`);
};
