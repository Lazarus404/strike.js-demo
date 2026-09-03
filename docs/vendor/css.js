const seen = new WeakMap();
const byString = new Map();

/**
 * Inject a CSS template once into document.head.
 * Dedupes by template strings identity (WeakMap) and by joined text.
 */
export function css(strings, ...values) {
	let text;
	if (typeof strings === 'string') {
		text = strings;
	} else {
		text = strings[0] || '';
		for (let i = 0; i < values.length; i++) {
			text += values[i] + (strings[i + 1] || '');
		}
		if (seen.has(strings)) return seen.get(strings);
	}

	if (byString.has(text)) {
		const el = byString.get(text);
		if (typeof strings !== 'string') seen.set(strings, el);
		return el;
	}

	const style = document.createElement('style');
	style.setAttribute('data-strike', '');
	style.textContent = text;
	document.head.appendChild(style);
	byString.set(text, style);
	if (typeof strings !== 'string') seen.set(strings, style);
	return style;
}
