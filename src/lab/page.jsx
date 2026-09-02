import {
	useState,
	useLayoutEffect,
	useMemo,
	mount
} from '../../vendor/strike.core+hooks.js';
import { html } from '../../vendor/html.js';
import {
	Btn,
	Stack,
	Text,
	RadioGroup,
	NumberField,
	BtnGroup,
	ToggleGroup,
	Autocomplete
} from '../../vendor/strike-ui.js';
import { IslandCounter } from './island.jsx';

function HtmlPlayground() {
	const [n, setN] = useState(0);
	const busy = n >= 5;
	return html`
		<div class="lab-html">
			<p class="lab-html__status">Clicked ${n}${busy ? ' (disabled)' : ''}</p>
			<button
				type="button"
				class="lab-html__btn"
				?disabled=${busy}
				@click=${() => setN(n + 1)}
			>
				html tagged click
			</button>
		</div>
	`;
}

function ControlsPlayground() {
	const [ship, setShip] = useState('standard');
	const [size, setSize] = useState('m');
	const [tags, setTags] = useState(['kitchen']);
	const [qty, setQty] = useState(1);
	const [query, setQuery] = useState('');
	const [picked, setPicked] = useState('');
	const all = useMemo(
		() => [
			{ value: 'board', label: 'Cutting board' },
			{ value: 'skillet', label: 'Cast iron' },
			{ value: 'apron', label: 'Linen apron' },
			{ value: 'mill', label: 'Coffee mill' }
		],
		[]
	);
	const filtered = useMemo(() => {
		const q = query.trim().toLowerCase();
		if (!q) return all;
		return all.filter(
			o =>
				o.label.toLowerCase().includes(q) ||
				o.value.toLowerCase().includes(q)
		);
	}, [all, query]);

	return (
		<Stack gap={18} class="lab-controls">
			<div class="lab-control">
				<Text as="h3" class="lab-control__name">
					RadioGroup
				</Text>
				<RadioGroup
					label="Shipping"
					name="lab-ship"
					row
					value={ship}
					options={[
						{ value: 'standard', label: 'Standard' },
						{ value: 'express', label: 'Express' }
					]}
					onChange={e => setShip(e.target.value)}
				/>
			</div>

			<div class="lab-control">
				<Text as="h3" class="lab-control__name">
					ToggleGroup
				</Text>
				<Stack gap={10}>
					<ToggleGroup
						value={size}
						options={[
							{ value: 's', label: 'S' },
							{ value: 'm', label: 'M' },
							{ value: 'l', label: 'L' }
						]}
						onChange={setSize}
					/>
					<ToggleGroup
						exclusive={false}
						joined={false}
						value={tags}
						options={[
							{ value: 'kitchen', label: 'Kitchen' },
							{ value: 'brew', label: 'Brew' },
							{ value: 'table', label: 'Table' }
						]}
						onChange={setTags}
					/>
				</Stack>
			</div>

			<div class="lab-control">
				<Text as="h3" class="lab-control__name">
					NumberField
				</Text>
				<NumberField
					label="Quantity"
					value={qty}
					min={1}
					max={9}
					onInput={e => setQty(Number(e.target.value))}
				/>
			</div>

			<div class="lab-control">
				<Text as="h3" class="lab-control__name">
					BtnGroup
				</Text>
				<BtnGroup>
					<Btn variant="ghost" type="button">
						Left
					</Btn>
					<Btn variant="ghost" type="button">
						Mid
					</Btn>
					<Btn variant="primary" type="button">
						Right
					</Btn>
				</BtnGroup>
			</div>

			<div class="lab-control">
				<Text as="h3" class="lab-control__name">
					Autocomplete
				</Text>
				<Autocomplete
					label="Find a tool"
					value={query}
					options={filtered}
					onInput={e => setQuery(e.target.value)}
					onSelect={opt => {
						setQuery(opt.label);
						setPicked(opt.value);
					}}
				/>
			</div>

			<Text tone="muted" class="lab-controls__summary">
				Ship {ship} · size {size} · tags {tags.join(', ') || 'none'} · qty{' '}
				{qty}
				{picked ? ' · picked ' + picked : ''}
			</Text>
		</Stack>
	);
}

export function LabPage() {
	useLayoutEffect(() => {
		const host = document.getElementById('lab-hydrate');
		if (!host || host.__strikeLab) return;
		host.__strikeLab = true;
		if (!host.firstChild) {
			host.innerHTML = '<button type="button" class="lab-island__btn">0</button>';
		}
		mount(host, IslandCounter, { n: 0 });
	}, []);

	return (
		<Stack gap={28} class="lab">
			<Stack gap={8}>
				<Text as="h1" tone="title">
					Lab
				</Text>
				<Text>
					Kitchen-sink route for Strike APIs outside the shop flow. Still loads
					only vendor dist files.
				</Text>
			</Stack>

			<section class="lab-section">
				<Text as="h2" tone="title">
					html templates
				</Text>
				<Text tone="muted">
					No JSX compile for this block - prefixes .prop ?bool @event.
				</Text>
				<HtmlPlayground />
			</section>

			<section class="lab-section">
				<Text as="h2" tone="title">
					hydrate island
				</Text>
				<Text tone="muted">
					Pre-rendered button kept on first mount via data-hydrate.
				</Text>
				<div
					id="lab-hydrate"
					class="lab-island"
					data-hydrate
					data-props='{"n":0}'
				/>
			</section>

			<section class="lab-section">
				<Text as="h2" tone="title">
					UI controls
				</Text>
				<Text tone="muted">
					RadioGroup, ToggleGroup (exclusive + multi), NumberField, BtnGroup,
					Autocomplete - from vendor/strike-ui.js.
				</Text>
				<ControlsPlayground />
			</section>

			<Btn variant="ghost" onClick={() => (location.hash = '#/')}>
				Back to shop
			</Btn>
		</Stack>
	);
}
