import { Sidebar } from '../shared/components/sidebar.js';
import { Header }  from '../shared/components/header.js';
import { Footer }  from '../shared/components/footer.js';

export async function PrivateLayout(content) {
    return `
        <div class="flex min-h-screen flex-col bg-gray-950 text-gray-100">
            <!-- Header -->
            <header class="sticky top-0 z-50 h-16 border-b border-gray-800 bg-gray-900/95 shadow-lg shadow-black/20 backdrop-blur-sm">
                ${await Header()}
            </header>

            <!-- Main Container with Sidebar -->
            <div class="flex flex-1">
                <!-- Sidebar (Desktop only, fixed on left) -->
                ${await Sidebar()}

                <!-- Content Area -->
                <div class="min-w-0 flex-1 md:ml-72 flex flex-col">
                    <!-- Main Content -->
                    <main class="flex-1 min-w-0 px-4 py-5 sm:px-6 lg:px-8 pb-40 md:pb-6">
                        <div class="mx-auto w-full max-w-7xl">
                            ${content}
                        </div>
                    </main>

                    <!-- Footer (below content) -->
                    <footer class="border-t border-gray-800 bg-gray-900/95 shadow-lg shadow-black/20 backdrop-blur-sm">
                        ${await Footer()}
                    </footer>
                </div>
            </div>
        </div>
    `;
}
