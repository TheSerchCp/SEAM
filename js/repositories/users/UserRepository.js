import { DataBaseDDL } from "../../services/indexDB/dbDDL.js";
import { connection } from "../../services/indexDB/databaseConnection.js";

class UserRepository {
    constructor() {
        this.db = new DataBaseDDL();
    }

    //Registrar un usuario
    async registerUser(user) {
        const { name, email, password, role } = user;
        return await this.db.insert(connection, {
            into: "users",
            values: [{ full_name:name, email:email, password:password, roleId:role }]
        });
    }

    //Modificar usuario
    async updateUser(id, updatedFields) {
        return await this.db.update(connection, {
            in: "users",
            set: updatedFields,
            where: { idUser: id }
        });
    }

    //Obtener un usuario por su email
    async getUserByEmail(email) {
        const results = await this.db.select(connection, {
            from: "users",
            where: { email }
        });
        return results[0] || null;
    }

    //Obtener un usuario por su id
    async getUserById(id) {
        const results = await this.db.select(connection, {
            from: "users",
            where: { idUser: id }
        });
        return results[0] || null;
    }

    async getRoles(){
        let results = await this.db.select(connection, {
             from: "roles"
        });
        
        results = results.map(rol => ({
            idRole: rol.idRole,
            roleName: rol.roleName,
        }))
        return results;
    }

    async getAllUsers() {
        let results = await this.db.select(connection,{
            from: "users",
            join: [{
                with: "roles",
                on: "users.roleId=roles.idRole",
                type:"inner"
            }]
        })
        console.log("Usuarios obtenidos: ", results)
        results = results.map(user => ({
            idUser: user.idUser,
            full_name: user.full_name,
            email: user.email,
            roleName: user.roleName
        }))
        return results;
    }
}

export const userRepository = new UserRepository();