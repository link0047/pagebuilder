<script lang="ts">
	import Badge from "./Badge.svelte";
	import ProductCard from "./ProductCard.svelte";

	type Product = {
		href: string;
		src: { desktop: string; mobile: string };
		name: string;
		price: { original: number; sale: number | null };
		badge?: string;
	};

	type Props = {
		product?: Product;
		[key: string]: unknown;
	};

	let { product }: Props = $props();
</script>

{#if product}
	{@const { href, src, name, price, badge } = product}
	{#snippet badgeSnippet()}
		<Badge shape="pill">{badge}</Badge>
	{/snippet}

	<wcag-ui-carousel-item>
		<ProductCard
			href={href}
			src={src}
			name={name}
			price={price}
			badge={badge ? badgeSnippet : undefined}
		/>
	</wcag-ui-carousel-item>
{/if}
