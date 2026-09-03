export declare function Overlay(props: {
	open?: boolean;
	onClose?: (e?: Event) => void;
	dim?: boolean;
	class?: string;
	children?: unknown | ((ctx: { panelRef: { current: unknown } }) => unknown);
	[key: string]: unknown;
}): unknown;
