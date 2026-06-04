import { DataBaseDDL } from "../../services/indexDB/dbDDL.js";
import { connection } from "../../services/indexDB/databaseConnection.js";

class LoginRepository {
    constructor() {
        this.db = new DataBaseDDL();
    }

    /**
     * Busca un usuario por email
     * @param {string} email
     * @returns {Promise<Object|null>}
     */
    async findByEmail(email) {
        const results = await this.db.select(connection, {
            from: "users",
            where: { email: email }
        });
        return results.length > 0 ? results[0] : null;
    }

    /**
     * Valida credenciales, retorna el usuario o null
     * @param {string} email
     * @param {string} password
     * @returns {Promise<Object|null>}
     */
    async login(email, password) {
        let results = await this.db.select(connection, {
            from: "users",
            where: {
                email,
                password
            },
            join: [{
                with: "roles",
                on: "users.roleId=roles.idRole",
                type: "inner"
            }]
});
console.log("Resultados de login: ", results);
        results = results.map(user => {
            return {
                idUser: user.idUser,
                full_name: user.full_name,
                email: user.email,
                password: user.password,
                role: user.roleName,
                idRole: user.idRole
            };
        });
        return results.length > 0 ? results[0] : null;
    }

    /**
     * Registra un nuevo usuario
     * @param {{ full_name: string, email: string, password: string, idRole: number }} user
     * @returns {Promise<number>} filas insertadas
     */
    async register(user) {
        return await this.db.insert(connection, {
            into: "users",
            values: [user]
        });
    }

    /**
     * Actualiza la contraseña de un usuario
     * @param {string} email
     * @param {string} newPassword
     * @returns {Promise<number>} filas actualizadas
     */
    async updatePassword(email, newPassword) {
        return await this.db.update(connection, {
            in: "users",
            set: { password: newPassword },
            where: { email }
        });
    }

    /**
     * Elimina un usuario por email
     * @param {string} email
     * @returns {Promise<number>} filas eliminadas
     */
    async deleteByEmail(email) {
        return await this.db.delete(connection, {
            from: "users",
            where: { email }
        });
    }
}

export const loginRepository = new LoginRepository();
