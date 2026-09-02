import { mount } from '../../vendor/strike.core+hooks.js';
import { CartCtx, useCart } from '../cart/context.jsx';
import { useRoute } from './router.jsx';
import { Shell } from './shell.jsx';
import { Page } from './page.jsx';

function App() {
	const path = useRoute();
	const cart = useCart();
	return (
		<CartCtx.Provider value={cart}>
			<Shell path={path} cart={cart}>
				<Page path={path} />
			</Shell>
		</CartCtx.Provider>
	);
}

if (typeof document !== 'undefined' && document.getElementById('app')) {
	if (!location.hash) location.hash = '#/';
	mount('#app', App);
}

export { App };
export { PRODUCTS } from '../data/products.js';
export { parseRoute } from './router.jsx';
