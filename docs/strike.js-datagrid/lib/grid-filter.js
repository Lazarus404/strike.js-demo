import { getCellValue, formatCell } from './grid-columns.js';

export function applyQuickFilter(rows, columns, query) {
	const q = query == null ? '' : String(query).trim().toLowerCase();
	if (!q) return rows;
	const cols = columns.filter(c => c.filterable !== false);
	return rows.filter(row =>
		cols.some(col => {
			const text = String(formatCell(row, col)).toLowerCase();
			return text.includes(q);
		})
	);
}

function toNumber(v) {
	const n = Number(v);
	return Number.isFinite(n) ? n : NaN;
}

function toTime(v) {
	const d = v instanceof Date ? v : new Date(v);
	const t = d.getTime();
	return Number.isNaN(t) ? NaN : t;
}

function compareOrdered(cellValue, filterValue, type) {
	if (type === 'number') {
		return toNumber(cellValue) - toNumber(filterValue);
	}
	if (type === 'date') {
		return toTime(cellValue) - toTime(filterValue);
	}
	return String(cellValue ?? '').localeCompare(String(filterValue ?? ''));
}

function equalsValue(cellValue, filterValue, type) {
	if (type === 'number') {
		return toNumber(cellValue) === toNumber(filterValue);
	}
	if (type === 'date') {
		return toTime(cellValue) === toTime(filterValue);
	}
	if (type === 'boolean') {
		return !!cellValue === !!filterValue;
	}
	return String(cellValue ?? '') === String(filterValue ?? '');
}

function matchFilter(cellValue, item, type) {
	const op = item.operator;
	const fv = item.value;
	if (op === 'contains') {
		return String(cellValue ?? '')
			.toLowerCase()
			.includes(String(fv ?? '').toLowerCase());
	}
	if (op === 'startsWith') {
		return String(cellValue ?? '')
			.toLowerCase()
			.startsWith(String(fv ?? '').toLowerCase());
	}
	if (op === 'equals') return equalsValue(cellValue, fv, type);
	if (op === '>') return compareOrdered(cellValue, fv, type) > 0;
	if (op === '>=') return compareOrdered(cellValue, fv, type) >= 0;
	if (op === '<') return compareOrdered(cellValue, fv, type) < 0;
	if (op === '<=') return compareOrdered(cellValue, fv, type) <= 0;
	return true;
}

export function applyFilterModel(rows, columns, filterModel) {
	const items = filterModel && filterModel.items;
	if (!items || !items.length) return rows;
	return rows.filter(row =>
		items.every(item => {
			if (!item || !item.field) return true;
			const col = columns.find(c => c.field === item.field);
			if (!col) return true;
			return matchFilter(getCellValue(row, col), item, col.type);
		})
	);
}
