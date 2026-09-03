import { h } from 'strike-fw';
import { useEffect, useRef } from 'strike-fw/hooks';
import { css } from 'strike-fw/css';
import { cls } from '../cls.js';
import { Portal } from './portal.js';

css`
.strike-overlay {
  position: fixed;
  inset: 0;
  z-index: var(--strike-z-drawer, 45);
  background: rgba(0, 0, 0, 0.4);
}
.strike-overlay--nodim { background: transparent; }
`;

export function Overlay({
	open,
	onClose,
	dim = true,
	class: className,
	children,
	...rest
}) {
	const panelRef = useRef(null);

	useEffect(() => {
		if (!open || !onClose) return;
		function onKey(e) {
			if (e.key === 'Escape') onClose(e);
		}
		window.addEventListener('keydown', onKey);
		const el = panelRef.current;
		if (el && typeof el.focus === 'function') {
			try {
				el.focus();
			} catch (_) {}
		}
		return () => window.removeEventListener('keydown', onKey);
	}, [open]);

	if (!open) return null;

	return h(
		Portal,
		null,
		h(
			'div',
			{
				class: cls('strike-overlay', !dim && 'strike-overlay--nodim', className),
				role: 'presentation',
				onClick: e => {
					if (e.target === e.currentTarget && onClose) onClose(e);
				}
			},
			typeof children === 'function'
				? children({ panelRef, ...rest })
				: children
		)
	);
}

export function focusablePanelProps(panelRef, extra = {}) {
	return {
		...extra,
		ref: panelRef,
		tabIndex: -1
	};
}
