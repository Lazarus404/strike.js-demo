# strike-fw-datagrid

DataGrid for [Strike](https://github.com/Lazarus404/strike.js).

Peers: `strike-fw` >= 0.2.1 and `strike-fw-ui` >= 0.2.0 (Table, Pagination).

## Install

```bash
npm install strike-fw strike-fw-ui strike-fw-datagrid
```

## Usage

```js
import { DataGrid, rowsToCsv } from 'strike-fw-datagrid';
```

```js
<DataGrid
  columns={[
    { field: 'name', headerName: 'Product', editable: true },
    { field: 'qty', headerName: 'Qty', type: 'number', editable: true }
  ]}
  rows={rows}
  getRowId={r => r.id}
  checkboxSelection
  striped
  processRowUpdate={(next) => {
    setRows(rs => rs.map(r => (r.id === next.id ? next : r)));
    return next;
  }}
/>
```

`processRowUpdate` is required for edits to persist (parent owns `rows`).

## License

MIT
