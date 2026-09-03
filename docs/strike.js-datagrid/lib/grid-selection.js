export function toggleId(model, id) {
	const list = model ? model.slice() : [];
	const i = list.indexOf(id);
	if (i >= 0) list.splice(i, 1);
	else list.push(id);
	return list;
}

/** Add or remove all visible ids from the selection model. */
export function setVisibleSelection(model, visibleIds, selected) {
	const set = new Set(model || []);
	for (const id of visibleIds) {
		if (selected) set.add(id);
		else set.delete(id);
	}
	return [...set];
}

export function selectableVisibleIds(rows, getRowId, isRowSelectable) {
	return rows
		.filter(r => !isRowSelectable || isRowSelectable(r))
		.map(getRowId);
}

export function selectionState(visibleIds, model) {
	if (!visibleIds.length) return 'none';
	const set = new Set(model || []);
	let n = 0;
	for (const id of visibleIds) {
		if (set.has(id)) n++;
	}
	if (n === 0) return 'none';
	if (n === visibleIds.length) return 'all';
	return 'some';
}
