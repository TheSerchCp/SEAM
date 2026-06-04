import { DataBaseDDL } from "../../services/indexDB/dbDDL.js";
import { connection } from "../../services/indexDB/databaseConnection.js";

class SideBarRepository {

    constructor() {
        this.db = new DataBaseDDL();    
    }

    /**
     * Obtiene los sidebar items por roleId usando JOIN
     * @param {number} roleId
     * @returns {Promise<Array<{name: string, link: string}>>}
     */
    async findItemsByRoleId(roleId) {
        const id = Number(roleId);
        const results = await this.db.select(connection, {
            from: "roleXItem",
            join: [{
                with: "sidebarItems",
                on: "roleXItem.itemId=sidebarItems.idItem",
                type: "inner"
            }],
            where: { roleId: id }
        });

        return results.map(r => ({ name: r.nameItem, link: r.route }));
    }

    /**
     * Obtiene los sidebar items por nombre de rol
     * @param {string} roleName  - "admin" | "profesor" | "alumno"
     * @returns {Promise<Array>}
     */
    async findItemsByRoleName(roleName) {
        return await this.db.select(connection, {
            from: "sidebarItems",
            join: [
                {
                    with: "roleXItem",
                    on: "sidebarItems.idItem=roleXItem.itemId",
                    type: "inner"
                },
                {
                    with: "roles",
                    on: "roleXItem.roleId=roles.idRole",
                    type: "inner"
                }
            ],
            where: { "roles.roleName": roleName }
        });
    }
}

export const sidebarRepository = new SideBarRepository();
