# SEAM

Aplicación web de página única (SPA) desarrollada con JavaScript puro (ES Modules) para la gestión de proyectos, tareas, usuarios y calificaciones.

## Tecnologías

- **Frontend:** HTML, CSS, JavaScript (ES Modules, sin frameworks)
- **Comunicación en tiempo real:** Socket.io
- **Routing:** Hash-based (`#/ruta`)
- **Backend (requerido):** API REST en `http://localhost:3000/api/v1`

## Módulos

| Módulo        | Descripción                              |
|---------------|------------------------------------------|
| Auth          | Inicio de sesión y sesión persistente    |
| Usuarios      | Gestión de usuarios del sistema          |
| Roles         | Asignación y administración de roles     |
| Permisos      | Control de acceso granular               |
| Proyectos     | Gestión de proyectos                     |
| Tareas        | Administración de tareas por proyecto    |
| Calificaciones| Registro y consulta de calificaciones    |
| Reportes      | Generación de reportes                   |

## Cómo ejecutar

1. Asegúrate de tener el servidor backend corriendo en `http://localhost:3000`.
2. Abre `index.html` en un servidor local (por ejemplo, con la extensión Live Server de VS Code).
3. Accede a la aplicación en el navegador.

> **Nota:** No abrir `index.html` directamente como archivo (`file://`) ya que los ES Modules requieren un servidor HTTP.

## Estructura del proyecto

```
SEAM/
├── index.html
├── styles.css
├── css/
│   ├── components/
│   ├── layout/
│   └── pages/
└── js/
    ├── main.js
    ├── config/        # Configuración de la API
    ├── core/          # Router y EventBus
    ├── layout/        # Componentes de estructura
    ├── pages/         # Vistas por módulo
    ├── repositories/  # Acceso a datos
    ├── services/      # Lógica de negocio
    ├── shared/        # Componentes reutilizables
    └── state/         # Estado global de sesión
```
