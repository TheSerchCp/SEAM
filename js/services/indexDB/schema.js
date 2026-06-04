const dbName = "seam";

export function createSchema() {
 const tables = [
    {
        name: "users",
        columns: {
            idUser:    { primaryKey: true, autoIncrement: true },
            full_name: { dataType: "string" },
            email:     { dataType: "string", unique: true },
            password:  { dataType: "string" },
            roleId:    { dataType: "number" }
        }
    },
    {
        name: "roles",
        columns: {
            idRole:            { primaryKey: true, autoIncrement: true },
            roleName:          { dataType: "string", unique: true },
            description:       { dataType: "string" },
            idRoleXPermission: { dataType: "number" }
        }
    },
    {
        name: "permissions",
        columns: {
            idPermission:      { primaryKey: true, autoIncrement: true },
            nameUri:           { dataType: "string", unique: true },
            description:       { dataType: "string" },
            idPermissionXRole: { dataType: "number" }
        }
    },
    {
        name: "permissionXRole",
        columns: {
            idPermXRole:  { primaryKey: true, autoIncrement: true },
            roleId:       { dataType: "number" },
            permissionId: { dataType: "number" }
        }
    },
    {
        name: "roleXItem",
        columns: {
            idRoleXItem: { primaryKey: true, autoIncrement: true },
            roleId:      { dataType: "number" },
            itemId:      { dataType: "number" }
        }
    },
    {
        name: "sidebarItems",
        columns: {
            idItem:      { primaryKey: true, autoIncrement: true },
            nameItem:    { dataType: "string" },
            iconItem:    { dataType: "string" },
            route:       { dataType: "string" },
            idItemXRole: { dataType: "number" }
        }
    }
 ];

 const db = {
    name: dbName,
    tables: tables,
    version: 5
 };

 return db;
}

export async function seedDatabase(connection) {
    await connection.insert({
        into: "roles",
        ignore: true,
        values: [
            { idRole: 1, roleName: "admin",    description: "Administrador del sistema",            idRoleXPermission: 0 },
            { idRole: 2, roleName: "profesor", description: "Profesor encargado de impartir clases", idRoleXPermission: 0 },
            { idRole: 3, roleName: "alumno",   description: "Alumno que recibe clases",              idRoleXPermission: 0 }
        ]
    });

    await connection.insert({
        into: "users",
        ignore: true,
        values: [
            { idUser: 1, full_name: "Admin User",    email: "admin@example.com",    password: "Admin123",    roleId: 1 },
            { idUser: 2, full_name: "Juan Profesor",  email: "profesor@example.com", password: "Profesor123", roleId: 2 },
            { idUser: 3, full_name: "Carlos Alumno",  email: "alumno@example.com",   password: "Alumno123",   roleId: 3 }
        ]
    });

    await connection.insert({
        into: "sidebarItems",
        ignore: true,
        values: [
            { idItem: 1, nameItem: "Home",           iconItem: "", route: "home",           idItemXRole: 0 },
            { idItem: 2, nameItem: "Usuarios",        iconItem: "", route: "usuarios",        idItemXRole: 0 },
            { idItem: 3, nameItem: "Reportes",        iconItem: "", route: "reportes",        idItemXRole: 0 },
            { idItem: 4, nameItem: "Permisos",        iconItem: "", route: "permisos",        idItemXRole: 0 },
            { idItem: 5, nameItem: "Calificaciones",  iconItem: "", route: "calificaciones",  idItemXRole: 0 },
            { idItem: 6, nameItem: "Tareas",          iconItem: "", route: "tareas",          idItemXRole: 0 },
            { idItem: 7, nameItem: "Mi Historial",    iconItem: "", route: "home",            idItemXRole: 0 }
        ]
    });

    // admin(1): Home, Usuarios, Reportes, Permisos
    // profesor(2): Home, Calificaciones, Tareas
    // alumno(3): Home, Mi Historial
    const inserted = await connection.insert({
        into: "roleXItem",
        ignore: true,
        values: [
            { idRoleXItem: 1,  roleId: 1, itemId: 1 },
            { idRoleXItem: 2,  roleId: 1, itemId: 2 },
            { idRoleXItem: 3,  roleId: 1, itemId: 3 },
            { idRoleXItem: 4,  roleId: 1, itemId: 4 },
            { idRoleXItem: 5,  roleId: 2, itemId: 1 },
            { idRoleXItem: 6,  roleId: 2, itemId: 5 },
            { idRoleXItem: 7,  roleId: 2, itemId: 6 },
            { idRoleXItem: 8,  roleId: 3, itemId: 1 },
            { idRoleXItem: 9,  roleId: 3, itemId: 7 }
        ]
    });
}

