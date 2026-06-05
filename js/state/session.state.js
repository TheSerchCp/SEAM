export const session = {

    user: null,

    /** JWT devuelto por /auth/login. Se adjunta en cada petición a la API. */
    token: null,

    /**
     * Set<string> con los nameUri de permisos del usuario activo.
     * Se puebla al hacer login y se limpia al cerrar sesión.
     */
    permissions: null,

    /** Items de sidebar devueltos por /auth/login para el rol del usuario. */
    sidebarItems: null,

    users: [
        {
            id:1,
            email: "admin@example.com",
            name: "Admin User",
            password:"Admin123",
            role: "admin"
        },
        {
            id:2,
            email: "profesor@example.com",
            name: "Juan Profesor",
            password:"Profesor123",
            role: "profesor"
        },
        {
            id:3,
            email: "alumno@example.com",
            name: "Carlos Alumno",
            password:"Alumno123",
            role: "alumno"
        }
    ],

    roles: [
        {
            id:1,
            name: "admin",
            description: "Administrador del sistema"
        },
        {
            id: 2,
            name: "profesor",
            description: "Profesor encargado de impartir clases"
        },
        {
            id: 3,
            name: "alumno",
            description: "Alumno que recibe clases"
        }
    ],

    grupos: [
        { id: 1, nombre: "6A", profesor_id: 2, alumnos: 30, promedio: 7.8, reprobados: 3 },
        { id: 2, nombre: "6B", profesor_id: 2, alumnos: 28, promedio: 8.1, reprobados: 2 }
    ],

    calificaciones: [
        { id: 1, alumno_id: 3, grupo_id: 1, materia: "Matemática", nota: 8.5, semestre: 1 },
        { id: 2, alumno_id: 3, grupo_id: 1, materia: "Español", nota: 7.9, semestre: 1 }
    ],

    tareas: [
        { id: 1, profesor_id: 2, grupo_id: 1, titulo: "Tarea 1", descripcion: "Resolver ejercicios", fecha_entrega: "2026-06-15" }
    ],

    reportes: []

};
