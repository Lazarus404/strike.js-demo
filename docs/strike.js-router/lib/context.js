import { createContext, h } from 'strike-fw';
import {
	useState,
	useLayoutEffect,
	useContext,
	useRef,
	useCallback
} from 'strike-fw/hooks';
import { createHashAdapter } from './adapter-hash.js';
import { resolvePath } from './location.js';

export const RouterContext = createContext(null);
export const RouteContext = createContext(null);

function requireRouter(hookName) {
	const ctx = useContext(RouterContext);
	if (!ctx) {
		throw new Error(hookName + ' must be used within a <Router>');
	}
	return ctx;
}

export function useLocation() {
	return requireRouter('useLocation').location;
}

export function useNavigationType() {
	return requireRouter('useNavigationType').navigationType;
}

export function useNavigate() {
	const router = requireRouter('useNavigate');
	const route = useContext(RouteContext);
	return useCallback(
		(to, opts) => {
			if (typeof to === 'number') {
				router.navigate(to);
				return;
			}
			const from =
				(route && route.pathname) || router.location.pathname;
			const resolved = resolvePath(from, to);
			const target = resolved.pathname + (resolved.search || '');
			router.navigate(target, opts);
		},
		[router, route]
	);
}

export function useDocumentTitle(title) {
	useLayoutEffect(() => {
		if (title != null && String(title) !== '') {
			document.title = String(title);
		}
	}, [title]);
}

export function Router(props) {
	const adapterRef = useRef(null);
	if (!adapterRef.current) {
		adapterRef.current =
			props.adapter ||
			(typeof window !== 'undefined' ? createHashAdapter() : null);
	}
	const adapter = props.adapter || adapterRef.current;
	if (!adapter) {
		throw new Error('Router requires an adapter');
	}

	const [location, setLocation] = useState(() => adapter.get());
	const [navigationType, setNavigationType] = useState('pop');
	const focusReset = !!props.focusReset;
	const prevPath = useRef(location.pathname);

	useLayoutEffect(() => {
		return adapter.listen(() => {
			setLocation(adapter.get());
		});
	}, [adapter]);

	useLayoutEffect(() => {
		if (!focusReset) return;
		if (prevPath.current === location.pathname) return;
		prevPath.current = location.pathname;
		const el =
			document.querySelector('[data-strike-focus]') ||
			document.querySelector('main');
		if (el && typeof el.focus === 'function') {
			try {
				el.focus({ preventScroll: true });
			} catch {
				el.focus();
			}
		}
	}, [location.pathname, focusReset]);

	const navigate = useCallback(
		(to, opts) => {
			if (typeof to === 'number') {
				setNavigationType('pop');
				adapter.navigate(to);
				setLocation(adapter.get());
				return;
			}
			const replace = !!(opts && opts.replace);
			setNavigationType(replace ? 'replace' : 'push');
			adapter.navigate(to, opts);
			setLocation(adapter.get());
		},
		[adapter]
	);

	const value = {
		location,
		navigate,
		navigationType,
		adapter
	};

	return h(RouterContext.Provider, { value }, props.children);
}
