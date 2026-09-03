/** Parse `?a=1&b=2` or `a=1` into a flat record. Multi-value keys: last wins. */
export function parseSearch(search) {
	const out = {};
	if (search == null || search === '') return out;
	const raw = String(search).startsWith('?')
		? String(search).slice(1)
		: String(search);
	if (!raw) return out;
	for (const part of raw.split('&')) {
		if (!part) continue;
		const eq = part.indexOf('=');
		const k = decodeURIComponent(eq === -1 ? part : part.slice(0, eq));
		const v = decodeURIComponent(eq === -1 ? '' : part.slice(eq + 1));
		out[k] = v;
	}
	return out;
}

/** Serialize a record to `?a=1` or `''`. Omits null/undefined values. */
export function stringifySearch(record) {
	if (!record) return '';
	const parts = [];
	for (const key of Object.keys(record)) {
		const v = record[key];
		if (v == null) continue;
		parts.push(
			encodeURIComponent(key) + '=' + encodeURIComponent(String(v))
		);
	}
	return parts.length ? '?' + parts.join('&') : '';
}
