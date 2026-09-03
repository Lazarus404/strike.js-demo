import { h } from 'strike-fw';
import { css } from 'strike-fw/css';
import { cls } from '../cls.js';
import { Box } from './box.js';

css`
.strike-grid { width: 100%; }
.strike-grid-item { min-width: 0; }
`;

export function Grid({
	columns = 12,
	gap = 2,
	rowGap,
	columnGap,
	class: className,
	style,
	children,
	...rest
}) {
	const template =
		typeof columns === 'number' ? 'repeat(' + columns + ', minmax(0, 1fr))' : columns;
	return h(
		Box,
		{
			...rest,
			display: 'grid',
			gap: rowGap == null && columnGap == null ? gap : undefined,
			class: cls('strike-grid', className),
			style: {
				gridTemplateColumns: template,
				...(rowGap != null ? { rowGap: typeof rowGap === 'number' ? 'calc(' + rowGap + ' * var(--strike-space, 0.75rem))' : rowGap } : {}),
				...(columnGap != null ? { columnGap: typeof columnGap === 'number' ? 'calc(' + columnGap + ' * var(--strike-space, 0.75rem))' : columnGap } : {}),
				...(style || {})
			}
		},
		children
	);
}

export function GridItem({ colSpan, rowSpan, class: className, style, children, ...rest }) {
	const st = { ...(style || {}) };
	if (colSpan) st.gridColumn = 'span ' + colSpan;
	if (rowSpan) st.gridRow = 'span ' + rowSpan;
	return h(
		'div',
		{
			...rest,
			class: cls('strike-grid-item', className),
			style: st
		},
		children
	);
}
