export function pageCount(rowCount, pageSize) {
	const size = Math.max(1, pageSize | 0);
	const n = Math.max(0, rowCount | 0);
	return Math.max(1, Math.ceil(n / size) || 1);
}

export function applyPagination(rows, page, pageSize) {
	const size = Math.max(1, pageSize | 0);
	const count = pageCount(rows.length, size);
	const p = Math.max(0, Math.min(count - 1, page | 0));
	const start = p * size;
	return rows.slice(start, start + size);
}

export function clampPage(page, rowCount, pageSize) {
	const count = pageCount(rowCount, pageSize);
	return Math.max(0, Math.min(count - 1, page | 0));
}
