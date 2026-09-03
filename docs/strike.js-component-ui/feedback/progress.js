import { h } from 'strike-fw';
import { css } from 'strike-fw/css';
import { cls } from '../cls.js';
import { toneClass } from '../lib/tone.js';

css`
.strike-progress {
  display: block;
  width: 100%;
}
.strike-progress--linear {
  height: 0.4rem;
  background: var(--strike-fill, #f6f6f4);
  border-radius: 999px;
  overflow: hidden;
}
.strike-progress__bar {
  height: 100%;
  background: var(--strike-accent, #0b6e4f);
  border-radius: inherit;
  transition: width 0.2s ease;
}
.strike-progress--danger .strike-progress__bar { background: var(--strike-danger, #9b2226); }
.strike-progress--ok .strike-progress__bar { background: var(--strike-ok, #2d6a4f); }
.strike-progress--warn .strike-progress__bar { background: var(--strike-warn, #b08900); }
.strike-progress--info .strike-progress__bar { background: var(--strike-info, #1d4e89); }
.strike-progress--muted .strike-progress__bar { background: var(--strike-muted, #5c5c5c); }
.strike-progress--indeterminate .strike-progress__bar {
  width: 40%;
  animation: strike-progress-indeterminate 1.2s ease-in-out infinite;
}
@keyframes strike-progress-indeterminate {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(350%); }
}
@media (prefers-reduced-motion: reduce) {
  .strike-progress--indeterminate .strike-progress__bar { animation: none; width: 100%; opacity: 0.5; }
}
.strike-progress--circular {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  border: 3px solid var(--strike-fill, #f6f6f4);
  border-top-color: var(--strike-accent, #0b6e4f);
}
.strike-progress--circular.strike-progress--indeterminate {
  animation: strike-progress-spin 0.8s linear infinite;
}
@keyframes strike-progress-spin {
  to { transform: rotate(360deg); }
}
.strike-progress--circular.strike-progress--danger { border-top-color: var(--strike-danger, #9b2226); }
.strike-progress--circular.strike-progress--ok { border-top-color: var(--strike-ok, #2d6a4f); }
`;

export function Progress({
	value,
	variant = 'linear',
	tone,
	label,
	class: className,
	...rest
}) {
	const indeterminate = value == null;
	const clamped =
		indeterminate ? null : Math.max(0, Math.min(100, Number(value) || 0));
	const a11y = {
		role: 'progressbar',
		'aria-valuemin': 0,
		'aria-valuemax': 100,
		'aria-label': label,
		...(indeterminate ? {} : { 'aria-valuenow': clamped })
	};

	if (variant === 'circular') {
		return h('div', {
			...rest,
			...a11y,
			class: cls(
				'strike-progress',
				'strike-progress--circular',
				indeterminate && 'strike-progress--indeterminate',
				toneClass('strike-progress', tone),
				className
			)
		});
	}

	return h(
		'div',
		{
			...rest,
			...a11y,
			class: cls(
				'strike-progress',
				'strike-progress--linear',
				indeterminate && 'strike-progress--indeterminate',
				toneClass('strike-progress', tone),
				className
			)
		},
		h('div', {
			class: 'strike-progress__bar',
			style: indeterminate ? undefined : { width: clamped + '%' }
		})
	);
}
