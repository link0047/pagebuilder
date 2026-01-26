<script lang="ts">
	import Badge from "./Badge.svelte";
	import CarouselItem from "./CarouselItem.svelte";
	import ProductCard from "./ProductCard.svelte";

	let {
		product
	} = $props();
</script>

{#snippet badgeSnippet()}
	<Badge shape="pill">{product.badge}</Badge>
{/snippet}
<CarouselItem>
	<ProductCard
		href="#<product-url"
		src={product.src}
		name={product.name}
		price={product.price}
		badge={product.badge ? badgeSnippet : undefined}
	/>
</CarouselItem>
