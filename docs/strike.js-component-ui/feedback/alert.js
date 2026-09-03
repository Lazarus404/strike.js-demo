import { h } from 'strike-fw';
import { css } from 'strike-fw/css';
import { Btn, Stack, Text } from 'strike-fw/ui';
import { cls } from '../cls.js';
import { toneClass } from '../lib/tone.js';
import { Icon } from '../display/icon.js';

css`
.strike-alert {
  padding: 0.75rem 0.9rem;
  border-radius: var(--strike-radius, 6px);
  border: 1px solid var(--strike-line, #d4d4d4);
  background: var(--strike-fill, #f6f6f4);
}
.strike-alert--accent {
  border-color: var(--strike-accent, #0b6e4f);
  background: color-mix(in srgb, var(--strike-accent, #0b6e4f) 10%, #fff);
}
.strike-alert--danger {
  border-color: var(--strike-danger, #9b2226);
  background: color-mix(in srgb, var(--strike-danger, #9b2226) 10%, #fff);
}
.strike-alert--ok {
  border-color: var(--strike-ok, #2d6a4f);
  background: color-mix(in srgb, var(--strike-ok, #2d6a4f) 10%, #fff);
}
.strike-alert--warn {
  border-color: var(--strike-warn, #b08900);
  background: color-mix(in srgb, var(--strike-warn, #b08900) 12%, #fff);
}
.strike-alert--info {
  border-color: var(--strike-info, #1d4e89);
  background: color-mix(in srgb, var(--strike-info, #1d4e89) 10%, #fff);
}
.strike-alert--muted {
  border-color: var(--strike-line, #d4d4d4);
  color: var(--strike-muted, #5c5c5c);
}
.strike-alert__body { flex: 1; min-width: 0; }
.strike-alert__title { margin: 0 0 0.2rem; font-weight: 600; }
`;

function defaultIcon(tone) {
	const mark =
		tone === 'danger' ? '!' : tone === 'ok' ? 'ok' : tone === 'warn' ? '!' : 'i';
	return h(Icon, { size: 'sm', label: undefined }, mark);
}

export function Alert({
	tone = 'default',
	title,
	children,
	icon,
	onClose,
	action,
	assertive,
	class: className,
	...rest
}) {
	const showIcon = icon !== false;
	const iconNode = icon === false ? null : icon != null ? icon : defaultIcon(tone);
	return h(
		'div',
		{
			...rest,
			role: assertive ? 'alert' : 'status',
			class: cls('strike-alert', toneClass('strike-alert', tone), className)
		},
		h(
			Stack,
			{ row: true, gap: 10, class: 'strike-alert__row' },
			showIcon && iconNode,
			h(
				'div',
				{ class: 'strike-alert__body' },
				title && h(Text, { as: 'p', class: 'strike-alert__title' }, title),
				children && h(Text, { as: 'p' }, children)
			),
			action,
			onClose &&
				h(
					Btn,
					{
						variant: 'ghost',
						type: 'button',
						'aria-label': 'Close',
						onClick: onClose
					},
					'x'
				)
		)
	);
}
