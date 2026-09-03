import { useState } from '../../vendor/strike.core+hooks.js';
import { Btn, Stack, Text } from '../../vendor/strike-ui.js';
import {
	Card,
	Container,
	Grid,
	GridItem,
	List,
	ListItem,
	Accordion,
	AccordionItem,
	AppBar,
	Breadcrumbs,
	Tabs,
	Tooltip,
	Avatar,
	Icon
} from 'strike-fw-ui';

export function StructurePlayground() {
	const [tab, setTab] = useState('overview');
	const [picked, setPicked] = useState('oak');

	return (
		<Stack gap={18} class="lab-controls">
			<div class="lab-control">
				<Text as="h3" class="lab-control__name">
					AppBar / Breadcrumbs
				</Text>
				<AppBar
					elevated
					start={<Text as="strong">Harbor</Text>}
					end={
						<Btn variant="ghost" type="button">
							Cart
						</Btn>
					}
				>
					<Text tone="muted">Lab chrome</Text>
				</AppBar>
				<Breadcrumbs
					items={[
						{ label: 'Shop', href: '#/' },
						{ label: 'Lab', href: '#/lab' },
						{ label: 'Structure' }
					]}
				/>
			</div>

			<div class="lab-control">
				<Text as="h3" class="lab-control__name">
					Card / Container / Grid
				</Text>
				<Container size="md">
					<Grid columns={2} gap={2}>
						<GridItem>
							<Card
								title="Cutting board"
								subtitle="Oak"
								actions={
									<Btn variant="primary" type="button">
										View
									</Btn>
								}
							>
								Structured surface on Paper.
							</Card>
						</GridItem>
						<GridItem>
							<Card outlined title="Cast iron" subtitle="Skillet">
								Outlined variant.
							</Card>
						</GridItem>
					</Grid>
				</Container>
			</div>

			<div class="lab-control">
				<Text as="h3" class="lab-control__name">
					List
				</Text>
				<List>
					<ListItem
						selected={picked === 'oak'}
						onClick={() => setPicked('oak')}
						start={<Avatar name="Oak" size="sm" />}
					>
						Oak board
					</ListItem>
					<ListItem
						selected={picked === 'teak'}
						onClick={() => setPicked('teak')}
						start={<Avatar name="Teak" size="sm" />}
					>
						Teak board
					</ListItem>
				</List>
			</div>

			<div class="lab-control">
				<Text as="h3" class="lab-control__name">
					Accordion
				</Text>
				<Accordion defaultValue="ship">
					<AccordionItem id="ship" title="Shipping">
						Standard 3-5 days.
					</AccordionItem>
					<AccordionItem id="care" title="Care">
						Hand wash only.
					</AccordionItem>
				</Accordion>
			</div>

			<div class="lab-control">
				<Text as="h3" class="lab-control__name">
					Tabs
				</Text>
				<Tabs
					value={tab}
					onChange={setTab}
					items={[
						{ id: 'overview', label: 'Overview', panel: 'Product overview copy.' },
						{ id: 'specs', label: 'Specs', panel: 'Size and weight details.' }
					]}
				/>
			</div>

			<div class="lab-control">
				<Text as="h3" class="lab-control__name">
					Tooltip
				</Text>
				<Stack row gap={10}>
					<Tooltip title="Anchored to this button" placement="top">
						<Btn variant="ghost" type="button">
							Top
						</Btn>
					</Tooltip>
					<Tooltip title="Anchored to this button" placement="bottom">
						<Btn variant="ghost" type="button">
							Bottom
						</Btn>
					</Tooltip>
					<Tooltip title="Anchored to this button" placement="left">
						<Btn variant="ghost" type="button">
							Left
						</Btn>
					</Tooltip>
					<Tooltip title="Anchored to this button" placement="right">
						<Btn variant="ghost" type="button">
							Right
						</Btn>
					</Tooltip>
				</Stack>
			</div>
		</Stack>
	);
}
