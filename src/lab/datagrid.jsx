import { useState, useMemo } from '../../vendor/strike.core+hooks.js';
import { Stack, Text, Btn } from '../../vendor/strike-ui.js';
import { DataGrid, rowsToCsv } from 'strike-fw-datagrid';

function makeRows(n) {
	const out = [];
	for (let i = 1; i <= n; i++) {
		out.push({
			id: i,
			name: 'Product ' + i,
			qty: (i * 3) % 40,
			active: i % 2 === 0,
			when: '2024-0' + ((i % 9) + 1) + '-15'
		});
	}
	return out;
}

export function DataGridPlayground() {
	const [rows, setRows] = useState(() => makeRows(32));
	const [selected, setSelected] = useState([]);
	const [visibility, setVisibility] = useState({});
	const [colWidths, setColWidths] = useState({
		name: 160,
		qty: 88,
		active: 88,
		when: 120
	});
	const [rowOrder, setRowOrder] = useState(() =>
		makeRows(8).map(r => r.id)
	);
	const [colOrder, setColOrder] = useState(['name', 'qty', 'active']);
	const [serverModel, setServerModel] = useState({ page: 0, pageSize: 5 });
	const allServer = useMemo(() => makeRows(20), []);
	const serverRows = useMemo(() => {
		const start = serverModel.page * serverModel.pageSize;
		return allServer.slice(start, start + serverModel.pageSize);
	}, [allServer, serverModel]);
	const orderedRows = useMemo(() => makeRows(8), []);
	const reorderCols = [
		{ field: 'name', headerName: 'Name', editable: true },
		{ field: 'qty', headerName: 'Qty', type: 'number' },
		{ field: 'active', headerName: 'Active', type: 'boolean' }
	];

	const cols = [
		{ field: 'name', headerName: 'Product', editable: true },
		{ field: 'qty', headerName: 'Qty', type: 'number', editable: true },
		{ field: 'active', headerName: 'Active', type: 'boolean', editable: true },
		{ field: 'when', headerName: 'When', type: 'date', editable: true }
	];

	return (
		<Stack gap={18} class="lab-controls">
			<div
				class="lab-control"
				style={{
					'--strike-grid-selected': '#e8f2ee',
					'--strike-data-grid-max-height': '280px'
				}}
			>
				<Text as="h3" class="lab-control__name">
					DataGrid
				</Text>
				<Text tone="muted">
					Sort (Shift+click multi), filter, page, select, edit. Drag column
					edges to resize. Selected: {selected.join(', ') || 'none'}
				</Text>
				<Btn
					type="button"
					variant="ghost"
					onClick={() =>
						setVisibility(v => ({ ...v, when: v.when === false ? true : false }))
					}
				>
					Toggle When column
				</Btn>
				<Btn
					type="button"
					variant="ghost"
					onClick={() => {
						const csv = rowsToCsv(rows, cols.filter(c => visibility[c.field] !== false));
						const blob = new Blob([csv], { type: 'text/csv' });
						const a = document.createElement('a');
						a.href = URL.createObjectURL(blob);
						a.download = 'grid.csv';
						a.click();
					}}
				>
					Download CSV
				</Btn>
				<DataGrid
					columns={cols}
					rows={rows}
					getRowId={r => r.id}
					checkboxSelection
					isRowSelectable={r => r.id !== 3}
					columnVisibilityModel={visibility}
					onColumnVisibilityModelChange={setVisibility}
					columnWidthModel={colWidths}
					onColumnWidthChange={setColWidths}
					striped
					stripedRowScope="dataset"
					headerShade
					pageSizeOptions={[5, 10, 25]}
					defaultPaginationModel={{ page: 0, pageSize: 5 }}
					selectionModel={selected}
					onSelectionModelChange={setSelected}
					editOnClick={false}
					enableGridKeyboard
					processRowUpdate={next => {
						setRows(rs => rs.map(r => (r.id === next.id ? next : r)));
						return next;
					}}
				/>
			</div>

			<div class="lab-control">
				<Text as="h3" class="lab-control__name">
					DataGrid (reorder + virtualize)
				</Text>
				<Text tone="muted">
					Drag the dotted handle on a row or column header (or focus it and use
					arrow keys). Sort is off while row reorder is on.
				</Text>
				<DataGrid
					columns={reorderCols}
					rows={orderedRows}
					getRowId={r => r.id}
					rowOrderModel={rowOrder}
					onRowOrderChange={setRowOrder}
					columnOrderModel={colOrder}
					onColumnOrderChange={setColOrder}
					virtualize
					getRowHeight={36}
					pageSizeOptions={[8]}
					defaultPaginationModel={{ page: 0, pageSize: 8 }}
					disableQuickFilter
					processRowUpdate={next => next}
				/>
			</div>

			<div class="lab-control">
				<Text as="h3" class="lab-control__name">
					DataGrid (server page)
				</Text>
				<DataGrid
					columns={[{ field: 'name', headerName: 'Name' }]}
					rows={serverRows}
					getRowId={r => r.id}
					paginationMode="server"
					rowCount={allServer.length}
					paginationModel={serverModel}
					onPaginationModelChange={setServerModel}
					pageSizeOptions={[5, 10]}
					disableQuickFilter
				/>
			</div>
		</Stack>
	);
}
