import { h, Fragment } from 'strike-fw';
import { css } from 'strike-fw/css';
import { cls } from '../cls.js';
import { Link } from './link.js';

css`
.strike-breadcrumbs ol {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.9rem;
}
.strike-breadcrumbs__sep {
  color: var(--strike-muted, #5c5c5c);
  user-select: none;
}
.strike-breadcrumbs__current {
  color: var(--strike-ink, #1a1a1a);
  font-weight: 600;
}
`;

export function Breadcrumbs({
	items = [],
	separator = '/',
	class: className,
	...rest
}) {
	return h(
		'nav',
		{
			...rest,
			'aria-label': 'Breadcrumb',
			class: cls('strike-breadcrumbs', className)
		},
		h(
			'ol',
			null,
			items.map((item, i) => {
				const last = i === items.length - 1;
				return h(
					Fragment,
					{ key: i },
					i > 0 &&
						h('li', { class: 'strike-breadcrumbs__sep', 'aria-hidden': 'true' }, separator),
					h(
						'li',
						null,
						last || !item.href
							? h(
									'span',
									{
										class: last ? 'strike-breadcrumbs__current' : undefined,
										'aria-current': last ? 'page' : undefined
									},
									item.label
								)
							: h(Link, { href: item.href, underline: 'hover' }, item.label)
					)
				);
			})
		)
	);
}
