# strike-fw-ui

Extended UI controls for [Strike](https://github.com/Lazarus404/strike.js) (`strike-fw`).

## Install

```bash
npm install strike-fw strike-fw-ui
```

Peer: `strike-fw` >= 0.2.1.

## Usage

```js
import { h } from 'strike-fw';
import { Alert, Card, Drawer, Table, Stepper } from 'strike-fw-ui';
```

For DataGrid, use the `strike-fw-datagrid` package.

Link optional tokens after core tokens:

```html
<link rel="stylesheet" href="node_modules/strike-fw/ui/tokens.css" />
<link rel="stylesheet" href="node_modules/strike-fw-ui/tokens.css" />
```

## Shipped controls

Box, Paper, Link, Icon, Divider, Avatar, Badge, Chip, Alert, Progress, Skeleton,
Portal, Card, Container, Grid, List, Accordion, AppBar, Breadcrumbs, Tabs, Tooltip,
Overlay, Drawer, Menu, MenuBar, Snackbar, SnackbarStack, SnackbarHost, Pagination, Navigation,
Table, ImageList, Video, Audio, Stepper.

Mount `<SnackbarHost transition={{ ms: 220 }} />` once for `snackbar.show` / `useSnackbar()`. Pass `transition={false}` to skip motion. Lone `<Snackbar open>` stays for single toasts.

## License

MIT
