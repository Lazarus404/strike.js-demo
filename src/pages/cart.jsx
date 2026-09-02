import { useState, useContext } from '../../vendor/strike.core+hooks.js';
import { Btn, Stack, Text, Select, Dialog } from '../../vendor/strike-ui.js';
import { CartCtx } from '../cart/context.jsx';
import { money, go } from '../data/products.js';

export function CartPage() {
	const cart = useContext(CartCtx);
	const [pending, setPending] = useState(null);

	if (!cart.lines.length) {
		return (
			<Stack gap={12}>
				<Text as="h1" tone="title">
					Cart
				</Text>
				<Text tone="muted">Your cart is empty.</Text>
				<Btn onClick={() => go('#/')}>Browse shop</Btn>
			</Stack>
		);
	}

	return (
		<Stack gap={16}>
			<Text as="h1" tone="title">
				Cart
			</Text>
			<ul class="cart-list">
				{cart.lines.map(line => (
					<li key={line.id + (line.giftWrap ? '-gift' : '')}>
						<Stack row gap={12} class="cart-row">
							<div class="cart-info">
								<Text as="strong">{line.name}</Text>
								{line.giftWrap ? (
									<Text tone="muted">Gift wrap included</Text>
								) : null}
								<Text tone="muted">{money(line.price)} each</Text>
							</div>
							<Select
								label="Qty"
								value={String(line.qty)}
								options={[1, 2, 3, 4, 5].map(n => ({
									value: String(n),
									label: String(n)
								}))}
								onChange={e =>
									cart.setQty(
										line.id,
										Number(e.target.value),
										line.giftWrap
									)
								}
							/>
							<Btn
								variant="ghost"
								onClick={() =>
									setPending({ id: line.id, giftWrap: line.giftWrap })
								}
							>
								Remove
							</Btn>
						</Stack>
					</li>
				))}
			</ul>
			<Stack row gap={12} class="cart-total">
				<Text as="strong">Total {money(cart.total)}</Text>
				<Btn onClick={() => go('#/checkout')}>Checkout</Btn>
			</Stack>
			<Dialog
				open={!!pending}
				title="Remove item?"
				onClose={() => setPending(null)}
			>
				<Stack gap={12}>
					<Text>This removes the line from your cart.</Text>
					<Stack row gap={8}>
						<Btn
							onClick={() => {
								cart.setQty(pending.id, 0, pending.giftWrap);
								setPending(null);
							}}
						>
							Remove
						</Btn>
						<Btn variant="ghost" onClick={() => setPending(null)}>
							Cancel
						</Btn>
					</Stack>
				</Stack>
			</Dialog>
		</Stack>
	);
}
