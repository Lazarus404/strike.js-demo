import { h } from 'strike-fw';
import { css } from 'strike-fw/css';
import { cls } from '../cls.js';
import { toneClass } from '../lib/tone.js';

css`
.strike-link {
  color: var(--strike-accent, #0b6e4f);
  text-decoration: underline;
  text-underline-offset: 0.15em;
}
.strike-link--hover { text-decoration: none; }
.strike-link--hover:hover { text-decoration: underline; }
.strike-link--none { text-decoration: none; }
.strike-link--muted { color: var(--strike-muted, #5c5c5c); }
.strike-link--danger { color: var(--strike-danger, #9b2226); }
.strike-link--ok { color: var(--strike-ok, #2d6a4f); }
.strike-link--warn { color: var(--strike-warn, #b08900); }
.strike-link--info { color: var(--strike-info, #1d4e89); }
`;

const TAG = { a: 1, span: 1, button: 1 };

export function Link({
	as = 'a',
	href,
	tone,
	underline = 'always',
	external,
	class: className,
	children,
	...rest
}) {
	const host = typeof as === 'function' ? as : TAG[as] ? as : 'a';
	const props = {
		...rest,
		class: cls(
			'strike-link',
			underline === 'hover' && 'strike-link--hover',
			underline === 'none' && 'strike-link--none',
			toneClass('strike-link', tone),
			className
		)
	};
	if (host === 'a') {
		props.href = href;
		if (external) {
			props.target = props.target || '_blank';
			props.rel = props.rel || 'noopener noreferrer';
		}
	} else if (href != null) {
		props.href = href;
	}
	return h(host, props, children);
}
