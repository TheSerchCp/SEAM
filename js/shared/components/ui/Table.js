/**
 * Table — genera una tabla HTML desde columnas y filas.
 * @param {{ columns, rows, tbodyId?, emptyMessage?, actions? }} props
 * columns: Array<{ label, key }>
 * rows: Array<object>
 * actions: (row) => string HTML — columna de acciones opcional
 */
export function Table({ columns = [], rows = [], tbodyId = "table-body", emptyMessage = "Sin datos", actions = null }) {
    const headers = columns.map(c => `<th>${c.label}</th>`).join("");
    const actionsHeader = actions ? "<th>Acciones</th>" : "";

    const bodyRows = rows.length
        ? rows.map(row => {
            const cells = columns.map(c => `<td>${row[c.key] ?? ""}</td>`).join("");
            const actionsCell = actions ? `<td>${actions(row)}</td>` : "";
            return `<tr>${cells}${actionsCell}</tr>`;
        }).join("")
        : `<tr><td colspan="${columns.length + (actions ? 1 : 0)}">${emptyMessage}</td></tr>`;

    return `
    <div class="table-container">
        <table>
            <thead><tr>${headers}${actionsHeader}</tr></thead>
            <tbody id="${tbodyId}">${bodyRows}</tbody>
        </table>
    </div>`;
    }