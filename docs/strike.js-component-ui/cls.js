/** Join truthy class name parts with a space. */
export function cls(...parts) {
	let out = '';
	for (let i = 0; i < parts.length; i++) {
		const p = parts[i];
		if (p == null || p === false || p === '') continue;
		out = out ? out + ' ' + p : '' + p;
	}
	return out;
}
