import { useState } from '../../vendor/strike.core+hooks.js';

/** Hydrated island counter - initial markup comes from Lab host. */
export function IslandCounter({ n: initial = 0 }) {
	const [n, setN] = useState(Number(initial) || 0);
	return (
		<button type="button" class="lab-island__btn" onClick={() => setN(n + 1)}>
			{String(n)}
		</button>
	);
}
