import { mount } from '../../vendor/strike.core+hooks.js';
import {
	Router,
	Routes,
	Route,
	useParams
} from 'strike-fw-router';
import { Shell } from './shell.jsx';
import { ShopHome } from '../pages/shop.jsx';
import { ProductPage } from '../pages/product.jsx';
import { CartPage } from '../pages/cart.jsx';
import { CheckoutPage } from '../pages/checkout.jsx';
import { ThanksPage } from '../pages/thanks.jsx';
import { LabPage } from '../lab/page.jsx';

function ProductRoute() {
	const { id } = useParams();
	return <ProductPage id={id} />;
}

function AppRoutes() {
	return (
		<Routes>
			<Route path="/" element={<ShopHome />} />
			<Route path="/product/:id" element={<ProductRoute />} />
			<Route path="/cart" element={<CartPage />} />
			<Route path="/checkout" element={<CheckoutPage />} />
			<Route path="/thanks" element={<ThanksPage />} />
			<Route path="/lab/:section?" element={<LabPage />} />
		</Routes>
	);
}

function App() {
	return (
		<Router>
			<Shell>
				<AppRoutes />
			</Shell>
		</Router>
	);
}

if (typeof document !== 'undefined' && document.getElementById('app')) {
	if (!location.hash) location.hash = '#/';
	mount('#app', App);
}

export { App };
export { PRODUCTS } from '../data/products.js';
