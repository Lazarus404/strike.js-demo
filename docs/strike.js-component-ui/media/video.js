import { h } from 'strike-fw';
import { css } from 'strike-fw/css';
import { cls } from '../cls.js';
import { Box } from '../layout/box.js';

css`
.strike-video {
  display: block;
  width: 100%;
  max-width: 100%;
  background: #000;
}
.strike-video-wrap {
  width: 100%;
  overflow: hidden;
  border-radius: var(--strike-radius, 6px);
}
.strike-video-wrap .strike-video { height: 100%; object-fit: contain; }
`;

export function Video({
	ratio,
	controls = true,
	class: className,
	children,
	...rest
}) {
	const video = h(
		'video',
		{
			...rest,
			controls,
			class: cls('strike-video', className)
		},
		children
	);
	if (!ratio) return video;
	return h(
		Box,
		{
			class: 'strike-video-wrap',
			style: { aspectRatio: ratio }
		},
		video
	);
}
