import { h } from 'strike-fw';
import { css } from 'strike-fw/css';
import { cls } from '../cls.js';
import { toneClass } from '../lib/tone.js';

css`
.strike-badge-wrap {
  position: relative;
  display: inline-flex;
}
.strike-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.25rem;
  height: 1.25rem;
  padding: 0 0.35rem;
  font-size: 0.7rem;
  font-weight: 600;
  line-height: 1;
  border-radius: 999px;
  background: var(--strike-accent, #0b6e4f);
  color: #fff;
}
.strike-badge--dot {
  min-width: 0.5rem;
  width: 0.5rem;
  height: 0.5rem;
  padding: 0;
}
.strike-badge--anchor {
  position: absolute;
  top: 0;
  right: 0;
  transform: translate(40%, -40%);
}
.strike-badge--muted { background: var(--strike-muted, #5c5c5c); }
.strike-badge--danger { background: var(--strike-danger, #9b2226); }
.strike-badge--ok { background: var(--strike-ok, #2d6a4f); }
.strike-badge--warn { background: var(--strike-warn, #b08900); }
.strike-badge--info { background: var(--strike-info, #1d4e89); }
.strike-badge--accent { background: var(--strike-accent, #0b6e4f); }
`;

function badgeLabel(content, max) {
	if (content == null || content === '') return null;
	if (typeof content === 'number' && max != null && content > max) {
		return max + '+';
	}
	return content;
}

export function Badge({
	tone = 'accent',
	content,
	dot,
	max,
	class: className,
	children,
	...rest
}) {
	const label = badgeLabel(content, max);
	const badge = h(
		'span',
		{
			...rest,
			class: cls(
				'strike-badge',
				dot && 'strike-badge--dot',
				children != null && 'strike-badge--anchor',
				toneClass('strike-badge', tone),
				className
			)
		},
		dot ? null : label
	);
	if (children == null) return badge;
	return h('span', { class: 'strike-badge-wrap' }, children, badge);
}
