let batchDepth = 0;
const pending = new Set();
const computing = new Set();

function flushPending() {
	const list = Array.from(pending);
	pending.clear();
	for (let i = 0; i < list.length; i++) {
		list[i].__flush();
	}
}

export function batch(fn) {
	batchDepth++;
	try {
		fn();
	} finally {
		batchDepth--;
		if (batchDepth === 0) flushPending();
	}
}

function notifyOrQueue(store) {
	if (batchDepth > 0) {
		pending.add(store);
		return;
	}
	store.__flush();
}

export function atom(initial, opts) {
	let value = initial;
	const listeners = new Set();
	const store = {
		key: opts && opts.key,
		get: function () {
			return value;
		},
		set: function (next, setOpts) {
			const resolved =
				typeof next === 'function' ? next(value) : next;
			const force = setOpts && setOpts.force;
			if (!force && Object.is(value, resolved)) return;
			const prev = value;
			value = resolved;
			store.__prev = prev;
			notifyOrQueue(store);
		},
		subscribe: function (listener) {
			listeners.add(listener);
			return function unsubscribe() {
				listeners.delete(listener);
			};
		},
		__flush: function () {
			const prev = store.__prev;
			store.__prev = undefined;
			const snap = value;
			listeners.forEach(function (fn) {
				batchDepth++;
				try {
					fn(snap, prev);
				} finally {
					batchDepth--;
				}
			});
			if (batchDepth === 0 && pending.size) flushPending();
		}
	};
	return store;
}

export function computed(sources, fn) {
	let value;
	let ready = false;
	const listeners = new Set();

	function recompute() {
		if (computing.has(store)) {
			throw new Error('computed: cycle detected');
		}
		computing.add(store);
		try {
			const args = sources.map(function (s) {
				return s.get();
			});
			const next = fn.apply(null, args);
			if (!ready || !Object.is(value, next)) {
				const prev = value;
				value = next;
				ready = true;
				store.__prev = prev;
				if (ready) notifyOrQueue(store);
			}
		} finally {
			computing.delete(store);
		}
	}

	const store = {
		key: undefined,
		get: function () {
			if (computing.has(store)) {
				throw new Error('computed: cycle detected');
			}
			if (!ready) recompute();
			return value;
		},
		subscribe: function (listener) {
			listeners.add(listener);
			if (!ready) recompute();
			return function unsubscribe() {
				listeners.delete(listener);
			};
		},
		__flush: function () {
			const prev = store.__prev;
			store.__prev = undefined;
			const snap = value;
			listeners.forEach(function (fn) {
				batchDepth++;
				try {
					fn(snap, prev);
				} finally {
					batchDepth--;
				}
			});
			if (batchDepth === 0 && pending.size) flushPending();
		}
	};

	for (let i = 0; i < sources.length; i++) {
		sources[i].subscribe(function () {
			recompute();
		});
	}
	recompute();
	return store;
}

export function map(initial) {
	const store = atom(Object.assign({}, initial));
	return {
		key: store.key,
		get: function () {
			return store.get();
		},
		set: function (next, opts) {
			store.set(next, opts);
		},
		subscribe: function (fn) {
			return store.subscribe(fn);
		},
		setKey: function (key, val) {
			store.set(function (s) {
				const next = Object.assign({}, s);
				next[key] = val;
				return next;
			});
		},
		assign: function (partial) {
			store.set(function (s) {
				return Object.assign({}, s, partial);
			});
		}
	};
}
