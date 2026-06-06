import { PrivateLayout } from '../../layout/PrivateLayout.js';

export async function Error404Page() {
    return PrivateLayout(`
        <div class="flex min-h-[60vh] flex-col items-center justify-center rounded-2xl border border-gray-700 bg-gray-900/90 px-6 py-12 text-center shadow-xl shadow-black/10">
            <span class="bg-gradient-to-r from-red-500 to-rose-400 bg-clip-text text-8xl font-black leading-none text-transparent sm:text-9xl">404</span>
            <h2 class="mt-6 text-3xl font-bold text-white">Página no encontrada</h2>
            <p class="mt-4 max-w-xl text-sm text-gray-400 sm:text-base">El contenido que intentas acceder no está disponible o la ruta no existe.</p>
            <button class="mt-8 inline-flex items-center justify-center gap-2 rounded-xl border border-blue-500 bg-blue-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-600" onclick="location.hash = '#/home'">
                <i class="fa-solid fa-house"></i>
                <span>Volver al Inicio</span>
            </button>
        </div>
    `);
}
