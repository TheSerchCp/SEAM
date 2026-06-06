import { session } from '../../state/session.state.js';

export async function Header() {
    return `
        <div class="flex h-full items-center justify-between gap-4 px-4 sm:px-6">
            <div class="flex items-center gap-3">
                <span class="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-500/30 bg-blue-500/10 text-blue-400 shadow-lg shadow-blue-500/10">
                    <i class="fa-solid fa-graduation-cap"></i>
                </span>
                <div>
                    <span class="block text-lg font-bold tracking-[0.3em] text-white">SEAM</span>
                    <span class="block text-xs uppercase tracking-[0.25em] text-gray-400">Sistema Escolar</span>
                </div>
            </div>
            ${session.user ? `
                <div class="flex items-center gap-3 rounded-xl border border-gray-700 bg-gray-800 px-4 py-2 text-sm text-gray-200 shadow-lg shadow-black/10">
                    <span class="flex h-9 w-9 items-center justify-center rounded-full bg-gray-700 text-blue-400">
                        <i class="fa-solid fa-user"></i>
                    </span>
                    <div class="hidden text-right sm:block">
                        <span class="block text-xs uppercase tracking-wide text-gray-400">Sesión activa</span>
                        <span class="block font-medium text-white">${session.user.full_name ?? session.user.email ?? ''}</span>
                    </div>
                </div>` : ''}
        </div>
    `;
}
