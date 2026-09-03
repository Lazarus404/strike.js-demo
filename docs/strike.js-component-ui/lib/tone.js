export function toneClass(prefix, tone) {
	if (!tone || tone === 'default') return null;
	return prefix + '--' + tone;
}
