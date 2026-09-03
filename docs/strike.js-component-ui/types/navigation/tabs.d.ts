export declare function Tabs(props: {
	value?: string;
	defaultValue?: string;
	onChange?: (id: string) => void;
	items?: { id: string; label: unknown; panel?: unknown }[];
	orientation?: 'horizontal' | 'vertical';
	class?: string;
	[key: string]: unknown;
}): unknown;
