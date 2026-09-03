export declare function Navigation(props: {
	items?: { href?: string; label: unknown; current?: boolean }[];
	orientation?: 'horizontal' | 'vertical';
	onNavigate?: (item: { href?: string; label: unknown; current?: boolean }, e: Event) => void;
	class?: string;
	[key: string]: unknown;
}): unknown;
