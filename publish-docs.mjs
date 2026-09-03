/**
 * Build the demo and copy a GitHub Pages snapshot into docs/.
 * Usage: node publish-docs.mjs
 */
import {
	cpSync,
	existsSync,
	mkdirSync,
	rmSync,
	writeFileSync
} from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = dirname(fileURLToPath(import.meta.url));
const docs = join(root, 'docs');

function run(cmd, args) {
	const r = spawnSync(cmd, args, { cwd: root, stdio: 'inherit' });
	if (r.status) process.exit(r.status || 1);
}

function packFilter(from) {
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

function mustExist(rel) {
	const p = join(root, rel);
	if (!existsSync(p)) {
		console.error('publish-docs: missing', rel, '- run failed?');
		process.exit(1);
	}
	return p;
}

console.log('publish-docs: building...');
run(process.execPath, ['build.mjs']);

const required = [
	'index.html',
	'app.js',
	'vendor',
	'strike.js-component-ui',
	'strike.js-datagrid',
	'strike.js-router',
	'strike.js-store',
	'src/styles/shop.css'
];
for (const rel of required) mustExist(rel);

if (existsSync(docs)) rmSync(docs, { recursive: true, force: true });
mkdirSync(docs, { recursive: true });

cpSync(join(root, 'index.html'), join(docs, 'index.html'));
cpSync(join(root, 'app.js'), join(docs, 'app.js'));
cpSync(join(root, 'vendor'), join(docs, 'vendor'), { recursive: true });
for (const pack of [
	'strike.js-component-ui',
	'strike.js-datagrid',
	'strike.js-router',
	'strike.js-store'
]) {
	const from = join(root, pack);
	cpSync(from, join(docs, pack), {
		recursive: true,
		dereference: true,
		filter: packFilter(from)
	});
}
mkdirSync(join(docs, 'src', 'styles'), { recursive: true });
cpSync(
	join(root, 'src/styles/shop.css'),
	join(docs, 'src/styles/shop.css')
);

writeFileSync(
	join(docs, '.nojekyll'),
	'',
	'utf8'
);

console.log('publish-docs: wrote', docs);
