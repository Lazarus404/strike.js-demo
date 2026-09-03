import { h } from 'strike-fw';
import { css } from 'strike-fw/css';
import { Btn } from 'strike-fw/ui';
import { cls } from '../cls.js';

css`
.strike-pagination {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  align-items: center;
}
.strike-pagination__ellipsis {
  padding: 0 0.35rem;
  color: var(--strike-muted, #5c5c5c);
}
`;

/** Build page tokens: numbers and 'ellipsis'. */
export function pageItems(page, count, siblingCount = 1) {
	if (count <= 0) return [];
	page = Math.max(1, Math.min(count, page | 0));
	siblingCount = Math.max(0, siblingCount | 0);
	const set = new Set([1, count]);
	for (let i = page - siblingCount; i <= page + siblingCount; i++) {
		if (i >= 1 && i <= count) set.add(i);
	}
	const sorted = [...set].sort((a, b) => a - b);
	const out = [];
	let prev = 0;
	for (const n of sorted) {
		if (prev && n - prev > 1) out.push('ellipsis');
		out.push(n);
		prev = n;
	}
	return out;
}

export function Pagination({
	page = 1,
	count = 1,
	onChange,
	siblingCount = 1,
	showFirstLast = true,
	class: className,
	...rest
}) {
	const items = pageItems(page, count, siblingCount);
	function go(p) {
		if (onChange && p >= 1 && p <= count && p !== page) onChange(p);
	}
	return h(
		'nav',
		{
			...rest,
			'aria-label': 'Pagination',
			class: cls('strike-pagination', className)
		},
		showFirstLast &&
			h(
				Btn,
				{
					variant: 'ghost',
					type: 'button',
					disabled: page <= 1,
					'aria-label': 'First page',
					onClick: () => go(1)
				},
				'«'
			),
		h(
			Btn,
			{
				variant: 'ghost',
				type: 'button',
				disabled: page <= 1,
				'aria-label': 'Previous page',
				onClick: () => go(page - 1)
			},
			'‹'
		),
		items.map((it, i) =>
			it === 'ellipsis'
				? h('span', { key: 'e' + i, class: 'strike-pagination__ellipsis' }, '…')
				: h(
						Btn,
						{
							key: it,
							variant: it === page ? 'primary' : 'ghost',
							type: 'button',
							'aria-current': it === page ? 'page' : undefined,
							'aria-label': 'Page ' + it,
							onClick: () => go(it)
						},
						String(it)
					)
		),
		h(
			Btn,
			{
				variant: 'ghost',
				type: 'button',
				disabled: page >= count,
				'aria-label': 'Next page',
				onClick: () => go(page + 1)
			},
			'›'
		),
		showFirstLast &&
			h(
				Btn,
				{
					variant: 'ghost',
					type: 'button',
					disabled: page >= count,
					'aria-label': 'Last page',
					onClick: () => go(count)
				},
				'»'
			)
	);
}
