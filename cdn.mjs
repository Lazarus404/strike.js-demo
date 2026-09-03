/**
 * Demo serves packs from paths under the demo root (filled by build.mjs).
 * Defaults: npm strike-fw-ui@0.2.0 and strike-fw-datagrid@0.1.0.
 */
export const STRIKE_FW_UI_VERSION = '0.2.0';
export const STRIKE_FW_UI_CDN =
	'https://cdn.jsdelivr.net/npm/strike-fw-ui@' + STRIKE_FW_UI_VERSION;
export const STRIKE_FW_UI_BASE = './strike.js-component-ui';

export const STRIKE_FW_DATAGRID_VERSION = '0.1.0';
export const STRIKE_FW_DATAGRID_CDN =
	'https://cdn.jsdelivr.net/npm/strike-fw-datagrid@' + STRIKE_FW_DATAGRID_VERSION;
export const STRIKE_FW_DATAGRID_BASE = './strike.js-datagrid';

export const STRIKE_FW_ROUTER_VERSION = '0.1.0';
export const STRIKE_FW_ROUTER_CDN =
	'https://cdn.jsdelivr.net/npm/strike-fw-router@' + STRIKE_FW_ROUTER_VERSION;
export const STRIKE_FW_ROUTER_BASE = './strike.js-router';

export const STRIKE_FW_STORE_VERSION = '0.1.0';
export const STRIKE_FW_STORE_CDN =
	'https://cdn.jsdelivr.net/npm/strike-fw-store@' + STRIKE_FW_STORE_VERSION;
export const STRIKE_FW_STORE_BASE = './strike.js-store';

/** Map bare strike-fw-ui imports for browser ESM. */
export function toStrikeFwUiUrl(spec) {
	if (spec === 'strike-fw-ui') return STRIKE_FW_UI_BASE + '/index.js';
	if (spec.startsWith('strike-fw-ui/')) {
		return STRIKE_FW_UI_BASE + '/' + spec.slice('strike-fw-ui/'.length);
	}
	return spec;
}

export function toStrikeFwDatagridUrl(spec) {
	if (spec === 'strike-fw-datagrid') return STRIKE_FW_DATAGRID_BASE + '/index.js';
	if (spec.startsWith('strike-fw-datagrid/')) {
		return (
			STRIKE_FW_DATAGRID_BASE +
			'/' +
			spec.slice('strike-fw-datagrid/'.length)
		);
	}
	return spec;
}

export function toStrikeFwRouterUrl(spec) {
	if (spec === 'strike-fw-router') return STRIKE_FW_ROUTER_BASE + '/index.js';
	if (spec.startsWith('strike-fw-router/')) {
		return (
			STRIKE_FW_ROUTER_BASE + '/' + spec.slice('strike-fw-router/'.length)
		);
	}
	return spec;
}

export function toStrikeFwStoreUrl(spec) {
	if (spec === 'strike-fw-store') return STRIKE_FW_STORE_BASE + '/index.js';
	if (spec === 'strike-fw-store/query') {
		return STRIKE_FW_STORE_BASE + '/lib/query-entry.js';
	}
	if (spec.startsWith('strike-fw-store/')) {
		return (
			STRIKE_FW_STORE_BASE + '/' + spec.slice('strike-fw-store/'.length)
		);
	}
	return spec;
}

export function rewriteStrikeFwUiImports(code) {
	return code.replace(
		/from\s*["'](strike-fw-ui(?:\/[^"']*)?)["']/g,
		(_, spec) => 'from "' + toStrikeFwUiUrl(spec) + '"'
	);
}

export function rewriteStrikeFwDatagridImports(code) {
	return code.replace(
		/from\s*["'](strike-fw-datagrid(?:\/[^"']*)?)["']/g,
		(_, spec) => 'from "' + toStrikeFwDatagridUrl(spec) + '"'
	);
}

export function rewriteStrikeFwRouterImports(code) {
	return code.replace(
		/from\s*["'](strike-fw-router(?:\/[^"']*)?)["']/g,
		(_, spec) => 'from "' + toStrikeFwRouterUrl(spec) + '"'
	);
}

export function rewriteStrikeFwStoreImports(code) {
	return code.replace(
		/from\s*["'](strike-fw-store(?:\/[^"']*)?)["']/g,
		(_, spec) => 'from "' + toStrikeFwStoreUrl(spec) + '"'
	);
}
