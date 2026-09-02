import { useState, useContext } from '../../vendor/strike.core+hooks.js';
import {
	Btn,
	Stack,
	Text,
	Field,
	Select,
	Form,
	Switch
} from '../../vendor/strike-ui.js';
import { CartCtx } from '../cart/context.jsx';
import { money, go } from '../data/products.js';

export function CheckoutPage() {
	const cart = useContext(CartCtx);
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [ship, setShip] = useState('standard');
	const [updates, setUpdates] = useState(true);
	const [giftNote, setGiftNote] = useState(false);
	const [note, setNote] = useState('');
	const [err, setErr] = useState('');

	if (!cart.lines.length) {
		return (
			<Stack gap={12}>
				<Text as="h1" tone="title">
					Checkout
				</Text>
				<Text tone="muted">Add something to the cart first.</Text>
				<Btn variant="ghost" onClick={() => go('#/')}>
					Shop
				</Btn>
			</Stack>
		);
	}

	const total = cart.total + (ship === 'express' ? 12 : 0);

	function submit() {
		if (!name.trim() || !email.trim()) {
			setErr('Name and email are required.');
			return;
		}
		cart.clear();
		go('#/thanks');
	}

	return (
		<Stack gap={16}>
			<Text as="h1" tone="title">
				Checkout
			</Text>
			<Form class="checkout" onSubmit={submit}>
				<Stack gap={12}>
					<Field
						label="Name"
						value={name}
						onInput={e => setName(e.target.value)}
					/>
					<Field
						label="Email"
						value={email}
						onInput={e => setEmail(e.target.value)}
					/>
					<Select
						label="Shipping"
						value={ship}
						onChange={e => setShip(e.target.value)}
						options={[
							{ value: 'standard', label: 'Standard (free)' },
							{ value: 'express', label: 'Express (+$12)' }
						]}
					/>
					<Switch
						label="Email me order updates"
						checked={updates}
						onChange={e => setUpdates(e.target.checked)}
					/>
					<Switch
						label="Add a gift note"
						checked={giftNote}
						onChange={e => setGiftNote(e.target.checked)}
					/>
					{giftNote ? (
						<Field
							label="Gift note"
							value={note}
							onInput={e => setNote(e.target.value)}
						/>
					) : null}
					{err ? (
						<Text tone="danger" class="strike-err">
							{err}
						</Text>
					) : null}
					<Stack row gap={8}>
						<Btn type="submit">Place order · {money(total)}</Btn>
						<Btn variant="ghost" onClick={() => go('#/cart')}>
							Back to cart
						</Btn>
					</Stack>
				</Stack>
			</Form>
		</Stack>
	);
}
