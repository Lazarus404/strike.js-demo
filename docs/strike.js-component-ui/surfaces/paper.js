import { h } from 'strike-fw';
import { css } from 'strike-fw/css';
import { cls } from '../cls.js';

css`
.strike-paper {
  background: #fff;
  color: var(--strike-ink, #1a1a1a);
  border-radius: var(--strike-radius, 6px);
}
.strike-paper--elevated { box-shadow: var(--strike-elev-1, 0 1px 2px rgba(0,0,0,.08)); }
.strike-paper--elev-2 { box-shadow: var(--strike-elev-2, 0 4px 16px rgba(0,0,0,.12)); }
.strike-paper--elev-3 {
  box-shadow: var(--strike-elev-2, 0 4px 16px rgba(0,0,0,.12)), 0 8px 28px rgba(0,0,0,.1);
}
.strike-paper--outlined {
  border: 1px solid var(--strike-line, #d4d4d4);
  box-shadow: none;
}
.strike-paper--filled {
  background: var(--strike-fill, #f6f6f4);
  box-shadow: none;
}
.strike-paper--square { border-radius: 0; }
`;

export function Paper({
	elevation = 0,
	variant = 'elevated',
	square,
	class: className,
	children,
	...rest
}) {
	const elev =
		variant === 'elevated' && elevation > 0
			? elevation >= 3
				? 'strike-paper--elev-3'
				: elevation === 2
					? 'strike-paper--elev-2'
					: 'strike-paper--elevated'
			: variant === 'elevated' && elevation === 0
				? 'strike-paper--elevated'
				: null;

	return h(
		'div',
		{
			...rest,
			class: cls(
				'strike-paper',
				variant !== 'elevated' && 'strike-paper--' + variant,
				elev,
				square && 'strike-paper--square',
				className
			)
		},
		children
	);
}
