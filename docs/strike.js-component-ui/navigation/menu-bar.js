import { h } from 'strike-fw';
import { useState, useRef } from 'strike-fw/hooks';
import { css } from 'strike-fw/css';
import { cls } from '../cls.js';
import { Menu, MenuItem } from './menu.js';

css`
.strike-menubar {
  display: flex;
  gap: 0.15rem;
  align-items: stretch;
}
.strike-menubar__trigger {
  font: inherit;
  padding: 0.4rem 0.75rem;
  border: 0;
  background: transparent;
  cursor: pointer;
  color: inherit;
  border-radius: var(--strike-radius, 6px);
}
.strike-menubar__trigger:hover,
.strike-menubar__trigger[aria-expanded="true"] {
  background: var(--strike-fill, #f6f6f4);
}
.strike-menubar__trigger:focus-visible {
  outline: 2px solid var(--strike-accent, #0b6e4f);
  outline-offset: 1px;
}
`;

export function MenuBar({ items = [], class: className, ...rest }) {
	const [openId, setOpenId] = useState(null);
	const refs = useRef({});

	function onBarKey(e, index) {
		if (e.key === 'ArrowRight') {
			e.preventDefault();
			const next = items[(index + 1) % items.length];
			setOpenId(next.id);
		} else if (e.key === 'ArrowLeft') {
			e.preventDefault();
			const next = items[(index - 1 + items.length) % items.length];
			setOpenId(next.id);
		} else if (e.key === 'ArrowDown') {
			e.preventDefault();
			setOpenId(items[index].id);
		} else if (e.key === 'Escape') {
			setOpenId(null);
		}
	}

	return h(
		'div',
		{
			...rest,
			role: 'menubar',
			class: cls('strike-menubar', className)
		},
		items.map((item, index) => {
			const open = openId === item.id;
			return h(
				'div',
				{ key: item.id, class: 'strike-menubar__slot' },
				h(
					'button',
					{
						type: 'button',
						role: 'menuitem',
						class: 'strike-menubar__trigger',
						'aria-haspopup': 'true',
						'aria-expanded': open,
						ref: el => {
							refs.current[item.id] = el;
						},
						onClick: () => setOpenId(open ? null : item.id),
						onKeyDown: e => onBarKey(e, index)
					},
					item.label
				),
				h(
					Menu,
					{
						open,
						onClose: () => setOpenId(null),
						anchor: { current: refs.current[item.id] }
					},
					(item.children || []).map((child, i) =>
						h(
							MenuItem,
							{
								key: i,
								disabled: child.disabled,
								onSelect: e => {
									if (child.onSelect) child.onSelect(e);
									setOpenId(null);
								}
							},
							child.label
						)
					)
				)
			);
		})
	);
}
