export async function Footer() {
    return `
        <p class="flex items-center justify-center gap-2 px-4 py-4 text-center text-xs uppercase tracking-[0.3em] text-gray-400">
            <i class="fa-regular fa-copyright"></i>
            <span>${new Date().getFullYear()} SEAM</span>
        </p>`;
}
