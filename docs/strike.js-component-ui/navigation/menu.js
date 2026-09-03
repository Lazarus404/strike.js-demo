import { h } from 'strike-fw';
import { useEffect, useRef } from 'strike-fw/hooks';
import { css } from 'strike-fw/css';
import { cls } from '../cls.js';
import { Portal } from '../lib/portal.js';
import { Paper } from '../surfaces/paper.js';
import { Divider } from '../display/divider.js';

css`
.strike-menu-root {
  position: fixed;
  inset: 0;
  z-index: var(--strike-z-drawer, 45);
  background: transparent;
}
.strike-menu {
  position: fixed;
  z-index: calc(var(--strike-z-drawer, 45) + 1);
  min-width: 10rem;
  padding: 0.35rem 0;
  margin: 0;
  outline: none;
}
.strike-menu__list {
  list-style: none;
  margin: 0;
  padding: 0;
}
.strike-menu__item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.45rem 0.85rem;
  font: inherit;
  text-align: left;
  background: transparent;
  border: 0;
  cursor: pointer;
  color: inherit;
}
.strike-menu__item:hover,
.strike-menu__item:focus {
  background: var(--strike-fill, #f6f6f4);
  outline: none;
}
.strike-menu__item[disabled] { opacity: 0.5; pointer-events: none; }
.strike-menu__item--destructive { color: var(--strike-danger, #9b2226); }
.strike-menu__sep { margin: 0.35rem 0; list-style: none; }
`;

export function Menu({
	open,
	onClose,
	anchor,
	placement = 'bottom',
	class: className,
	children,
	...rest
}) {
	const listRef = useRef(null);

	useEffect(() => {
		if (!open) return;
		function onKey(e) {
			if (e.key === 'Escape' && onClose) onClose(e);
			const items = listRef.current
				? [...listRef.current.querySelectorAll('[role="menuitem"]:not([disabled])')]
				: [];
			if (!items.length) return;
			const i = items.indexOf(document.activeElement);
			if (e.key === 'ArrowDown') {
				e.preventDefault();
				items[(i + 1 + items.length) % items.length].focus();
			} else if (e.key === 'ArrowUp') {
				e.preventDefault();
				items[(i - 1 + items.length) % items.length].focus();
			} else if (e.key === 'Home') {
				e.preventDefault();
				items[0].focus();
			} else if (e.key === 'End') {
				e.preventDefault();
				items[items.length - 1].focus();
			}
		}
		document.addEventListener('keydown', onKey);
		const first = listRef.current && listRef.current.querySelector('[role="menuitem"]');
		if (first) first.focus();
		return () => document.removeEventListener('keydown', onKey);
	}, [open, onClose]);

	if (!open) return null;

	let style = {};
	const el = anchor && (anchor.current || anchor);
	if (el && el.getBoundingClientRect) {
		const r = el.getBoundingClientRect();
		style =
			placement === 'top'
				? { left: r.left + 'px', top: r.top - 4 + 'px', transform: 'translateY(-100%)' }
				: { left: r.left + 'px', top: r.bottom + 4 + 'px' };
	}

	return h(
		Portal,
		null,
		h(
			'div',
			{
				class: 'strike-menu-root',
				role: 'presentation',
				onClick: e => {
					if (e.target === e.currentTarget && onClose) onClose(e);
				}
			},
			h(
				Paper,
				{
					elevation: 2,
					class: cls('strike-menu', className),
					style,
					onClick: e => e.stopPropagation()
				},
				h(
					'ul',
					{
						...rest,
						ref: listRef,
						role: 'menu',
						tabIndex: -1,
						class: 'strike-menu__list'
					},
					children
				)
			)
		)
	);
}

export function MenuItem({
	onSelect,
	disabled,
	startIcon,
	destructive,
	class: className,
	children,
	...rest
}) {
	return h(
		'li',
		{ role: 'none' },
		h(
			'button',
			{
				...rest,
				type: 'button',
				role: 'menuitem',
				disabled,
				class: cls(
					'strike-menu__item',
					destructive && 'strike-menu__item--destructive',
					className
				),
				onClick: e => {
					if (disabled) return;
					e.stopPropagation();
					if (onSelect) onSelect(e);
				}
			},
			startIcon,
			children
		)
	);
}

export function MenuSeparator(props) {
	return h(
		'li',
		{ role: 'separator', class: cls('strike-menu__sep', props && props.class) },
		h(Divider, null)
	);
}
