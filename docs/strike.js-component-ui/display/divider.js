import { h } from 'strike-fw';
import { css } from 'strike-fw/css';
import { cls } from '../cls.js';

css`
.strike-divider {
  border: 0;
  border-top: 1px solid var(--strike-line, #d4d4d4);
  margin: 0.75rem 0;
}
.strike-divider--vertical {
  display: inline-block;
  width: 1px;
  height: 1.25em;
  margin: 0 0.5rem;
  border: 0;
  background: var(--strike-line, #d4d4d4);
  vertical-align: middle;
}
.strike-divider--labeled {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  border: 0;
  margin: 0.75rem 0;
}
.strike-divider--labeled::before,
.strike-divider--labeled::after {
  content: '';
  flex: 1;
  border-top: 1px solid var(--strike-line, #d4d4d4);
}
.strike-divider__label {
  font-size: 0.85rem;
  color: var(--strike-muted, #5c5c5c);
  white-space: nowrap;
}
`;

export function Divider({
	orientation = 'horizontal',
	label,
	class: className,
	...rest
}) {
	if (label) {
		return h(
			'div',
			{
				...rest,
				role: 'separator',
				'aria-label': typeof label === 'string' ? label : undefined,
				class: cls('strike-divider--labeled', className)
			},
			h('span', { class: 'strike-divider__label' }, label)
		);
	}
	if (orientation === 'vertical') {
		return h('div', {
			...rest,
			role: 'separator',
			'aria-orientation': 'vertical',
			class: cls('strike-divider', 'strike-divider--vertical', className)
		});
	}
	return h('hr', {
		...rest,
		class: cls('strike-divider', className)
	});
}
