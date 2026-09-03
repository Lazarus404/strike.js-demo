export declare function pageItems(
	page: number,
	count: number,
	siblingCount?: number
): (number | 'ellipsis')[];

export declare function Pagination(props: {
	page?: number;
	count?: number;
	onChange?: (page: number) => void;
	siblingCount?: number;
	showFirstLast?: boolean;
	class?: string;
	[key: string]: unknown;
}): unknown;
