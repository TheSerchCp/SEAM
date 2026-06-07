export function Table({ columns = [], rows = [], tbodyId = 'table-body', emptyMessage = 'Sin datos', actions = null }) {
    if (!rows || rows.length === 0) {
        return `
            <div class="overflow-hidden rounded-lg border border-gray-700/60 bg-gray-900/80 shadow-lg shadow-black/20">
                <div class="flex items-center justify-center px-6 py-12">
                    <div class="text-center">
                        <i class="fa-solid fa-inbox text-4xl text-gray-600 mb-4 block"></i>
                        <p class="text-sm text-gray-400">${emptyMessage}</p>
                    </div>
                </div>
            </div>
        `;
    }

    // Desktop table view
    const tableHtml = `
        <div class="hidden md:block rounded-lg border border-gray-700/60 bg-gray-900/80 shadow-lg shadow-black/20">
            <table class="w-full divide-y divide-gray-700/40">
                    <thead class="bg-gray-800/60 sticky top-0 z-10">
                        <tr>
                            ${columns.map(col => `
                                <th class="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-300 first:rounded-tl-lg last:rounded-tr-lg">
                                    ${col.label}
                                </th>
                            `).join('')}
                            ${actions ? '<th class="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider text-gray-300 last:rounded-tr-lg">Acciones</th>' : ''}
                        </tr>
                    </thead>
                    <tbody id="${tbodyId}" class="divide-y divide-gray-700/40 bg-gray-900">
                        ${rows.map((row, idx) => `
                            <tr class="border-b border-gray-700/40 transition hover:bg-gray-800/70 ${idx % 2 === 1 ? 'bg-gray-900/50' : ''}">
                                ${columns.map(col => `
                                    <td class="px-4 py-3 text-xs sm:text-sm font-medium text-gray-200 truncate max-w-xs">
                                        <span class="block truncate">${row[col.key] || '-'}</span>
                                    </td>
                                `).join('')}
                                ${actions ? `<td class="px-4 py-3 text-center text-sm text-gray-200">${actions(row)}</td>` : ''}
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
        </div>
    `;

    // Mobile card view with responsive grid
    const cardsHtml = `
        <div class="md:hidden grid grid-cols-1 xs:grid-cols-2 gap-3">
            ${rows.map((row) => `
                <div class="rounded-lg border border-gray-700/60 bg-gray-900/80 shadow-lg shadow-black/20 p-3 flex flex-col gap-2">
                    <div class="grid grid-cols-2 gap-x-2 gap-y-2">
                        ${columns.map(col => {
                            const value = row[col.key] || '-';
                            return `
                                <div class="flex flex-col gap-0.5 min-w-0">
                                    <span class="text-[10px] font-bold uppercase tracking-wider text-gray-400 truncate">${col.label}</span>
                                    <span class="text-xs font-medium text-gray-200 break-words line-clamp-2">${value}</span>
                                </div>
                            `;
                        }).join('')}
                    </div>
                    ${actions ? `
                        <div class="flex flex-wrap gap-1.5 pt-2 border-t border-gray-700/40 mt-auto">
                            ${actions(row)}
                        </div>
                    ` : ''}
                </div>
            `).join('')}
        </div>
    `;

    return `${tableHtml}${cardsHtml}`;
}
