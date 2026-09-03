import { h, toChildArray } from 'strike-fw';
import { useState } from 'strike-fw/hooks';
import { css } from 'strike-fw/css';
import { cls } from '../cls.js';
import { Icon } from '../display/icon.js';

css`
.strike-accordion { display: flex; flex-direction: column; gap: 0.35rem; }
.strike-accordion__item {
  border: 1px solid var(--strike-line, #d4d4d4);
  border-radius: var(--strike-radius, 6px);
  overflow: hidden;
  background: #fff;
}
.strike-accordion__trigger {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.65rem 0.85rem;
  font: inherit;
  text-align: left;
  background: transparent;
  border: 0;
  cursor: pointer;
  color: inherit;
}
.strike-accordion__trigger:hover { background: var(--strike-fill, #f6f6f4); }
.strike-accordion__trigger:focus-visible {
  outline: 2px solid var(--strike-accent, #0b6e4f);
  outline-offset: -2px;
}
.strike-accordion__trigger[disabled] { opacity: 0.5; cursor: not-allowed; }
.strike-accordion__chevron {
  transition: transform 0.15s ease;
}
.strike-accordion__chevron--open { transform: rotate(180deg); }
.strike-accordion__panel { padding: 0 0.85rem 0.85rem; }
@media (prefers-reduced-motion: reduce) {
  .strike-accordion__chevron { transition: none; }
}
`;

/** Marker component - props are read by Accordion parent. */
export function AccordionItem() {
	return null;
}

export function Accordion({
	type = 'single',
	value,
	defaultValue,
	onChange,
	class: className,
	children,
	...rest
}) {
	const uncontrolled = value === undefined;
	const [inner, setInner] = useState(
		defaultValue != null ? defaultValue : type === 'multiple' ? [] : null
	);
	const current = uncontrolled ? inner : value;

	function setValue(next) {
		if (uncontrolled) setInner(next);
		if (onChange) onChange(next);
	}

	function toggle(id) {
		if (type === 'multiple') {
			const arr = Array.isArray(current) ? current.slice() : [];
			const i = arr.indexOf(id);
			if (i >= 0) arr.splice(i, 1);
			else arr.push(id);
			setValue(arr);
		} else {
			setValue(current === id ? null : id);
		}
	}

	function isOpen(id) {
		if (type === 'multiple') {
			return Array.isArray(current) && current.indexOf(id) >= 0;
		}
		return current === id;
	}

	const items = toChildArray(children).filter(
		c => c && c.props && c.props.id != null
	);

	return h(
		'div',
		{ ...rest, class: cls('strike-accordion', className) },
		items.map(child => {
			const { id, title, disabled, children: body } = child.props;
			const open = isOpen(id);
			const panelId = 'strike-acc-panel-' + id;
			const btnId = 'strike-acc-btn-' + id;
			return h(
				'div',
				{ key: id, class: 'strike-accordion__item' },
				h(
					'button',
					{
						type: 'button',
						id: btnId,
						class: 'strike-accordion__trigger',
						'aria-expanded': open ? 'true' : 'false',
						'aria-controls': panelId,
						disabled,
						onClick: () => toggle(id)
					},
					h('span', null, title),
					h(
						Icon,
						{
							size: 'sm',
							class: cls(
								'strike-accordion__chevron',
								open && 'strike-accordion__chevron--open'
							)
						},
						h(
							'svg',
							{ viewBox: '0 0 24 24', 'aria-hidden': 'true' },
							h('path', { d: 'M7 10l5 5 5-5H7z' })
						)
					)
				),
				open
					? h(
							'div',
							{
								id: panelId,
								role: 'region',
								'aria-labelledby': btnId,
								class: 'strike-accordion__panel'
							},
							body
						)
					: null
			);
		})
	);
}
