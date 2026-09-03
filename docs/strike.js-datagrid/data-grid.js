import { h } from 'strike-fw';
import { useState, useLayoutEffect, useRef, useEffect } from 'strike-fw/hooks';
import { css } from 'strike-fw/css';
import { Field, Check, NumberField, Select, Btn, cls } from 'strike-fw/ui';
import { Table } from 'strike-fw-ui/display/table.js';
import { Pagination } from 'strike-fw-ui/navigation/pagination.js';
import { useControllable } from './lib/controllable.js';
import {
	normalizeColumn,
	getCellValue,
	formatCell,
	isColumnEditable,
	defaultAlign,
	clampColumnWidth
} from './lib/grid-columns.js';
import { applyQuickFilter, applyFilterModel } from './lib/grid-filter.js';
import { applySort, cycleSortModel } from './lib/grid-sort.js';
import {
	applyPagination,
	pageCount,
	clampPage
} from './lib/grid-paginate.js';
import {
	toggleId,
	setVisibleSelection,
	selectionState,
	selectableVisibleIds
} from './lib/grid-selection.js';
import { buildUpdatedRow, parseByType } from './lib/grid-edit.js';
import {
	moveItem,
	applyRowOrder,
	applyColumnOrder
} from './lib/grid-order.js';
import { windowRange } from './lib/grid-window.js';
import { moveFocus } from './lib/grid-keyboard.js';

css`
.strike-data-grid {
  --strike-grid-header-bg: var(--strike-fill, #f6f6f4);
  --strike-grid-stripe: var(--strike-fill, #f6f6f4);
  --strike-grid-selected: var(--strike-fill, #f6f6f4);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font: inherit;
  position: relative;
}
.strike-data-grid__toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
}
.strike-data-grid__scroller .strike-table {
  table-layout: fixed;
  width: max-content;
  min-width: 100%;
}
.strike-data-grid .strike-table th {
  position: relative;
}
.strike-data-grid__col-resizer {
  position: absolute;
  top: 0;
  right: -3px;
  width: 8px;
  height: 100%;
  cursor: col-resize;
  touch-action: none;
  z-index: 3;
  padding: 0;
  border: 0;
  background: transparent;
}
.strike-data-grid__col-resizer:hover,
.strike-data-grid__col-resizer:focus-visible,
.strike-data-grid--resizing .strike-data-grid__col-resizer--active {
  background: var(--strike-accent, #0b6e4f);
  opacity: 0.4;
}
.strike-data-grid__col-resizer:focus-visible {
  outline: 2px solid var(--strike-accent, #0b6e4f);
  outline-offset: 0;
  opacity: 0.55;
}
.strike-data-grid--resizing {
  user-select: none;
  cursor: col-resize;
}
.strike-data-grid--resizing .strike-data-grid__scroller {
  cursor: col-resize;
}
.strike-data-grid__footer {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
  justify-content: space-between;
}
.strike-data-grid__loading {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.65);
  z-index: 2;
}
.strike-data-grid--header-shade thead th {
  background: var(--strike-grid-header-bg);
}
.strike-data-grid--striped-rows tbody tr:nth-child(even) td {
  background: var(--strike-grid-stripe);
}
.strike-data-grid--striped-dataset tbody tr.strike-data-grid__row--stripe td {
  background: var(--strike-grid-stripe);
}
.strike-data-grid--striped-columns tbody td:not(.strike-data-grid__cell--select):not(.strike-data-grid__cell--grip):nth-child(even),
.strike-data-grid--striped-columns thead th:not(.strike-data-grid__cell--select):not(.strike-data-grid__cell--grip):nth-child(even) {
  background: var(--strike-grid-stripe);
}
.strike-data-grid__row--selected td {
  background: var(--strike-grid-selected);
}
.strike-data-grid__sort {
  font: inherit;
  font-weight: 600;
  background: none;
  border: 0;
  padding: 0;
  cursor: pointer;
  color: inherit;
  text-align: inherit;
}
.strike-data-grid__sort:focus-visible {
  outline: 2px solid var(--strike-accent, #0b6e4f);
  outline-offset: 1px;
}
.strike-data-grid__editor .strike-field,
.strike-data-grid__editor .strike-number,
.strike-data-grid__editor .strike-check {
  gap: 0;
  width: 100%;
}
.strike-data-grid__editor .strike-field__label,
.strike-data-grid__editor .strike-number__label {
  display: none;
}
.strike-data-grid__editor .strike-field__input,
.strike-data-grid__editor .strike-number__input {
  padding: 0.25rem 0.35rem;
  width: 100%;
  box-sizing: border-box;
}
.strike-data-grid__cell--select,
.strike-data-grid__cell--grip {
  width: 2.25rem;
  text-align: center;
  padding-left: 0.35rem;
  padding-right: 0.35rem;
}
.strike-data-grid__cell--editable {
  cursor: cell;
}
.strike-data-grid__grip {
  cursor: grab;
  user-select: none;
  touch-action: none;
  border: 0;
  background: none;
  font: inherit;
  padding: 0.35rem 0.25rem;
  margin: 0;
  color: var(--strike-muted, #5c5c5c);
  border-radius: 0.25rem;
  line-height: 0;
  vertical-align: middle;
}
.strike-data-grid__grip:hover,
.strike-data-grid__grip:focus-visible {
  color: var(--strike-fg, #1a1a1a);
  background: var(--strike-fill, #f0f0ee);
}
.strike-data-grid__grip:focus-visible {
  outline: 2px solid var(--strike-accent, #0b6e4f);
  outline-offset: 1px;
}
.strike-data-grid__grip:active,
.strike-data-grid--dnd .strike-data-grid__grip {
  cursor: grabbing;
}
.strike-data-grid__grip-icon {
  display: block;
  width: 0.65rem;
  height: 1rem;
  background-image: radial-gradient(
    circle closest-side,
    currentColor 1.15px,
    transparent 1.25px
  );
  background-size: 0.325rem 0.325rem;
  background-position: 0 0;
  opacity: 0.7;
}
.strike-data-grid__header {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  min-width: 0;
}
.strike-data-grid__row--dragging td {
  opacity: 0.45;
}
.strike-data-grid__row--drop td {
  box-shadow: inset 0 2px 0 0 var(--strike-accent, #0b6e4f);
}
.strike-data-grid__th--dragging {
  opacity: 0.45;
}
.strike-data-grid__th--drop {
  box-shadow: inset 2px 0 0 0 var(--strike-accent, #0b6e4f);
}
.strike-data-grid--dnd {
  user-select: none;
}
.strike-data-grid--dnd .strike-data-grid__scroller {
  cursor: grabbing;
}
.strike-data-grid__cell--focus {
  outline: 2px solid var(--strike-accent, #0b6e4f);
  outline-offset: -2px;
}
`;

function sortCue(item) {
	if (!item) return '';
	return item.sort === 'desc' ? ' v' : ' ^';
}

function ariaSortValue(item) {
	if (!item) return 'none';
	return item.sort === 'desc' ? 'descending' : 'ascending';
}

function GripIcon() {
	return h('span', {
		class: 'strike-data-grid__grip-icon',
		'aria-hidden': 'true'
	});
}

function FocusEditor({ children }) {
	const ref = useRef(null);
	useLayoutEffect(() => {
		const root = ref.current;
		if (!root) return;
		const el =
			root.querySelector('input, select, textarea, button') || root;
		if (el && el.focus) el.focus();
	}, []);
	return h('div', { class: 'strike-data-grid__editor', ref }, children);
}

function editKeys(onCommit, onCancel) {
	return e => {
		if (e.key === 'Enter') {
			e.preventDefault();
			onCommit();
		}
		if (e.key === 'Escape') {
			e.preventDefault();
			onCancel();
		}
	};
}

function DefaultEditor({ col, value, onValueChange, onCommit, onCancel }) {
	const type = col.type || 'string';
	const label = String(col.headerName || col.field);
	const onKeyDown = editKeys(onCommit, onCancel);
	if (type === 'boolean') {
		return h(Check, {
			checked: !!value,
			'aria-label': label,
			onChange: e => {
				onValueChange(e.target.checked);
				onCommit();
			}
		});
	}
	if (type === 'number') {
		return h(NumberField, {
			value: value == null ? '' : value,
			'aria-label': label,
			onChange: e => onValueChange(e.target.valueAsNumber),
			onBlur: () => onCommit(),
			onKeyDown
		});
	}
	if (type === 'date') {
		let dateVal = '';
		if (value != null && value !== '') {
			const d = value instanceof Date ? value : new Date(value);
			if (!Number.isNaN(d.getTime())) {
				dateVal = d.toISOString().slice(0, 10);
			} else {
				dateVal = String(value).slice(0, 10);
			}
		}
		return h(Field, {
			type: 'date',
			value: dateVal,
			'aria-label': label,
			onInput: e => onValueChange(e.target.value),
			onKeyDown,
			onBlur: () => onCommit()
		});
	}
	return h(Field, {
		value: value == null ? '' : value,
		'aria-label': label,
		onInput: e => onValueChange(e.target.value),
		onKeyDown,
		onBlur: () => onCommit()
	});
}

function isCoarsePointer() {
	try {
		return (
			typeof matchMedia === 'function' &&
			matchMedia('(pointer: coarse)').matches
		);
	} catch (_) {
		return false;
	}
}

export function DataGrid({
	columns,
	rows = [],
	getRowId,
	processRowUpdate,
	onProcessRowUpdateError,
	caption,
	class: className,
	density = 'md',
	striped = false,
	stripedRowScope = 'page',
	headerShade = 'muted',
	stickyHeader = true,
	getRowClassName,
	checkboxSelection = false,
	isRowSelectable,
	disableColumnSorting = false,
	disableQuickFilter = false,
	hideFooter = false,
	loading = false,
	loadingOverlay,
	empty,
	toolbar,
	quickFilterPlaceholder = 'Filter rows',
	pageSizeOptions = [10, 25, 50],
	sortingMode = 'client',
	filterMode = 'client',
	paginationMode = 'client',
	rowCount: rowCountProp,
	sortModel: sortModelProp,
	defaultSortModel = [],
	onSortModelChange,
	quickFilterValue: quickFilterProp,
	defaultQuickFilterValue = '',
	onQuickFilterValueChange,
	filterModel: filterModelProp,
	defaultFilterModel = { items: [] },
	onFilterModelChange,
	paginationModel: paginationProp,
	defaultPaginationModel = { page: 0, pageSize: 10 },
	onPaginationModelChange,
	selectionModel: selectionProp,
	defaultSelectionModel = [],
	onSelectionModelChange,
	columnVisibilityModel: visibilityProp,
	defaultColumnVisibilityModel = {},
	onColumnVisibilityModelChange,
	editCell: editCellProp,
	defaultEditCell = null,
	onEditCellChange,
	editMode = 'cell',
	editOnClick = false,
	enableGridKeyboard = false,
	rowOrderModel: rowOrderProp,
	defaultRowOrderModel,
	onRowOrderChange,
	columnOrderModel: colOrderProp,
	defaultColumnOrderModel,
	onColumnOrderChange,
	columnWidthModel: colWidthProp,
	defaultColumnWidthModel = {},
	onColumnWidthChange,
	disableColumnResize = false,
	rowReorderMode = 'client',
	virtualize = false,
	getRowHeight = 36,
	onRowClick,
	...rest
}) {
	if (typeof getRowId !== 'function') {
		throw new Error('DataGrid getRowId is required');
	}

	const [sortModel, setSortModel] = useControllable(
		sortModelProp,
		defaultSortModel,
		onSortModelChange
	);
	const [quickFilter, setQuickFilter] = useControllable(
		quickFilterProp,
		defaultQuickFilterValue,
		onQuickFilterValueChange
	);
	const [filterModel, setFilterModel] = useControllable(
		filterModelProp,
		defaultFilterModel,
		onFilterModelChange
	);
	const [paginationModel, setPaginationModel] = useControllable(
		paginationProp,
		defaultPaginationModel,
		onPaginationModelChange
	);
	const [selectionModel, setSelectionModel] = useControllable(
		selectionProp,
		defaultSelectionModel,
		onSelectionModelChange
	);
	const [visibilityModel, setVisibilityModel] = useControllable(
		visibilityProp,
		defaultColumnVisibilityModel,
		onColumnVisibilityModelChange
	);
	const [editCell, setEditCell] = useControllable(
		editCellProp,
		defaultEditCell,
		onEditCellChange
	);
	const [rowOrderModel, setRowOrderModel] = useControllable(
		rowOrderProp,
		defaultRowOrderModel,
		onRowOrderChange
	);
	const [columnOrderModel, setColumnOrderModel] = useControllable(
		colOrderProp,
		defaultColumnOrderModel,
		onColumnOrderChange
	);
	const [columnWidthModel, setColumnWidthModel] = useControllable(
		colWidthProp,
		defaultColumnWidthModel,
		onColumnWidthChange
	);

	const [draft, setDraft] = useState(null);
	const editCellRef = useRef(editCell);
	editCellRef.current = editCell;
	const draftRef = useRef(draft);
	draftRef.current = draft;
	const [focusPos, setFocusPos] = useState({ row: 0, col: 0 });
	const [scrollTop, setScrollTop] = useState(0);
	const [viewportH, setViewportH] = useState(280);
	const scrollerRef = useRef(null);
	const [dragRowId, setDragRowId] = useState(null);
	const [dropRowIndex, setDropRowIndex] = useState(-1);
	const [dragColField, setDragColField] = useState(null);
	const [dropColIndex, setDropColIndex] = useState(-1);
	const [resizeField, setResizeField] = useState(null);
	const dragRowIdRef = useRef(null);
	const dropRowIndexRef = useRef(-1);
	const dragColFieldRef = useRef(null);
	const dropColIndexRef = useRef(-1);
	const displayRowsRef = useRef([]);
	const colsRef = useRef([]);
	const rowOrderRef = useRef(null);
	const colOrderRef = useRef(null);
	const colWidthRef = useRef(columnWidthModel);
	colWidthRef.current = columnWidthModel;
	const resizeRef = useRef(null);

	const rowReorderEnabled =
		rowOrderModel != null ||
		defaultRowOrderModel != null ||
		!!onRowOrderChange;
	const colReorderEnabled =
		columnOrderModel != null ||
		defaultColumnOrderModel != null ||
		!!onColumnOrderChange;
	const sortDisabled = disableColumnSorting || rowReorderEnabled;

	function updateDraft(next) {
		draftRef.current = next;
		setDraft(next);
	}

	let cols = (columns || []).map(normalizeColumn);
	cols = cols.filter(c => visibilityModel[c.field] !== false);
	cols = applyColumnOrder(cols, columnOrderModel);

	const pageSize = Math.max(1, (paginationModel && paginationModel.pageSize) || 10);
	const modelPage = (paginationModel && paginationModel.page) | 0;
	const rowHeight = typeof getRowHeight === 'number' ? getRowHeight : 36;

	let pipeline = rows;
	if (filterMode !== 'server') {
		pipeline = applyFilterModel(pipeline, cols, filterModel);
		pipeline = applyQuickFilter(pipeline, cols, quickFilter);
	}
	if (sortingMode !== 'server' && !rowReorderEnabled) {
		pipeline = applySort(pipeline, cols, sortModel);
	}
	if (rowReorderEnabled && rowReorderMode !== 'server') {
		pipeline = applyRowOrder(pipeline, getRowId, rowOrderModel || []);
	}

	const filteredCount =
		paginationMode === 'server'
			? rowCountProp != null
				? rowCountProp
				: rows.length
			: pipeline.length;
	const page = clampPage(modelPage, filteredCount, pageSize);
	const pages = pageCount(filteredCount, pageSize);

	useLayoutEffect(() => {
		if (page !== modelPage) {
			setPaginationModel({ ...paginationModel, page });
		}
	}, [page, modelPage]);

	useEffect(() => {
		const el = scrollerRef.current;
		if (!el || !virtualize) return;
		const measure = () => setViewportH(el.clientHeight || 280);
		measure();
		if (typeof ResizeObserver === 'function') {
			const ro = new ResizeObserver(measure);
			ro.observe(el);
			return () => ro.disconnect();
		}
	}, [virtualize]);

	let visible =
		paginationMode === 'server'
			? rows
			: applyPagination(pipeline, page, pageSize);

	const datasetIndex = new Map();
	pipeline.forEach((r, i) => datasetIndex.set(getRowId(r), i));

	let padTop = 0;
	let padBottom = 0;
	let displayRows = visible;
	if (virtualize && visible.length) {
		const wr = windowRange(scrollTop, viewportH, visible.length, rowHeight);
		displayRows = visible.slice(wr.start, wr.end);
		padTop = wr.offsetTop;
		padBottom = Math.max(
			0,
			wr.totalHeight - wr.offsetTop - displayRows.length * rowHeight
		);
	}
	displayRowsRef.current = displayRows;
	colsRef.current = cols;
	rowOrderRef.current = rowOrderModel;
	colOrderRef.current = columnOrderModel;

	function elementAt(clientX, clientY) {
		const el =
			typeof document !== 'undefined' && document.elementFromPoint
				? document.elementFromPoint(clientX, clientY)
				: null;
		if (!el || typeof el.closest !== 'function') return null;
		return el;
	}

	function visibleRowIndex(tr) {
		if (!tr || !tr.parentNode || tr.getAttribute('aria-hidden') === 'true') {
			return -1;
		}
		const kids = [...tr.parentNode.children].filter(
			n => n.getAttribute('aria-hidden') !== 'true'
		);
		return kids.indexOf(tr);
	}

	function dataRowIndexFromPoint(clientX, clientY) {
		const el = elementAt(clientX, clientY);
		if (!el) return -1;
		return visibleRowIndex(el.closest('tbody tr'));
	}

	function dataColIndexFromPoint(clientX, clientY) {
		const el = elementAt(clientX, clientY);
		if (!el) return -1;
		const th = el.closest('th[data-grid-col]');
		if (!th) return -1;
		const n = Number(th.getAttribute('data-grid-col'));
		return Number.isFinite(n) ? n : -1;
	}

	function clearRowDrag() {
		dragRowIdRef.current = null;
		dropRowIndexRef.current = -1;
		setDragRowId(null);
		setDropRowIndex(-1);
	}

	function clearColDrag() {
		dragColFieldRef.current = null;
		dropColIndexRef.current = -1;
		setDragColField(null);
		setDropColIndex(-1);
	}

	function clearColResize() {
		resizeRef.current = null;
		setResizeField(null);
	}

	function asPx(raw) {
		if (raw == null || raw === '') return undefined;
		const n = typeof raw === 'number' ? raw : Number(raw);
		return Number.isFinite(n) ? n : undefined;
	}

	/** Model px, else col.width (number or CSS length string for Table). */
	function columnPixelWidth(col) {
		const fromModel =
			columnWidthModel && columnWidthModel[col.field] != null
				? asPx(columnWidthModel[col.field])
				: undefined;
		if (fromModel != null) return fromModel;
		const w = col.width;
		if (w == null || w === '') return undefined;
		const px = asPx(w);
		if (px != null) return px;
		return typeof w === 'string' ? w : undefined;
	}

	function resolveStartWidth(col, field, th) {
		const measured = th && th.offsetWidth > 0 ? th.offsetWidth : 0;
		return clampColumnWidth(
			col,
			measured ||
				asPx(colWidthRef.current && colWidthRef.current[field]) ||
				asPx(col.width) ||
				120
		);
	}

	/**
	 * Snapshot every data column to px so fixed+max-content layout does not
	 * mix auto/% siblings with one resized column.
	 */
	function freezeColumnWidths(activeField, activePx) {
		const root = scrollerRef.current;
		const list = colsRef.current || [];
		const next = { ...(colWidthRef.current || {}) };
		for (let i = 0; i < list.length; i++) {
			const c = list[i];
			const f = c.field;
			if (f === activeField) {
				next[f] = clampColumnWidth(c, activePx);
				continue;
			}
			const existing = asPx(next[f]);
			if (existing != null) {
				next[f] = clampColumnWidth(c, existing);
				continue;
			}
			let measured = 0;
			if (root) {
				const th = root.querySelector(
					'thead th[data-grid-col="' + i + '"]'
				);
				if (th && th.offsetWidth > 0) measured = th.offsetWidth;
			}
			if (measured > 0) {
				next[f] = clampColumnWidth(c, measured);
				continue;
			}
			const fromCol = asPx(c.width);
			if (fromCol != null) next[f] = clampColumnWidth(c, fromCol);
		}
		return next;
	}

	function beginColumnResize(field, col, clientX, th) {
		const startW = resolveStartWidth(col, field, th);
		const frozen = freezeColumnWidths(field, startW);
		colWidthRef.current = frozen;
		setColumnWidthModel(frozen);
		resizeRef.current = { field, startX: clientX, startW };
		setResizeField(field);
	}

	function applyColumnWidth(field, col, px) {
		const next = {
			...(colWidthRef.current || {}),
			[field]: clampColumnWidth(col, px)
		};
		colWidthRef.current = next;
		setColumnWidthModel(next);
	}

	useLayoutEffect(() => {
		if (!enableGridKeyboard || editCell) return;
		const root = scrollerRef.current;
		if (!root) return;
		const el = root.querySelector(
			'[data-grid-row="' +
				focusPos.row +
				'"][data-grid-col="' +
				focusPos.col +
				'"]'
		);
		if (
			el &&
			typeof el.focus === 'function' &&
			document.activeElement !== el
		) {
			el.focus();
		}
	}, [focusPos.row, focusPos.col, enableGridKeyboard, editCell]);

	function cancelEdit() {
		editCellRef.current = null;
		draftRef.current = null;
		setEditCell(null);
		setDraft(null);
	}

	function resetPage() {
		if (modelPage !== 0) setPaginationModel({ ...paginationModel, page: 0 });
	}

	async function commitEdit() {
		const cell = editCellRef.current;
		if (!cell) return;
		const row = rows.find(r => getRowId(r) === cell.id);
		if (!row) {
			cancelEdit();
			return;
		}
		if (!processRowUpdate) {
			cancelEdit();
			return;
		}
		let newRow = row;
		if (editMode === 'row' || (cell.field == null && draftRef.current && typeof draftRef.current === 'object')) {
			const draftObj = draftRef.current || {};
			newRow = { ...row };
			for (const col of cols) {
				if (!isColumnEditable(col)) continue;
				if (!(col.field in draftObj)) continue;
				const parsed = parseByType(col.type, draftObj[col.field]);
				newRow = buildUpdatedRow(newRow, col.field, parsed, col);
			}
		} else {
			const col = cols.find(c => c.field === cell.field);
			if (!col) {
				cancelEdit();
				return;
			}
			const parsed = parseByType(col.type, draftRef.current);
			newRow = buildUpdatedRow(row, col.field, parsed, col);
		}
		try {
			await processRowUpdate(newRow, row);
			cancelEdit();
		} catch (err) {
			if (onProcessRowUpdateError) onProcessRowUpdateError(err);
		}
	}

	function startEdit(row, col) {
		const id = getRowId(row);
		const rIdx = displayRows.findIndex(r => getRowId(r) === id);
		const prev = editCellRef.current;
		if (prev && (prev.id !== id || prev.field !== (col && col.field))) {
			void commitEdit();
		}
		if (editMode === 'row') {
			const draftObj = {};
			for (const c of cols) {
				if (isColumnEditable(c)) draftObj[c.field] = getCellValue(row, c);
			}
			if (rIdx >= 0) setFocusPos({ row: rIdx, col: 0 });
			setEditCell({ id, field: null });
			updateDraft(draftObj);
			return;
		}
		if (!col || !isColumnEditable(col)) return;
		const ci = cols.findIndex(c => c.field === col.field);
		if (rIdx >= 0 && ci >= 0) {
			setFocusPos({ row: rIdx, col: ci });
		}
		setEditCell({ id, field: col.field });
		updateDraft(getCellValue(row, col));
	}

	function setDraftField(field, value) {
		const cur =
			draftRef.current && typeof draftRef.current === 'object'
				? { ...draftRef.current }
				: {};
		cur[field] = value;
		updateDraft(cur);
	}

	const selectableIds = selectableVisibleIds(
		displayRows,
		getRowId,
		isRowSelectable
	);
	const selState = selectionState(selectableIds, selectionModel);

	function rowClassName(row) {
		const id = getRowId(row);
		const selected =
			selectionModel && selectionModel.indexOf(id) >= 0
				? 'strike-data-grid__row--selected'
				: null;
		const stripe =
			striped &&
			(striped === true || striped === 'rows' || striped === 'both') &&
			stripedRowScope === 'dataset' &&
			(datasetIndex.get(id) | 0) % 2 === 1
				? 'strike-data-grid__row--stripe'
				: null;
		const drop =
			dragRowId != null &&
			dropRowIndex >= 0 &&
			displayRows[dropRowIndex] &&
			getRowId(displayRows[dropRowIndex]) === id
				? 'strike-data-grid__row--drop'
				: null;
		const dragging =
			dragRowId != null && dragRowId === id
				? 'strike-data-grid__row--dragging'
				: null;
		const extra = getRowClassName ? getRowClassName(row) : null;
		return cls(selected, stripe, drop, dragging, extra);
	}

	const tableColumns = [];

	if (rowReorderEnabled) {
		tableColumns.push({
			key: '__grip',
			headerClass: 'strike-data-grid__cell--grip',
			class: 'strike-data-grid__cell--grip',
			label: '',
			render: row => {
				const id = getRowId(row);
				const order = rowOrderModel || pipeline.map(getRowId);
				const idx = order.indexOf(id);
				const displayIdx = displayRows.findIndex(r => getRowId(r) === id);
				return h(
					'button',
					{
						type: 'button',
						class: 'strike-data-grid__grip',
						'aria-label': 'Reorder row',
						title: 'Drag to reorder',
						disabled: loading || !!editCell,
						onPointerDown: e => {
							if (loading || editCell) return;
							e.preventDefault();
							e.currentTarget.setPointerCapture(e.pointerId);
							dragRowIdRef.current = id;
							dropRowIndexRef.current = displayIdx;
							setDragRowId(id);
							setDropRowIndex(displayIdx);
						},
						onPointerMove: e => {
							if (dragRowIdRef.current == null) return;
							const next = dataRowIndexFromPoint(e.clientX, e.clientY);
							if (next < 0 || next === dropRowIndexRef.current) return;
							dropRowIndexRef.current = next;
							setDropRowIndex(next);
						},
						onPointerUp: e => {
							const dragId = dragRowIdRef.current;
							if (dragId == null) return;
							try {
								e.currentTarget.releasePointerCapture(e.pointerId);
							} catch (_) {}
							const dropIdx = dropRowIndexRef.current;
							const rowsNow = displayRowsRef.current;
							const orderNow =
								rowOrderRef.current || rowsNow.map(getRowId);
							if (
								rowReorderMode !== 'server' &&
								dropIdx >= 0 &&
								rowsNow[dropIdx]
							) {
								const targetId = getRowId(rowsNow[dropIdx]);
								const to = orderNow.indexOf(targetId);
								setRowOrderModel(moveItem(orderNow.slice(), dragId, to));
							} else if (rowReorderMode === 'server' && onRowOrderChange) {
								onRowOrderChange(
									moveItem(
										orderNow.slice(),
										dragId,
										dropIdx >= 0 ? dropIdx : idx
									)
								);
							}
							clearRowDrag();
						},
						onPointerCancel: () => clearRowDrag(),
						onKeyDown: e => {
							if (e.key === 'Escape') {
								clearRowDrag();
								return;
							}
							if (loading || editCell) return;
							if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return;
							e.preventDefault();
							const delta = e.key === 'ArrowUp' ? -1 : 1;
							const next = idx + delta;
							if (next < 0 || next >= order.length) return;
							setRowOrderModel(moveItem(order.slice(), id, next));
						}
					},
					h(GripIcon)
				);
			}
		});
	}

	if (checkboxSelection) {
		tableColumns.push({
			key: '__select',
			headerClass: 'strike-data-grid__cell--select',
			class: 'strike-data-grid__cell--select',
			label: h(Check, {
				'aria-label': 'Select all rows',
				checked: selState === 'all',
				indeterminate: selState === 'some',
				onChange: e => {
					setSelectionModel(
						setVisibleSelection(
							selectionModel,
							selectableIds,
							e.target.checked
						)
					);
				}
			}),
			render: row => {
				const id = getRowId(row);
				const ok = !isRowSelectable || isRowSelectable(row);
				return h(Check, {
					'aria-label': 'Select row',
					checked: selectionModel.indexOf(id) >= 0,
					disabled: !ok,
					onClick: e => e.stopPropagation(),
					onChange: () => {
						if (!ok) return;
						setSelectionModel(toggleId(selectionModel, id));
					}
				});
			}
		});
	}

	for (let ci = 0; ci < cols.length; ci++) {
		const col = cols[ci];
		const field = col.field;
		const sortable = !sortDisabled && col.sortable;
		const align = col.align || defaultAlign(col.type);
		const sortItem = sortModel && sortModel.find(s => s.field === field);
		const editingId =
			editCell &&
			(editMode === 'row' ? editCell.id : editCell.field === field ? editCell.id : null);

		tableColumns.push({
			key: field,
			headerClass: cls(
				col.headerClassName,
				dragColField === field && 'strike-data-grid__th--dragging',
				dropColIndex === ci &&
					dragColField &&
					dragColField !== field &&
					'strike-data-grid__th--drop'
			),
			headerProps: {
				'aria-sort': ariaSortValue(sortItem),
				'data-grid-col': String(ci)
			},
			class: row => {
				const id = getRowId(row);
				const parts = [
					typeof col.cellClassName === 'function'
						? col.cellClassName(row)
						: col.cellClassName,
					isColumnEditable(col) && 'strike-data-grid__cell--editable'
				];
				const rIdx = displayRows.findIndex(r => getRowId(r) === id);
				if (
					enableGridKeyboard &&
					focusPos.row === rIdx &&
					focusPos.col === ci
				) {
					parts.push('strike-data-grid__cell--focus');
				}
				return cls(...parts);
			},
			width: columnPixelWidth(col),
			align,
			label: h(
				'span',
				{ class: 'strike-data-grid__header' },
				colReorderEnabled
					? h(
							'button',
							{
								type: 'button',
								class: 'strike-data-grid__grip',
								'aria-label':
									'Reorder column ' + String(col.headerName || field),
								title: 'Drag to reorder',
								disabled: loading || !!editCell,
								onPointerDown: e => {
									if (loading || editCell) return;
									e.preventDefault();
									e.stopPropagation();
									e.currentTarget.setPointerCapture(e.pointerId);
									dragColFieldRef.current = field;
									dropColIndexRef.current = ci;
									setDragColField(field);
									setDropColIndex(ci);
								},
								onPointerMove: e => {
									if (dragColFieldRef.current == null) return;
									const next = dataColIndexFromPoint(
										e.clientX,
										e.clientY
									);
									if (next < 0 || next === dropColIndexRef.current) {
										return;
									}
									dropColIndexRef.current = next;
									setDropColIndex(next);
								},
								onPointerUp: e => {
									const dragField = dragColFieldRef.current;
									if (dragField == null) return;
									try {
										e.currentTarget.releasePointerCapture(e.pointerId);
									} catch (_) {}
									const order =
										colOrderRef.current ||
										colsRef.current.map(c => c.field);
									const to =
										dropColIndexRef.current >= 0
											? dropColIndexRef.current
											: order.indexOf(dragField);
									setColumnOrderModel(
										moveItem(order.slice(), dragField, to)
									);
									clearColDrag();
								},
								onPointerCancel: () => clearColDrag(),
								onKeyDown: e => {
									if (e.key === 'Escape') {
										clearColDrag();
										return;
									}
									if (loading || editCell) return;
									if (
										e.key !== 'ArrowLeft' &&
										e.key !== 'ArrowRight'
									) {
										return;
									}
									e.preventDefault();
									const order =
										columnOrderModel || cols.map(c => c.field);
									const i = order.indexOf(field);
									const next = i + (e.key === 'ArrowLeft' ? -1 : 1);
									if (i < 0 || next < 0 || next >= order.length) {
										return;
									}
									setColumnOrderModel(
										moveItem(order.slice(), field, next)
									);
								}
							},
							h(GripIcon)
						)
					: null,
				sortable
					? h(
							'button',
							{
								type: 'button',
								class: 'strike-data-grid__sort',
								'aria-label': 'Sort by ' + String(col.headerName || field),
								onClick: e => {
									cancelEdit();
									setSortModel(
										cycleSortModel(sortModel, field, {
											append: !!e.shiftKey
										})
									);
									resetPage();
								}
							},
							col.headerName != null ? col.headerName : field,
							sortCue(sortItem)
						)
					: col.headerName != null
						? col.headerName
						: field,
				!disableColumnResize && col.resizable !== false
					? h('button', {
							type: 'button',
							class: cls(
								'strike-data-grid__col-resizer',
								resizeField === field &&
									'strike-data-grid__col-resizer--active'
							),
							'aria-label':
								'Resize column ' + String(col.headerName || field),
							'aria-orientation': 'vertical',
							disabled: loading,
							onPointerDown: e => {
								if (loading) return;
								e.preventDefault();
								e.stopPropagation();
								clearColDrag();
								beginColumnResize(
									field,
									col,
									e.clientX,
									e.currentTarget.closest('th')
								);
								e.currentTarget.setPointerCapture(e.pointerId);
							},
							onPointerMove: e => {
								const st = resizeRef.current;
								if (!st || st.field !== field) return;
								applyColumnWidth(
									field,
									col,
									st.startW + (e.clientX - st.startX)
								);
							},
							onPointerUp: e => {
								if (resizeRef.current == null) return;
								try {
									e.currentTarget.releasePointerCapture(e.pointerId);
								} catch (_) {}
								clearColResize();
							},
							onPointerCancel: () => clearColResize(),
							onKeyDown: e => {
								if (e.key === 'Escape') {
									clearColResize();
									return;
								}
								if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') {
									return;
								}
								e.preventDefault();
								const th = e.currentTarget.closest('th');
								const cur = resolveStartWidth(col, field, th);
								const frozen = freezeColumnWidths(field, cur);
								const delta = e.key === 'ArrowLeft' ? -8 : 8;
								const next = {
									...frozen,
									[field]: clampColumnWidth(col, cur + delta)
								};
								colWidthRef.current = next;
								setColumnWidthModel(next);
							}
						})
					: null
			),
			render: row => {
				const id = getRowId(row);
				const rowEditing = editingId === id;
				const rIdx = displayRows.findIndex(r => getRowId(r) === id);
				const isFocused =
					enableGridKeyboard &&
					focusPos.row === rIdx &&
					focusPos.col === ci;
				if (
					rowEditing &&
					(editMode !== 'row' || isColumnEditable(col))
				) {
					const rowMode = editMode === 'row';
					const params = {
						row,
						value: rowMode
							? (draftRef.current || {})[field]
							: draft,
						field,
						onValueChange: rowMode
							? v => setDraftField(field, v)
							: updateDraft,
						onCommit: commitEdit,
						onCancel: cancelEdit
					};
					return h(
						FocusEditor,
						null,
						col.renderEditCell
							? col.renderEditCell(params)
							: h(DefaultEditor, { col, ...params })
					);
				}
				const content = col.renderCell
					? col.renderCell(row)
					: formatCell(row, col);
				if (!isColumnEditable(col)) return content;
				const allowClick = editOnClick || isCoarsePointer();
				return h(
					'div',
					{
						tabIndex: enableGridKeyboard ? (isFocused ? 0 : -1) : 0,
						role: enableGridKeyboard ? 'gridcell' : 'button',
						'data-grid-cell': '1',
						'data-grid-row': String(rIdx),
						'data-grid-col': String(ci),
						'aria-label': 'Edit ' + String(col.headerName || field),
						onFocus: () => {
							if (!enableGridKeyboard || rIdx < 0) return;
							if (focusPos.row === rIdx && focusPos.col === ci) return;
							setFocusPos({ row: rIdx, col: ci });
						},
						onDblClick: e => {
							e.stopPropagation();
							startEdit(row, col);
						},
						onClick: allowClick
							? e => {
									e.stopPropagation();
									startEdit(row, col);
								}
							: undefined,
						onKeyDown: e => {
							if (editCell) return;
							if (e.key === 'Enter') {
								e.preventDefault();
								startEdit(row, col);
								return;
							}
							if (!enableGridKeyboard || loading) return;
							const keys = [
								'ArrowUp',
								'ArrowDown',
								'ArrowLeft',
								'ArrowRight',
								'Home',
								'End'
							];
							if (!keys.includes(e.key)) return;
							e.preventDefault();
							const next = moveFocus(
								{ row: rIdx, col: ci },
								e.key,
								displayRows.length,
								cols.length
							);
							setFocusPos(next);
						}
					},
					content
				);
			}
		});
	}

	const usePageStripe =
		(striped === true || striped === 'rows' || striped === 'both') &&
		stripedRowScope !== 'dataset';
	const useDatasetStripe =
		(striped === true || striped === 'rows' || striped === 'both') &&
		stripedRowScope === 'dataset';
	const stripeMod = cls(
		usePageStripe && 'strike-data-grid--striped-rows',
		useDatasetStripe && 'strike-data-grid--striped-dataset',
		(striped === 'columns' || striped === 'both') &&
			'strike-data-grid--striped-columns'
	);
	const shadeOn = headerShade !== false && headerShade !== 'none';

	const pageSizeOpts = pageSizeOptions.map(n => ({
		value: String(n),
		label: String(n)
	}));

	return h(
		'section',
		{
			...rest,
			class: cls(
				'strike-data-grid',
				shadeOn && 'strike-data-grid--header-shade',
				stripeMod,
				(dragRowId != null || dragColField != null) && 'strike-data-grid--dnd',
				resizeField != null && 'strike-data-grid--resizing',
				className
			)
		},
		h(
			'div',
			{ class: 'strike-data-grid__toolbar' },
			!disableQuickFilter &&
				h(Field, {
					'aria-label': 'Filter rows',
					placeholder: quickFilterPlaceholder,
					value: quickFilter,
					onInput: e => {
						cancelEdit();
						setQuickFilter(e.target.value);
						resetPage();
					}
				}),
			editMode === 'row' &&
				editCell &&
				h(Btn, {
					type: 'button',
					size: 'sm',
					onClick: () => void commitEdit(),
					children: 'Save row'
				}),
			toolbar
		),
		h(
			'div',
			{
				class: 'strike-data-grid__scroller',
				ref: scrollerRef,
				'aria-busy': loading ? 'true' : undefined,
				onScroll: virtualize
					? e => setScrollTop(e.currentTarget.scrollTop)
					: undefined
			},
			h(Table, {
				role: enableGridKeyboard ? 'grid' : undefined,
				columns: tableColumns,
				rows: displayRows,
				getRowId,
				getRowClassName: rowClassName,
				caption,
				stickyHeader,
				size: density === 'sm' ? 'sm' : undefined,
				empty,
				padTop,
				padBottom,
				onClick: onRowClick
					? e => {
							const tr = e.target.closest('tr');
							if (
								!tr ||
								!tr.parentNode ||
								tr.parentNode.tagName !== 'TBODY'
							) {
								return;
							}
							if (
								e.target.closest(
									'.strike-check, .strike-data-grid__editor, button, input, select, textarea'
								)
							) {
								return;
							}
							const idx = visibleRowIndex(tr);
							if (idx >= 0 && displayRows[idx]) {
								onRowClick(displayRows[idx], e);
							}
						}
					: undefined
			}),
			loading &&
				h(
					'div',
					{ class: 'strike-data-grid__loading' },
					loadingOverlay || 'Loading'
				)
		),
		!hideFooter &&
			h(
				'div',
				{ class: 'strike-data-grid__footer' },
				h(Select, {
					'aria-label': 'Rows per page',
					options: pageSizeOpts,
					value: String(pageSize),
					onChange: e => {
						cancelEdit();
						setPaginationModel({
							page: 0,
							pageSize: Number(e.target.value) || pageSize
						});
					}
				}),
				h(Pagination, {
					page: page + 1,
					count: pages,
					onChange: p => {
						cancelEdit();
						setPaginationModel({
							...paginationModel,
							page: p - 1
						});
					}
				})
			)
	);
}
