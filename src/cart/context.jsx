import {
	createContext,
	useState,
	useMemo
} from '../../vendor/strike.core+hooks.js';

export const CartCtx = createContext(null);

export function useCart() {
	const [lines, setLines] = useState([]);
	return useMemo(
		() => ({
			lines,
			count: lines.reduce((n, l) => n + l.qty, 0),
			total: lines.reduce((n, l) => n + l.qty * l.price, 0),
			add(product, extras) {
				setLines(list => {
					const gift = !!(extras && extras.giftWrap);
					const i = list.findIndex(
						l => l.id === product.id && !!l.giftWrap === gift
					);
					if (i === -1) {
						return list.concat([
							{
								id: product.id,
								name: product.name,
								price: product.price + (gift ? 5 : 0),
								qty: 1,
								giftWrap: gift
							}
						]);
					}
					return list.map((l, idx) =>
						idx === i ? Object.assign({}, l, { qty: l.qty + 1 }) : l
					);
				});
			},
			setQty(id, qty, giftWrap) {
				setLines(list =>
					list
						.map(l =>
							l.id === id && !!l.giftWrap === !!giftWrap
								? Object.assign({}, l, { qty })
								: l
						)
						.filter(l => l.qty > 0)
				);
			},
			clear() {
				setLines([]);
			}
		}),
		[lines]
	);
}
