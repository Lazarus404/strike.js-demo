import { getCellValue } from './grid-columns.js';

function normalizeCol(col) {
	if (typeof col === 'string') return { field: col, headerName: col };
	return col;
}

function escapeCsvField(value) {
	const s = value == null ? '' : String(value);
	if (/[",\n\r]/.test(s)) return '"' + s.replace(/"/g, '""') + '"';
	return s;
}

export function rowsToCsv(rows, columns) {
	const cols = columns.map(normalizeCol);
	const header = cols
		.map(c => escapeCsvField(c.headerName != null ? c.headerName : c.field))
		.join(',');
	const lines = [header];
	for (const row of rows) {
		lines.push(cols.map(c => escapeCsvField(getCellValue(row, c))).join(','));
	}
	return lines.join('\n');
}
