import {
	useState,
	useLayoutEffect,
	useCallback,
	useRef
} from 'strike-fw/hooks';

function identity(v) {
	return v;
}

/**
 * Subscribe to a store (or computed) and return a selected slice.
 * @template T, S
 * @param {{ get(): T, subscribe(fn: Function): Function }} store
 * @param {(v: T) => S} [selector]
 * @param {{ eq?: (a: S, b: S) => boolean }} [opts]
 * @returns {S}
 */
export function useStoreValue(store, selector, opts) {
	const sel = selector || identity;
	const eq = (opts && opts.eq) || Object.is;
	const selRef = useRef(sel);
	const eqRef = useRef(eq);
	selRef.current = sel;
	eqRef.current = eq;

	const [value, setValue] = useState(function () {
		return sel(store.get());
	});

	useLayoutEffect(
		function () {
			setValue(function (prev) {
				const next = selRef.current(store.get());
				return eqRef.current(prev, next) ? prev : next;
			});
			return store.subscribe(function (next) {
				const selected = selRef.current(next);
				setValue(function (prev) {
					return eqRef.current(prev, selected) ? prev : selected;
				});
			});
		},
		[store]
	);

	return value;
}

/** Stable store.set bound to the store. */
export function useStoreSet(store) {
	return useCallback(
		function (next, setOpts) {
			store.set(next, setOpts);
		},
		[store]
	);
}
