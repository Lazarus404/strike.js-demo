import {
	atom,
	computed,
	persist,
	useStoreValue
} from 'strike-fw-store';

export const cart = atom({ lines: [] });

if (typeof sessionStorage !== 'undefined') {
	persist(cart, { name: 'harbor-cart', storage: sessionStorage });
}

export const cartCount = computed([cart], function (c) {
	return c.lines.reduce(function (n, l) {
		return n + l.qty;
	}, 0);
});

export const cartTotal = computed([cart], function (c) {
	return c.lines.reduce(function (n, l) {
		return n + l.qty * l.price;
	}, 0);
});

export function addToCart(product, extras) {
	const gift = !!(extras && extras.giftWrap);
	cart.set(function (state) {
		const list = state.lines;
		const i = list.findIndex(
			l => l.id === product.id && !!l.giftWrap === gift
		);
		if (i === -1) {
			return {
				lines: list.concat([
					{
						id: product.id,
						name: product.name,
						price: product.price + (gift ? 5 : 0),
						qty: 1,
						giftWrap: gift
					}
				])
			};
		}
		return {
			lines: list.map(function (l, idx) {
				return idx === i
					? Object.assign({}, l, { qty: l.qty + 1 })
					: l;
			})
		};
	});
}

export function setCartQty(id, qty, giftWrap) {
	cart.set(function (state) {
		return {
			lines: state.lines
				.map(function (l) {
					return l.id === id && !!l.giftWrap === !!giftWrap
						? Object.assign({}, l, { qty: qty })
						: l;
				})
				.filter(function (l) {
					return l.qty > 0;
				})
		};
	});
}

export function clearCart() {
	cart.set({ lines: [] });
}

export function useCartLines() {
	return useStoreValue(cart, function (c) {
		return c.lines;
	});
}

export function useCartCount() {
	return useStoreValue(cartCount);
}

export function useCartTotal() {
	return useStoreValue(cartTotal);
}
