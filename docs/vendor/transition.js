import { css } from './css.js';
import { useState, useLayoutEffect, useEffect, useRef } from './strike.core+hooks.js';

css`
.strike-tx {
  transition:
    opacity var(--strike-tx-ms, 200ms) var(--strike-tx-ease, ease),
    transform var(--strike-tx-ms, 200ms) var(--strike-tx-ease, ease);
}
.strike-tx--fade.strike-tx--enter,
.strike-tx--fade.strike-tx--exit {
  opacity: 0;
}
.strike-tx--slide-up.strike-tx--enter,
.strike-tx--slide-up.strike-tx--exit {
  opacity: 0;
  transform: translateY(var(--strike-tx-distance, 0.5rem));
}
.strike-tx--slide-down.strike-tx--enter,
.strike-tx--slide-down.strike-tx--exit {
  opacity: 0;
  transform: translateY(calc(-1 * var(--strike-tx-distance, 0.5rem)));
}
.strike-tx--slide-start.strike-tx--enter,
.strike-tx--slide-start.strike-tx--exit {
  opacity: 0;
  transform: translateX(var(--strike-tx-distance, 0.5rem));
}
.strike-tx--slide-end.strike-tx--enter,
.strike-tx--slide-end.strike-tx--exit {
  opacity: 0;
  transform: translateX(calc(-1 * var(--strike-tx-distance, 0.5rem)));
}
.strike-tx--none {
  transition: none;
}
@media (prefers-reduced-motion: reduce) {
  .strike-tx {
    transition-duration: 0.01ms;
  }
}
`;

const PRESETS = {
	fade: 1,
	'slide-up': 1,
	'slide-down': 1,
	'slide-start': 1,
	'slide-end': 1,
	none: 1
};

function raf(fn) {
	if (typeof requestAnimationFrame === 'function') return requestAnimationFrame(fn);
	return setTimeout(fn, 0);
}

function caf(id) {
	if (typeof cancelAnimationFrame === 'function') cancelAnimationFrame(id);
	else clearTimeout(id);
}

function isOff(v) {
	return v === false || v === 'none';
}

/**
 * Normalize transition config.
 * @returns {{ enter: string, exit: string, move: string, ms: number, ease: string, distance: string, disabled: boolean }}
 */
export function resolveTransition(input, defaults = {}) {
	const baseEnter = defaults.enter || 'fade';
	const baseExit = defaults.exit || baseEnter;
	const baseMove = defaults.move != null ? defaults.move : 'flip';
	const baseMs = defaults.ms != null ? defaults.ms : 200;
	const baseEase = defaults.ease || 'ease';
	const baseDistance = defaults.distance || '0.5rem';

	if (isOff(input)) {
		return {
			enter: 'none',
			exit: 'none',
			move: 'none',
			ms: 0,
			ease: baseEase,
			distance: baseDistance,
			disabled: true
		};
	}

	if (typeof input === 'string') {
		const name = PRESETS[input] ? input : 'fade';
		const off = name === 'none';
		return {
			enter: name,
			exit: name,
			move: off ? 'none' : baseMove === false ? 'none' : baseMove || 'flip',
			ms: off ? 0 : baseMs,
			ease: baseEase,
			distance: baseDistance,
			disabled: off
		};
	}

	const obj = input && typeof input === 'object' ? input : {};
	let enter = obj.enter != null ? obj.enter : baseEnter;
	let exit = obj.exit != null ? obj.exit : baseExit;
	let move = obj.move != null ? obj.move : baseMove;
	if (isOff(enter)) enter = 'none';
	if (isOff(exit)) exit = 'none';
	if (isOff(move)) move = 'none';
	if (enter !== 'none' && !PRESETS[enter]) enter = 'fade';
	if (exit !== 'none' && !PRESETS[exit]) exit = 'fade';
	const ms = obj.ms != null ? obj.ms : baseMs;
	const disabled = enter === 'none' && exit === 'none' && move === 'none';
	return {
		enter,
		exit,
		move: move || 'none',
		ms: disabled ? 0 : ms,
		ease: obj.ease != null ? obj.ease : baseEase,
		distance: obj.distance != null ? obj.distance : baseDistance,
		disabled
	};
}

/** Class list for a preset + phase (`enter` | `in` | `exit`). */
export function transitionClass(name, phase) {
	if (!name || name === 'none' || isOff(name)) return 'strike-tx strike-tx--none';
	const preset = PRESETS[name] ? name : 'fade';
	let out = 'strike-tx strike-tx--' + preset;
	if (phase === 'enter') out += ' strike-tx--enter';
	else if (phase === 'exit') out += ' strike-tx--exit';
	return out;
}

/** Inline CSS vars for duration / easing / distance. */
export function transitionVars(opts = {}) {
	const style = {};
	if (opts.ms != null) style['--strike-tx-ms'] = opts.ms + 'ms';
	if (opts.ease != null) style['--strike-tx-ease'] = opts.ease;
	if (opts.distance != null) style['--strike-tx-distance'] = opts.distance;
	return style;
}

/** Resolve after `ms` (0 resolves on next macrotask). */
export function waitMs(ms) {
	const n = ms > 0 ? ms : 0;
	return new Promise(resolve => setTimeout(resolve, n));
}

/**
 * Capture positions, then call the returned `play()` after layout change
 * to animate elements from old to new positions (FLIP).
 */
export function flipLayout(elements, opts = {}) {
	const disabled = opts.disabled || !opts.ms;
	const list = [];
	if (elements) {
		for (let i = 0; i < elements.length; i++) {
			const el = elements[i];
			if (el && typeof el.getBoundingClientRect === 'function') list.push(el);
		}
	}
	if (disabled || !list.length) {
		return function play() {};
	}
	const first = list.map(el => {
		const r = el.getBoundingClientRect();
		return { el, top: r.top, left: r.left };
	});
	const ms = opts.ms;
	const ease = opts.ease || 'ease';
	return function play() {
		raf(() => {
			for (let i = 0; i < first.length; i++) {
				const item = first[i];
				const el = item.el;
				if (!el.isConnected) continue;
				const last = el.getBoundingClientRect();
				const dx = item.left - last.left;
				const dy = item.top - last.top;
				if (!dx && !dy) continue;
				const prevTransition = el.style.transition;
				el.style.transition = 'none';
				el.style.transform = 'translate(' + dx + 'px,' + dy + 'px)';
				void el.offsetWidth;
				el.style.transition = 'transform ' + ms + 'ms ' + ease;
				el.style.transform = '';
				const done = () => {
					el.style.transition = prevTransition;
					el.removeEventListener('transitionend', onEnd);
				};
				function onEnd(e) {
					if (e.target === el && e.propertyName === 'transform') done();
				}
				el.addEventListener('transitionend', onEnd);
				setTimeout(done, ms + 50);
			}
		});
	};
}

/**
 * Enter -> in on mount; when open becomes false, runs exit then onExited.
 * requestExit() starts the same exit path (idempotent).
 */
export function useTransition(opts = {}) {
	const name = opts.name;
	const ms = opts.ms != null ? opts.ms : 200;
	const open = opts.open !== false;
	const onExited = opts.onExited;
	const [phase, setPhase] = useState(open ? 'enter' : 'exit');
	const exiting = useRef(false);
	const gen = useRef(0);
	const onExitedRef = useRef(onExited);
	onExitedRef.current = onExited;

	function finishExit() {
		if (exiting.current) return;
		exiting.current = true;
		setPhase('exit');
		const token = gen.current;
		const wait = isOff(name) || name === 'none' ? 0 : ms;
		waitMs(wait).then(() => {
			if (token !== gen.current) return;
			const cb = onExitedRef.current;
			if (cb) cb();
		});
	}

	useLayoutEffect(() => {
		if (!open || phase !== 'enter') return;
		const id = raf(() => setPhase('in'));
		return () => caf(id);
	}, [open, phase]);

	useEffect(() => {
		if (open) {
			gen.current += 1;
			exiting.current = false;
			setPhase('enter');
			return;
		}
		finishExit();
	}, [open]);

	function requestExit() {
		finishExit();
	}

	const resolved = isOff(name) || name === 'none' ? 'none' : name || 'fade';
	return {
		phase,
		className: transitionClass(resolved, phase),
		style: transitionVars({ ms, ease: opts.ease, distance: opts.distance }),
		requestExit
	};
}
