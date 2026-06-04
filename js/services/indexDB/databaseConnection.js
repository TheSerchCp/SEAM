import { createSchema, seedDatabase } from "./schema.js";

const worker = new Worker("./js/utils/libraries/JsStore/jsstore.worker.js");
let connection = new JsStore.Connection(worker);

export async function initDatabase() {
    const isCreated = await connection.initDb(createSchema());
    console.log(isCreated ? "Base de datos creada" : "Base de datos ya existe");
    // Siempre ejecutar seed — ignore:true previene duplicados
    await seedDatabase(connection);
}

export { connection };
