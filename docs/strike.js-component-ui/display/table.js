import { h } from 'strike-fw';
import { css } from 'strike-fw/css';
import { cls } from '../cls.js';

css`
.strike-table {
  width: 100%;
  border-collapse: collapse;
  font: inherit;
}
.strike-table th,
.strike-table td {
  padding: 0.5rem 0.65rem;
  border-bottom: 1px solid var(--strike-line, #d4d4d4);
  text-align: left;
}
.strike-table th { font-weight: 600; }
.strike-table--sticky thead th {
  position: sticky;
  top: 0;
  background: var(--strike-grid-header-bg, #fff);
  z-index: 1;
}
.strike-table--sm th,
.strike-table--sm td { padding: 0.35rem 0.5rem; font-size: 0.9rem; }
.strike-table__empty {
  padding: 1rem;
  color: var(--strike-muted, #5c5c5c);
  text-align: center;
}
`;

function cellStyle(col) {
	const style = {};
	if (col.width != null) {
		style.width = typeof col.width === 'number' ? col.width + 'px' : col.width;
	}
	if (col.align) style.textAlign = col.align;
	return Object.keys(style).length ? style : undefined;
}

export function Table({
	columns,
	rows,
	caption,
	stickyHeader,
	size,
	empty,
	getRowId,
	getRowClassName,
	padTop = 0,
	padBottom = 0,
	class: className,
	children,
	...rest
}) {
	if (columns && rows) {
		const spacer = (hgt, key) =>
			hgt > 0
				? h('tr', { key, 'aria-hidden': 'true' }, [
						h('td', {
							colSpan: columns.length,
							style: {
								height: hgt + 'px',
								padding: 0,
								border: 0,
								lineHeight: 0
							}
						})
					])
				: null;
		return h(
			'table',
			{
				...rest,
				class: cls(
					'strike-table',
					stickyHeader && 'strike-table--sticky',
					size === 'sm' && 'strike-table--sm',
					className
				)
			},
			caption && h('caption', null, caption),
			h(
				'thead',
				null,
				h(
					'tr',
					null,
					columns.map(col =>
						h(
							'th',
							{
								key: col.key,
								scope: 'col',
								class: col.headerClass || undefined,
								style: cellStyle(col),
								...(col.headerProps || {})
							},
							col.label
						)
					)
				)
			),
			h(
				'tbody',
				null,
				rows.length === 0
					? h(
							'tr',
							null,
							h(
								'td',
								{ class: 'strike-table__empty', colSpan: columns.length },
								empty || 'No rows'
							)
						)
					: [
							spacer(padTop, '__pad-top'),
							...rows.map((row, i) => {
								const id = getRowId
									? getRowId(row)
									: row.id != null
										? row.id
										: i;
								const rowClass = getRowClassName
									? getRowClassName(row)
									: undefined;
								return h(
									'tr',
									{ key: id, class: rowClass || undefined },
									columns.map(col => {
										const cellClass =
											typeof col.class === 'function'
												? col.class(row)
												: col.class;
										return h(
											'td',
											{
												key: col.key,
												class: cellClass || undefined,
												style: cellStyle(col)
											},
											col.render ? col.render(row) : row[col.key]
										);
									})
								);
							}),
							spacer(padBottom, '__pad-bottom')
						]
			)
		);
	}
	return h(
		'table',
		{
			...rest,
			class: cls(
				'strike-table',
				stickyHeader && 'strike-table--sticky',
				size === 'sm' && 'strike-table--sm',
				className
			)
		},
		children
	);
}

export function THead({ class: className, children, ...rest }) {
	return h('thead', { ...rest, class: className }, children);
}
export function TBody({ class: className, children, ...rest }) {
	return h('tbody', { ...rest, class: className }, children);
}
export function TR({ class: className, children, ...rest }) {
	return h('tr', { ...rest, class: className }, children);
}
export function TH({ class: className, children, ...rest }) {
	return h('th', { ...rest, scope: rest.scope || 'col', class: className }, children);
}
export function TD({ class: className, children, ...rest }) {
	return h('td', { ...rest, class: className }, children);
}
