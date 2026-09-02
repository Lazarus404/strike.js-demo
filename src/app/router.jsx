import { useState, useLayoutEffect } from '../../vendor/strike.core+hooks.js';

export function pathFromHash() {
	const raw =
		(typeof location !== 'undefined' && location.hash.slice(1)) || '/';
	return raw.startsWith('/') ? raw : '/' + raw;
}

export function parseRoute(path) {
	if (path === '/cart') return { name: 'cart' };
	if (path === '/checkout') return { name: 'checkout' };
	if (path === '/thanks') return { name: 'thanks' };
	if (path === '/lab') return { name: 'lab' };
	const m = path.match(/^\/product\/([^/]+)$/);
	if (m) return { name: 'product', id: m[1] };
	return { name: 'shop' };
}

export function useRoute() {
	const [path, setPath] = useState(pathFromHash);
	useLayoutEffect(() => {
		const onHash = () => setPath(pathFromHash());
		window.addEventListener('hashchange', onHash);
		return () => window.removeEventListener('hashchange', onHash);
	}, []);
	return path;
}
