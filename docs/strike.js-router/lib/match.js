import { normalizePathname } from './location.js';

/**
 * Compile a path pattern into segments.
 * Segments: { type: 'static'|'param'|'optional'|'splat', value?: string, name?: string }
 */
export function compilePattern(pattern) {
	const raw = pattern == null ? '' : String(pattern);
	if (raw === '*' || raw === '/*') {
		return { segments: [{ type: 'splat' }], original: raw };
	}
	const path = normalizePathname(raw === '' ? '/' : raw);
	const parts = path === '/' ? [] : path.split('/').slice(1);
	const segments = [];
	for (let i = 0; i < parts.length; i++) {
		const part = parts[i];
		if (part === '*') {
			if (i !== parts.length - 1) {
				throw new Error('splat must be the last segment');
			}
			segments.push({ type: 'splat' });
			continue;
		}
		if (part.startsWith(':')) {
			const optional = part.endsWith('?');
			const name = optional ? part.slice(1, -1) : part.slice(1);
			segments.push({
				type: optional ? 'optional' : 'param',
				name
			});
			continue;
		}
		segments.push({ type: 'static', value: part });
	}
	return { segments, original: raw };
}

function scorePattern(compiled) {
	let score = 0;
	let staticPrefix = 0;
	let stillStatic = true;
	for (const seg of compiled.segments) {
		if (seg.type === 'static') {
			score += 40;
			if (stillStatic) staticPrefix += 1;
		} else if (seg.type === 'param') {
			score += 20;
			stillStatic = false;
		} else if (seg.type === 'optional') {
			score += 10;
			stillStatic = false;
		} else if (seg.type === 'splat') {
			score += 1;
			stillStatic = false;
		}
	}
	return score * 1000 + staticPrefix * 10 + compiled.segments.length;
}

/**
 * Match a single pattern against a pathname.
 * @returns {{ params: Record<string,string>, pathname: string, pattern: string } | null}
 */
export function matchPath(pattern, pathname, opts = {}) {
	const end = opts.end !== false;
	const compiled =
		typeof pattern === 'object' && pattern.segments
			? pattern
			: compilePattern(pattern);
	const path = normalizePathname(pathname);
	const pathParts = path === '/' ? [] : path.split('/').slice(1);
	const params = {};
	let pi = 0;
	const segs = compiled.segments;

	for (let si = 0; si < segs.length; si++) {
		const seg = segs[si];
		if (seg.type === 'splat') {
			params['*'] = pathParts.slice(pi).join('/');
			pi = pathParts.length;
			break;
		}
		if (seg.type === 'optional') {
			if (pi < pathParts.length) {
				params[seg.name] = decodeURIComponent(pathParts[pi]);
				pi += 1;
			}
			continue;
		}
		if (pi >= pathParts.length) return null;
		const part = pathParts[pi];
		if (seg.type === 'static') {
			if (part !== seg.value) return null;
		} else if (seg.type === 'param') {
			params[seg.name] = decodeURIComponent(part);
		}
		pi += 1;
	}

	if (end && pi !== pathParts.length) return null;

	const matchedPath =
		pi === 0 ? '/' : '/' + pathParts.slice(0, pi).join('/');

	return {
		params,
		pathname: normalizePathname(matchedPath),
		pattern:
			compiled.original != null ? compiled.original : String(pattern)
	};
}

function joinParentPath(parentPath, segment) {
	if (segment == null || segment === '') return parentPath || '/';
	if (segment.startsWith('/')) return normalizePathname(segment);
	const base = !parentPath || parentPath === '/' ? '' : parentPath;
	return normalizePathname(base + '/' + segment);
}

function absolutePathAt(chain, depth) {
	let p = '';
	for (let j = 0; j <= depth; j++) {
		const r = chain[j];
		if (r.index) {
			p = p || '/';
		} else if (r.path === '*' || r.path === '/*') {
			return '*';
		} else if (r.path != null && r.path !== '') {
			p = joinParentPath(p || '/', r.path);
		} else {
			p = p || '/';
		}
	}
	return p || '/';
}

/** Flatten nested routes to leaf entries with ancestor chain. */
function flattenRoutes(routes, parentPath = '', ancestors = []) {
	const out = [];
	for (const route of routes || []) {
		let abs;
		if (route.index) {
			abs = parentPath || '/';
		} else if (route.path === '*' || route.path === '/*') {
			abs = '*';
		} else if (route.path != null && route.path !== '') {
			abs = joinParentPath(parentPath, route.path);
		} else {
			abs = parentPath || '/';
		}
		const chain = ancestors.concat(route);
		const children = route.children;
		if (children && children.length) {
			out.push(
				...flattenRoutes(
					children,
					abs === '*' ? parentPath : abs,
					chain
				)
			);
		} else {
			out.push({
				route,
				chain,
				pattern: abs,
				score: scorePattern(
					compilePattern(abs === '*' ? '*' : abs)
				)
			});
		}
	}
	return out;
}

/**
 * Ranked match of a route table. Returns ancestor-to-leaf matches or null.
 * Each match: { route, pathname, params, pattern }
 */
export function matchRoutes(routes, pathname) {
	const path = normalizePathname(pathname);
	const flat = flattenRoutes(routes).sort((a, b) => b.score - a.score);

	for (const entry of flat) {
		const leaf = matchPath(entry.pattern, path, { end: true });
		if (!leaf) continue;

		const matches = [];
		const merged = {};
		let ok = true;
		for (let i = 0; i < entry.chain.length; i++) {
			const r = entry.chain[i];
			const abs = absolutePathAt(entry.chain, i);
			const isLeaf = i === entry.chain.length - 1;
			let depthMatch =
				abs === '*'
					? matchPath('*', path, { end: true })
					: matchPath(abs, path, { end: isLeaf });
			if (!depthMatch && !isLeaf) {
				depthMatch = matchPath(abs, path, { end: false });
			}
			if (!depthMatch) {
				ok = false;
				break;
			}
			Object.assign(merged, depthMatch.params);
			matches.push({
				route: r,
				pathname: depthMatch.pathname,
				params: { ...merged },
				pattern: abs
			});
		}
		if (ok && matches.length === entry.chain.length) return matches;
	}

	return null;
}
