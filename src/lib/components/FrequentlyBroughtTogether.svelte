<script lang="ts">
	import { onMount } from "svelte";
	import Image from "./Image.svelte";
	import Icon from "./Icon.svelte";
	import Checkbox from "./Checkbox.svelte";
	import Button from "./Button.svelte";
	import BottomSheet from "./BottomSheet.svelte";

	type Product = {
		id: string;
		name: string;
		price: number;
		imageUrl: string;
		mobileImageUrl: string;
		url: string;
		selected?: boolean;
	}

	type Props = {
		products: Product[]
	};

	let {
		products = $bindable()
	}: Props = $props();

	let isSheetOpen = $state(false);
	let isMobile = $state(false);
	let bottomSheetDisclosure: HTMLButtonElement | undefined = $state();

	let totalPrice = $derived(products.filter(p => p.selected).reduce((sum, p) => sum + p.price, 0));
	let totalSelected = $derived(products.filter(p => p.selected).length);

	function toggleProduct(index: number) {
		products[index].selected = !products[index].selected;
	}

	function handleBottomSheet() {
		isSheetOpen = true;
	}

	onMount(() => {
		const controller = new AbortController();
		const mediaQuery = window.matchMedia("(max-width: 768px)");

		isMobile = mediaQuery.matches;

		mediaQuery.addEventListener("change", (event: MediaQueryListEvent) => {
			isMobile = event.matches;
		}, { signal: controller.signal });

		return () => {
			controller.abort();
		};
	});
</script>

<section class="fbt" aria-labelledby="fbt-heading">
	<h2 id="fbt-heading" class="fbt__heading">Frequently Bought Together</h2>
	<div class="fbt__container">
		<div class="fbt__products" role="group" aria-label="Product bundle selection">
			{#each products as product, index (product.id)}
				<div class="fbt__product">
					<div class="fbt__product-checkbox">
						<Checkbox
							checked={product.selected}
							onchange={() => toggleProduct(index)}
							aria-label={`Include ${product.name} in bundle`}
						/>
					</div>
					<a href={product.url} class="fbt__product-link">
						<picture class="fbt__media">
							<source
								media="(max-width: 560px)"
								srcset={product.mobileImageUrl}
							>
							<Image
								src={product.imageUrl}
								width={144}
								height={144}
								alt={product.name}
							/>
						</picture>
						<span class="fbt__product-name">
							{#if index === 0}
								<span class="fbt__current-item">This item:</span>
							{/if}
							{product.name}
						</span>
						<span class="fbt__product-price" aria-label={`$${product.price.toFixed(2)}`}>
							<span class="fbt__product-price-symbol">$</span>
							<span class="fbt__product-price-dollars">{Math.floor(product.price)}</span>
							<span class="fbt__product-price-cents">{(product.price % 1).toFixed(2).slice(2)}</span>
						</span>
					</a>
				</div>
				{#if index < products.length - 1}
					<Icon >
						<path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
					</Icon>
				{/if}
			{/each}
		</div>
		<div class="fbt__summary">
			{#if !isMobile}
				<div class="fbt__status-area" aria-live="polite" aria-atomic="true">
					{#if totalSelected > 0}
						<div class="fbt__total">
							<span class="fbt__total-label">Total price:</span>
							<span class="fbt__total-price" aria-live="polite">
								<span class="fbt__total-price-symbol">$</span>
								<span class="fbt__total-price-whole">{totalPrice.toFixed(2)}</span>
							</span>
						</div>
					{:else}
						<span class="fbt__instruction">Please select items to build your perfect bundle</span>
					{/if}
				</div>
				<Button shape="pill" disabled={!totalSelected}>
					{@const count = totalSelected === products.length ? `all ${totalSelected}` : totalSelected || ""}
					Add {count} to Cart
				</Button>
			{:else}
				{@const finalPrice = products.reduce((sum, p) => sum + p.price, 0).toFixed(2)}
				<Button bind:ref={bottomSheetDisclosure} color="neutral" variant="outlined" shape="pill" fullWidth onclick={handleBottomSheet}>
					<div class="fbt__cta">
						<span class="fbt__cta-text">Buy all {products.length}: ${finalPrice}</span>
						<Icon>
							<path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
						</Icon>
					</div>
				</Button>
			{/if}
		</div>
	</div>
</section>

<BottomSheet disclosure={bottomSheetDisclosure} bind:open={isSheetOpen} hasCloseButton title="Frequently bought together">
	<div class="fbt__sheet-products" role="group" aria-label="Product bundle selection">
		{#each products as product, index (product.id)}
			<div class="fbt__sheet-product">
				<div class="fbt__sheet-checkbox">
					<Checkbox
						checked={product.selected}
						onchange={() => toggleProduct(index)}
						aria-label={`Include ${product.name} in bundle`}
					/>
				</div>
				<picture class="fbt__sheet-media">
					<Image
						src={product.imageUrl}
						width={96}
						height={96}
						alt={product.name}
					/>
				</picture>
				<div class="fbt__sheet-info">
					<span class="fbt__sheet-product-name">
						{#if index === 0}
							<span class="fbt__current-item">This item:</span>
						{/if}
						{product.name}
					</span>
					<span class="fbt__sheet-product-price" aria-label={`$${product.price.toFixed(2)}`}>
						<span class="fbt__product-price-symbol">$</span>
						<span class="fbt__product-price-dollars">{Math.floor(product.price)}</span>
						<span class="fbt__product-price-cents">{(product.price % 1).toFixed(2).slice(2)}</span>
					</span>
				</div>
			</div>
		{/each}
	</div>

	{#snippet footer()}
		<div class="fbt__sheet-summary">
			<div class="fbt__status-area" aria-live="polite" aria-atomic="true">
				{#if totalSelected > 0}
				<div class="fbt__sheet-total">
					<span class="fbt__total-label">Total price:</span>
					<span class="fbt__total-price" aria-live="polite">
						<span class="fbt__total-price-symbol">$</span>
						<span class="fbt__total-price-whole">{totalPrice.toFixed(2)}</span>
					</span>
				</div>
				{:else}
					<span class="fbt__instruction">Please select items to build your perfect bundle</span>
				{/if}
			</div>
			<Button shape="pill" disabled={!totalSelected} fullWidth>
				{@const count = totalSelected === products.length ? `all ${totalSelected}` : totalSelected || ""}
				Add {count} to Cart
			</Button>
		</div>
	{/snippet}
</BottomSheet>

<style>
	.fbt {
		max-width: 1024px;
		margin: 0 auto;
		padding: 1rem;
	}

	.fbt__heading {
		font-size: 1.25rem;
		font-weight: 600;
	}

	.fbt__container {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 1.5rem;
	}

	.fbt__products {
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		gap: 1rem;
		align-items: center;
		justify-content: center;
	}

	.fbt__product {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		flex: 0 1 auto;
		gap: 0.5rem;
	}

	.fbt__current-item {
		font-weight: 700;
	}

	.fbt__product-checkbox {
		position: absolute;
		z-index: 1;
		top: 0.5rem;
		right: 0.5rem;
	}

	.fbt__total-label {
		text-wrap: nowrap;
	}

	.fbt__product-link {
		display: flex;
		flex-direction: column;
		text-decoration: none;
		color: inherit;
		gap: 0.5rem;
	}

	.fbt__media {
		position: relative;
		display: block;
		width: 144px;
		height: 144px;
		align-self: center;
	}

	.fbt__product-name {
		font-size: 0.875rem;
		line-height: 1.2;
	}

	.fbt__product-price {
		display: flex;
		flex-direction: row;
		gap: 0;
	}

	.fbt__product-price-symbol,
	.fbt__product-price-cents {
		font-size: .75rem;
		line-height: 1;
		align-self: start;
		margin-block-start: .125rem;
	}

	.fbt__product-price-dollars {
		line-height: 1;
		font-size: 1.5rem;
		font-weight: 500;
		align-self: start;
	}

	.fbt__summary {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: .5rem;
	}

	.fbt__instruction {
		text-wrap: balance;
  	display: inline-block;
  	text-align: center;
	}

	.fbt__total {
		display: flex;
		align-items: center;
		gap: .25rem;
		font-size: 1rem;
	}

	.fbt__total-price {
		display: flex;
	}

	.fbt__total-price-symbol {
		font-size: .875rem;
	}

	.fbt__total-price-whole {
		line-height: 1;
		font-size: 1.5rem;
		font-weight: 500;
	}

	.fbt__cta {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		gap: 0.5rem;
	}

	.fbt__cta-text {
		flex: 1;
		text-align: center;
	}

	.fbt__sheet-product {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 1rem;
		padding-block: .5rem;
		border-bottom: 1px solid #e5e5e5;
	}

	.fbt__sheet-product:last-child {
		border-bottom: none;
	}

	.fbt__sheet-checkbox {
		flex-shrink: 0;
	}

	.fbt__sheet-media {
		flex-shrink: 0;
		width: 96px;
		height: 96px;
	}

	.fbt__sheet-info {
		flex: 1;
		display: flex;
		align-self: start;
		flex-direction: column;
		padding-block: .5rem;
		gap: 0.5rem;
	}

	.fbt__sheet-product-name {
		font-size: 0.875rem;
		line-height: 1.3;
	}

	.fbt__sheet-product-price {
		display: flex;
		flex-direction: row;
		gap: 0;
		font-weight: 500;
	}

	.fbt__sheet-summary {
		display: flex;
		flex-direction: column;
		gap: .5rem;
		padding-block: 1rem;
		padding-inline: 1rem;
		text-align: center;
	}

	.fbt__sheet-total {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: .25rem;
		font-size: 1rem;
	}

	@media (max-width: 768px) {
		.fbt__summary {
			width: 100%;
		}

		.fbt__products :global(.uikit-checkbox) {
			display: none;
		}

		.fbt__container {
			flex-direction: column;
		}

		.fbt__product-name {
			display: none;
		}

		.fbt__product-price {
			display: none;
		}

		.fbt__products {
			gap: 0;
		}

		.fbt__media {
			width: 96px;
			height: 96px;
		}
	}
</style>
