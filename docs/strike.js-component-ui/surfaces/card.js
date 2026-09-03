import { h } from 'strike-fw';
import { css } from 'strike-fw/css';
import { Text, Stack } from 'strike-fw/ui';
import { cls } from '../cls.js';
import { Paper } from './paper.js';

css`
.strike-card { overflow: hidden; }
.strike-card__media { display: block; width: 100%; }
.strike-card__media > * { display: block; width: 100%; }
.strike-card__body { padding: 0.85rem 1rem; }
.strike-card__actions {
  display: flex;
  gap: 0.5rem;
  padding: 0 1rem 0.85rem;
  flex-wrap: wrap;
}
.strike-card__subtitle {
  margin: 0.15rem 0 0;
  color: var(--strike-muted, #5c5c5c);
  font-size: 0.9rem;
}
`;

export function Card({
	elevated,
	outlined,
	filled,
	title,
	subtitle,
	media,
	actions,
	class: className,
	children,
	...rest
}) {
	const variant = outlined ? 'outlined' : filled ? 'filled' : 'elevated';
	let elevation = 0;
	if (variant === 'elevated') {
		elevation = elevated === false ? 0 : typeof elevated === 'number' ? elevated : 1;
	}
	return h(
		Paper,
		{
			...rest,
			variant,
			elevation,
			class: cls('strike-card', className)
		},
		media && h('div', { class: 'strike-card__media' }, media),
		h(
			'div',
			{ class: 'strike-card__body' },
			(title || subtitle) &&
				h(
					Stack,
					{ gap: 4 },
					title && h(Text, { as: 'h3', tone: 'title' }, title),
					subtitle &&
						h(Text, { as: 'p', class: 'strike-card__subtitle' }, subtitle)
				),
			children
		),
		actions && h('div', { class: 'strike-card__actions' }, actions)
	);
}
