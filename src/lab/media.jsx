import { useState } from '../../vendor/strike.core+hooks.js';
import { Stack, Text } from '../../vendor/strike-ui.js';
import {
	Table,
	ImageList,
	Video,
	Audio,
	Stepper
} from 'strike-fw-ui';

export function MediaPlayground() {
	const [step, setStep] = useState(0);

	return (
		<Stack gap={18} class="lab-controls">
			<div class="lab-control">
				<Text as="h3" class="lab-control__name">
					Table
				</Text>
				<Table
					caption="Stock"
					columns={[
						{ key: 'name', label: 'Product' },
						{ key: 'qty', label: 'Qty' }
					]}
					rows={[
						{ name: 'Cutting board', qty: 12 },
						{ name: 'Skillet', qty: 4 }
					]}
				/>
			</div>

			<div class="lab-control">
				<Text as="h3" class="lab-control__name">
					ImageList
				</Text>
				<ImageList
					cols={3}
					rowHeight={72}
					items={[
						{
							src: 'https://picsum.photos/seed/harbor1/160/160',
							alt: 'Board',
							title: 'Oak'
						},
						{
							src: 'https://picsum.photos/seed/harbor2/160/160',
							alt: 'Pan',
							title: 'Iron'
						},
						{
							src: 'https://picsum.photos/seed/harbor3/160/160',
							alt: 'Mill',
							title: 'Mill'
						}
					]}
				/>
			</div>

			<div class="lab-control">
				<Text as="h3" class="lab-control__name">
					Stepper
				</Text>
				<Stepper
					orientation="vertical"
					activeStep={step}
					steps={[
						{ label: 'Cart' },
						{ label: 'Ship' },
						{ label: 'Pay' }
					]}
				/>
				<Stepper
					variant="mobile"
					activeStep={step}
					steps={[
						{ label: 'Cart' },
						{ label: 'Ship' },
						{ label: 'Pay' }
					]}
					onNext={() => setStep(Math.min(2, step + 1))}
					onBack={() => setStep(Math.max(0, step - 1))}
				/>
			</div>

			<div class="lab-control">
				<Text as="h3" class="lab-control__name">
					Video / Audio
				</Text>
				<Video
					ratio="16 / 9"
					controls
					poster="https://picsum.photos/seed/harborv/640/360"
				/>
				<Audio title="Sample tone" controls />
			</div>
		</Stack>
	);
}
