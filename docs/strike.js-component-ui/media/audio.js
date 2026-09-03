import { h } from 'strike-fw';
import { css } from 'strike-fw/css';
import { Stack, Text } from 'strike-fw/ui';
import { cls } from '../cls.js';

css`
.strike-audio { width: 100%; max-width: 24rem; }
.strike-audio-wrap { display: flex; flex-direction: column; gap: 0.35rem; }
`;

export function Audio({
	title,
	controls = true,
	class: className,
	...rest
}) {
	return h(
		Stack,
		{ gap: 6, class: cls('strike-audio-wrap', className) },
		title && h(Text, { as: 'span' }, title),
		h('audio', { ...rest, controls, class: 'strike-audio' })
	);
}
