export type SnackbarItem = {
	id: string;
	tone?: string;
	children?: unknown;
	action?: unknown;
	autoHideMs?: number | null;
	onClose?: () => void;
	exiting?: boolean;
};

export type SnackbarTransition =
	| false
	| 'none'
	| 'fade'
	| 'slide-up'
	| 'slide-down'
	| 'slide-start'
	| 'slide-end'
	| {
			enter?: string | false;
			exit?: string | false;
			move?: 'flip' | 'none' | false;
			ms?: number;
			ease?: string;
			distance?: string;
	  };

export declare function SnackbarStack(props: {
	items?: SnackbarItem[];
	onDismiss?: (id: string) => void;
	placement?: string;
	gap?: number;
	transition?: SnackbarTransition;
	class?: string;
}): unknown;

export declare function SnackbarHost(props: {
	placement?: string;
	gap?: number;
	transition?: SnackbarTransition;
	max?: number;
	class?: string;
}): unknown;

export declare function useSnackbar(): {
	show: (opts: {
		id?: string;
		tone?: string;
		children?: unknown;
		action?: unknown;
		autoHideMs?: number | null;
		onClose?: () => void;
		placement?: string;
	}) => string | null;
	dismiss: (id?: string | null) => void;
};

export declare const snackbar: {
	show: (opts: {
		id?: string;
		tone?: string;
		children?: unknown;
		action?: unknown;
		autoHideMs?: number | null;
		onClose?: () => void;
		placement?: string;
	}) => string | null;
	dismiss: (id?: string | null) => void;
};
