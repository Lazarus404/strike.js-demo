import {
	mkdirSync,
	copyFileSync,
	readFileSync,
	writeFileSync,
	mkdtempSync,
	rmSync,
	existsSync,
	symlinkSync,
	cpSync
} from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';
import {
	rewriteStrikeFwUiImports,
	rewriteStrikeFwDatagridImports,
	rewriteStrikeFwRouterImports,
	rewriteStrikeFwStoreImports,
	STRIKE_FW_UI_BASE,
	STRIKE_FW_DATAGRID_BASE,
	STRIKE_FW_ROUTER_BASE,
	STRIKE_FW_STORE_BASE
} from './cdn.mjs';

const STRIKE_REPO = 'https://github.com/Lazarus404/strike.js.git';
const STRIKE_REF = process.env.STRIKE_REF || '';
const STRIKE_NPM = process.env.STRIKE_NPM || 'strike-fw@0.2.1';
const STRIKE_UI_NPM = process.env.STRIKE_UI_NPM || 'strike-fw-ui@0.2.0';
const STRIKE_DG_NPM = process.env.STRIKE_DG_NPM || 'strike-fw-datagrid@0.1.0';
const STRIKE_ROUTER_NPM =
	process.env.STRIKE_ROUTER_NPM || 'strike-fw-router@0.1.0';
const STRIKE_STORE_NPM =
	process.env.STRIKE_STORE_NPM || 'strike-fw-store@0.1.0';

const root = dirname(fileURLToPath(import.meta.url));
const vendor = join(root, 'vendor');
const siblingStrike = join(root, '..', 'strike.js');
const siblingUi = join(root, '..', 'strike.js-component-ui');
const siblingDatagrid = join(root, '..', 'strike.js-datagrid');
const siblingRouter = join(root, '..', 'strike.js-router');
const siblingStore = join(root, '..', 'strike.js-store');
const localUi = join(root, 'strike.js-component-ui');
const localDatagrid = join(root, 'strike.js-datagrid');
const localRouter = join(root, 'strike.js-router');
const localStore = join(root, 'strike.js-store');
// Default: published npm. STRIKE_LOCAL=1 uses sibling ../strike.js.
const useLocalStrike = process.env.STRIKE_LOCAL === '1';
// Default: published npm. STRIKE_UI_LOCAL=1 uses sibling ../strike.js-component-ui.
const useLocalUi = process.env.STRIKE_UI_LOCAL === '1';
// Default: published npm. STRIKE_DG_LOCAL=1 uses sibling ../strike.js-datagrid.
const useLocalDg = process.env.STRIKE_DG_LOCAL === '1';
// Default: published npm. STRIKE_ROUTER_LOCAL=1 uses sibling ../strike.js-router.
const useLocalRouter = process.env.STRIKE_ROUTER_LOCAL === '1';
// Default: published npm. STRIKE_STORE_LOCAL=1 uses sibling ../strike.js-store.
const useLocalStore = process.env.STRIKE_STORE_LOCAL === '1';

function run(cmd, args, opts = {}) {
	const r = spawnSync(cmd, args, { stdio: 'inherit', ...opts });
	if (r.status) {
		process.exit(r.status || 1);
	}
	return r;
}

function packCopyFilter(from) {
	return src => {
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
	};
}

function linkSiblingPack(siblingPath, localPath, label) {
	if (!existsSync(join(siblingPath, 'package.json'))) {
		console.warn('demo: missing sibling pack at', siblingPath);
		return;
	}
	try {
		if (existsSync(localPath)) rmSync(localPath, { recursive: true, force: true });
		symlinkSync(siblingPath, localPath, 'dir');
		console.log('demo: linked', label, '->', siblingPath);
	} catch {
		if (existsSync(localPath)) rmSync(localPath, { recursive: true, force: true });
		cpSync(siblingPath, localPath, {
			recursive: true,
			filter: packCopyFilter(siblingPath)
		});
		console.log('demo: copied sibling pack to', label);
	}
}

function copyNpmPack(npmRoot, localPath, label) {
	if (!existsSync(join(npmRoot, 'package.json'))) {
		console.error('demo: missing npm pack at', npmRoot);
		process.exit(1);
	}
	if (existsSync(localPath)) rmSync(localPath, { recursive: true, force: true });
	cpSync(npmRoot, localPath, {
		recursive: true,
		filter: packCopyFilter(npmRoot)
	});
	console.log('demo: copied', label, 'from npm ->', localPath);
}

/** Install an npm pack into a temp dir; returns { root, cleanup }. */
function npmPackageDir(spec) {
	if (spec.startsWith('@')) {
		const parts = spec.split('@');
		return '@' + parts[1];
	}
	return spec.split('@')[0];
}

function installPackNpm(spec, label) {
	const work = mkdtempSync(join(tmpdir(), 'harbor-' + label + '-'));
	writeFileSync(
		join(work, 'package.json'),
		JSON.stringify({ private: true, type: 'module' })
	);
	console.log('demo: npm install', spec);
	run('npm', ['install', spec], { cwd: work });
	return {
		root: join(work, 'node_modules', npmPackageDir(spec)),
		cleanup: () => rmSync(work, { recursive: true, force: true })
	};
}

function syncUiPack(npmUiRoot) {
	if (useLocalUi) {
		linkSiblingPack(siblingUi, localUi, STRIKE_FW_UI_BASE);
		return () => {};
	}
	if (npmUiRoot) {
		copyNpmPack(npmUiRoot, localUi, STRIKE_UI_NPM);
		return () => {};
	}
	const { root: uiRoot, cleanup } = installPackNpm(STRIKE_UI_NPM, 'ui');
	copyNpmPack(uiRoot, localUi, STRIKE_UI_NPM);
	return cleanup;
}

function syncDatagridPack(npmDgRoot) {
	if (useLocalDg) {
		linkSiblingPack(siblingDatagrid, localDatagrid, STRIKE_FW_DATAGRID_BASE);
		return () => {};
	}
	if (npmDgRoot) {
		copyNpmPack(npmDgRoot, localDatagrid, STRIKE_DG_NPM);
		return () => {};
	}
	const { root: dgRoot, cleanup } = installPackNpm(STRIKE_DG_NPM, 'dg');
	copyNpmPack(dgRoot, localDatagrid, STRIKE_DG_NPM);
	return cleanup;
}

function syncRouterPack(npmRouterRoot) {
	if (useLocalRouter) {
		linkSiblingPack(siblingRouter, localRouter, STRIKE_FW_ROUTER_BASE);
		return () => {};
	}
	if (npmRouterRoot) {
		copyNpmPack(npmRouterRoot, localRouter, STRIKE_ROUTER_NPM);
		return () => {};
	}
	const { root: routerRoot, cleanup } = installPackNpm(
		STRIKE_ROUTER_NPM,
		'router'
	);
	copyNpmPack(routerRoot, localRouter, STRIKE_ROUTER_NPM);
	return cleanup;
}

function syncStorePack(npmStoreRoot) {
	if (useLocalStore) {
		linkSiblingPack(siblingStore, localStore, STRIKE_FW_STORE_BASE);
		return () => {};
	}
	if (npmStoreRoot) {
		copyNpmPack(npmStoreRoot, localStore, STRIKE_STORE_NPM);
		return () => {};
	}
	const { root: storeRoot, cleanup } = installPackNpm(
		STRIKE_STORE_NPM,
		'store'
	);
	copyNpmPack(storeRoot, localStore, STRIKE_STORE_NPM);
	return cleanup;
}

function syncPacks(npmUiRoot, npmDgRoot, npmRouterRoot, npmStoreRoot) {
	const cleanupUi = syncUiPack(npmUiRoot);
	const cleanupDg = syncDatagridPack(npmDgRoot);
	const cleanupRouter = syncRouterPack(npmRouterRoot);
	const cleanupStore = syncStorePack(npmStoreRoot);
	return () => {
		cleanupUi();
		cleanupDg();
		cleanupRouter();
		cleanupStore();
	};
}

function copyDist(dist, strikeRoot) {
	mkdirSync(vendor, { recursive: true });
	for (const f of [
		'strike.core+hooks.js',
		'strike-ui.js',
		'jsx-runtime.js',
		'html.js',
		'tokens.css',
		'ui.css'
	]) {
		copyFileSync(join(dist, f), join(vendor, f));
	}
	// Peer for strike-fw-ui (import map -> ./vendor/css.js).
	copyFileSync(join(strikeRoot, 'css.js'), join(vendor, 'css.js'));
	let tx = readFileSync(join(strikeRoot, 'transition.js'), 'utf8');
	tx = tx.replace("from './hooks.js'", "from './strike.core+hooks.js'");
	writeFileSync(join(vendor, 'transition.js'), tx);
}

function vendorPlugin() {
	return {
		name: 'external-vendor',
		setup(build) {
			build.onResolve({ filter: /^strike\/jsx-(?:dev-)?runtime$/ }, () => ({
				path: './vendor/jsx-runtime.js',
				external: true
			}));
			build.onResolve({ filter: /[/\\]vendor[/\\]/ }, args => {
				const name = args.path.split(/[/\\]vendor[/\\]/).pop();
				return { path: './vendor/' + name, external: true };
			});

			// Leave pack imports external; rewritten to sibling paths after bundle.
			build.onResolve({ filter: /^strike-fw-ui(?:\/|$)/ }, args => ({
				path: args.path,
				external: true
			}));
			build.onResolve({ filter: /^strike-fw-datagrid(?:\/|$)/ }, args => ({
				path: args.path,
				external: true
			}));
			build.onResolve({ filter: /^strike-fw-router(?:\/|$)/ }, args => ({
				path: args.path,
				external: true
			}));
			build.onResolve({ filter: /^strike-fw-store(?:\/|$)/ }, args => ({
				path: args.path,
				external: true
			}));
		}
	};
}

async function bundleApp(esbuildPath) {
	const esbuild = await import(pathToFileURL(esbuildPath).href);
	const outfile = join(root, 'app.js');
	await esbuild.build({
		entryPoints: [join(root, 'src/app/main.jsx')],
		outfile,
		bundle: true,
		format: 'esm',
		jsx: 'automatic',
		jsxImportSource: 'strike',
		loader: { '.jsx': 'jsx', '.js': 'js' },
		target: ['es2020'],
		plugins: [vendorPlugin()]
	});
	let code = readFileSync(outfile, 'utf8');
	code = code.replace(
		/from\s*["']strike\/jsx-(?:dev-)?runtime["']/g,
		'from "./vendor/jsx-runtime.js"'
	);
	code = rewriteStrikeFwUiImports(code);
	code = rewriteStrikeFwDatagridImports(code);
	code = rewriteStrikeFwRouterImports(code);
	code = rewriteStrikeFwStoreImports(code);
	if (!code.includes(STRIKE_FW_UI_BASE)) {
		console.warn(
			'demo: warning - no strike-fw-ui sibling imports in app.js (lab unused?)'
		);
	}
	if (!code.includes(STRIKE_FW_DATAGRID_BASE)) {
		console.warn(
			'demo: warning - no strike-fw-datagrid sibling imports in app.js'
		);
	}
	if (!code.includes(STRIKE_FW_ROUTER_BASE)) {
		console.warn(
			'demo: warning - no strike-fw-router sibling imports in app.js'
		);
	}
	if (!code.includes(STRIKE_FW_STORE_BASE)) {
		console.warn(
			'demo: warning - no strike-fw-store sibling imports in app.js'
		);
	}
	writeFileSync(outfile, code);
}

if (useLocalStrike) {
	if (!existsSync(join(siblingStrike, 'package.json'))) {
		console.error('demo: STRIKE_LOCAL=1 but missing', siblingStrike);
		process.exit(1);
	}
	console.log('demo: using local Strike at', siblingStrike);
	run('npm', ['install'], { cwd: siblingStrike });
	run(process.execPath, ['build.mjs'], { cwd: siblingStrike });
	copyDist(join(siblingStrike, 'dist'), siblingStrike);
	const cleanup = syncPacks();
	try {
		await bundleApp(join(siblingStrike, 'node_modules/esbuild/lib/main.js'));
	} finally {
		cleanup();
	}
	console.log(
		'demo: vendor synced from local sibling; ui ->',
		useLocalUi ? 'sibling' : STRIKE_UI_NPM,
		'; datagrid ->',
		useLocalDg ? 'sibling' : STRIKE_DG_NPM,
		'; router ->',
		useLocalRouter ? 'sibling' : STRIKE_ROUTER_NPM,
		'; store ->',
		useLocalStore ? 'sibling' : STRIKE_STORE_NPM
	);
} else if (STRIKE_REF) {
	const work = mkdtempSync(join(tmpdir(), 'harbor-strike-'));
	let cleanup = () => {};
	try {
		console.log('demo: cloning', STRIKE_REPO, STRIKE_REF);
		run('git', [
			'clone',
			'--depth',
			'1',
			'--branch',
			STRIKE_REF,
			STRIKE_REPO,
			work
		]);

		console.log('demo: npm install in', work);
		run('npm', ['install'], { cwd: work });

		console.log('demo: building Strike dist');
		run(process.execPath, ['build.mjs'], { cwd: work });

		copyDist(join(work, 'dist'), work);
		cleanup = syncPacks();
		await bundleApp(join(work, 'node_modules/esbuild/lib/main.js'));
		console.log(
			'demo: vendor synced from GitHub; ui ->',
			useLocalUi ? 'sibling' : STRIKE_UI_NPM,
			'; datagrid ->',
			useLocalDg ? 'sibling' : STRIKE_DG_NPM,
			'; router ->',
			useLocalRouter ? 'sibling' : STRIKE_ROUTER_NPM,
			'; store ->',
			useLocalStore ? 'sibling' : STRIKE_STORE_NPM
		);
	} finally {
		cleanup();
		rmSync(work, { recursive: true, force: true });
	}
} else {
	const work = mkdtempSync(join(tmpdir(), 'harbor-strike-'));
	let cleanup = () => {};
	try {
		const pkgs = [STRIKE_NPM, 'esbuild@^0.25.0'];
		if (!useLocalUi) pkgs.push(STRIKE_UI_NPM);
		if (!useLocalDg) pkgs.push(STRIKE_DG_NPM);
		if (!useLocalRouter) pkgs.push(STRIKE_ROUTER_NPM);
		if (!useLocalStore) pkgs.push(STRIKE_STORE_NPM);
		console.log('demo: npm install', pkgs.join(', '));
		writeFileSync(
			join(work, 'package.json'),
			JSON.stringify({ private: true, type: 'module' })
		);
		run('npm', ['install', ...pkgs], { cwd: work });
		const strikeRoot = join(work, 'node_modules', 'strike-fw');
		if (!existsSync(join(strikeRoot, 'package.json'))) {
			console.error('demo: strike-fw missing after npm install');
			process.exit(1);
		}
		copyDist(join(strikeRoot, 'dist'), strikeRoot);
		cleanup = syncPacks(
			useLocalUi ? null : join(work, 'node_modules', 'strike-fw-ui'),
			useLocalDg ? null : join(work, 'node_modules', 'strike-fw-datagrid'),
			useLocalRouter
				? null
				: join(work, 'node_modules', 'strike-fw-router'),
			useLocalStore
				? null
				: join(work, 'node_modules', 'strike-fw-store')
		);
		await bundleApp(join(work, 'node_modules/esbuild/lib/main.js'));
		console.log(
			'demo: vendor synced from',
			STRIKE_NPM,
			'; ui ->',
			useLocalUi ? 'sibling' : STRIKE_UI_NPM,
			'; datagrid ->',
			useLocalDg ? 'sibling' : STRIKE_DG_NPM,
			'; router ->',
			useLocalRouter ? 'sibling' : STRIKE_ROUTER_NPM,
			'; store ->',
			useLocalStore ? 'sibling' : STRIKE_STORE_NPM
		);
	} finally {
		cleanup();
		rmSync(work, { recursive: true, force: true });
	}
}
