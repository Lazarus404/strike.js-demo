import { h } from 'strike-fw';
import { css } from 'strike-fw/css';
import { cls } from '../cls.js';

css`
.strike-box { box-sizing: border-box; }
.strike-box--flex { display: flex; }
.strike-box--grid { display: grid; }
.strike-box--inline-flex { display: inline-flex; }
.strike-box--block { display: block; }
.strike-box--none { display: none; }
`;

const AS = {
	div: 1,
	section: 1,
	main: 1,
	span: 1,
	article: 1,
	aside: 1,
	header: 1,
	footer: 1,
	nav: 1
};

function space(v) {
	if (v == null) return undefined;
	if (typeof v === 'number') return 'calc(' + v + ' * var(--strike-space, 0.75rem))';
	return v;
}

export function Box({
	as = 'div',
	p,
	px,
	py,
	m,
	mx,
	my,
	gap,
	display,
	direction,
	align,
	justify,
	width,
	height,
	class: className,
	style,
	children,
	...rest
}) {
	const tag = AS[as] ? as : 'div';
	const st = { ...(style || {}) };
	if (p != null) st.padding = space(p);
	if (px != null) {
		st.paddingLeft = space(px);
		st.paddingRight = space(px);
	}
	if (py != null) {
		st.paddingTop = space(py);
		st.paddingBottom = space(py);
	}
	if (m != null) st.margin = space(m);
	if (mx != null) {
		st.marginLeft = space(mx);
		st.marginRight = space(mx);
	}
	if (my != null) {
		st.marginTop = space(my);
		st.marginBottom = space(my);
	}
	if (gap != null) st.gap = space(gap);
	if (direction) st.flexDirection = direction;
	if (align) st.alignItems = align;
	if (justify) st.justifyContent = justify;
	if (width != null) st.width = width;
	if (height != null) st.height = height;

	const displayClass =
		display === 'flex'
			? 'strike-box--flex'
			: display === 'grid'
				? 'strike-box--grid'
				: display === 'inline-flex'
					? 'strike-box--inline-flex'
					: display === 'block'
						? 'strike-box--block'
						: display === 'none'
							? 'strike-box--none'
							: null;

	return h(
		tag,
		{
			...rest,
			class: cls('strike-box', displayClass, className),
			style: st
		},
		children
	);
}
