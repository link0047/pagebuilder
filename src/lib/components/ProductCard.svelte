<script lang="ts">
	import { type Snippet } from "svelte";
	import Image from "./Image.svelte";
	import Button from "./Button.svelte";

	type Props = {
		href?: string;
		src?: { desktop: string; mobile: string };
		name: string;
		price: { original: number; sale?: number | null };
		onAddToCart?: () => void | Promise<void>;
		isAddingToCart?: boolean;
		badge?: Snippet;
	}

	let {
		href = "",
		src = { desktop: "", mobile: "" },
		name,
		price,
		onAddToCart = () => {},
		isAddingToCart = false,
		badge
	}: Props = $props();

	let currentPrice = $derived(price.sale ?? price.original);
	let onSale = $derived(price.sale != null);
</script>

<div class="uikit-product-card">
	<a class="uikit-product-card__link" href={href}>
		<div class="uikit-product-card__media-container">
			<picture class="uikit-product-card__media">
				<source media="(max-width: 560px)" srcset={src.mobile}>
				<Image width={300} height={300} src={src.desktop} alt="" />
			</picture>
			{#if badge}
				<div class="uikit-product-card__badge">
					{@render badge()}
				</div>
			{/if}
		</div>
		<div class="uikit-product-card__description">
			<div class="uikit-product-card__price">
				<span class="uikit-product-card__price-current" aria-hidden="true">
					<span class="uikit-product-card__price-symbol">$</span>
					<span class="uikit-product-card__price-dollars">{Math.floor(currentPrice)}</span>
					<span class="uikit-product-card__price-cents">
						{String(Math.round(currentPrice % 1 * 100)).padStart(2, "0")}
					</span>
				</span>
				{#if onSale}
					<s class="uikit-product-card__price-original">
						${price.original}
					</s>
				{/if}
				<span class="sr-only">
					{onSale ? `Sale price $${currentPrice}, was $${price.original}` : `$${currentPrice}`}
				</span>
			</div>
			<span class="uikit-product-card__name">{name}</span>
		</div>
	</a>
	<div class="uikit-product-card__action">
		<Button
		  color="primary"
		  fullWidth
		  shape="pill"
		  onclick={onAddToCart}
		  disabled={isAddingToCart}
		>
		  {isAddingToCart ? "Adding..." : "Add to cart"}
		</Button>
	</div>
</div>

<style>
	.sr-only {
	  position: absolute;
	  width: 1px;
	  height: 1px;
	  padding: 0;
	  margin: -1px;
	  overflow: hidden;
	  clip: rect(0, 0, 0, 0);
	  white-space: nowrap;
	  border-width: 0;
	}

	.uikit-product-card {
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		height: 100%;
		gap: 1rem;
		background-color: #fff;
		padding-block: .5rem;
		padding-inline: .5rem;
		border-radius: .5rem;
		border: 1px solid #eeeeec;
		transition: border-color .15s ease;
	}

	.uikit-product-card:hover {
		border-color: #e1e1e1;
	}

	.uikit-product-card__link {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		outline-offset: 6px;
		outline: 2px dashed transparent;
		border-radius: .25rem;
	}

	.uikit-product-card__link:is(:visited, :link) {
		color: #212121;
		text-decoration: none;
	}

	.uikit-product-card__link:focus-visible {
		outline-color: #212121;
	}

	.uikit-product-card__link:hover .uikit-product-card__name {
		text-decoration: underline;
	}

	.uikit-product-card__media-container {
		position: relative;
	}

	.uikit-product-card__badge {
		position: absolute;
		top: 0.25rem;
		left: 0rem;
		display: flex;
		width: 100%;
	}

	.uikit-product-card__media {
		overflow: hidden;
		border-radius: .25rem;
		width: 100%;
		aspect-ratio: 1 / 1;
	}

	.uikit-product-card__description {
		display: flex;
		flex-direction: column;
		gap: .25rem;
	}

	.uikit-product-card__name {
		font-size: 0.875rem;
		line-height: 1.4;

		display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;

    min-height: 2.4em;
	}

	.uikit-product-card__price {
		display: flex;
		flex-direction: row;
		gap: .5rem;
	}

	.uikit-product-card__price-current {
		display: flex;
		flex-direction: row;
		gap: 0;
	}

	.uikit-product-card__price-symbol,
	.uikit-product-card__price-cents {
		font-size: .75rem;
		line-height: 1;
		align-self: start;
		margin-block-start: .125rem;
	}

	.uikit-product-card__price-dollars {
		line-height: 1;
		font-size: 1.5rem;
		font-weight: 500;
		align-self: start;
	}

	.uikit-product-card__price-original {
		font-size: .75rem;
		font-weight: 500;
		color: #515357;
		text-decoration: line-through;
		align-self: end
	}

	.uikit-product-card__action {
		width: 100%;
		align-self: end;
		justify-self: end;
	}
</style>
