import { createPortal } from 'strike-fw';

export function Portal({ to, children }) {
	const target =
		to ||
		(typeof document !== 'undefined' ? document.body : null);
	if (!target) return null;
	return createPortal(children, target);
}
