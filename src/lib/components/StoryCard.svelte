<script lang="ts">
  import { type Snippet } from "svelte";
  import PromoBadge from "./PromoBadge.svelte";
  import Image from "./Image.svelte";

  type PromoPlacement = "top-left" | "top-right" | "bottom-left" | "bottom-right";
  type TextAlignment = "left" | "center" | "right";

  type PromoConfig = {
    heading?: string;
    value: string;
    legalText?: string;
    ariaLabel?: string;
    placement?: PromoPlacement;
  }

  type ImageSources = {
    mobile: string;
    tablet?: string;
    desktop: string;
  }

  type Props = {
    children?: Snippet;
    headline?: string;
    subhead?: string;
    supportingText?: string;
    images?: ImageSources;
    storycardActions?: Snippet;
    promo?: PromoConfig;
    href?: string;
    alt?: string;
    textAlignment?: TextAlignment;
    backgroundColor?: string;
		textColor?: string;
    hidden?: { desktop: boolean; mobile: boolean };
    spanColumn?: { desktop: string; tablet: string; mobile: string };
    spanRow?: { desktop: string; tablet: string; mobile: string };
    [key: string]: unknown;
  };

  let {
    children,
    headline,
    subhead,
    supportingText,
    images,
		video,
    storycardActions,
    promo,
    href,
		alt = "",
    mediaType = "image",
		textAlignment = "center",
		backgroundColor = "#fff",
		textColor = "#212121",
		hidden = { desktop: false, mobile: false },
    spanColumn = { desktop: "span 3", tablet: "", mobile: "span 6" },
    spanRow = { desktop: "span 1", tablet: "", mobile: "span 1" },
    ...restProps
  }: Props = $props();

  const promoPlacement = $derived(promo?.placement ?? "top-left");
	const promoHeading = $derived(promo?.heading ?? "");
</script>

<div 
  class="uikit-story-card"
	class:uikit-story-card--textAlignment-left={textAlignment === "left"}
  class:uikit-story-card--textAlignment-right={textAlignment === "right"}
  style:--uikit-storycard-column-d={spanColumn.desktop || null}
  style:--uikit-storycard-column-m={spanColumn.mobile || null}
  style:--uikit-storycard-row-d={spanRow.desktop || null}
  style:--uikit-storycard-row-m={spanRow.mobile || null}
  style:--uikit-storycard-background={backgroundColor}
	style:--uikit-storycard-color={textColor}
  style:--uikit-storycard-display-d={hidden.desktop ? "none" : "block"}
  style:--uikit-storycard-display-m={hidden.mobile ? "none" : "block"}
  {...restProps}
>
	<a class="uikit-story-card__link" {href}>
		{#if promo}
			<div 
				class="uikit-story-card__promo-badge"
				class:uikit-story-card__promo-badge--top-left={promoPlacement === "top-left"}
				class:uikit-story-card__promo-badge--top-right={promoPlacement === "top-right"}
				class:uikit-story-card__promo-badge--bottom-left={promoPlacement === "bottom-left"}
				class:uikit-story-card__promo-badge--bottom-right={promoPlacement === "bottom-right"}
			>
				<PromoBadge 
					heading={promoHeading}
					value={promo.value}
					legalText={promo.legalText}
					ariaLabel={promo.ariaLabel}
				/>
			</div>
		{/if}
		<picture class="uikit-story-card__media">
			<source media="(max-width: 560px)" srcset={images?.mobile}>
			<Image src={images?.desktop} {alt} width={280} height={280} />
		</picture>
		{#if headline || subhead || supportingText}
			<div class="uikit-story-card__content">
				{#if headline && subhead}
					<hgroup class="uikit-story-card__heading-group">
						<h3 class="uikit-story-card__headline">{headline}</h3>
						<p class="uikit-story-card__subhead">{subhead}</p>
					</hgroup>
				{:else if headline}
					<h3 class="uikit-story-card__headline">{headline}</h3>
				{:else if subhead}
					<p class="uikit-story-card__subhead">{subhead}</p>
				{/if}
				{#if supportingText}
					<div class="uikit-story-card__supportingText">
						{supportingText}
					</div>
				{/if}
			</div>
		{/if}
	</a>
	{#if storycardActions}
		<div class="uikit-story-card__actions">
			{@render storycardActions()}
		</div>
	{/if}
</div>

<style>
	:root {
		--uikit-storycard-background: #fff;
    --uikit-storycard-color: #212121;
		--uikit-storycard-column-m: span 6;
		--uikit-storycard-column-t: span 4;
		--uikit-storycard-column-d: span 3;
		
		--uikit-storycard-row-m: span 1;
		--uikit-storycard-row-t: span 1;
		--uikit-storycard-row-d: span 1;
		
		--uikit-storycard-text-alignment: center;
		--uikit-storycard-font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, Oxygen, Ubuntu, Cantarell, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
	}
	
  .uikit-story-card {
		position: relative;
		background-color: var(--uikit-storycard-background);
		font-family: var(--uikit-storycard-font-family);
		grid-column: var(--uikit-storycard-column-m);
		grid-row: var(--uikit-storycard-row-m);
		border-radius: 1rem;
		overflow: hidden;
		height: fit-content;
		display: var(--uikit-storycard-display-m);
		text-align: var(--uikit-storycard-text-alignment);
	}

	.uikit-story-card--textAlignment-left {
		--uikit-storycard-text-alignment: left;
	}

	.uikit-story-card--textAlignment-right {
		--uikit-storycard-text-alignment: right;
	}
	
	.uikit-story-card__promo-badge {
		position: absolute;
		z-index: 1;
	}

	.uikit-story-card__promo-badge--top-left {
		top: .5rem;
		left: .5rem;
	}
  
	.uikit-story-card__promo-badge--top-right {
		top: .5rem;
		right: .5rem;
	}

  .uikit-story-card__promo-badge--bottom-left {
		bottom: .5rem;
		left: .5rem;
	}

  .uikit-story-card__promo-badge--bottom-right {
		bottom: .5rem;
		right: .5rem;
	}

	.uikit-story-card__link, .uikit-story-card__link:visited {
		display: block;
		text-decoration: none;
    color: var(--uikit-storycard-color);
	}

	.uikit-story-card__link:is(:hover, :focus-visible) {
		text-decoration: underline;
		cursor: pointer;
	}

	.uikit-story-card__content {
		box-sizing: border-box;
		min-height: 3rem;
		display: flex;
		flex-flow: column nowrap;
	}

	.uikit-story-card__content:not(:empty) {
		padding-block: 1rem;
		padding-inline: 1rem;
	}

	.uikit-story-card__headline {
		margin: 0;
		line-height: 1.4;
		font-size: 1.2rem;
	}

	.uikit-story-card__subhead {
		margin: 0;
		line-height: 1.2;
		font-weight: 500;
		font-size: 1.125rem;
	}

	.uikit-story-card__supportingText {
		font-size: 1rem;
		line-height: 1.2;
	}

	@container (min-width: 768px) {
		.uikit-story-card {
			grid-column: var(--uikit-storycard-column-d);
			grid-row: var(--uikit-storycard-row-d);
			display: var(--uikit-storycard-display-d);
		}
	}

	@container (min-width: 1024px) {
		.uikit-story-card {
			grid-column: var(--uikit-storycard-column-d);
			grid-row: var(--uikit-storycard-row-d);
			display: var(--uikit-storycard-display-d);
		}
	}
</style>