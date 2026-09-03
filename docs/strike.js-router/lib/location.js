import { parseSearch, stringifySearch } from './search.js';

let keySeq = 0;

/** Strip trailing slash except root `/`. Always starts with `/`. */
export function normalizePathname(pathname) {
	let p = pathname == null || pathname === '' ? '/' : String(pathname);
	if (!p.startsWith('/')) p = '/' + p;
	if (p.length > 1 && p.endsWith('/')) p = p.slice(0, -1);
	return p;
}

export function createLocationKey() {
	keySeq += 1;
	return 'k' + keySeq + '-' + Math.random().toString(36).slice(2, 8);
}

/**
 * Resolve `to` against `from` pathname.
 * Absolute `to` (leading `/`) skips join. Search-only `?x=1` keeps path.
 * Returns `{ pathname, search }` (search '' or '?...').
 */
export function resolvePath(fromPathname, to) {
	const from = normalizePathname(fromPathname);
	const raw = to == null ? '' : String(to);

	if (raw.startsWith('?')) {
		return { pathname: from, search: raw === '?' ? '' : raw };
	}

	let pathPart = raw;
	let search = '';
	const q = raw.indexOf('?');
	if (q !== -1) {
		pathPart = raw.slice(0, q);
		search = raw.slice(q);
		if (search === '?') search = '';
	}

	if (pathPart === '' || pathPart === '.') {
		return { pathname: from, search };
	}

	let joined;
	if (pathPart.startsWith('/')) {
		joined = pathPart;
	} else {
		const baseSegs = from === '/' ? [] : from.split('/').slice(1);
		const segs = pathPart.split('/');
		for (const seg of segs) {
			if (seg === '' || seg === '.') continue;
			if (seg === '..') {
				if (baseSegs.length) baseSegs.pop();
				continue;
			}
			baseSegs.push(seg);
		}
		joined = '/' + baseSegs.join('/');
		if (joined !== '/' && joined.endsWith('/')) {
			joined = joined.slice(0, -1);
		}
	}

	return { pathname: normalizePathname(joined), search };
}

/** Build a Location from parts. */
export function makeLocation({
	pathname,
	search = '',
	hash = '',
	state,
	key
}) {
	let s = search == null || search === '' ? '' : String(search);
	if (s && !s.startsWith('?')) s = '?' + s;
	if (s === '?') s = '';
	let h = hash == null || hash === '' ? '' : String(hash);
	if (h && !h.startsWith('#')) h = '#' + h;
	if (h === '#') h = '';
	return {
		pathname: normalizePathname(pathname),
		search: s,
		hash: h,
		key: key || createLocationKey(),
		state
	};
}

export { parseSearch, stringifySearch };
