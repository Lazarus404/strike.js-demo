import { h } from 'strike-fw';
import { css } from 'strike-fw/css';
import { cls } from '../cls.js';
import { Overlay } from '../lib/overlay.js';

css`
.strike-drawer {
  position: fixed;
  top: 0;
  bottom: 0;
  width: min(20rem, 90vw);
  max-width: 100%;
  z-index: calc(var(--strike-z-drawer, 45) + 1);
  outline: none;
  display: flex;
  flex-direction: column;
  overflow: auto;
  margin: 0;
  border-radius: 0;
  box-sizing: border-box;
}
.strike-drawer--left { left: 0; }
.strike-drawer--right { right: 0; }
.strike-drawer__title {
  margin: 0;
  padding: 1rem 1rem 0.5rem;
  font-size: 1.1rem;
  font-weight: 600;
}
.strike-drawer__body { padding: 0.75rem 1rem 1rem; flex: 1; }
.strike-drawer--push {
  position: relative;
  inset: auto;
  height: 100%;
}
`;

export function Drawer({
	open,
	onClose,
	side = 'left',
	modal = true,
	title,
	class: className,
	children,
	...rest
}) {
	const panel = panelRef =>
		h(
			'aside',
			{
				...rest,
				ref: panelRef,
				role: 'dialog',
				'aria-modal': modal ? 'true' : undefined,
				tabIndex: -1,
				class: cls(
					'strike-paper',
					'strike-paper--elev-2',
					'strike-drawer',
					'strike-drawer--' + side,
					!modal && 'strike-drawer--push',
					className
				),
				onClick: e => e.stopPropagation()
			},
			title && h('h2', { class: 'strike-drawer__title' }, title),
			h('div', { class: 'strike-drawer__body' }, children)
		);

	if (!modal) {
		if (!open) return null;
		return panel(null);
	}

	return h(Overlay, {
		open,
		onClose,
		children: ({ panelRef }) => panel(panelRef)
	});
}
