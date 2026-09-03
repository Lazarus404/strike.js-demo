import { h } from 'strike-fw';
import { css } from 'strike-fw/css';
import { cls } from '../cls.js';

css`
.strike-list {
  list-style: none;
  margin: 0;
  padding: 0;
}
.strike-list--dense .strike-list__item { padding: 0.35rem 0.65rem; }
.strike-list__item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.55rem 0.75rem;
  border-radius: var(--strike-radius, 6px);
}
.strike-list__item--clickable {
  cursor: pointer;
  width: 100%;
  font: inherit;
  text-align: left;
  background: transparent;
  border: 0;
  color: inherit;
}
.strike-list__item--clickable:hover { background: var(--strike-fill, #f6f6f4); }
.strike-list__item--clickable:focus-visible {
  outline: 2px solid var(--strike-accent, #0b6e4f);
  outline-offset: 1px;
}
.strike-list__item--selected {
  background: color-mix(in srgb, var(--strike-accent, #0b6e4f) 12%, #fff);
}
.strike-list__item[aria-disabled="true"] { opacity: 0.5; pointer-events: none; }
.strike-list__main { flex: 1; min-width: 0; }
.strike-list__start,
.strike-list__end { flex-shrink: 0; }
`;

export function List({ dense, class: className, children, ...rest }) {
	return h(
		'ul',
		{
			...rest,
			class: cls('strike-list', dense && 'strike-list--dense', className)
		},
		children
	);
}

export function ListItem({
	selected,
	disabled,
	onClick,
	start,
	end,
	class: className,
	children,
	...rest
}) {
	const body = [
		start && h('span', { class: 'strike-list__start' }, start),
		h('span', { class: 'strike-list__main' }, children),
		end && h('span', { class: 'strike-list__end' }, end)
	];
	if (onClick) {
		return h(
			'li',
			{ class: cls('strike-list__li', className) },
			h(
				'button',
				{
					...rest,
					type: 'button',
					disabled,
					onClick,
					class: cls(
						'strike-list__item',
						'strike-list__item--clickable',
						selected && 'strike-list__item--selected'
					)
				},
				...body
			)
		);
	}
	return h(
		'li',
		{
			...rest,
			class: cls(
				'strike-list__item',
				selected && 'strike-list__item--selected',
				className
			),
			'aria-disabled': disabled || undefined
		},
		...body
	);
}
