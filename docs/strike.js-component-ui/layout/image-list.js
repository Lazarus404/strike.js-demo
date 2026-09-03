import { h } from 'strike-fw';
import { css } from 'strike-fw/css';
import { Image, Text } from 'strike-fw/ui';
import { cls } from '../cls.js';

css`
.strike-image-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: var(--strike-image-list-gap, 0.5rem);
  grid-template-columns: repeat(var(--strike-image-list-cols, 3), minmax(0, 1fr));
}
.strike-image-list__item {
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}
.strike-image-list__item img {
  width: 100%;
  height: var(--strike-image-list-row, auto);
  object-fit: cover;
  display: block;
  border-radius: var(--strike-radius, 6px);
}
.strike-image-list__title {
  margin: 0;
  font-size: 0.85rem;
}
`;

export function ImageList({
	items = [],
	cols = 3,
	gap = '0.5rem',
	rowHeight,
	variant = 'standard',
	class: className,
	...rest
}) {
	return h(
		'ul',
		{
			...rest,
			class: cls(
				'strike-image-list',
				variant === 'quilted' && 'strike-image-list--quilted',
				className
			),
			style: {
				'--strike-image-list-cols': cols,
				'--strike-image-list-gap': typeof gap === 'number' ? gap + 'px' : gap,
				'--strike-image-list-row':
					rowHeight != null
						? typeof rowHeight === 'number'
							? rowHeight + 'px'
							: rowHeight
						: undefined
			}
		},
		items.map((it, i) =>
			h(
				'li',
				{ key: i, class: 'strike-image-list__item' },
				h('figure', { class: 'strike-image-list__figure' },
					h(Image, { src: it.src, alt: it.alt || '' }),
					it.title &&
						h(Text, { as: 'span', class: 'strike-image-list__title' }, it.title)
				)
			)
		)
	);
}
