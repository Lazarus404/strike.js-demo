import {
	makeLocation,
	normalizePathname,
	createLocationKey
} from './location.js';

function stripBasename(pathname, basename) {
	if (!basename || basename === '/') return pathname;
	const base = normalizePathname(basename);
	if (pathname === base) return '/';
	if (pathname.startsWith(base + '/')) {
		return pathname.slice(base.length) || '/';
	}
	return pathname;
}

function withBasename(pathname, basename) {
	if (!basename || basename === '/') return pathname;
	const base = normalizePathname(basename);
	if (pathname === '/') return base;
	return normalizePathname(base + pathname);
}

function readWindowLocation(win, basename) {
	const path = stripBasename(
		normalizePathname(win.location.pathname),
		basename
	);
	return makeLocation({
		pathname: path,
		search: win.location.search || '',
		hash: win.location.hash || '',
		state: win.history.state,
		key: createLocationKey()
	});
}

/** HTML5 history adapter with optional basename. */
export function createHistoryAdapter(
	opts = {},
	win = typeof window !== 'undefined' ? window : null
) {
	if (!win) {
		throw new Error('createHistoryAdapter requires a window');
	}
	const basename = opts.basename
		? normalizePathname(opts.basename)
		: '';

	let current = readWindowLocation(win, basename);
	const listeners = new Set();

	function onPop() {
		current = readWindowLocation(win, basename);
		for (const fn of listeners) fn();
	}

	return {
		get() {
			return current;
		},
		listen(fn) {
			listeners.add(fn);
			win.addEventListener('popstate', onPop);
			return () => {
				listeners.delete(fn);
				win.removeEventListener('popstate', onPop);
			};
		},
		createHref(to) {
			const s = String(to);
			let pathname = s;
			let search = '';
			let hash = '';
			const hashIdx = s.indexOf('#');
			if (hashIdx !== -1) {
				hash = s.slice(hashIdx);
				pathname = s.slice(0, hashIdx);
			}
			const q = pathname.indexOf('?');
			if (q !== -1) {
				search = pathname.slice(q);
				pathname = pathname.slice(0, q);
			}
			if (!pathname.startsWith('/')) pathname = '/' + pathname;
			const fullPath = withBasename(normalizePathname(pathname), basename);
			return fullPath + (search || '') + (hash || '');
		},
		navigate(to, navOpts = {}) {
			if (typeof to === 'number') {
				win.history.go(to);
				return;
			}
			const href = this.createHref(to);
			const replace = !!navOpts.replace;
			const state = navOpts.state;
			const next = makeLocation({
				pathname: stripBasename(
					normalizePathname(
						href.split('#')[0].split('?')[0] || '/'
					),
					basename
				),
				search: (() => {
					const withoutHash = href.split('#')[0];
					const qi = withoutHash.indexOf('?');
					return qi === -1 ? '' : withoutHash.slice(qi);
				})(),
				hash: href.includes('#')
					? '#' + href.split('#').slice(1).join('#')
					: '',
				state,
				key: createLocationKey()
			});
			current = next;
			if (replace) {
				win.history.replaceState(state, '', href);
			} else {
				win.history.pushState(state, '', href);
			}
			for (const fn of listeners) fn();
		}
	};
}
