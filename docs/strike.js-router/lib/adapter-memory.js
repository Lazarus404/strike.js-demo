import {
	makeLocation,
	normalizePathname,
	createLocationKey,
	resolvePath
} from './location.js';

function parseEntry(entry) {
	if (typeof entry === 'string') {
		let pathname = entry;
		let search = '';
		let hash = '';
		const hashIdx = entry.indexOf('#');
		if (hashIdx !== -1) {
			hash = entry.slice(hashIdx);
			pathname = entry.slice(0, hashIdx);
		}
		const q = pathname.indexOf('?');
		if (q !== -1) {
			search = pathname.slice(q);
			pathname = pathname.slice(0, q);
		}
		return makeLocation({
			pathname: normalizePathname(pathname || '/'),
			search,
			hash,
			state: undefined,
			key: createLocationKey()
		});
	}
	return makeLocation({
		pathname: entry.pathname || '/',
		search: entry.search || '',
		hash: entry.hash || '',
		state: entry.state,
		key: entry.key || createLocationKey()
	});
}

/** In-memory history stack for tests and non-DOM hosts. */
export function createMemoryAdapter(opts = {}) {
	const initial = opts.initialEntries || ['/'];
	let index =
		opts.initialIndex != null
			? opts.initialIndex
			: initial.length - 1;
	const stack = initial.map(parseEntry);
	const listeners = new Set();

	function notify() {
		for (const fn of listeners) fn();
	}

	return {
		get() {
			return stack[index];
		},
		listen(fn) {
			listeners.add(fn);
			return () => listeners.delete(fn);
		},
		createHref(to) {
			const s = String(to);
			if (s.startsWith('/')) return s;
			const resolved = resolvePath(stack[index].pathname, s);
			return resolved.pathname + (resolved.search || '');
		},
		navigate(to, navOpts = {}) {
			if (typeof to === 'number') {
				const next = index + to;
				if (next < 0 || next >= stack.length) return;
				index = next;
				notify();
				return;
			}
			const href = this.createHref(to);
			let pathname = href;
			let search = '';
			let hash = '';
			const hashIdx = href.indexOf('#');
			if (hashIdx !== -1) {
				hash = href.slice(hashIdx);
				pathname = href.slice(0, hashIdx);
			}
			const q = pathname.indexOf('?');
			if (q !== -1) {
				search = pathname.slice(q);
				pathname = pathname.slice(0, q);
			}
			const next = makeLocation({
				pathname: normalizePathname(pathname || '/'),
				search,
				hash,
				state: navOpts.state,
				key: createLocationKey()
			});
			if (navOpts.replace) {
				stack[index] = next;
			} else {
				stack.splice(index + 1);
				stack.push(next);
				index = stack.length - 1;
			}
			notify();
		}
	};
}
