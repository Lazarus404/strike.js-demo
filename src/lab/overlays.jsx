import { useState, useRef } from '../../vendor/strike.core+hooks.js';
import { Btn, Stack, Text } from '../../vendor/strike-ui.js';
import {
	Drawer,
	Menu,
	MenuItem,
	MenuBar,
	Snackbar,
	snackbar,
	Pagination,
	Navigation
} from 'strike-fw-ui';

export function OverlaysPlayground() {
	const [drawer, setDrawer] = useState(false);
	const [menuOpen, setMenuOpen] = useState(false);
	const [snack, setSnack] = useState(false);
	const [snackPlace, setSnackPlace] = useState('bottom-end');
	const [page, setPage] = useState(3);
	const [n, setN] = useState(0);
	const menuBtn = useRef(null);

	function pushToast(placement) {
		const i = n + 1;
		setN(i);
		if (placement) setSnackPlace(placement);
		snackbar.show({
			tone: 'ok',
			children: 'Toast ' + i,
			autoHideMs: 4000,
			placement: placement || snackPlace
		});
	}

	return (
		<Stack gap={18} class="lab-controls">
			<div class="lab-control">
				<Text as="h3" class="lab-control__name">
					Navigation
				</Text>
				<Navigation
					items={[
						{ href: '#/', label: 'Shop' },
						{ href: '#/lab', label: 'Lab', current: true }
					]}
					onNavigate={item => {
						location.hash = item.href.replace(/^#/, '') ? item.href : '#/';
					}}
				/>
			</div>

			<div class="lab-control">
				<Text as="h3" class="lab-control__name">
					Drawer
				</Text>
				<Btn variant="ghost" type="button" onClick={() => setDrawer(true)}>
					Open drawer
				</Btn>
				<Drawer
					open={drawer}
					onClose={() => setDrawer(false)}
					title="Filters"
				>
					Side panel via overlay.
				</Drawer>
			</div>

			<div class="lab-control">
				<Text as="h3" class="lab-control__name">
					Menu
				</Text>
				<span ref={menuBtn}>
					<Btn
						variant="ghost"
						type="button"
						onClick={() => setMenuOpen(true)}
					>
						Actions
					</Btn>
				</span>
				<Menu
					open={menuOpen}
					onClose={() => setMenuOpen(false)}
					anchor={menuBtn}
				>
					<MenuItem onSelect={() => setMenuOpen(false)}>Edit</MenuItem>
					<MenuItem onSelect={() => setMenuOpen(false)}>Duplicate</MenuItem>
					<MenuItem destructive onSelect={() => setMenuOpen(false)}>
						Delete
					</MenuItem>
				</Menu>
			</div>

			<div class="lab-control">
				<Text as="h3" class="lab-control__name">
					MenuBar
				</Text>
				<MenuBar
					items={[
						{
							id: 'file',
							label: 'File',
							children: [
								{ label: 'New', onSelect: () => {} },
								{ label: 'Open', onSelect: () => {} }
							]
						},
						{
							id: 'edit',
							label: 'Edit',
							children: [{ label: 'Undo', onSelect: () => {} }]
						}
					]}
				/>
			</div>

			<div class="lab-control">
				<Text as="h3" class="lab-control__name">
					Snackbar
				</Text>
				<Text tone="muted">
					Uses the app Shell host (slide-up + FLIP). Spam Stack to stack toasts.
				</Text>
				<Stack row gap={8}>
					<Btn
						variant="ghost"
						type="button"
						onClick={() => {
							setSnackPlace('bottom-start');
							setSnack(true);
						}}
					>
						Lone start
					</Btn>
					<Btn
						variant="ghost"
						type="button"
						onClick={() => pushToast('bottom-start')}
					>
						Stack start
					</Btn>
					<Btn
						variant="ghost"
						type="button"
						onClick={() => pushToast('bottom-center')}
					>
						Stack center
					</Btn>
					<Btn
						variant="ghost"
						type="button"
						onClick={() => pushToast('bottom-end')}
					>
						Stack end
					</Btn>
				</Stack>
				<Snackbar
					open={snack}
					onClose={() => setSnack(false)}
					tone="ok"
					placement={snackPlace}
				>
					Saved to cart
				</Snackbar>
			</div>

			<div class="lab-control">
				<Text as="h3" class="lab-control__name">
					Pagination
				</Text>
				<Pagination page={page} count={12} onChange={setPage} />
			</div>
		</Stack>
	);
}
