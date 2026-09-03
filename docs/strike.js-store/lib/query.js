import { atom } from './atom.js';

function getAC() {
	if (typeof globalThis !== 'undefined' && globalThis.AbortController) {
		return globalThis.AbortController;
	}
	throw new Error('strike-fw-store/query: AbortController required (Node >=18)');
}

function emptyGroup() {
	return {
		pending: 0,
		progress: null,
		status: 'idle',
		error: null,
		_ratios: Object.create(null),
		_controllers: Object.create(null),
		_sawNonAbort: false
	};
}

/** Create a query client for grouped Promise work. */
export function createQueryClient() {
	const groups = Object.create(null);
	const tick = atom(0);

	function bump() {
		tick.set(function (n) {
			return n + 1;
		});
	}

	function getGroup(name) {
		if (!groups[name]) groups[name] = emptyGroup();
		return groups[name];
	}

	function snapshot(name) {
		const g = getGroup(name);
		return {
			pending: g.pending,
			progress: g.progress,
			status: g.status,
			error: g.error
		};
	}

	function recomputeProgress(g) {
		const keys = Object.keys(g._ratios);
		if (!keys.length) {
			g.progress = null;
			return;
		}
		let sum = 0;
		for (let i = 0; i < keys.length; i++) {
			const r = g._ratios[keys[i]];
			if (r == null) {
				g.progress = null;
				return;
			}
			sum += r;
		}
		g.progress = sum / keys.length;
	}

	function finishPending(g, outcome) {
		g.pending = Math.max(0, g.pending - 1);
		if (outcome === 'success' || outcome === 'error') {
			g._sawNonAbort = true;
		}
		if (g.pending === 0) {
			g.progress = null;
			g._ratios = Object.create(null);
			if (outcome === 'success') {
				g.status = 'success';
				g.error = null;
			} else if (outcome === 'error') {
				g.status = 'error';
			} else if (!g._sawNonAbort) {
				g.status = 'idle';
			}
			g._sawNonAbort = false;
		} else {
			recomputeProgress(g);
		}
		bump();
	}

	function run(groupName, task, opts) {
		opts = opts || {};
		const g = getGroup(groupName);
		const key =
			opts.key != null ? String(opts.key) : '\0' + String(Math.random());

		if (g._controllers[key]) {
			try {
				g._controllers[key].abort();
			} catch (e) {}
			const oldGen = g._gen && g._gen[key];
			if (oldGen != null) g._dead[oldGen] = true;
			delete g._controllers[key];
			delete g._ratios[key];
			if (g.pending > 0) g.pending -= 1;
		}

		const AC = getAC();
		const controller = new AC();
		const gen = (g._seq = (g._seq || 0) + 1);
		if (!g._gen) g._gen = Object.create(null);
		if (!g._dead) g._dead = Object.create(null);
		g._gen[key] = gen;
		if (opts.signal) {
			if (opts.signal.aborted) controller.abort();
			else {
				opts.signal.addEventListener('abort', function () {
					controller.abort();
				});
			}
		}

		g._controllers[key] = controller;
		g.pending += 1;
		g.status = 'pending';
		g._ratios[key] = null;
		recomputeProgress(g);
		bump();

		const ctx = {
			signal: controller.signal,
			reportProgress: function (ratio) {
				g._ratios[key] = Math.max(0, Math.min(1, Number(ratio) || 0));
				recomputeProgress(g);
				bump();
			}
		};

		let settled = false;
		function settleAbort() {
			if (settled || g._dead[gen]) return;
			settled = true;
			delete g._controllers[key];
			delete g._ratios[key];
			finishPending(g, 'abort');
		}

		return new Promise(function (resolve, reject) {
			function onAbort() {
				if (settled || g._dead[gen]) return;
				const err = new Error('Aborted');
				err.name = 'AbortError';
				settleAbort();
				reject(err);
			}
			if (controller.signal.aborted) {
				onAbort();
				return;
			}
			controller.signal.addEventListener('abort', onAbort);

			var taskPromise;
			try {
				taskPromise = Promise.resolve(task(ctx));
			} catch (err) {
				taskPromise = Promise.reject(err);
			}

			taskPromise
				.then(function (raw) {
					if (settled || g._dead[gen]) return;
					if (controller.signal.aborted) {
						onAbort();
						return;
					}
					let data = raw;
					if (opts.parse) data = opts.parse(data);
					if (opts.map) data = opts.map(data);
					if (opts.onSuccess) {
						opts.onSuccess(data, { key: opts.key, group: groupName });
					}
					settled = true;
					delete g._controllers[key];
					delete g._ratios[key];
					finishPending(g, 'success');
					resolve(data);
				})
				.catch(function (err) {
					if (settled || g._dead[gen]) {
						reject(err);
						return;
					}
					settled = true;
					delete g._controllers[key];
					delete g._ratios[key];
					const aborted =
						controller.signal.aborted ||
						(err && (err.name === 'AbortError' || err.code === 20));
					if (aborted) {
						finishPending(g, 'abort');
					} else {
						g.error = err;
						if (opts.onError) {
							opts.onError(err, { key: opts.key, group: groupName });
						}
						finishPending(g, 'error');
					}
					reject(err);
				});
		});
	}

	function cancel(groupName, key) {
		const g = getGroup(groupName);
		if (key != null) {
			const k = String(key);
			if (g._controllers[k]) g._controllers[k].abort();
			return;
		}
		const keys = Object.keys(g._controllers);
		for (let i = 0; i < keys.length; i++) {
			g._controllers[keys[i]].abort();
		}
	}

	function runAll(groupName, tasks, opts) {
		opts = opts || {};
		const list = tasks.map(function (t, i) {
			if (typeof t === 'function') {
				return run(groupName, t, { key: 'all-' + i });
			}
			return run(
				groupName,
				t.task,
				Object.assign({}, t, { key: t.key != null ? t.key : 'all-' + i })
			);
		});
		if (opts.settled) return Promise.allSettled(list);
		return Promise.all(list);
	}

	return {
		run: run,
		runAll: runAll,
		cancel: cancel,
		getGroup: snapshot,
		_tick: tick
	};
}
