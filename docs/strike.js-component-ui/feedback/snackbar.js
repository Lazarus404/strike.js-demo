import { h } from 'strike-fw';
import { useEffect } from 'strike-fw/hooks';
import { css } from 'strike-fw/css';
import { cls } from '../cls.js';
import { Portal } from '../lib/portal.js';
import { Alert } from './alert.js';

css`
.strike-snackbar {
  position: fixed;
  z-index: var(--strike-z-snackbar, 55);
  left: 1rem;
  right: 1rem;
  display: flex;
  pointer-events: none;
  box-sizing: border-box;
}
.strike-snackbar > * {
  pointer-events: auto;
  max-width: min(24rem, 100%);
  width: fit-content;
  box-sizing: border-box;
}
.strike-snackbar > .strike-alert .strike-alert__body {
  flex: 0 1 auto;
}
.strike-snackbar--bottom { bottom: 1rem; }
.strike-snackbar--top { top: 1rem; }
.strike-snackbar--start { justify-content: flex-start; }
.strike-snackbar--center { justify-content: center; }
.strike-snackbar--end { justify-content: flex-end; }
`;

export function Snackbar({
	open,
	onClose,
	tone,
	children,
	action,
	autoHideMs = 4000,
	placement = 'bottom-center',
	class: className,
	...rest
}) {
	useEffect(() => {
		if (!open || autoHideMs == null || !onClose) return;
		const t = setTimeout(() => onClose(), autoHideMs);
		return () => clearTimeout(t);
	}, [open, autoHideMs, onClose]);

	if (!open) return null;

	const parts = String(placement).split('-');
	const y = parts[0] === 'top' ? 'top' : 'bottom';
	const x = parts[1] === 'start' || parts[1] === 'end' ? parts[1] : 'center';

	return h(
		Portal,
		null,
		h(
			'div',
			{
				class: cls(
					'strike-snackbar',
					'strike-snackbar--' + y,
					'strike-snackbar--' + x,
					className
				)
			},
			h(
				Alert,
				{ ...rest, tone, action, onClose, role: 'status' },
				children
			)
		)
	);
}
