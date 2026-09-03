import { h } from 'strike-fw';
import { css } from 'strike-fw/css';
import { Btn, Stack, Text } from 'strike-fw/ui';
import { cls } from '../cls.js';
import { Icon } from '../display/icon.js';

css`
.strike-stepper { display: flex; gap: 1rem; }
.strike-stepper--vertical { flex-direction: column; }
.strike-stepper--horizontal { flex-direction: row; align-items: flex-start; }
.strike-stepper__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  gap: 0.75rem;
}
.strike-stepper--vertical .strike-stepper__list { flex-direction: column; }
.strike-stepper--horizontal .strike-stepper__list { flex-direction: row; flex-wrap: wrap; }
.strike-stepper__step {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--strike-muted, #5c5c5c);
}
.strike-stepper__step[aria-current="step"] {
  color: var(--strike-accent, #0b6e4f);
  font-weight: 600;
}
.strike-stepper__step--done { color: var(--strike-ok, #2d6a4f); }
.strike-stepper__dot {
  width: 0.55rem;
  height: 0.55rem;
  border-radius: 50%;
  background: var(--strike-line, #d4d4d4);
}
.strike-stepper__dot--active { background: var(--strike-accent, #0b6e4f); }
.strike-stepper__mobile {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  align-items: stretch;
}
.strike-stepper__dots {
  display: flex;
  gap: 0.35rem;
  justify-content: center;
}
`;

export function Stepper({
	steps = [],
	activeStep = 0,
	orientation = 'horizontal',
	variant = 'default',
	onNext,
	onBack,
	class: className,
	children,
	...rest
}) {
	if (variant === 'mobile') {
		return h(
			'nav',
			{
				...rest,
				'aria-label': 'Progress',
				class: cls('strike-stepper__mobile', className)
			},
			h(
				'div',
				{ class: 'strike-stepper__dots' },
				steps.map((_, i) =>
					h('span', {
						key: i,
						class: cls(
							'strike-stepper__dot',
							i === activeStep && 'strike-stepper__dot--active'
						),
						'aria-current': i === activeStep ? 'step' : undefined
					})
				)
			),
			h(Text, { as: 'p' }, steps[activeStep] && steps[activeStep].label),
			h(
				Stack,
				{ row: true, gap: 8 },
				h(
					Btn,
					{
						variant: 'ghost',
						type: 'button',
						disabled: activeStep <= 0,
						onClick: onBack
					},
					'Back'
				),
				h(
					Btn,
					{
						variant: 'primary',
						type: 'button',
						disabled: activeStep >= steps.length - 1,
						onClick: onNext
					},
					'Next'
				)
			)
		);
	}

	return h(
		'nav',
		{
			...rest,
			'aria-label': 'Progress',
			class: cls(
				'strike-stepper',
				'strike-stepper--' + orientation,
				className
			)
		},
		h(
			'ol',
			{ class: 'strike-stepper__list' },
			steps.map((step, i) => {
				const done = i < activeStep;
				const current = i === activeStep;
				return h(
					'li',
					{
						key: i,
						class: cls(
							'strike-stepper__step',
							done && 'strike-stepper__step--done'
						),
						'aria-current': current ? 'step' : undefined
					},
					done
						? h(
								Icon,
								{ size: 'sm' },
								h(
									'svg',
									{ viewBox: '0 0 24 24', 'aria-hidden': 'true' },
									h('path', {
										d: 'M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z'
									})
								)
							)
						: h('span', { class: 'strike-stepper__dot' }),
					h('span', null, step.label),
					step.optional && h(Text, { tone: 'muted', as: 'span' }, ' (optional)')
				);
			})
		),
		children
	);
}
