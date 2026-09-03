import {
	useState,
	useEffect,
	useLayoutEffect,
	useMemo,
	mount
} from '../../vendor/strike.core+hooks.js';
import { useTransition } from '../../vendor/transition.js';
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
import {
	Avatar,
	Badge,
	Chip,
	Divider,
	Icon,
	Alert,
	Progress,
	Skeleton,
	Paper,
	Box,
	Link,
	Tabs
} from 'strike-fw-ui';
import { useParams, useNavigate } from 'strike-fw-router';
import { RouteFade } from '../lib/motion.jsx';
import { IslandCounter } from './island.jsx';
import { StructurePlayground } from './structure.jsx';
import { OverlaysPlayground } from './overlays.jsx';
import { MediaPlayground } from './media.jsx';
import { DataGridPlayground } from './datagrid.jsx';
import { StorePlayground } from './store.jsx';

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

function HydrateIsland() {
	useLayoutEffect(() => {
		const host = document.getElementById('lab-hydrate');
		if (!host || host.__strikeLab) return;
		host.__strikeLab = true;
		if (!host.firstChild) {
			host.innerHTML =
				'<button type="button" class="lab-island__btn">0</button>';
		}
		mount(host, IslandCounter, { n: 0 });
	}, []);

	return (
		<div
			id="lab-hydrate"
			class="lab-island"
			data-hydrate
			data-props='{"n":0}'
		/>
	);
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

function CheckIcon() {
	return (
		<Icon size="sm" label="ok">
			<svg viewBox="0 0 24 24" aria-hidden="true">
				<path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z" />
			</svg>
		</Icon>
	);
}

function FadeAlert({ open, onClose, class: className, children, ...rest }) {
	const [mounted, setMounted] = useState(!!open);
	const { className: txClass, style } = useTransition({
		name: 'fade',
		ms: 160,
		open: !!open,
		onExited: () => setMounted(false)
	});

	useEffect(() => {
		if (open) setMounted(true);
	}, [open]);

	if (!mounted) return null;

	return (
		<Alert
			{...rest}
			class={[txClass, className].filter(Boolean).join(' ')}
			style={style}
			onClose={onClose}
		>
			{children}
		</Alert>
	);
}

function ExtendedPlayground() {
	const [chipOn, setChipOn] = useState(true);
	const [chips, setChips] = useState(['oak', 'teak']);
	const [alertOpen, setAlertOpen] = useState(true);
	const [prog, setProg] = useState(35);

	return (
		<Stack gap={18} class="lab-controls">
			<div class="lab-control">
				<Text as="h3" class="lab-control__name">
					Avatar / Badge / Icon
				</Text>
				<Stack row gap={14}>
					<Badge content={2}>
						<Avatar name="Harbor Goods" />
					</Badge>
					<Avatar name="Ada Lovelace" size="lg" />
					<Badge tone="danger" dot>
						<Icon size="lg">
							<svg viewBox="0 0 24 24" aria-hidden="true">
								<path d="M12 22c1.1 0 2-.9 2-2h-4a2 2 0 002 2zm6-6V11c0-3.07-1.64-5.64-4.5-6.32V4a1.5 1.5 0 00-3 0v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
							</svg>
						</Icon>
					</Badge>
				</Stack>
			</div>

			<div class="lab-control">
				<Text as="h3" class="lab-control__name">
					Chip
				</Text>
				<Stack row gap={8}>
					<Chip selected={chipOn} onClick={() => setChipOn(!chipOn)}>
						Filter
					</Chip>
					{chips.map(c => (
						<Chip
							key={c}
							onDelete={() => setChips(chips.filter(x => x !== c))}
						>
							{c}
						</Chip>
					))}
					<Chip startIcon={<CheckIcon />} tone="ok">
						In stock
					</Chip>
				</Stack>
			</div>

			<div class="lab-control">
				<Text as="h3" class="lab-control__name">
					Alert
				</Text>
				<FadeAlert
					open={alertOpen}
					tone="info"
					title="Foundations"
					onClose={() => setAlertOpen(false)}
				>
					Dismissible inline feedback with a fade exit.
				</FadeAlert>
				{!alertOpen ? (
					<Btn
						variant="ghost"
						type="button"
						onClick={() => setAlertOpen(true)}
					>
						Show alert
					</Btn>
				) : null}
			</div>

			<div class="lab-control">
				<Text as="h3" class="lab-control__name">
					Progress
				</Text>
				<Stack gap={10}>
					<Progress value={prog} label="Load" />
					<Progress label="Busy" />
					<Stack row gap={8}>
						<Btn
							variant="ghost"
							type="button"
							onClick={() => setProg(Math.max(0, prog - 10))}
						>
							-10
						</Btn>
						<Btn
							variant="ghost"
							type="button"
							onClick={() => setProg(Math.min(100, prog + 10))}
						>
							+10
						</Btn>
					</Stack>
				</Stack>
			</div>

			<div class="lab-control">
				<Text as="h3" class="lab-control__name">
					Skeleton
				</Text>
				<Stack gap={8}>
					<Skeleton variant="text" width="60%" />
					<Skeleton variant="rectangular" height={48} animation="wave" />
				</Stack>
			</div>

			<div class="lab-control">
				<Text as="h3" class="lab-control__name">
					Paper / Box / Link / Divider
				</Text>
				<Paper elevation={1}>
					<Box p={2} display="flex" direction="column" gap={2}>
						<Text as="h3">Paper surface</Text>
						<Text tone="muted">Box lays out with spacing scale.</Text>
						<Divider label="or" />
						<Link href="#/lab" underline="hover">
							Lab link
						</Link>
						<Link href="https://example.com" external>
							External
						</Link>
					</Box>
				</Paper>
			</div>
		</Stack>
	);
}

function LabPanel({ title, blurb, sectionKey, children }) {
	return (
		<div class="lab-panel">
			<header class="lab-panel__head">
				<Text as="h2" class="lab-panel__title">
					{title}
				</Text>
				{blurb ? (
					<Text tone="muted" class="lab-panel__blurb">
						{blurb}
					</Text>
				) : null}
			</header>
			<RouteFade routeKey={sectionKey || title}>{children}</RouteFade>
		</div>
	);
}

export function LabPage() {
	const { section: sectionParam } = useParams();
	const navigate = useNavigate();
	const section = sectionParam || 'core';
	const setSection = id => {
		navigate(id ? '/lab/' + id : '/lab', { replace: true });
	};

	const items = [
		{
			id: 'templates',
			label: 'Templates',
			panel: (
				<LabPanel
					title="html templates"
					sectionKey="templates"
					blurb="No JSX compile - prefixes .prop ?bool @event."
				>
					<HtmlPlayground />
				</LabPanel>
			)
		},
		{
			id: 'hydrate',
			label: 'Hydrate',
			panel: (
				<LabPanel
					title="Hydrate island"
					sectionKey="hydrate"
					blurb="Pre-rendered button kept on first mount via data-hydrate."
				>
					<HydrateIsland />
				</LabPanel>
			)
		},
		{
			id: 'core',
			label: 'Core UI',
			panel: (
				<LabPanel
					title="Core UI"
					sectionKey="core"
					blurb="RadioGroup, ToggleGroup, NumberField, BtnGroup, Autocomplete - vendor/strike-ui.js."
				>
					<ControlsPlayground />
				</LabPanel>
			)
		},
		{
			id: 'foundations',
			label: 'Foundations',
			panel: (
				<LabPanel
					title="Foundations"
					sectionKey="foundations"
					blurb="Avatar, Badge, Chip, Alert, Progress, Skeleton, Paper, Box, Link, Icon, Divider."
				>
					<ExtendedPlayground />
				</LabPanel>
			)
		},
		{
			id: 'structure',
			label: 'Structure',
			panel: (
				<LabPanel
					title="Structure"
					sectionKey="structure"
					blurb="Card, Container, Grid, List, Accordion, AppBar, Breadcrumbs, Tabs, Tooltip."
				>
					<StructurePlayground />
				</LabPanel>
			)
		},
		{
			id: 'overlays',
			label: 'Overlays',
			panel: (
				<LabPanel
					title="Overlays"
					sectionKey="overlays"
					blurb="Drawer, Menu, MenuBar, Snackbar, Pagination, Navigation."
				>
					<OverlaysPlayground />
				</LabPanel>
			)
		},
		{
			id: 'media',
			label: 'Media',
			panel: (
				<LabPanel
					title="Media and data"
					sectionKey="media"
					blurb="Table, ImageList, Stepper, Video, Audio."
				>
					<MediaPlayground />
				</LabPanel>
			)
		},
		{
			id: 'store',
			label: 'Store',
			panel: (
				<LabPanel
					title="Store and query"
					sectionKey="store"
					blurb="strike-fw-store atoms, persist, and query groups driving Progress."
				>
					<StorePlayground />
				</LabPanel>
			)
		},
		{
			id: 'datagrid',
			label: 'DataGrid',
			panel: (
				<LabPanel
					title="DataGrid"
					sectionKey="datagrid"
					blurb="Sort, filter, page, select, edit, reorder, resize - strike-fw-datagrid."
				>
					<DataGridPlayground />
				</LabPanel>
			)
		}
	];

	return (
		<Stack gap={22} class="lab">
			<header class="lab-hero">
				<p class="lab-hero__eyebrow">Strike playground</p>
				<Text as="h1" class="lab-hero__title">
					Lab
				</Text>
				<Text class="lab-hero__lede">
					Kitchen-sink for Strike APIs outside the shop. Core UI from vendor;
					extended UI from strike-fw-ui; grid from strike-fw-datagrid; store
					from strike-fw-store.
				</Text>
			</header>

			<div class="lab-shell">
				<Tabs
					class="lab-tabs"
					value={section}
					onChange={setSection}
					items={items}
				/>
			</div>

			<Btn
				variant="ghost"
				onClick={() => navigate('/', { replace: false })}
			>
				Back to shop
			</Btn>
		</Stack>
	);
}
