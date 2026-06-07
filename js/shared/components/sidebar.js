import { session }         from '../../state/session.state.js';
import { getSidebarItems } from '../../services/sidebar.service.js';
import { logout }          from '../../services/auth.service.js';
import { Modal }           from './Modal.js';

const ICONS = {
    home: 'house',
    usuarios: 'users',
    users: 'users',
    tareas: 'list-check',
    proyectos: 'diagram-project',
    roles: 'user-shield',
    permisos: 'shield-halved',
    permissions: 'shield-halved',
    reportes: 'chart-column',
    calificaciones: 'star'
};

function getIcon(name = '', link = '') {
    const key = String(link || name).split('/')[0]?.toLowerCase();
    return ICONS[key] || ICONS[String(name).toLowerCase()] || 'circle';
}

function isActive(link = '') {
    return location.hash.replace(/^#\/?/, '').startsWith(link);
}

export async function Sidebar() {
    const menuOptions = session.user ? getSidebarItems() : [];

    return `
        <!-- Mobile Floating Menu (Horizontal, Fixed Bottom) -->
        <nav class="fixed bottom-0 left-0 right-0 z-30 md:hidden flex flex-row max-w-fit mx-auto">
            <div class="m-4 flex items-center justify-center gap-2 bg-gray-900/95 backdrop-blur-sm border border-gray-800 rounded-full px-3 py-1 shadow-xl shadow-black/40 ">
                ${menuOptions.map(item => {
                    const active = isActive(item.link);
                    return `
                        <button
                            type="button"
                            onclick="navigateSidebar('${item.link}')"
                            class="group flex flex-col items-center justify-center gap-1 rounded-full px-6 py-2.5 text-center text-xs font-medium transition-all duration-200 hover:cursor-pointer ${active
                                ? 'bg-blue-500/30 text-blue-300 shadow-lg shadow-blue-500/20'
                                : 'text-gray-400 hover:bg-white/5 hover:text-white'
                            }"
                            title="${item.name}">
                            <i class="fa-solid fa-${getIcon(item.name, item.link)} text-lg"></i>
                            <span class="truncate text-[10px]">${item.name}</span>
                        </button>
                    `;
                }).join('')}
                
            </div>
                       
            <div class="m-4 px-2 flex  items-center justify-center bg-gray-900/95 backdrop-blur-sm border border-gray-800 rounded-full shadow-xl shadow-black/40">
                <button
                    type="button"
                    onclick="showLogoutModal()"
                    class="group flex flex-col items-center justify-center rounded-full px-6 py-3 text-center text-xs font-medium text-gray-400 transition-all duration-200 hover:bg-red-500/10 hover:text-red-400 hover:cursor-pointer"
                    title="Cerrar sesión">
                    <i class="fa-solid fa-sign-out-alt text-lg"></i>
                    <span class="truncate text-[10px]">Salir</span>
                </button>
            </div>
        </nav>

        <!-- Desktop Sidebar (Fixed Left) -->
        <aside class="hidden md:flex fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-72 flex-col border-r border-gray-800/80 bg-gray-950/95 shadow-2xl shadow-black/30 backdrop-blur-sm">
            <div class="flex h-full flex-col px-3 py-4 text-gray-200">
                <nav class="flex-1 overflow-y-auto pr-1">
                    <ul class="space-y-2">
                        ${menuOptions.map(item => {
                            const active = isActive(item.link);
                            return `
                                <li>
                                    <button
                                        type="button"
                                        onclick="navigateSidebar('${item.link}')"
                                        class="group flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition-all duration-200 ${active
                                            ? 'bg-blue-600/30 text-blue-300 shadow-lg shadow-blue-500/10'
                                            : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                        }"
                                        title="${item.name}">
                                        <i class="fa-solid fa-${getIcon(item.name, item.link)} text-base flex-shrink-0"></i>
                                        <span class="flex-1">${item.name}</span>
                                        ${active ? '<i class="fa-solid fa-chevron-right text-xs flex-shrink-0"></i>' : ''}
                                    </button>
                                </li>
                            `;
                        }).join('')}
                    </ul>
                </nav>

                <div class="border-t border-gray-800/60 pt-3">
                    <button
                        type="button"
                        onclick="showLogoutModal()"
                        class="group flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-gray-400 transition-all duration-200 hover:bg-red-500/10 hover:text-red-400">
                        <i class="fa-solid fa-sign-out-alt flex-shrink-0"></i>
                        <span>Cerrar sesión</span>
                    </button>
                </div>
            </div>
        </aside>

        <div id="sidebar-modal-container"></div>
    `;
}

window.navigateSidebar = (link) => {
    window.location.hash = `#/${link}`;
};

window.showLogoutModal = async () => {
    const container = document.getElementById('sidebar-modal-container');
    if (!container) return;

    container.innerHTML = await Modal({
        title: '¿Cerrar sesión?',
        body: '<p class="text-sm text-gray-300">¿Estás seguro de que deseas cerrar sesión?</p>',
        onConfirm: async () => {
            try {
                await logout();
                window.location.hash = '#/login';
                return { success: true };
            } catch (error) {
                return { success: false, error: error.message };
            }
        },
        confirmText: 'Cerrar sesión',
        isDanger: true,
    });
};
