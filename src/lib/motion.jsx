import { useState, useEffect, useLayoutEffect, useRef } from '../../vendor/strike.core+hooks.js';
import {
	useTransition,
	flipLayout
} from '../../vendor/transition.js';
import { Dialog } from '../../vendor/strike-ui.js';

/** Remounts on routeKey so each view enters with a fade. */
export function RouteFade({ routeKey, children, ms = 180 }) {
	return (
		<RouteFadeInner key={routeKey} ms={ms}>
			{children}
		</RouteFadeInner>
	);
}

function RouteFadeInner({ children, ms }) {
	const { className, style } = useTransition({
		name: 'fade',
		ms,
		open: true
	});
	return (
		<div class={'shop-route ' + className} style={style}>
			{children}
		</div>
	);
}

/**
 * Dialog that finishes its exit fade before unmounting.
 * Parent still toggles `open`; close handlers run immediately.
 */
export function TxDialog({ open, onClose, class: className, children, ...rest }) {
	const [mounted, setMounted] = useState(!!open);
	const { className: txClass, style } = useTransition({
		name: 'fade',
		ms: 180,
		open: !!open,
		onExited: () => setMounted(false)
	});

	useEffect(() => {
		if (open) setMounted(true);
	}, [open]);

	if (!mounted) return null;

	const panelClass = [txClass, className].filter(Boolean).join(' ');

	return (
		<Dialog
			{...rest}
			open
			onClose={onClose}
			class={panelClass}
			style={style}
		>
			{children}
		</Dialog>
	);
}

/** FLIP sibling rows when the keyed list changes. */
export function useListFlip(ref, deps, ms = 200) {
	const pending = useRef(null);
	useLayoutEffect(() => {
		if (pending.current) pending.current();
		const root = ref.current;
		if (!root) {
			pending.current = null;
			return;
		}
		pending.current = flipLayout(root.children, { ms });
	}, deps);
}
