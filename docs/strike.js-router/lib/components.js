import { h, toChildArray } from 'strike-fw';
import {
	useContext,
	useLayoutEffect,
	useRef,
	useMemo
} from 'strike-fw/hooks';
import {
	RouterContext,
	RouteContext,
	useLocation,
	useNavigate
} from './context.js';
import { matchPath, matchRoutes } from './match.js';
import { resolvePath, normalizePathname } from './location.js';
import { parseSearch, stringifySearch } from './search.js';

function useRouter(hookName) {
	const ctx = useContext(RouterContext);
	if (!ctx) {
		throw new Error(
			(hookName || 'Router hook') + ' must be used within a <Router>'
		);
	}
	return ctx;
}

/** Marker route; rendered only via Routes. */
export function Route() {
	return null;
}
Route._strikeRoute = true;

function collectRoutes(children) {
	const list = [];
	for (const child of toChildArray(children)) {
		if (!child || typeof child !== 'object') continue;
		const type = child.type;
		if (type !== Route && !(type && type._strikeRoute)) continue;
		const props = child.props || {};
		const node = {
			path: props.path,
			index: !!props.index,
			element: props.element,
			children: props.children
				? collectRoutes(props.children)
				: undefined
		};
		if (node.children && !node.children.length) delete node.children;
		list.push(node);
	}
	return list;
}

export function Routes(props) {
	const { location } = useRouter('Routes');
	const routes = useMemo(
		() => collectRoutes(props.children),
		[props.children]
	);
	const matches = matchRoutes(routes, location.pathname);
	if (!matches || !matches.length) return null;

	const match = matches[0];
	const value = {
		matches,
		outletDepth: 0,
		pathname: match.pathname,
		params: match.params
	};
	return h(RouteContext.Provider, { value }, match.route.element);
}

export function Outlet() {
	const route = useContext(RouteContext);
	if (!route || !route.matches) return null;
	const next = route.matches[route.outletDepth + 1];
	if (!next) return null;
	const value = {
		matches: route.matches,
		outletDepth: route.outletDepth + 1,
		pathname: next.pathname,
		params: next.params
	};
	return h(RouteContext.Provider, { value }, next.route.element);
}

export function useParams() {
	const route = useContext(RouteContext);
	return (route && route.params) || {};
}

export function useMatch(pattern, opts = {}) {
	const location = useLocation();
	return matchPath(pattern, location.pathname, {
		end: opts.end !== false
	});
}

export function useResolvedPath(to) {
	const router = useRouter('useResolvedPath');
	const route = useContext(RouteContext);
	const from = (route && route.pathname) || router.location.pathname;
	const resolved = resolvePath(from, to);
	return resolved.pathname + (resolved.search || '');
}

function isModifiedClick(e) {
	return (
		e.metaKey ||
		e.altKey ||
		e.ctrlKey ||
		e.shiftKey ||
		(e.button != null && e.button !== 0)
	);
}

export function NavLink(props) {
	const router = useRouter('NavLink');
	const navigate = useNavigate();
	const location = useLocation();
	const route = useContext(RouteContext);
	const {
		to,
		end,
		replace,
		state,
		class: classProp,
		className,
		isActive: isActiveProp,
		'aria-current': ariaCurrentProp,
		children,
		onClick,
		target,
		...rest
	} = props;

	const from = (route && route.pathname) || location.pathname;
	const resolved = resolvePath(from, to);
	const hrefPath = resolved.pathname + (resolved.search || '');
	const href = router.adapter.createHref(hrefPath);

	let active;
	if (typeof isActiveProp === 'function') {
		active = !!isActiveProp(location);
	} else {
		const path = normalizePathname(resolved.pathname);
		const cur = location.pathname;
		if (path === '/') {
			active = end ? cur === '/' : cur === '/';
		} else {
			active = end
				? cur === path
				: cur === path || cur.startsWith(path + '/');
		}
	}

	let cls = classProp != null ? classProp : className;
	if (typeof cls === 'function') cls = cls(active);

	const ariaCurrent =
		ariaCurrentProp === false || ariaCurrentProp === null
			? undefined
			: ariaCurrentProp !== undefined
				? ariaCurrentProp
				: active
					? 'page'
					: undefined;

	return h(
		'a',
		{
			...rest,
			href,
			class: cls,
			'aria-current': ariaCurrent,
			target,
			onClick: e => {
				if (onClick) onClick(e);
				if (e.defaultPrevented) return;
				if (target && target !== '_self') return;
				if (isModifiedClick(e)) return;
				e.preventDefault();
				navigate(hrefPath, { replace, state });
			}
		},
		children
	);
}

export function Navigate(props) {
	const navigate = useNavigate();
	const done = useRef(false);
	useLayoutEffect(() => {
		if (done.current) return;
		done.current = true;
		navigate(props.to, {
			replace: props.replace,
			state: props.state
		});
	}, [navigate, props.to, props.replace, props.state]);
	return null;
}

export function useSearchParams() {
	const router = useRouter('useSearchParams');
	const location = router.location;
	const params = useMemo(
		() => parseSearch(location.search),
		[location.search]
	);

	const setParams = (next, opts = {}) => {
		const replace = opts.replace !== false;
		const record =
			typeof next === 'function' ? next({ ...params }) : next;
		const search = stringifySearch(record);
		const target = location.pathname + search;
		const current = location.pathname + (location.search || '');
		if (target === current) return;
		router.navigate(target, { replace });
	};

	return [params, setParams];
}

export function useSearchParam(name, options = {}) {
	const [params, setParams] = useSearchParams();
	const {
		defaultValue,
		replace = true,
		parse = v => v,
		serialize = v => (v == null ? null : String(v))
	} = options;

	const raw = Object.prototype.hasOwnProperty.call(params, name)
		? params[name]
		: undefined;
	const value = raw === undefined ? defaultValue : parse(raw);

	const setValue = next => {
		const serialized =
			typeof next === 'function'
				? serialize(next(value))
				: serialize(next);
		const nextRecord = { ...params };
		if (serialized == null) {
			delete nextRecord[name];
		} else {
			nextRecord[name] = serialized;
		}
		setParams(nextRecord, { replace });
	};

	return [value, setValue];
}
