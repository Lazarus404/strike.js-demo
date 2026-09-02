import { useState, useMemo } from '../../vendor/strike.core+hooks.js';
import { Btn, Stack } from '../../vendor/strike-ui.js';
import { PRODUCTS, money } from '../data/products.js';

function ProductCard({ product }) {
	return (
		<article class="card">
			<a
				href={'#/product/' + product.id}
				class="card-media"
				style={{ background: product.tone }}
			>
				<span class="card-tag">{product.tag}</span>
			</a>
			<div class="card-body">
				<a href={'#/product/' + product.id} class="card-title">
					{product.name}
				</a>
				<p class="card-price">{money(product.price)}</p>
			</div>
		</article>
	);
}

export function ShopHome() {
	const [tag, setTag] = useState('all');
	const tags = useMemo(() => {
		const set = { all: 1 };
		for (let i = 0; i < PRODUCTS.length; i++) set[PRODUCTS[i].tag] = 1;
		return Object.keys(set);
	}, []);
	const list =
		tag === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.tag === tag);

	return (
		<div class="shop-home">
			<section class="shop-hero">
				<p class="shop-hero__eyebrow">Coastal kitchen supply</p>
				<h1 class="shop-hero__brand">Harbor Goods</h1>
				<p class="shop-hero__lede">
					Quiet tools for daily cooking - boards, iron, linen, and brew.
				</p>
			</section>
			<Stack gap={20}>
				<Stack row gap={8} class="filters">
					{tags.map(t => (
						<Btn
							key={t}
							variant={tag === t ? 'primary' : 'ghost'}
							onClick={() => setTag(t)}
						>
							{t}
						</Btn>
					))}
				</Stack>
				<div class="grid">
					{list.map(p => (
						<ProductCard key={p.id} product={p} />
					))}
				</div>
			</Stack>
		</div>
	);
}
