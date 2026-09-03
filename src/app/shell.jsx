import { Text } from '../../vendor/strike-ui.js';
import { SnackbarHost } from 'strike-fw-ui';
import { NavLink, useLocation, useMatch } from 'strike-fw-router';
import { RouteFade } from '../lib/motion.jsx';
import { useCartCount } from '../cart/store.js';

export function Shell({ children }) {
	const location = useLocation();
	const cartActive = !!useMatch('/cart') || !!useMatch('/checkout');
	const count = useCartCount();

	return (
		<div class="shop">
			<SnackbarHost
				placement="bottom-end"
				max={3}
				gap={10}
				transition={{
					enter: 'slide-up',
					exit: 'slide-up',
					move: 'flip',
					ms: 220
				}}
			/>
			<header class="shop-top">
				<NavLink to="/" end class="shop-brand">
					Harbor Goods
				</NavLink>
				<nav class="shop-nav" aria-label="Primary">
					<NavLink to="/" end class={on => (on ? 'is-active' : undefined)}>
						Shop
					</NavLink>
					<NavLink to="/cart" isActive={() => cartActive} class={on => (on ? 'is-active' : undefined)}>
						Cart
						<span class="shop-nav__count">{count}</span>
					</NavLink>
					<NavLink to="/lab" class={on => (on ? 'is-active' : undefined)}>
						Lab
					</NavLink>
				</nav>
			</header>
			<main class="shop-main" data-strike-focus tabindex="-1">
				<RouteFade routeKey={location.pathname + location.search}>
					{children}
				</RouteFade>
			</main>
			<footer class="shop-foot">
				<Text tone="muted" as="span">
					Harbor Goods · Strike dist vendor demo
				</Text>
			</footer>
		</div>
	);
}
