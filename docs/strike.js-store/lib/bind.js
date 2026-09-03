import { useStoreValue, useStoreSet } from './hooks.js';

/**
 * Non-hook bridge. Returns get/set/onChange -- never a stale value for JSX.
 * @param {{ get(): any, set: Function }} store
 */
export function bindStore(store) {
	return {
		get: function () {
			return store.get();
		},
		set: function (next, opts) {
			store.set(next, opts);
		},
		onChange: function (next) {
			store.set(next);
		}
	};
}

/**
 * Reactive controllable props for Strike UI.
 * @param {{ get(): any, set: Function, subscribe: Function }} store
 * @param {{ toControl?: Function, fromControl?: Function }} [opts]
 */
export function useBindStore(store, opts) {
	const toControl = (opts && opts.toControl) || function (v) {
		return v;
	};
	const fromControl = (opts && opts.fromControl) || function (v) {
		return v;
	};
	const raw = useStoreValue(store);
	const set = useStoreSet(store);
	return {
		value: toControl(raw),
		onChange: function (next) {
			set(fromControl(next));
		}
	};
}
