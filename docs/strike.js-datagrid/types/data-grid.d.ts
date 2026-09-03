export declare function DataGrid(props: {
	columns: Record<string, unknown>[];
	rows?: Record<string, unknown>[];
	getRowId: (row: Record<string, unknown>) => string | number;
	processRowUpdate?: (
		newRow: Record<string, unknown>,
		oldRow: Record<string, unknown>
	) => Record<string, unknown> | Promise<Record<string, unknown>>;
	onProcessRowUpdateError?: (err: unknown) => void;
	caption?: unknown;
	class?: string;
	density?: 'sm' | 'md' | string;
	striped?: boolean | 'rows' | 'columns' | 'both';
	stripedRowScope?: 'page' | 'dataset';
	headerShade?: boolean | 'muted' | 'none';
	stickyHeader?: boolean;
	getRowClassName?: (row: Record<string, unknown>) => string | null | undefined;
	checkboxSelection?: boolean;
	isRowSelectable?: (row: Record<string, unknown>) => boolean;
	disableColumnSorting?: boolean;
	disableQuickFilter?: boolean;
	hideFooter?: boolean;
	loading?: boolean;
	loadingOverlay?: unknown;
	empty?: unknown;
	toolbar?: unknown;
	quickFilterPlaceholder?: string;
	pageSizeOptions?: number[];
	sortingMode?: 'client' | 'server';
	filterMode?: 'client' | 'server';
	paginationMode?: 'client' | 'server';
	rowCount?: number;
	sortModel?: { field: string; sort: 'asc' | 'desc' }[];
	defaultSortModel?: { field: string; sort: 'asc' | 'desc' }[];
	onSortModelChange?: (model: { field: string; sort: 'asc' | 'desc' }[]) => void;
	quickFilterValue?: string;
	defaultQuickFilterValue?: string;
	onQuickFilterValueChange?: (value: string) => void;
	filterModel?: {
		items: Array<{ field: string; operator: string; value?: unknown }>;
	};
	defaultFilterModel?: {
		items: Array<{ field: string; operator: string; value?: unknown }>;
	};
	onFilterModelChange?: (model: {
		items: Array<{ field: string; operator: string; value?: unknown }>;
	}) => void;
	paginationModel?: { page: number; pageSize: number };
	defaultPaginationModel?: { page: number; pageSize: number };
	onPaginationModelChange?: (model: { page: number; pageSize: number }) => void;
	selectionModel?: Array<string | number>;
	defaultSelectionModel?: Array<string | number>;
	onSelectionModelChange?: (model: Array<string | number>) => void;
	columnVisibilityModel?: Record<string, boolean>;
	defaultColumnVisibilityModel?: Record<string, boolean>;
	onColumnVisibilityModelChange?: (model: Record<string, boolean>) => void;
	editCell?: { id: string | number; field: string | null } | null;
	defaultEditCell?: { id: string | number; field: string | null } | null;
	onEditCellChange?: (
		cell: { id: string | number; field: string | null } | null
	) => void;
	editMode?: 'cell' | 'row';
	editOnClick?: boolean;
	enableGridKeyboard?: boolean;
	rowOrderModel?: Array<string | number>;
	defaultRowOrderModel?: Array<string | number>;
	onRowOrderChange?: (model: Array<string | number>) => void;
	columnOrderModel?: string[];
	defaultColumnOrderModel?: string[];
	onColumnOrderChange?: (model: string[]) => void;
	columnWidthModel?: Record<string, number>;
	defaultColumnWidthModel?: Record<string, number>;
	onColumnWidthChange?: (model: Record<string, number>) => void;
	disableColumnResize?: boolean;
	rowReorderMode?: 'client' | 'server';
	virtualize?: boolean;
	getRowHeight?: number;
	onRowClick?: (row: Record<string, unknown>, ev: unknown) => void;
	[key: string]: unknown;
}): unknown;
