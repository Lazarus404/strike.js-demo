export function moveItem(order, fromId, toIndex) {
	const list = order ? order.slice() : [];
	const from = list.indexOf(fromId);
	if (from < 0) return list;
	list.splice(from, 1);
	const idx = Math.max(0, Math.min(toIndex, list.length));
	list.splice(idx, 0, fromId);
	return list;
}

export function applyRowOrder(rows, getRowId, rowOrderModel) {
	if (!rowOrderModel || !rowOrderModel.length) return rows;
	const rank = new Map(rowOrderModel.map((id, i) => [id, i]));
	const tail = rowOrderModel.length;
	return rows.slice().sort((a, b) => {
		const ia = rank.has(getRowId(a)) ? rank.get(getRowId(a)) : tail;
		const ib = rank.has(getRowId(b)) ? rank.get(getRowId(b)) : tail;
		return ia - ib;
	});
}

export function applyColumnOrder(columns, columnOrderModel) {
	if (!columnOrderModel || !columnOrderModel.length) return columns;
	const rank = new Map(columnOrderModel.map((field, i) => [field, i]));
	const tail = columnOrderModel.length;
	return columns.slice().sort((a, b) => {
		const ia = rank.has(a.field) ? rank.get(a.field) : tail;
		const ib = rank.has(b.field) ? rank.get(b.field) : tail;
		return ia - ib;
	});
}
