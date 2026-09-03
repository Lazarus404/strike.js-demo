/** Normalize DataGrid column aliases to a single shape. */
export function normalizeColumn(col) {
	if (!col || typeof col !== 'object') {
		throw new Error('column required');
	}
	const field = col.field != null ? col.field : col.key;
	if (field == null || field === '') {
		throw new Error('column field or key required');
	}
	const headerName =
		col.headerName !== undefined ? col.headerName : col.label;
	const renderCell =
		col.renderCell !== undefined ? col.renderCell : col.render;
	return {
		...col,
		field: String(field),
		headerName,
		renderCell,
		type: col.type || 'string',
		sortable: col.sortable !== false,
		filterable: col.filterable !== false,
		editable: !!col.editable
	};
}

export function getCellValue(row, col) {
	if (col.valueGetter) return col.valueGetter(row);
	return row[col.field];
}

export function formatCell(row, col) {
	const value = getCellValue(row, col);
	if (col.valueFormatter) return col.valueFormatter(value, row);
	if (col.type === 'boolean') return value ? 'Yes' : 'No';
	if (col.type === 'date' && value != null && value !== '') {
		const d = value instanceof Date ? value : new Date(value);
		if (!Number.isNaN(d.getTime())) return d.toLocaleDateString();
	}
	if (value == null) return '';
	return String(value);
}

export function defaultAlign(type) {
	return type === 'number' ? 'right' : 'left';
}

/** Derived-only columns need valueSetter to be editable. */
export function isColumnEditable(col) {
	if (!col.editable) return false;
	if (col.valueGetter && !col.valueSetter) return false;
	return true;
}

/** Clamp a pixel width using column minWidth / maxWidth (defaults 50 / none). */
export function clampColumnWidth(col, px) {
	const n = Number(px);
	const width = Number.isFinite(n) ? n : 50;
	const min =
		col && col.minWidth != null && Number.isFinite(Number(col.minWidth))
			? Number(col.minWidth)
			: 50;
	const max =
		col && col.maxWidth != null && Number.isFinite(Number(col.maxWidth))
			? Number(col.maxWidth)
			: Infinity;
	return Math.max(min, Math.min(max, Math.round(width)));
}
