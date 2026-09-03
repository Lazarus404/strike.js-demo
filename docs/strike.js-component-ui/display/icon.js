import { h } from 'strike-fw';
import { css } from 'strike-fw/css';
import { cls } from '../cls.js';

css`
.strike-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--strike-icon-size, 1.25rem);
  height: var(--strike-icon-size, 1.25rem);
  flex-shrink: 0;
  line-height: 0;
  color: inherit;
}
.strike-icon svg {
  width: 100%;
  height: 100%;
  fill: currentColor;
}
.strike-icon--sm { --strike-icon-size: 1rem; }
.strike-icon--md { --strike-icon-size: 1.25rem; }
.strike-icon--lg { --strike-icon-size: 1.75rem; }
`;

export function Icon({ size = 'md', label, class: className, children, style, ...rest }) {
	const sizeClass =
		typeof size === 'number'
			? null
			: size === 'sm' || size === 'lg'
				? 'strike-icon--' + size
				: 'strike-icon--md';
	const st = { ...(style || {}) };
	if (typeof size === 'number') {
		st.width = size + 'px';
		st.height = size + 'px';
	}
	const a11y = label
		? { role: 'img', 'aria-label': label }
		: { 'aria-hidden': 'true' };
	return h(
		'span',
		{
			...rest,
			...a11y,
			class: cls('strike-icon', sizeClass, className),
			style: st
		},
		children
	);
}
