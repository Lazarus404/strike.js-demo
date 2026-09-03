import {
	makeLocation,
	normalizePathname,
	createLocationKey
} from './location.js';

function parseHashRouting(hash) {
	let raw = hash == null ? '' : String(hash);
	if (raw.startsWith('#')) raw = raw.slice(1);
	if (!raw) raw = '/';
	if (!raw.startsWith('/')) raw = '/' + raw;
	let pathname = raw;
	let search = '';
	const q = raw.indexOf('?');
	if (q !== -1) {
		pathname = raw.slice(0, q);
		search = raw.slice(q);
	}
	return makeLocation({
		pathname: normalizePathname(pathname),
		search,
		hash: '',
		state: undefined,
		key: createLocationKey()
	});
}

function toHashTarget(to) {
	if (typeof to === 'number') return to;
	const s = String(to);
	if (s.startsWith('#')) return s.slice(1) || '/';
	return s.startsWith('/') ? s : '/' + s;
}

/** Hash-routing adapter: browser location.hash holds app path + search. */
export function createHashAdapter(win = typeof window !== 'undefined' ? window : null) {
	if (!win) {
		throw new Error('createHashAdapter requires a window');
	}

	let current = parseHashRouting(win.location.hash);
	const listeners = new Set();

	function notify(type) {
		current = {
			...parseHashRouting(win.location.hash),
			key: type === 'pop' ? createLocationKey() : current.key
		};
		if (type !== 'pop') {
			// keep key from navigate for push/replace unless we set below
		}
		for (const fn of listeners) fn();
	}

	function onHash() {
		current = parseHashRouting(win.location.hash);
		for (const fn of listeners) fn();
	}

	return {
		get() {
			return current;
		},
		listen(fn) {
			listeners.add(fn);
			win.addEventListener('hashchange', onHash);
			return () => {
				listeners.delete(fn);
				win.removeEventListener('hashchange', onHash);
			};
		},
		createHref(to) {
			const target = toHashTarget(to);
			const path = target.startsWith('/') ? target : '/' + target;
			return '#' + path;
		},
		navigate(to, opts = {}) {
			if (typeof to === 'number') {
				win.history.go(to);
				return;
			}
			const href = this.createHref(to);
			const pathAndQuery = href.slice(1); // drop #
			const replace = !!opts.replace;
			const next = parseHashRouting('#' + pathAndQuery);
			next.key = createLocationKey();
			next.state = undefined;
			current = next;
			if (replace) {
				const loc = win.location;
				const full =
					loc.origin +
					loc.pathname +
					loc.search +
					'#' +
					pathAndQuery;
				win.history.replaceState(win.history.state, '', full);
				for (const fn of listeners) fn();
			} else {
				win.location.hash = pathAndQuery;
				// hashchange will fire; also sync eagerly for same-tick reads
				current = next;
				for (const fn of listeners) fn();
			}
		}
	};
}
