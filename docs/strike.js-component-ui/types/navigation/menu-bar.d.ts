export declare function MenuBar(props: {
	items?: {
		id: string;
		label: unknown;
		children?: { label: unknown; onSelect?: (e: Event) => void; disabled?: boolean }[];
	}[];
	class?: string;
	[key: string]: unknown;
}): unknown;
