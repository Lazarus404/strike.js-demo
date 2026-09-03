import { h } from 'strike-fw';
import { css } from 'strike-fw/css';
import { cls } from '../cls.js';
import { Box } from './box.js';

css`
.strike-container {
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  padding-left: var(--strike-space, 0.75rem);
  padding-right: var(--strike-space, 0.75rem);
  box-sizing: border-box;
}
.strike-container--sm { max-width: 40rem; }
.strike-container--md { max-width: 48rem; }
.strike-container--lg { max-width: 64rem; }
.strike-container--xl { max-width: 80rem; }
`;

export function Container({ size = 'md', class: className, children, ...rest }) {
	return h(
		Box,
		{
			...rest,
			class: cls('strike-container', 'strike-container--' + size, className)
		},
		children
	);
}
