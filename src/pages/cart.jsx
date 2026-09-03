import { useState, useRef } from '../../vendor/strike.core+hooks.js';
import { Btn, Stack, Text, Select } from '../../vendor/strike-ui.js';
import { snackbar } from 'strike-fw-ui';
import {
	useCartLines,
	useCartTotal,
	setCartQty
} from '../cart/store.js';
import { money, go } from '../data/products.js';
import { TxDialog, useListFlip } from '../lib/motion.jsx';

export function CartPage() {
	const lines = useCartLines();
	const total = useCartTotal();
	const [pending, setPending] = useState(null);
	const listRef = useRef(null);
	useListFlip(listRef, [lines.map(l => l.id + ':' + l.qty + ':' + !!l.giftWrap).join('|')]);

	if (!lines.length) {
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
			<ul class="cart-list" ref={listRef}>
				{lines.map(line => (
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
									setCartQty(
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
				<Text as="strong">Total {money(total)}</Text>
				<Btn onClick={() => go('#/checkout')}>Checkout</Btn>
			</Stack>
			<TxDialog
				open={!!pending}
				title="Remove item?"
				onClose={() => setPending(null)}
			>
				<Stack gap={12}>
					<Text>This removes the line from your cart.</Text>
					<Stack row gap={8}>
						<Btn
							onClick={() => {
								setCartQty(pending.id, 0, pending.giftWrap);
								setPending(null);
								snackbar.show({
									children: 'Removed from cart',
									autoHideMs: 2500
								});
							}}
						>
							Remove
						</Btn>
						<Btn variant="ghost" onClick={() => setPending(null)}>
							Cancel
						</Btn>
					</Stack>
				</Stack>
			</TxDialog>
		</Stack>
	);
}
