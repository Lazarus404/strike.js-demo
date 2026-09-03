import { h } from 'strike-fw';
import { css } from 'strike-fw/css';
import { cls } from '../cls.js';

css`
.strike-appbar {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-height: var(--strike-appbar-height, 3rem);
  padding: 0 1rem;
  background: #fff;
  color: var(--strike-ink, #1a1a1a);
  border-bottom: 1px solid var(--strike-line, #d4d4d4);
  box-sizing: border-box;
}
.strike-appbar--elevated {
  box-shadow: var(--strike-elev-1, 0 1px 2px rgba(0,0,0,.08));
  border-bottom-color: transparent;
}
.strike-appbar--sticky { position: sticky; top: 0; z-index: 30; }
.strike-appbar--fixed {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 30;
}
.strike-appbar--dense { min-height: 2.5rem; padding: 0 0.75rem; }
.strike-appbar--inverse {
  background: var(--strike-ink, #1a1a1a);
  color: #fff;
  border-bottom-color: transparent;
}
.strike-appbar__start,
.strike-appbar__end { display: flex; align-items: center; gap: 0.5rem; flex-shrink: 0; }
.strike-appbar__main { flex: 1; min-width: 0; display: flex; align-items: center; gap: 0.75rem; }
`;

export function AppBar({
	position = 'static',
	elevated,
	start,
	end,
	dense,
	tone = 'default',
	class: className,
	children,
	...rest
}) {
	return h(
		'header',
		{
			...rest,
			class: cls(
				'strike-appbar',
				elevated && 'strike-appbar--elevated',
				position === 'sticky' && 'strike-appbar--sticky',
				position === 'fixed' && 'strike-appbar--fixed',
				dense && 'strike-appbar--dense',
				tone === 'inverse' && 'strike-appbar--inverse',
				className
			)
		},
		start && h('div', { class: 'strike-appbar__start' }, start),
		h('div', { class: 'strike-appbar__main' }, children),
		end && h('div', { class: 'strike-appbar__end' }, end)
	);
}
