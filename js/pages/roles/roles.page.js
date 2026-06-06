import { PrivateLayout } from '../../layout/PrivateLayout.js';
import { getRoles } from '../../services/roles.service.js';
import { session } from '../../state/session.state.js';
import { Table } from '../../shared/components/ui/Table.js';

const pageCard = 'rounded-2xl border border-gray-700 bg-gray-900/90 p-5 shadow-xl shadow-black/10 sm:p-6';
const ROLE_COLUMNS = [
    { label: 'ID', key: 'idRole' },
    { label: 'Rol', key: 'roleName' },
    { label: 'Descripción', key: 'description' },
];

export async function RolesPage() {
    let roles = [];

    try {
        roles = await getRoles();
    } catch {
        roles = session.roles.map(role => ({
            idRole: role.id,
            roleName: role.name,
            description: role.description,
        }));
    }

    return PrivateLayout(`
        <div class="space-y-6">
            <section class="${pageCard}">
                <div class="flex flex-col gap-4 border-b border-gray-800 pb-5 sm:flex-row sm:items-start sm:justify-between">
                    <div class="flex items-start gap-4">
                        <span class="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/10 text-2xl text-violet-400">
                            <i class="fa-solid fa-user-shield"></i>
                        </span>
                        <div>
                            <span class="text-xs font-semibold uppercase tracking-[0.3em] text-violet-400">Roles</span>
                            <h1 class="mt-2 text-2xl font-bold text-white sm:text-3xl">Gestionar roles</h1>
                            <p class="mt-2 max-w-2xl text-sm text-gray-400">Consulta los perfiles registrados en una tabla compacta, legible y lista para pantallas pequeñas.</p>
                        </div>
                    </div>
                    <span class="inline-flex w-fit items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1 text-xs font-semibold text-violet-300">
                        <i class="fa-solid fa-layer-group"></i>
                        ${roles.length} roles
                    </span>
                </div>
            </section>

            <section class="${pageCard}">
                ${Table({
                    columns: ROLE_COLUMNS,
                    rows: roles,
                    emptyMessage: 'No hay roles registrados en este momento.'
                })}
            </section>
        </div>
    `);
}
