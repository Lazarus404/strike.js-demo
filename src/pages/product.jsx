import { useState, useContext } from '../../vendor/strike.core+hooks.js';
import { Btn, Stack, Text, Check, Dialog } from '../../vendor/strike-ui.js';
import { CartCtx } from '../cart/context.jsx';
import { PRODUCTS, money, go } from '../data/products.js';

export function ProductPage({ id }) {
	const cart = useContext(CartCtx);
	const [giftWrap, setGiftWrap] = useState(false);
	const [careOpen, setCareOpen] = useState(false);
	const product = PRODUCTS.find(p => p.id === id);

	if (!product) {
		return (
			<Stack gap={12}>
				<Text as="h1" tone="title">
					Not found
				</Text>
				<Btn variant="ghost" onClick={() => go('#/')}>
					Back to shop
				</Btn>
			</Stack>
		);
	}

	return (
		<div class="product">
			<div
				class="product-media"
				style={{ background: product.tone }}
				aria-hidden="true"
			/>
			<Stack gap={14} class="product-copy">
				<Text tone="muted" as="span">
					{product.tag}
				</Text>
				<Text as="h1" tone="title">
					{product.name}
				</Text>
				<Text>{product.blurb}</Text>
				<Text as="strong">{money(product.price)}</Text>
				<Check
					label="Gift wrap (+$5)"
					checked={giftWrap}
					onChange={e => setGiftWrap(e.target.checked)}
				/>
				<Stack row gap={8}>
					<Btn
						onClick={() => {
							cart.add(product, { giftWrap });
							go('#/cart');
						}}
					>
						Add to cart
					</Btn>
					<Btn variant="ghost" onClick={() => setCareOpen(true)}>
						Care guide
					</Btn>
					<Btn variant="ghost" onClick={() => go('#/')}>
						Keep shopping
					</Btn>
				</Stack>
			</Stack>
			<Dialog
				open={careOpen}
				title="Care guide"
				onClose={() => setCareOpen(false)}
			>
				<Stack gap={12}>
					<Text>{product.care}</Text>
					<Btn variant="ghost" onClick={() => setCareOpen(false)}>
						Close
					</Btn>
				</Stack>
			</Dialog>
		</div>
	);
}
