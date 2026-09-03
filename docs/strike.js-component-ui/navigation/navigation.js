import { h } from 'strike-fw';
import { css } from 'strike-fw/css';
import { cls } from '../cls.js';
import { Link } from './link.js';

css`
.strike-nav {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  flex-wrap: wrap;
}
.strike-nav--vertical { flex-direction: column; align-items: stretch; }
.strike-nav__link[aria-current="page"] {
  font-weight: 600;
  color: var(--strike-accent, #0b6e4f);
}
`;

export function Navigation({
	items = [],
	orientation = 'horizontal',
	onNavigate,
	class: className,
	...rest
}) {
	return h(
		'nav',
		{
			...rest,
			class: cls(
				'strike-nav',
				orientation === 'vertical' && 'strike-nav--vertical',
				className
			)
		},
		items.map((item, i) =>
			h(
				Link,
				{
					key: i,
					href: item.href,
					underline: 'hover',
					class: 'strike-nav__link',
					'aria-current': item.current ? 'page' : undefined,
					onClick: e => {
						if (onNavigate) {
							e.preventDefault();
							onNavigate(item, e);
						}
					}
				},
				item.label
			)
		)
	);
}
