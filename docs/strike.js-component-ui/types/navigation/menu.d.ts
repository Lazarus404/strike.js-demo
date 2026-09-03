export declare function Menu(props: {
	open?: boolean;
	onClose?: (e?: Event) => void;
	anchor?: { current?: Element | null } | Element;
	placement?: string;
	class?: string;
	children?: unknown;
	[key: string]: unknown;
}): unknown;

export declare function MenuItem(props: {
	onSelect?: (e: Event) => void;
	disabled?: boolean;
	startIcon?: unknown;
	destructive?: boolean;
	class?: string;
	children?: unknown;
	[key: string]: unknown;
}): unknown;

export declare function MenuSeparator(props?: { class?: string }): unknown;
