import { h } from 'strike-fw';
import { useState } from 'strike-fw/hooks';
import { css } from 'strike-fw/css';
import { cls } from '../cls.js';

css`
.strike-avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--strike-avatar-size, 2.5rem);
  height: var(--strike-avatar-size, 2.5rem);
  overflow: hidden;
  background: var(--strike-fill, #f6f6f4);
  color: var(--strike-muted, #5c5c5c);
  font-size: calc(var(--strike-avatar-size, 2.5rem) * 0.4);
  font-weight: 600;
  flex-shrink: 0;
}
.strike-avatar--sm { --strike-avatar-size: 1.75rem; }
.strike-avatar--md { --strike-avatar-size: 2.5rem; }
.strike-avatar--lg { --strike-avatar-size: 3.5rem; }
.strike-avatar--circle { border-radius: 50%; }
.strike-avatar--rounded { border-radius: var(--strike-radius, 6px); }
.strike-avatar--square { border-radius: 0; }
.strike-avatar__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
`;

function initials(name) {
	if (!name) return '?';
	const parts = String(name).trim().split(/\s+/);
	if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
	return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function Avatar({
	src,
	alt,
	name,
	size = 'md',
	variant = 'circle',
	class: className,
	children,
	...rest
}) {
	const [failed, setFailed] = useState(false);
	const showImg = src && !failed;
	return h(
		'span',
		{
			...rest,
			class: cls(
				'strike-avatar',
				'strike-avatar--' + size,
				'strike-avatar--' + variant,
				className
			)
		},
		showImg
			? h('img', {
					class: 'strike-avatar__img',
					src,
					alt: alt || name || '',
					onError: () => setFailed(true)
				})
			: children != null
				? children
				: initials(name)
	);
}
