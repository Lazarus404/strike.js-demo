import { strict as assert } from 'node:assert';
import { pathToFileURL } from 'node:url';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFileSync, readdirSync } from 'node:fs';
import { installDom } from '../strike/test/dom.js';

const root = dirname(fileURLToPath(import.meta.url));

function walk(dir, out = []) {
	for (const name of readdirSync(dir, { withFileTypes: true })) {
		const p = join(dir, name.name);
		if (name.isDirectory()) walk(p, out);
		else if (/\.(jsx?|mjs)$/.test(name.name)) out.push(p);
	}
	return out;
}

for (const file of walk(join(root, 'src'))) {
	const src = readFileSync(file, 'utf8');
	assert.equal(
		/from ['"]\.\.\/(?:\.\.\/)*strike\//.test(src),
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
		assert.match(
			spec,
			/\/vendor\//,
			file + ' external import must be vendor: ' + spec
		);
	}
}

const { window, location } = installDom(
	'<html><head></head><body><div id="app"></div></body></html>',
	'#/'
);
await import(pathToFileURL(join(root, 'app.js')).href + '?t=' + Date.now());
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
assert.match(app.textContent, /html tagged/);
assert.ok(document.getElementById('lab-hydrate'));

console.log('ok demo shop flow (vendor dist only)');
