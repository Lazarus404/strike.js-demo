import { getCellValue } from './grid-columns.js';

function isEmpty(v) {
	return v == null || v === '';
}

export function compareByType(a, b, type) {
	const aEmpty = isEmpty(a);
	const bEmpty = isEmpty(b);
	if (aEmpty && bEmpty) return 0;
	if (aEmpty) return 1;
	if (bEmpty) return -1;
	if (type === 'number') {
		return Number(a) - Number(b);
	}
	if (type === 'boolean') {
		return (a ? 1 : 0) - (b ? 1 : 0);
	}
	if (type === 'date') {
		const ta = new Date(a).getTime();
		const tb = new Date(b).getTime();
		return ta - tb;
	}
	return String(a).localeCompare(String(b));
}

function compareRows(rowA, rowB, col, dir) {
	if (col.sortComparator) {
		return (
			dir *
			col.sortComparator(
				getCellValue(rowA, col),
				getCellValue(rowB, col),
				rowA,
				rowB
			)
		);
	}
	return (
		dir *
		compareByType(
			getCellValue(rowA, col),
			getCellValue(rowB, col),
			col.type
		)
	);
}

export function applySort(rows, columns, sortModel) {
	if (!sortModel || !sortModel.length) return rows;
	const keys = [];
	for (const item of sortModel) {
		if (!item || !item.field) continue;
		const col = columns.find(c => c.field === item.field);
		if (!col) continue;
		const dir = item.sort === 'desc' ? -1 : 1;
		keys.push({ col, dir });
	}
	if (!keys.length) return rows;
	const out = rows.slice();
	out.sort((rowA, rowB) => {
		for (const { col, dir } of keys) {
			const r = compareRows(rowA, rowB, col, dir);
			if (r !== 0) return r;
		}
		return 0;
	});
	return out;
}

/** Cycle none -> asc -> desc -> none for a field. */
export function cycleSortModel(model, field, opts) {
	if (opts && opts.append) {
		const list = model ? model.slice() : [];
		const i = list.findIndex(item => item.field === field);
		if (i < 0) return [...list, { field, sort: 'asc' }];
		const cur = list[i];
		if (cur.sort === 'asc') {
			const next = list.slice();
			next[i] = { field, sort: 'desc' };
			return next;
		}
		const next = list.slice();
		next.splice(i, 1);
		return next;
	}
	const cur = model && model[0] && model[0].field === field ? model[0] : null;
	if (!cur) return [{ field, sort: 'asc' }];
	if (cur.sort === 'asc') return [{ field, sort: 'desc' }];
	return [];
}
