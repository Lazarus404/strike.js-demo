export function windowRange(
	scrollTop,
	viewportHeight,
	rowCount,
	rowHeight,
	overscan = 3
) {
	if (rowCount <= 0 || rowHeight <= 0) {
		return { start: 0, end: 0, offsetTop: 0, totalHeight: 0 };
	}
	const totalHeight = rowCount * rowHeight;
	const visibleStart = Math.floor(Math.max(0, scrollTop) / rowHeight);
	const visibleCount = Math.ceil(Math.max(0, viewportHeight) / rowHeight);
	const start = Math.max(0, visibleStart - overscan);
	const end = Math.min(rowCount, visibleStart + visibleCount + overscan);
	return { start, end, offsetTop: start * rowHeight, totalHeight };
}
