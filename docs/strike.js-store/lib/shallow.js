/** Shallow equality for plain objects / arrays (one level). */
export function shallow(a, b) {
	if (Object.is(a, b)) return true;
	if (a == null || b == null) return false;
	if (typeof a !== 'object' || typeof b !== 'object') return false;
	const ka = Object.keys(a);
	const kb = Object.keys(b);
	if (ka.length !== kb.length) return false;
	for (let i = 0; i < ka.length; i++) {
		const k = ka[i];
		if (!Object.prototype.hasOwnProperty.call(b, k) || !Object.is(a[k], b[k])) {
			return false;
		}
	}
	return true;
}
