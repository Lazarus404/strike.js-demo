import { Text } from '../../vendor/strike-ui.js';
import { parseRoute } from './router.jsx';

export function Shell({ path, cart, children }) {
	const route = parseRoute(path);
	const cartActive = route.name === 'cart' || route.name === 'checkout';

	return (
		<div class="shop">
			<header class="shop-top">
				<a href="#/" class="shop-brand">
					Harbor Goods
				</a>
				<nav class="shop-nav" aria-label="Primary">
					<a href="#/" class={route.name === 'shop' ? 'is-active' : undefined}>
						Shop
					</a>
					<a href="#/cart" class={cartActive ? 'is-active' : undefined}>
						Cart
						<span class="shop-nav__count">{cart.count}</span>
					</a>
					<a
						href="#/lab"
						class={route.name === 'lab' ? 'is-active' : undefined}
					>
						Lab
					</a>
				</nav>
			</header>
			<main class="shop-main">{children}</main>
			<footer class="shop-foot">
				<Text tone="muted" as="span">
					Harbor Goods · Strike dist vendor demo
				</Text>
			</footer>
		</div>
	);
}
