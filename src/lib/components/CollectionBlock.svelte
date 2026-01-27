<script lang="ts">
	import { type Snippet } from "svelte";
	import Carousel from "./Carousel.svelte";

	type HeadingSize = "sm" | "md" | "lg" | "xl";
	type Props = {
		heading: string;
		hero?: Snippet;
		children?: Snippet;
		backgroundColor?: string;
    headingColor?: string;
    headingSize?: HeadingSize;
    ctaBackgroundColor?: string;
		breakpoints?: Record<string, { slidesPerView: number }>
	};

	let id = crypto.randomUUID();
	const headerId = `collection-heading-${id}`;
	const headingSizes = {
    sm: "1.25rem",
    md: "1.5rem",
    lg: "2rem",
    xl: "2.5rem"
  };

	let {
		heading,
		hero,
		backgroundColor = "#f6f5f1",
		headingColor = "#212121",
		headingSize = "md",
		headingAlign = "center",
		ctaBackgroundColor,
		ctaTextColor,
		breakpoints = {
      "320": { slidesPerView: 1.5 },
      "768": { slidesPerView: 4 },
      "1024": { slidesPerView: 5 }
    },
		children
	}: Props = $props();

	let currentHeadingSize = $derived(headingSizes[headingSize]);
</script>

<section
	class="collection-block"
	aria-labelledby={headerId}
	style:--collection-block-bg-color={backgroundColor}
  style:--collection-block-heading-color={headingColor}
  style:--collection-block-heading-size={currentHeadingSize}
  style:--collection-block-heading-text-align={headingAlign}
  style:--product-card-cta-bg-color={ctaBackgroundColor}
  style:--product-card-cta-text-color={ctaTextColor}
>
	{#if hero}
		<div class="collection-block__hero">
			{@render hero()}
		</div>
	{/if}
	<header class="collection-block__header">
		<h2 id={headerId} class="collection-block__title">{heading}</h2>
	</header>
	<div class="collection-block__content">
		<Carousel {breakpoints}>
			{@render children?.()}
		</Carousel>
	</div>
</section>

<style>
	.collection-block {
	  display: flex;
	  flex-direction: column;
	  gap: var(--collection-block-gap, 0);
	  padding-block-end: var(--collection-block-padding-block-end, 1rem);
	  border-radius: var(--collection-block-border-radius, 1rem);
	  background-color: var(--collection-block-bg-color, #f6f5f1);
	}

	.collection-block__hero {
	  width: 100%;
	  overflow: hidden;
	  border-start-start-radius: var(--collection-block-border-radius, 1rem);
	  border-start-end-radius: var(--collection-block-border-radius, 1rem);
	}

	.collection-block__header {
	  min-height: var(--collection-block-header-min-height, 3.5rem);
	  display: flex;
	  align-items: center;
	  padding-inline: var(--collection-block-header-padding-inline, 1rem);
	  padding-block: var(--collection-block-header-padding-block, 0);
	}

	.collection-block__title {
	  flex: 1;
	  margin: 0;
	  line-height: var(--collection-block-heading-line-height, 1.2);
	  text-align: var(--collection-block-heading-text-align, center);
	  font-weight: var(--collection-block-heading-weight, 600);
	  font-size: var(--collection-block-heading-size, 1.5rem);
	  color: var(--collection-block-heading-color, #000);
	}

	.collection-block__content {
	  box-sizing: border-box;
	  padding-inline: var(--collection-block-content-padding-inline, 0.25rem);
	}
</style>
