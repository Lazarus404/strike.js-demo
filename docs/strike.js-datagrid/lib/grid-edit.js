export function parseByType(type, raw) {
	if (type === 'number') {
		if (raw === '' || raw == null) return null;
		const n = typeof raw === 'number' ? raw : Number(raw);
		return Number.isFinite(n) ? n : null;
	}
	if (type === 'boolean') return !!raw;
	if (type === 'date') {
		if (raw == null || raw === '') return null;
		return raw;
	}
	return raw == null ? '' : String(raw);
}

export function buildUpdatedRow(oldRow, field, value, col) {
	if (col && col.valueSetter) return col.valueSetter(value, oldRow);
	return { ...oldRow, [field]: value };
}
