export const PRODUCTS = [
	{
		id: 'board',
		name: 'End-grain cutting board',
		price: 68,
		tag: 'Kitchen',
		blurb: 'Walnut and maple, oiled and ready for daily prep.',
		care: 'Hand wash, dry upright, oil monthly with food-safe mineral oil.',
		tone: '#3d2b1f'
	},
	{
		id: 'skillet',
		name: '10-inch cast iron',
		price: 42,
		tag: 'Cookware',
		blurb: 'Pre-seasoned skillet that holds heat for sears and bakes.',
		care: 'Wipe clean while warm. Avoid soap when possible; re-season if dull.',
		tone: '#2a2a2a'
	},
	{
		id: 'apron',
		name: 'Cross-back linen apron',
		price: 54,
		tag: 'Apparel',
		blurb: 'Stonewashed linen with deep pockets and brass hardware.',
		care: 'Cold wash, hang dry. Expect soft wrinkles - that is the linen.',
		tone: '#6b705c'
	},
	{
		id: 'bowls',
		name: 'Ceramic bowl set',
		price: 36,
		tag: 'Table',
		blurb: 'Four nesting bowls with a speckled ash glaze.',
		care: 'Dishwasher safe. Avoid thermal shock from freezer to oven.',
		tone: '#8a8175'
	},
	{
		id: 'mill',
		name: 'Hand coffee mill',
		price: 79,
		tag: 'Brew',
		blurb: 'Steel burrs, adjustable grind, beech wood body.',
		care: 'Brush burrs monthly. Wipe wood with a barely damp cloth.',
		tone: '#5c4033'
	},
	{
		id: 'towel',
		name: 'Heavyweight tea towels',
		price: 24,
		tag: 'Kitchen',
		blurb: 'Pair of hemmed cotton towels that soften with every wash.',
		care: 'Machine wash warm. Tumble low or line dry.',
		tone: '#c2b8a3'
	}
];

export function money(n) {
	return '$' + Number(n).toFixed(2);
}

export function go(hash) {
	location.hash = hash;
}
