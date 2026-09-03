export declare function Table(props: {
	columns?: {
		key: string;
		label: unknown;
		render?: (row: Record<string, unknown>) => unknown;
		class?: string | ((row: Record<string, unknown>) => string | null | undefined);
		headerClass?: string;
		width?: number | string;
		align?: 'left' | 'right' | 'center' | string;
	}[];
	rows?: Record<string, unknown>[];
	caption?: unknown;
	stickyHeader?: boolean;
	size?: string;
	empty?: unknown;
	getRowId?: (row: Record<string, unknown>) => string | number;
	getRowClassName?: (row: Record<string, unknown>) => string | null | undefined;
	class?: string;
	children?: unknown;
	[key: string]: unknown;
}): unknown;

export declare function THead(props: Record<string, unknown>): unknown;
export declare function TBody(props: Record<string, unknown>): unknown;
export declare function TR(props: Record<string, unknown>): unknown;
export declare function TH(props: Record<string, unknown>): unknown;
export declare function TD(props: Record<string, unknown>): unknown;
