/**
 * Persist an atom to Web Storage or a custom { getItem, setItem } adapter.
 * @param {{ get(): any, set: Function, subscribe: Function }} store
 * @param {{
 *   name: string,
 *   storage?: { getItem(k: string): string|null, setItem(k: string, v: string): void },
 *   serialize?: (v: any) => string,
 *   deserialize?: (s: string) => any,
 *   debounceMs?: number,
 *   onError?: (err: unknown) => void
 * }} opts
 */
export function persist(store, opts) {
	const name = opts.name;
	const storage = opts.storage;
	const serialize = opts.serialize || JSON.stringify;
	const deserialize = opts.deserialize || JSON.parse;
	const debounceMs = opts.debounceMs || 0;
	const onError = opts.onError;

	if (!storage || typeof storage.getItem !== 'function') {
		return function () {};
	}

	try {
		const raw = storage.getItem(name);
		if (raw != null && raw !== '') {
			store.set(deserialize(raw), { force: true });
		}
	} catch (err) {
		if (onError) onError(err);
	}

	let timer = null;
	function write(value) {
		try {
			storage.setItem(name, serialize(value));
		} catch (err) {
			if (onError) onError(err);
		}
	}

	return store.subscribe(function (value) {
		if (debounceMs > 0) {
			if (timer) clearTimeout(timer);
			timer = setTimeout(function () {
				timer = null;
				write(value);
			}, debounceMs);
			return;
		}
		write(value);
	});
}
