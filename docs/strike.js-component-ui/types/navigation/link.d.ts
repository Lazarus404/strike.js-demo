export declare function Link(props: {
	as?: string | ((props: Record<string, unknown>) => unknown);
	href?: string;
	tone?: string;
	underline?: 'hover' | 'always' | 'none';
	external?: boolean;
	class?: string;
	children?: unknown;
	[key: string]: unknown;
}): unknown;
