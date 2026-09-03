import { h } from 'strike-fw';
import { useState, useEffect, useLayoutEffect, useRef } from 'strike-fw/hooks';
import { css } from 'strike-fw/css';
import { cls } from '../cls.js';
import { Portal } from '../lib/portal.js';

css`
.strike-tooltip {
  position: relative;
  display: inline-flex;
  width: max-content;
  max-width: 100%;
  vertical-align: middle;
}
.strike-tooltip__tip {
  position: fixed;
  z-index: var(--strike-z-tooltip, 50);
  max-width: 16rem;
  padding: 0.35rem 0.55rem;
  font-size: 0.8rem;
  line-height: 1.3;
  background: var(--strike-ink, #1a1a1a);
  color: #fff;
  border-radius: var(--strike-radius, 6px);
  pointer-events: none;
  white-space: normal;
  box-sizing: border-box;
}
`;

let tipUid = 0;
const GAP = 6;

function tipStyle(placement, trigger, tip) {
	if (!trigger) return { visibility: 'hidden', top: 0, left: 0 };
	const tw = tip ? tip.offsetWidth : 0;
	const th = tip ? tip.offsetHeight : 0;
	const midX = trigger.left + trigger.width / 2;
	const midY = trigger.top + trigger.height / 2;
	if (placement === 'bottom') {
		return {
			visibility: 'visible',
			top: trigger.bottom + GAP,
			left: midX - tw / 2
		};
	}
	if (placement === 'left') {
		return {
			visibility: 'visible',
			top: midY - th / 2,
			left: trigger.left - GAP - tw
		};
	}
	if (placement === 'right') {
		return {
			visibility: 'visible',
			top: midY - th / 2,
			left: trigger.right + GAP
		};
	}
	return {
		visibility: 'visible',
		top: trigger.top - GAP - th,
		left: midX - tw / 2
	};
}

export function Tooltip({
	title,
	children,
	placement = 'top',
	open: openProp,
	defaultOpen = false,
	onOpenChange,
	delay = 200,
	class: className,
	...rest
}) {
	const uncontrolled = openProp === undefined;
	const [inner, setInner] = useState(defaultOpen);
	const open = uncontrolled ? inner : openProp;
	const timer = useRef(null);
	const tipId = useRef('strike-tip-' + ++tipUid);
	const rootRef = useRef(null);
	const tipRef = useRef(null);
	const [coords, setCoords] = useState(null);

	function setOpen(next) {
		if (uncontrolled) setInner(next);
		if (onOpenChange) onOpenChange(next);
	}

	function show() {
		clearTimeout(timer.current);
		timer.current = setTimeout(() => setOpen(true), delay);
	}
	function hide() {
		clearTimeout(timer.current);
		setOpen(false);
	}

	useLayoutEffect(() => {
		if (!open) {
			setCoords(null);
			return;
		}
		function place() {
			const el = rootRef.current;
			if (!el || typeof el.getBoundingClientRect !== 'function') return;
			setCoords(tipStyle(placement, el.getBoundingClientRect(), tipRef.current));
		}
		place();
		window.addEventListener('scroll', place, true);
		window.addEventListener('resize', place);
		return () => {
			window.removeEventListener('scroll', place, true);
			window.removeEventListener('resize', place);
		};
	}, [open, placement, title]);

	useEffect(() => {
		if (!open) return;
		function onKey(e) {
			if (e.key === 'Escape') setOpen(false);
		}
		document.addEventListener('keydown', onKey);
		return () => document.removeEventListener('keydown', onKey);
	}, [open]);

	useEffect(() => () => clearTimeout(timer.current), []);

	return h(
		'span',
		{
			...rest,
			ref: rootRef,
			class: cls('strike-tooltip', className),
			onMouseEnter: show,
			onMouseLeave: hide,
			onFocus: show,
			onBlur: hide
		},
		h('span', { 'aria-describedby': open ? tipId.current : undefined }, children),
		open &&
			h(
				Portal,
				null,
				h(
					'span',
					{
						id: tipId.current,
						ref: tipRef,
						role: 'tooltip',
						class: 'strike-tooltip__tip',
						style: coords || { visibility: 'hidden', top: 0, left: 0 }
					},
					title
				)
			)
	);
}
