import { PrivateLayout } from "../../layout/private.layout.js";

export async function ProyectosPage() {
    const grupoId = parseInt(location.hash.split('/')[2]);

    const content = `
        <div class="admin-page">
            <h1>Gestionar Proyectos - Grupo ${grupoId}</h1>
            
            <div class="form-section">
                <h2>Crear Nuevo Proyecto</h2>
                <form id="proyecto-form">
                    <div class="flex flex-col">
                        <label>Nombre del Proyecto</label>
                        <input type="text" name="nombre" class="input-base" required>
                    </div>
                    <div class="flex flex-col">
                        <label>Descripción</label>
                        <textarea name="descripcion" class="input-base" rows="4" required></textarea>
                    </div>
                    <div class="flex flex-col">
                        <label>Fecha de Entrega</label>
                        <input type="date" name="fecha_entrega" class="input-base" required>
                    </div>
                    <button type="submit" class="btn-success">Crear Proyecto</button>
                </form>
            </div>

            <h2>Proyectos del Grupo</h2>
            <p>No hay proyectos creados aún</p>

            <button class="btn-default" onclick="location.hash = '#/home'">Volver</button>
        </div>
    `;
    return PrivateLayout(content);
}

document.addEventListener('submit', (e) => {
    if (e.target.id === 'proyecto-form') {
        e.preventDefault();
        alert('Proyecto creado exitosamente');
    }
});
