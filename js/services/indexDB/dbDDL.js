export class DataBaseDDL {
    async select(connection, query) {
        try {
            return await connection.select(query);
        } catch (error) {
            console.error(`Error al consultar datos de la tabla ${query.from}:`, error);
            throw error;
        }
    }

    async insert(connection, query) {
        try {
            return await connection.insert(query);
        } catch (error) {
            console.error(`Error al insertar datos en la tabla ${query.into}:`, error);
            throw error;
        }
    }

    async update(connection, query) {
        try {
           return await connection.update(query);
        } catch (error) {
            console.error(`Error al actualizar datos en la tabla ${query.in}:`, error);
            throw error;
        }
    }

    async delete(connection, query) {
        try {
            return await connection.delete(query);
        } catch (error) {
            console.error(`Error al eliminar datos de la tabla ${query.from}:`, error);
            throw error;
        }
    }
}


