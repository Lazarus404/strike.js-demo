export type Location = {
	pathname: string;
	search: string;
	hash: string;
	key: string;
	state?: unknown;
};

export type NavigateOptions = {
	replace?: boolean;
	state?: unknown;
};

export type NavigationType = 'push' | 'replace' | 'pop';

export type NavigateFn = {
	(to: string, opts?: NavigateOptions): void;
	(delta: number): void;
};

export type HistoryAdapter = {
	get(): Location;
	listen(fn: () => void): () => void;
	navigate(to: string | number, opts?: NavigateOptions): void;
	createHref(to: string): string;
};

export type RouteObject = {
	path?: string;
	index?: boolean;
	element?: unknown;
	children?: RouteObject[];
};

export type PathMatch = {
	params: Record<string, string>;
	pathname: string;
	pattern: string;
};

export type RouteMatch = {
	route: RouteObject;
	pathname: string;
	params: Record<string, string>;
	pattern: string;
};

export declare function parseSearch(search: string): Record<string, string>;
export declare function stringifySearch(
	record: Record<string, string | null | undefined>
): string;
export declare function resolvePath(
	fromPathname: string,
	to: string
): { pathname: string; search: string };
export declare function compilePattern(pattern: string): {
	segments: Array<{
		type: 'static' | 'param' | 'optional' | 'splat';
		value?: string;
		name?: string;
	}>;
	original: string;
};
export declare function matchPath(
	pattern: string,
	pathname: string,
	opts?: { end?: boolean }
): PathMatch | null;
export declare function matchRoutes(
	routes: RouteObject[],
	pathname: string
): RouteMatch[] | null;

export declare function createHashAdapter(win?: Window): HistoryAdapter;
export declare function createHistoryAdapter(
	opts?: { basename?: string },
	win?: Window
): HistoryAdapter;
export declare function createMemoryAdapter(opts?: {
	initialEntries?: Array<string | Partial<Location>>;
	initialIndex?: number;
}): HistoryAdapter;

export declare function Router(props: {
	adapter?: HistoryAdapter;
	focusReset?: boolean;
	children?: unknown;
}): unknown;
export declare function Routes(props: { children?: unknown }): unknown;
export declare function Route(props: {
	path?: string;
	index?: boolean;
	element?: unknown;
	children?: unknown;
}): unknown;
export declare function Outlet(): unknown;
export declare function NavLink(props: {
	to: string;
	end?: boolean;
	replace?: boolean;
	state?: unknown;
	class?: string | ((active: boolean) => string | undefined);
	className?: string | ((active: boolean) => string | undefined);
	isActive?: (location: Location) => boolean;
	'aria-current'?: string | false | null;
	children?: unknown;
	onClick?: (e: MouseEvent) => void;
	target?: string;
	[key: string]: unknown;
}): unknown;
export declare function Navigate(props: {
	to: string;
	replace?: boolean;
	state?: unknown;
}): unknown;

export declare function useLocation(): Location;
export declare function useNavigate(): NavigateFn;
export declare function useNavigationType(): NavigationType;
export declare function useDocumentTitle(title: string): void;
export declare function useParams(): Record<string, string>;
export declare function useMatch(
	pattern: string,
	opts?: { end?: boolean }
): PathMatch | null;
export declare function useResolvedPath(to: string): string;
export declare function useSearchParams(): [
	Record<string, string>,
	(
		next:
			| Record<string, string | null | undefined>
			| ((
					prev: Record<string, string>
			  ) => Record<string, string | null | undefined>),
		opts?: { replace?: boolean }
	) => void
];
export declare function useSearchParam<T = string>(
	name: string,
	options?: {
		defaultValue?: T;
		replace?: boolean;
		parse?: (v: string) => T;
		serialize?: (v: T | null | undefined) => string | null;
	}
): [T, (next: T | null | undefined | ((prev: T) => T | null | undefined)) => void];
