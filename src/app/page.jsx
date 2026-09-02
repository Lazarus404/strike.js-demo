import { parseRoute } from '../app/router.jsx';
import { ShopHome } from '../pages/shop.jsx';
import { ProductPage } from '../pages/product.jsx';
import { CartPage } from '../pages/cart.jsx';
import { CheckoutPage } from '../pages/checkout.jsx';
import { ThanksPage } from '../pages/thanks.jsx';
import { LabPage } from '../lab/page.jsx';

export function Page({ path }) {
	const route = parseRoute(path);
	if (route.name === 'product') return <ProductPage id={route.id} />;
	if (route.name === 'cart') return <CartPage />;
	if (route.name === 'checkout') return <CheckoutPage />;
	if (route.name === 'thanks') return <ThanksPage />;
	if (route.name === 'lab') return <LabPage />;
	return <ShopHome />;
}
