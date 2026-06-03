export const state = {

    user: null,

    users: [
        {
            id:1,
            email: "admin@school.com",
            name: "Admin User",
            password:"admin123",
            role: "admin"
        },
        {
            id:2,
            email: "profesor@school.com",
            name: "Juan Profesor",
            password:"profesor123",
            role: "profesor"
        },
        {
            id:3,
            email: "alumno@school.com",
            name: "Carlos Alumno",
            password:"alumno123",
            role: "alumno"
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