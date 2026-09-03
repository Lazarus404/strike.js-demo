import { h } from 'strike-fw';
import { css } from 'strike-fw/css';
import { cls } from '../cls.js';

css`
.strike-skeleton {
  display: block;
  background: var(--strike-fill, #f6f6f4);
  border-radius: var(--strike-radius, 6px);
}
.strike-skeleton--text {
  height: 0.9em;
  width: 100%;
  margin: 0.25em 0;
}
.strike-skeleton--circular {
  border-radius: 50%;
  width: 2.5rem;
  height: 2.5rem;
}
.strike-skeleton--rectangular {
  width: 100%;
  height: 6rem;
}
.strike-skeleton--pulse {
  animation: strike-skeleton-pulse 1.4s ease-in-out infinite;
}
.strike-skeleton--wave {
  background: linear-gradient(
    90deg,
    var(--strike-fill, #f6f6f4) 0%,
    #eaeae8 50%,
    var(--strike-fill, #f6f6f4) 100%
  );
  background-size: 200% 100%;
  animation: strike-skeleton-wave 1.4s linear infinite;
}
@keyframes strike-skeleton-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.45; }
}
@keyframes strike-skeleton-wave {
  0% { background-position: 100% 0; }
  100% { background-position: -100% 0; }
}
@media (prefers-reduced-motion: reduce) {
  .strike-skeleton--pulse,
  .strike-skeleton--wave { animation: none; }
}
`;

export function Skeleton({
	variant = 'text',
	width,
	height,
	animation = 'pulse',
	class: className,
	style,
	...rest
}) {
	const st = { ...(style || {}) };
	if (width != null) st.width = typeof width === 'number' ? width + 'px' : width;
	if (height != null) st.height = typeof height === 'number' ? height + 'px' : height;
	return h('span', {
		...rest,
		class: cls(
			'strike-skeleton',
			'strike-skeleton--' + variant,
			animation && 'strike-skeleton--' + animation,
			className
		),
		style: st,
		'aria-hidden': 'true'
	});
}
