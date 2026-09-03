import { h } from 'strike-fw';
import { useState, useEffect, useRef } from 'strike-fw/hooks';
import { css } from 'strike-fw/css';
import { cls } from '../cls.js';

css`
.strike-tabs { display: flex; flex-direction: column; gap: 0.75rem; }
.strike-tabs--vertical { flex-direction: row; align-items: flex-start; }
.strike-tabs__list {
  display: flex;
  gap: 0.25rem;
  border-bottom: 1px solid var(--strike-line, #d4d4d4);
}
.strike-tabs--vertical .strike-tabs__list {
  flex-direction: column;
  border-bottom: 0;
  border-right: 1px solid var(--strike-line, #d4d4d4);
}
.strike-tabs__tab {
  font: inherit;
  padding: 0.5rem 0.85rem;
  border: 0;
  border-bottom: 2px solid transparent;
  background: transparent;
  cursor: pointer;
  color: var(--strike-muted, #5c5c5c);
  margin-bottom: -1px;
}
.strike-tabs--vertical .strike-tabs__tab {
  border-bottom: 0;
  border-right: 2px solid transparent;
  margin-bottom: 0;
  margin-right: -1px;
}
.strike-tabs__tab[aria-selected="true"] {
  color: var(--strike-accent, #0b6e4f);
  border-color: var(--strike-accent, #0b6e4f);
  font-weight: 600;
}
.strike-tabs__tab:focus-visible {
  outline: 2px solid var(--strike-accent, #0b6e4f);
  outline-offset: 2px;
}
.strike-tabs__panel { min-width: 0; flex: 1; }
`;

export function Tabs({
	value,
	defaultValue,
	onChange,
	items = [],
	orientation = 'horizontal',
	class: className,
	...rest
}) {
	const first = items[0] && items[0].id;
	const uncontrolled = value === undefined;
	const [inner, setInner] = useState(defaultValue != null ? defaultValue : first);
	const current = uncontrolled ? inner : value;
	const listRef = useRef(null);

	function select(id) {
		if (uncontrolled) setInner(id);
		if (onChange) onChange(id);
	}

	function onKeyDown(e) {
		const ids = items.map(it => it.id);
		const i = ids.indexOf(current);
		if (i < 0) return;
		const vertical = orientation === 'vertical';
		let next = i;
		if ((!vertical && e.key === 'ArrowRight') || (vertical && e.key === 'ArrowDown')) {
			next = (i + 1) % ids.length;
			e.preventDefault();
		} else if ((!vertical && e.key === 'ArrowLeft') || (vertical && e.key === 'ArrowUp')) {
			next = (i - 1 + ids.length) % ids.length;
			e.preventDefault();
		} else if (e.key === 'Home') {
			next = 0;
			e.preventDefault();
		} else if (e.key === 'End') {
			next = ids.length - 1;
			e.preventDefault();
		} else return;
		select(ids[next]);
		const btns = listRef.current && listRef.current.querySelectorAll('[role="tab"]');
		if (btns && btns[next]) btns[next].focus();
	}

	useEffect(() => {}, [current]);

	const active = items.find(it => it.id === current) || items[0];

	return h(
		'div',
		{
			...rest,
			class: cls(
				'strike-tabs',
				orientation === 'vertical' && 'strike-tabs--vertical',
				className
			)
		},
		h(
			'div',
			{
				ref: listRef,
				role: 'tablist',
				'aria-orientation': orientation,
				class: 'strike-tabs__list',
				onKeyDown
			},
			items.map(it => {
				const selected = it.id === (active && active.id);
				const tabId = 'strike-tab-' + it.id;
				const panelId = 'strike-tabpanel-' + it.id;
				return h(
					'button',
					{
						key: it.id,
						type: 'button',
						role: 'tab',
						id: tabId,
						class: 'strike-tabs__tab',
						'aria-selected': selected,
						'aria-controls': panelId,
						tabIndex: selected ? 0 : -1,
						onClick: () => select(it.id)
					},
					it.label
				);
			})
		),
		active &&
			h(
				'div',
				{
					role: 'tabpanel',
					id: 'strike-tabpanel-' + active.id,
					'aria-labelledby': 'strike-tab-' + active.id,
					class: 'strike-tabs__panel',
					tabIndex: 0
				},
				active.panel
			)
	);
}
