import { h, createContext } from 'strike-fw';
import { useState, useEffect, useLayoutEffect, useContext, useRef } from 'strike-fw/hooks';
import { css } from 'strike-fw/css';
import {
	resolveTransition,
	transitionClass,
	transitionVars,
	flipLayout
} from 'strike-fw/transition';
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
  box-sizing: border-box;
}
.strike-snackbar--bottom { bottom: 1rem; }
.strike-snackbar--top { top: 1rem; }
.strike-snackbar--start { justify-content: flex-start; }
.strike-snackbar--center { justify-content: center; }
.strike-snackbar--end { justify-content: flex-end; }
.strike-snackbar__list {
  display: flex;
  flex-direction: column;
  gap: var(--strike-snackbar-gap, 8px);
  max-width: min(24rem, 100%);
  width: fit-content;
  box-sizing: border-box;
}
.strike-snackbar--bottom .strike-snackbar__list {
  flex-direction: column-reverse;
}
.strike-snackbar--start .strike-snackbar__list { align-items: flex-start; }
.strike-snackbar--center .strike-snackbar__list { align-items: center; }
.strike-snackbar--end .strike-snackbar__list { align-items: flex-end; }
.strike-snackbar__item {
  width: fit-content;
  max-width: 100%;
  box-sizing: border-box;
}
.strike-snackbar__item .strike-alert {
  width: fit-content;
  max-width: 100%;
  box-sizing: border-box;
}
.strike-snackbar__item .strike-alert__body {
  flex: 0 1 auto;
}
`;

let snackUid = 0;
let activeHost = null;
let warned = false;

function placementParts(placement) {
	const parts = String(placement || 'bottom-center').split('-');
	const y = parts[0] === 'top' ? 'top' : 'bottom';
	const x = parts[1] === 'start' || parts[1] === 'end' ? parts[1] : 'center';
	return { y, x };
}

function defaultTx(placement) {
	const y = placementParts(placement).y;
	const slide = y === 'top' ? 'slide-down' : 'slide-up';
	return { enter: slide, exit: slide, move: 'flip', ms: 200 };
}

function StackItem({ item, onDismiss, tx }) {
	const [phase, setPhase] = useState(tx.disabled ? 'in' : 'enter');
	const enterName = tx.enter;
	const exitName = tx.exit;

	useLayoutEffect(() => {
		if (tx.disabled || phase !== 'enter') return;
		const raf =
			typeof requestAnimationFrame === 'function'
				? requestAnimationFrame
				: cb => setTimeout(cb, 0);
		const caf =
			typeof cancelAnimationFrame === 'function'
				? cancelAnimationFrame
				: clearTimeout;
		const id = raf(() => setPhase('in'));
		return () => caf(id);
	}, [phase, tx.disabled]);

	useEffect(() => {
		if (item.exiting) {
			setPhase('exit');
			return;
		}
		const ms = item.autoHideMs === undefined ? 4000 : item.autoHideMs;
		if (ms == null) return;
		const t = setTimeout(() => onDismiss(item.id), ms);
		return () => clearTimeout(t);
	}, [item.id, item.autoHideMs, item.exiting, onDismiss]);

	const preset = phase === 'exit' || item.exiting ? exitName : enterName;
	const showPhase =
		tx.disabled ? 'in' : phase === 'exit' || item.exiting ? 'exit' : phase;

	return h(
		'div',
		{
			class: cls(
				'strike-snackbar__item',
				transitionClass(preset, showPhase)
			),
			style: transitionVars({
				ms: tx.ms,
				ease: tx.ease,
				distance: tx.distance
			}),
			'data-snack-id': item.id
		},
		h(
			Alert,
			{
				tone: item.tone,
				action: item.action,
				onClose: () => onDismiss(item.id),
				role: 'status'
			},
			item.children
		)
	);
}

export function SnackbarStack({
	items = [],
	onDismiss,
	placement = 'bottom-center',
	gap = 8,
	transition,
	class: className
}) {
	const { y, x } = placementParts(placement);
	const tx = resolveTransition(transition, defaultTx(placement));
	const listRef = useRef(null);
	const prevIds = useRef([]);
	const pendingFlip = useRef(null);

	useLayoutEffect(() => {
		const ids = items.map(i => i.id);
		const added = ids.some(id => prevIds.current.indexOf(id) === -1);
		if (added && pendingFlip.current) {
			pendingFlip.current();
		}
		prevIds.current = ids;
		const list = listRef.current;
		if (list && tx.move === 'flip' && !tx.disabled && tx.ms > 0) {
			pendingFlip.current = flipLayout(
				list.querySelectorAll('.strike-snackbar__item'),
				{ ms: tx.ms, ease: tx.ease }
			);
		} else {
			pendingFlip.current = null;
		}
	});

	if (!items.length) return null;

	return h(
		Portal,
		null,
		h(
			'div',
			{
				class: cls(
					'strike-snackbar',
					'strike-snackbar--stack',
					'strike-snackbar--' + y,
					'strike-snackbar--' + x,
					className
				),
				style: {
					'--strike-snackbar-gap': gap + 'px',
					...transitionVars({
						ms: tx.ms,
						ease: tx.ease,
						distance: tx.distance
					})
				}
			},
			h(
				'div',
				{ class: 'strike-snackbar__list', ref: listRef },
				items.map(item =>
					h(StackItem, {
						key: item.id,
						item,
						onDismiss,
						tx
					})
				)
			)
		)
	);
}

const SnackbarCtx = createContext(null);

export function useSnackbar() {
	return useContext(SnackbarCtx) || snackbar;
}

export const snackbar = {
	show(opts) {
		if (!activeHost) {
			if (!warned && typeof console !== 'undefined' && console.warn) {
				warned = true;
				console.warn('snackbar.show: mount <SnackbarHost /> first');
			}
			return null;
		}
		return activeHost.show(opts);
	},
	dismiss(id) {
		if (activeHost) activeHost.dismiss(id);
	}
};

export function SnackbarHost({
	placement = 'bottom-center',
	gap = 8,
	transition,
	max = 3,
	class: className
}) {
	const [items, setItems] = useState([]);
	const [place, setPlace] = useState(placement);
	const maxRef = useRef(max);
	const exitTimers = useRef(new Map());
	const apiRef = useRef(null);
	const txRef = useRef(null);
	maxRef.current = max;
	txRef.current = resolveTransition(transition, defaultTx(place));

	useLayoutEffect(() => {
		setPlace(placement);
	}, [placement]);

	function clearExit(id) {
		const t = exitTimers.current.get(id);
		if (t) {
			clearTimeout(t);
			exitTimers.current.delete(id);
		}
	}

	function removeNow(id) {
		clearExit(id);
		setItems(list => {
			const item = list.find(i => i.id === id);
			if (item && item.onClose) item.onClose();
			return list.filter(i => i.id !== id);
		});
	}

	function dismiss(id) {
		const tx = txRef.current;
		const wait = tx.disabled ? 0 : tx.ms;
		if (id == null) {
			setItems(list => {
				for (const item of list) {
					clearExit(item.id);
					if (item.onClose) item.onClose();
				}
				exitTimers.current.clear();
				return [];
			});
			return;
		}
		if (wait <= 0) {
			removeNow(id);
			return;
		}
		setItems(list => {
			const item = list.find(i => i.id === id);
			if (!item || item.exiting) return list;
			return list.map(i => (i.id === id ? { ...i, exiting: true } : i));
		});
		clearExit(id);
		const t = setTimeout(() => removeNow(id), wait);
		exitTimers.current.set(id, t);
	}

	function show(opts) {
		if (opts && opts.placement) setPlace(opts.placement);
		const id = (opts && opts.id) || 'snack-' + ++snackUid;
		const next = {
			id,
			tone: opts && opts.tone,
			children: opts && opts.children,
			action: opts && opts.action,
			autoHideMs: opts && opts.autoHideMs,
			onClose: opts && opts.onClose
		};
		setItems(list => {
			const live = list.filter(i => !i.exiting);
			let base = list;
			if (live.length >= maxRef.current) {
				const oldest = live[0];
				clearExit(oldest.id);
				if (oldest.onClose) oldest.onClose();
				base = list.filter(i => i.id !== oldest.id);
			}
			return base.concat(next);
		});
		return id;
	}

	if (!apiRef.current) apiRef.current = { show, dismiss };
	else {
		apiRef.current.show = show;
		apiRef.current.dismiss = dismiss;
	}

	useLayoutEffect(() => {
		const bridge = {
			show: opts => apiRef.current.show(opts),
			dismiss: id => apiRef.current.dismiss(id)
		};
		activeHost = bridge;
		return () => {
			if (activeHost === bridge) activeHost = null;
			for (const t of exitTimers.current.values()) clearTimeout(t);
			exitTimers.current.clear();
		};
	}, []);

	return h(
		SnackbarCtx.Provider,
		{ value: apiRef.current },
		h(SnackbarStack, {
			items,
			onDismiss: dismiss,
			placement: place,
			gap,
			transition,
			class: className
		})
	);
}
