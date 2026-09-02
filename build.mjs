import {
	mkdirSync,
	copyFileSync,
	readFileSync,
	writeFileSync,
	mkdtempSync,
	rmSync
} from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';

const STRIKE_REPO = 'https://github.com/Lazarus404/strike.js.git';
const STRIKE_REF = process.env.STRIKE_REF || '';

const root = dirname(fileURLToPath(import.meta.url));
const vendor = join(root, 'vendor');
const work = mkdtempSync(join(tmpdir(), 'harbor-strike-'));

function run(cmd, args, opts = {}) {
	const r = spawnSync(cmd, args, { stdio: 'inherit', ...opts });
	if (r.status) {
		rmSync(work, { recursive: true, force: true });
		process.exit(r.status || 1);
	}
	return r;
}

try {
	console.log('demo: cloning', STRIKE_REPO, STRIKE_REF || '(default branch)');
	const cloneArgs = ['clone', '--depth', '1'];
	if (STRIKE_REF) cloneArgs.push('--branch', STRIKE_REF);
	cloneArgs.push(STRIKE_REPO, work);
	run('git', cloneArgs);

	console.log('demo: npm install in', work);
	run('npm', ['install'], { cwd: work });

	console.log('demo: building Strike dist');
	run(process.execPath, ['build.mjs'], { cwd: work });

	mkdirSync(vendor, { recursive: true });
	const dist = join(work, 'dist');
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

	const esbuild = await import(
		pathToFileURL(join(work, 'node_modules/esbuild/lib/main.js')).href
	);

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
		plugins: [
			{
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
				}
			}
		]
	});

	writeFileSync(
		outfile,
		readFileSync(outfile, 'utf8').replace(
			/from\s*["']strike\/jsx-(?:dev-)?runtime["']/g,
			'from "./vendor/jsx-runtime.js"'
		)
	);

	console.log('demo: vendor synced from GitHub, wrote app.js');
} finally {
	rmSync(work, { recursive: true, force: true });
}
