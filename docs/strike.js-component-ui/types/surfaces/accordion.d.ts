export declare function Accordion(props: {
	type?: 'single' | 'multiple';
	value?: string | string[] | null;
	defaultValue?: string | string[] | null;
	onChange?: (value: string | string[] | null) => void;
	class?: string;
	children?: unknown;
	[key: string]: unknown;
}): unknown;

export declare function AccordionItem(props: {
	id: string;
	title?: unknown;
	disabled?: boolean;
	class?: string;
	children?: unknown;
	[key: string]: unknown;
}): unknown;
