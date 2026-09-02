import { Btn, Stack, Text } from '../../vendor/strike-ui.js';
import { go } from '../data/products.js';

export function ThanksPage() {
	return (
		<Stack gap={12} class="thanks">
			<Text as="h1" tone="title">
				Order placed
			</Text>
			<Text>Thanks - this demo store does not charge a card.</Text>
			<Btn onClick={() => go('#/')}>Return to shop</Btn>
		</Stack>
	);
}
