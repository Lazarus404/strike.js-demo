import { useState } from 'strike-fw/hooks';

/** Controlled or uncontrolled value with onChange. */
export function useControllable(controlled, defaultValue, onChange) {
	const isControlled = controlled !== undefined;
	const [inner, setInner] = useState(
		isControlled ? controlled : defaultValue
	);
	const value = isControlled ? controlled : inner;
	function setValue(next) {
		const resolved = typeof next === 'function' ? next(value) : next;
		if (!isControlled) setInner(resolved);
		if (onChange) onChange(resolved);
	}
	return [value, setValue];
}
