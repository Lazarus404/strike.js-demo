import { h } from 'strike-fw';
import { css } from 'strike-fw/css';
import { cls } from '../cls.js';
import { toneClass } from '../lib/tone.js';

css`
.strike-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font: inherit;
  font-size: 0.85rem;
  line-height: 1.2;
  padding: 0.25rem 0.65rem;
  border-radius: 999px;
  border: 1px solid var(--strike-line, #d4d4d4);
  background: #fff;
  color: inherit;
  cursor: default;
}
button.strike-chip { cursor: pointer; }
.strike-chip:focus-visible {
  outline: 2px solid var(--strike-accent, #0b6e4f);
  outline-offset: 2px;
}
.strike-chip--selected {
  border-color: var(--strike-accent, #0b6e4f);
  background: color-mix(in srgb, var(--strike-accent, #0b6e4f) 12%, #fff);
}
.strike-chip[disabled] { opacity: 0.5; pointer-events: none; }
.strike-chip--danger { border-color: var(--strike-danger, #9b2226); color: var(--strike-danger, #9b2226); }
.strike-chip--ok { border-color: var(--strike-ok, #2d6a4f); }
.strike-chip--warn { border-color: var(--strike-warn, #b08900); }
.strike-chip--info { border-color: var(--strike-info, #1d4e89); }
.strike-chip--accent { border-color: var(--strike-accent, #0b6e4f); }
.strike-chip--muted { color: var(--strike-muted, #5c5c5c); }
.strike-chip__delete {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin: 0 -0.25rem 0 0;
  padding: 0;
  width: 1.1rem;
  height: 1.1rem;
  border: 0;
  border-radius: 50%;
  background: transparent;
  color: inherit;
  cursor: pointer;
  font: inherit;
  line-height: 1;
}
.strike-chip__delete:hover { background: rgba(0,0,0,.08); }
`;

export function Chip({
	tone,
	selected,
	onClick,
	onDelete,
	startIcon,
	disabled,
	class: className,
	children,
	...rest
}) {
	// Nested <button> is invalid inside <button>; use span when delete is present.
	const tag = onDelete ? 'span' : onClick ? 'button' : 'span';
	const props = {
		...rest,
		class: cls(
			'strike-chip',
			selected && 'strike-chip--selected',
			toneClass('strike-chip', tone),
			className
		)
	};
	if (tag === 'button') {
		props.type = 'button';
		props.disabled = disabled;
		if (onClick) props.onClick = onClick;
	} else if (onClick) {
		props.role = 'button';
		props.tabIndex = disabled ? -1 : 0;
		props.onClick = disabled ? undefined : onClick;
		props['aria-disabled'] = disabled || undefined;
	}
	if (disabled && tag === 'span' && !onClick) {
		props['aria-disabled'] = true;
	}
	return h(
		tag,
		props,
		startIcon,
		children,
		onDelete &&
			h(
				'button',
				{
					type: 'button',
					class: 'strike-chip__delete',
					'aria-label': 'Remove',
					disabled,
					onClick: e => {
						e.stopPropagation();
						onDelete(e);
					}
				},
				'x'
			)
	);
}
