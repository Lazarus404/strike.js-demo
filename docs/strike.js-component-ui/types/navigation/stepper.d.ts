export declare function Stepper(props: {
	steps?: { label: unknown; optional?: boolean }[];
	activeStep?: number;
	orientation?: 'vertical' | 'horizontal';
	variant?: 'default' | 'mobile';
	onNext?: () => void;
	onBack?: () => void;
	class?: string;
	children?: unknown;
	[key: string]: unknown;
}): unknown;
