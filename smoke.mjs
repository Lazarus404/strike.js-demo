import { strict as assert } from 'node:assert';
import { pathToFileURL } from 'node:url';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
	readFileSync,
	readdirSync,
	mkdirSync,
	writeFileSync,
	cpSync,
	rmSync,
	existsSync
} from 'node:fs';
import { installDom } from '../strike.js/test/dom.js';
import {
	STRIKE_FW_UI_BASE,
	STRIKE_FW_DATAGRID_BASE,
	STRIKE_FW_ROUTER_BASE,
	STRIKE_FW_STORE_BASE
} from './cdn.mjs';

const root = dirname(fileURLToPath(import.meta.url));
const demoUi = join(root, 'strike.js-component-ui');
const demoDg = join(root, 'strike.js-datagrid');
const demoRouter = join(root, 'strike.js-router');
const demoStore = join(root, 'strike.js-store');
const siblingUi = join(root, '..', 'strike.js-component-ui');
const siblingDatagrid = join(root, '..', 'strike.js-datagrid');
const siblingRouter = join(root, '..', 'strike.js-router');
const siblingStore = join(root, '..', 'strike.js-store');
const vendor = join(root, 'vendor');
const uiPack = existsSync(join(demoUi, 'package.json')) ? demoUi : siblingUi;
const dgPack = existsSync(join(demoDg, 'package.json'))
	? demoDg
	: siblingDatagrid;
const routerPack = existsSync(join(demoRouter, 'package.json'))
	? demoRouter
	: siblingRouter;
const storePack = existsSync(join(demoStore, 'package.json'))
	? demoStore
	: siblingStore;

function walk(dir, out = []) {
	for (const name of readdirSync(dir, { withFileTypes: true })) {
		const p = join(dir, name.name);
		if (name.isDirectory()) {
			if (name.name === 'node_modules' || name.name === 'test') continue;
			walk(p, out);
		} else if (/\.js$/.test(name.name)) out.push(p);
	}
	return out;
}

function copyPack(from, to) {
	cpSync(from, to, {
		recursive: true,
		dereference: true,
		filter: src => {
			const base = src.split(/[/\\]/).pop();
			if (base === 'node_modules' || base === 'test' || base === '.git') {
				return false;
			}
			if (
				src.includes(`${from}/node_modules`) ||
				src.includes(`${from}/test`) ||
				src.includes(`${from}/.git`)
			) {
				return false;
			}
			return true;
		}
	});
}

for (const file of walk(join(root, 'src'))) {
	const src = readFileSync(file, 'utf8');
	assert.equal(
		/from ['"]\.\.\/(?:\.\.\/)*strike(?:\.js)?\//.test(src),
		false,
		file + ' must not import strike source'
	);
	assert.equal(
		/\bimport\s*\{[^}]*\bh\b/.test(src),
		false,
		file + ' must not import h'
	);
	const external = [...src.matchAll(/from\s*['"]([^'"]+)['"]/g)].map(m => m[1]);
	for (const spec of external) {
		if (spec.startsWith('.') && !spec.includes('/vendor/')) continue;
		if (spec === 'strike-fw-ui' || spec.startsWith('strike-fw-ui/')) continue;
		if (
			spec === 'strike-fw-datagrid' ||
			spec.startsWith('strike-fw-datagrid/')
		) {
			continue;
		}
		if (
			spec === 'strike-fw-router' ||
			spec.startsWith('strike-fw-router/')
		) {
			continue;
		}
		if (
			spec === 'strike-fw-store' ||
			spec.startsWith('strike-fw-store/')
		) {
			continue;
		}
		assert.match(
			spec,
			/\/vendor\//,
			file + ' external import must be vendor: ' + spec
		);
	}
}

const appSrc = readFileSync(join(root, 'app.js'), 'utf8');
assert.ok(
	appSrc.includes(STRIKE_FW_UI_BASE),
	'app.js must import strike-fw-ui from local pack path; run node build.mjs'
);
assert.ok(
	appSrc.includes(STRIKE_FW_DATAGRID_BASE),
	'app.js must import strike-fw-datagrid from local pack path; run node build.mjs'
);
assert.ok(
	appSrc.includes(STRIKE_FW_ROUTER_BASE),
	'app.js must import strike-fw-router from local pack path; run node build.mjs'
);
assert.ok(
	appSrc.includes(STRIKE_FW_STORE_BASE),
	'app.js must import strike-fw-store from local pack path; run node build.mjs'
);

const smokeDir = join(root, 'tmp-smoke-' + process.pid);
mkdirSync(smokeDir, { recursive: true });

const smokeUi = join(smokeDir, 'ui');
const smokeDg = join(smokeDir, 'datagrid');
const smokeRouter = join(smokeDir, 'router');
const smokeStore = join(smokeDir, 'store');
copyPack(uiPack, smokeUi);
copyPack(dgPack, smokeDg);
copyPack(routerPack, smokeRouter);
copyPack(storePack, smokeStore);

function peerToVendor(fromFile, spec) {
	const rel = relative(dirname(fromFile), vendor).split('\\').join('/');
	const base = rel.startsWith('.') ? rel : './' + rel;
	if (spec === 'strike-fw' || spec === 'strike-fw/hooks') {
		return base + '/strike.core+hooks.js';
	}
	if (spec === 'strike-fw/ui' || spec.startsWith('strike-fw/ui/')) {
		return base + '/strike-ui.js';
	}
	if (spec === 'strike-fw/css') return base + '/css.js';
	if (spec === 'strike-fw/transition') return base + '/transition.js';
	return null;
}

function rewriteStrikeFwPeers(dir) {
	for (const file of walk(dir)) {
		let code = readFileSync(file, 'utf8');
		code = code.replace(
			/from\s*["'](strike-fw(?:\/[^"']*)?)["']/g,
			(_, spec) => {
				const mapped = peerToVendor(file, spec);
				assert.ok(
					mapped,
					'unmapped peer in smoke pack: ' + spec + ' (' + file + ')'
				);
				return 'from "' + mapped + '"';
			}
		);
		writeFileSync(file, code);
	}
}

rewriteStrikeFwPeers(smokeUi);
rewriteStrikeFwPeers(smokeDg);
rewriteStrikeFwPeers(smokeRouter);
rewriteStrikeFwPeers(smokeStore);

const smokeUiUrl = pathToFileURL(smokeUi + '/').href;
for (const file of walk(smokeDg)) {
	let code = readFileSync(file, 'utf8');
	code = code.replace(
		/from\s*["'](strike-fw-ui(?:\/[^"']*)?)["']/g,
		(_, spec) => {
			if (spec === 'strike-fw-ui') return 'from "' + smokeUiUrl + 'index.js"';
			return (
				'from "' +
				smokeUiUrl +
				spec.slice('strike-fw-ui/'.length) +
				'"'
			);
		}
	);
	writeFileSync(file, code);
}

const smokeDgUrl = pathToFileURL(smokeDg + '/').href;
const smokeRouterUrl = pathToFileURL(smokeRouter + '/').href;
const smokeStoreUrl = pathToFileURL(smokeStore + '/').href;
let smokeCode = appSrc
	.split(STRIKE_FW_UI_BASE + '/')
	.join(smokeUiUrl)
	.split(STRIKE_FW_DATAGRID_BASE + '/')
	.join(smokeDgUrl)
	.split(STRIKE_FW_ROUTER_BASE + '/')
	.join(smokeRouterUrl)
	.split(STRIKE_FW_STORE_BASE + '/')
	.join(smokeStoreUrl)
	.split(STRIKE_FW_STORE_BASE + '"')
	.join(smokeStoreUrl.slice(0, -1) + '"');
smokeCode = smokeCode.replace(
	/from\s*["']\.\/vendor\//g,
	'from "' + pathToFileURL(vendor + '/').href
);
const smokeApp = join(smokeDir, 'app.js');
writeFileSync(smokeApp, smokeCode);

const { window, location } = installDom(
	'<html><head></head><body><div id="app"></div></body></html>',
	'#/'
);
window.location = location;
window.history = {
	state: null,
	replaceState(state, _t, url) {
		this.state = state;
		if (url != null) {
			const u = String(url);
			const i = u.indexOf('#');
			if (i !== -1) location.hash = u.slice(i);
		}
	},
	pushState() {},
	go() {}
};
await import(pathToFileURL(smokeApp).href + '?t=' + Date.now());
await Promise.resolve();

const app = document.getElementById('app');
assert.match(app.textContent, /Harbor Goods/);

location.hash = '#/product/board';
window.dispatchEvent({ type: 'hashchange' });
await Promise.resolve();
assert.match(app.textContent, /Add to cart/);

const add = [...app.querySelectorAll('button')].find(b =>
	/Add to cart/.test(b.textContent)
);
add.dispatchEvent(new window.Event('click', { bubbles: true }));
await Promise.resolve();
window.dispatchEvent({ type: 'hashchange' });
await Promise.resolve();
await Promise.resolve();
assert.match(app.textContent, /Total/);

location.hash = '#/lab';
window.dispatchEvent({ type: 'hashchange' });
await Promise.resolve();
await Promise.resolve();
assert.match(app.textContent, /Lab/);
assert.match(app.textContent, /Strike playground/);
assert.match(app.textContent, /Core UI/);
assert.match(app.textContent, /Foundations/);
assert.match(app.textContent, /Structure/);
assert.match(app.textContent, /Overlays/);
assert.match(app.textContent, /Media/);
assert.match(app.textContent, /DataGrid/);
assert.match(app.textContent, /Store/);
assert.match(app.textContent, /Ship standard/);
assert.ok(document.querySelector('.lab-shell'));

rmSync(smokeDir, { recursive: true, force: true });
console.log('ok demo shop flow (vendor Strike + npm packs)');
