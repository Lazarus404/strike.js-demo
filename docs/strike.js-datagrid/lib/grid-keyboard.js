function clamp(n, min, max) {
	return Math.max(min, Math.min(n, max));
}

export function moveFocus(pos, key, rowCount, colCount) {
	const maxRow = Math.max(0, rowCount - 1);
	const maxCol = Math.max(0, colCount - 1);
	let row = pos.row;
	let col = pos.col;
	switch (key) {
		case 'ArrowUp':
			row -= 1;
			break;
		case 'ArrowDown':
			row += 1;
			break;
		case 'ArrowLeft':
			col -= 1;
			break;
		case 'ArrowRight':
			col += 1;
			break;
		case 'Home':
			col = 0;
			break;
		case 'End':
			col = maxCol;
			break;
		default:
			break;
	}
	return { row: clamp(row, 0, maxRow), col: clamp(col, 0, maxCol) };
}
