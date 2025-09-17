<script lang="ts">
  import { type Snippet } from "svelte";
  import { deepMerge } from "$lib/utils/merge";
	import Image from "./Image.svelte";
	
  type ContentConfig = {
    grid: { start: number; span: number };
    padding: string;
    justify: string;
    align: string;
    textAlign: string;
  };

  type BreakpointConfig = {
    mobile?: Partial<ContentConfig>;
    tablet?: Partial<ContentConfig>;
    desktop?: Partial<ContentConfig>;
  };

  type Images = {
    mobile: string;
    tablet?: string;
    desktop?: string;
  };

  type Breakpoints = {
    tablet: number;
    desktop: number;
  };

  type Props = {
    images: Images;
    href?: string;
    alt?: string;
    width?: number;
    height?: number;
    breakpoints?: Breakpoints;
    layout?: "overlay" | "split-left" | "split-right";
    contentConfig?: BreakpointConfig;
    loading?: "eager" | "lazy";
    fetchpriority?: "high" | "low" | "auto";
    headline?: string;
    subheading?: string;
    supportingText?: string;
    children?: Snippet
  };

	const DIMENSIONS = {
		width: 1200,
		height: 460
	} as const;
	
  const BREAKPOINTS = {
    tablet: 768,
    desktop: 1024
  } as const;

	const DEFAULT_CONTENT_CONFIG = {
		desktop: { 
			grid: { start: 1, span: -1 }, 
			padding: "1rem", 
			justify: "center", 
			align: "center", 
			textAlign: "center" 
		},
		tablet: { 
			grid: { start: 1, span: -1 }, 
			padding: "1rem", 
			justify: "center", 
			align: "center", 
			textAlign: "center" 
		},
		mobile: { 
			grid: { start: 1, span: -1 }, 
			padding: "1rem", 
			justify: "center", 
			align: "center", 
			textAlign: "center" 
		}
	};
	
	let {
		images,
		href,
		alt = "",
		width = DIMENSIONS.width,
		height = DIMENSIONS.height,
		breakpoints = {
			tablet: BREAKPOINTS.tablet,
			desktop: BREAKPOINTS.desktop
		},
		layout = "overlay",
		contentConfig = {},
		loading = "eager",
		fetchpriority = "auto",
		headline,
		subheading,
		supportingText,
		children
	}: Props = $props();

	let ref: HTMLDivElement;
	
	const mergedContentConfig = $derived.by(() => {
    let config = structuredClone(DEFAULT_CONTENT_CONFIG);
    
    for (const breakpoint of Object.keys(config) as Array<keyof typeof config>) {
      if (contentConfig[breakpoint]) {
        config[breakpoint] = deepMerge(config[breakpoint], contentConfig[breakpoint]);
      }
    }
    
    return config;
  });
	
	const hasContent = $derived(headline || subheading || supportingText || children);
</script>

{#snippet responsiveImage()}
  <picture class="uikit-hero__media">
    {#if images?.desktop}
      <source srcset={images.desktop} media="(min-width: {breakpoints.desktop}px)">
    {/if}
    {#if images?.tablet}
      <source srcset={images.tablet} media="(min-width: {breakpoints.tablet}px)">
    {/if}
    <Image 
      src={images?.mobile}
      {width} 
      {height} 
      {alt} 
      {loading} 
      {fetchpriority}
    />
  </picture>
{/snippet}

<div 
  class="uikit-hero"
	class:uikit-hero--split-left={layout === "split-left"}
  class:uikit-hero--split-right={layout === "split-right"}
  class:uikit-hero--overlay={layout === "overlay"}
	style:--uikit-hero-breakpoint-tablet="{breakpoints.tablet}px"
  style:--uikit-hero-breakpoint-desktop="{breakpoints.desktop}px"
  bind:this={ref}
>
	<svelte:element 
	  this={href ? "a" : "div"}
	  class="uikit-hero__visual"
	  href={href || null}
	>
	  {@render responsiveImage()}
	</svelte:element>

	{#if hasContent}
    <div
			class="uikit-hero__content"
			style:--uikit-hero-content-grid-mobile="{mergedContentConfig.mobile.grid.start} / {mergedContentConfig.mobile.grid.span}"
      style:--uikit-hero-content-grid-tablet="{mergedContentConfig.tablet.grid.start} / {mergedContentConfig.tablet.grid.span}"
      style:--uikit-hero-content-grid-desktop="{mergedContentConfig.desktop.grid.start} / {mergedContentConfig.desktop.grid.span}"
			style:--uikit-hero-content-padding-mobile={mergedContentConfig.mobile.padding}
      style:--uikit-hero-content-padding-tablet={mergedContentConfig.tablet.padding}
      style:--uikit-hero-content-padding-desktop={mergedContentConfig.desktop.padding}
      style:--uikit-hero-content-justify-mobile={mergedContentConfig.mobile.justify}
      style:--uikit-hero-content-justify-tablet={mergedContentConfig.tablet.justify}
      style:--uikit-hero-content-justify-desktop={mergedContentConfig.desktop.justify}
      style:--uikit-hero-content-align-mobile={mergedContentConfig.mobile.align}
      style:--uikit-hero-content-align-tablet={mergedContentConfig.tablet.align}
      style:--uikit-hero-content-align-desktop={mergedContentConfig.desktop.align}
			style:--uikit-hero-content-text-align-mobile={mergedContentConfig.mobile.textAlign}
      style:--uikit-hero-content-text-align-tablet={mergedContentConfig.tablet.textAlign}
      style:--uikit-hero-content-text-align-desktop={mergedContentConfig.desktop.textAlign}
		>
      {#if headline}
        <h2 class="uikit-hero__headline">{headline}</h2>
      {/if}
			{#if subheading}
				<h3 class="uikit-hero__subheading">{subheading}</h3>
			{/if}
      {#if supportingText}
        <p class="uikit-hero__supportingText">{supportingText}</p>
      {/if}
      {#if children}
        <div class="uikit-hero__ctas">
          {@render children?.()}
        </div>
      {/if}
    </div>
  {/if}
</div>

<style>
	@layer variables, base, variants, responsive;

	@layer variables {
		:root {
			--uikit-hero-border-radius: 0.75rem;
			--uikit-hero-font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
	
			--uikit-hero-visual-start: 1;
			--uikit-hero-visual-span: -1;
			--uikit-hero-content-start: 1;
			--uikit-hero-content-span: -1;
			
			--uikit-hero-headline-size: clamp(1.5rem, 4vw, 2.5rem);
	    --uikit-hero-headline-weight: 700;
	    --uikit-hero-headline-line-height: 1.1;
			--uikit-hero-subheading-size: clamp(1rem, 2vw, 1.5rem);;
	    --uikit-hero-subheading-weight: 500;
	    --uikit-hero-subheading-line-height: 1;
	    --uikit-hero-supporting-text-size: clamp(0.875rem, 2vw, 1.125rem);
	    --uikit-hero-supporting-text-weight: 400;
	    --uikit-hero-supporting-text-line-height: 1.4;
	
			--uikit-hero-ctas-gap: .5rem;
		}
	}

	@layer base {
		.uikit-hero {
			position: relative;
			display: grid;
			grid-template-columns: repeat(12, 1fr);
			container-type: inline-size;
			max-width: 1200px;
	    min-width: 320px;
			font-family: var(--uikit-hero-font-family);
			border-radius: var(--uikit-hero-border-radius);
			overflow: hidden;
		}
	
		.uikit-hero__visual {
			grid-column: var(--uikit-hero-visual-start) / var(--uikit-hero-visual-span);
			grid-row: 1;
			display: block;
			width: 100%;
			height: auto;
			border-radius: var(--uikit-hero-border-radius);
			overflow: hidden;
		}
		
		.uikit-hero__content {
			display: flex; 
			flex-direction: column;
			gap: .5rem;
			text-align: var(--uikit-hero-content-text-align-mobile);
			padding: var(--uikit-hero-content-padding-mobile);
			justify-content: var(--uikit-hero-content-justify-mobile);
			align-items: var(--uikit-hero-content-align-mobile);
			z-index: 1;
		}

		.uikit-hero__headline {
			font-size: var(--uikit-hero-headline-size);
	    font-weight: var(--uikit-hero-headline-weight);
	    line-height: var(--uikit-hero-headline-line-height);
	    margin: 0;
		}
		
		.uikit-hero__subheading {
			font-size: var(--uikit-hero-subheading-size);
	    font-weight: var(--uikit-hero-subheading-weight);
	    line-height: var(--uikit-hero-subheading-line-height);
	    margin: 0;
		}
		
		.uikit-hero__supportingText {
			font-size: var(--uikit-hero-supporting-text-size);
	    font-weight: var(--uikit-hero-supporting-text-weight);
	    line-height: var(--uikit-hero-supporting-text-line-height);
	    margin: 0;
		}
		
		.uikit-hero__ctas {
	    display: flex;
	    flex-wrap: wrap;
	    gap: var(--uikit-hero-ctas-gap);
	    justify-content: var(--uikit-hero-cta-justify);
	  }
	}

	@layer variants {
		.uikit-hero--split-left {
			grid-template-columns: 1fr 1fr;
			grid-template-areas: "visual content";
		}
	
		.uikit-hero--split-right {
			grid-template-columns: 1fr 1fr;
			grid-template-areas: "content visual";
		}
	
		:is(.uikit-hero--split-left, .uikit-hero--split-right) .uikit-hero__content {
			grid-area: content;
			
		}
	
		:is(.uikit-hero--split-left, .uikit-hero--split-right) .uikit-hero__visual {
			grid-area: visual;
		}
	
		.uikit-hero--overlay .uikit-hero__content {
			grid-column: var(--uikit-hero-content-grid-mobile);
			grid-row: 1;
		}
	}

	@layer responsive {
		@container (min-width: 768px) {
			.uikit-hero--overlay .uikit-hero__content {
				grid-column: var(--uikit-hero-content-grid-tablet);
				text-align: var(--uikit-hero-content-text-align-tablet);
				padding: var(--uikit-hero-content-padding-tablet);
				justify-content: var(--uikit-hero-content-justify-tablet);
				align-items: var(--uikit-hero-content-align-tablet);
			}
		}
		
		@container (min-width: 1024px) {
			.uikit-hero--overlay .uikit-hero__content {
				grid-column: var(--uikit-hero-content-grid-desktop);
				text-align: var(--uikit-hero-content-text-align-desktop);
				padding: var(--uikit-hero-content-padding-desktop);
				justify-content: var(--uikit-hero-content-justify-desktop);
				align-items: var(--uikit-hero-content-align-desktop);
			}
		}

		@supports not (container-type: inline-size) {
			@media (min-width: 768px) {
				.uikit-hero--overlay .uikit-hero__content {
					grid-column: var(--uikit-hero-content-grid-tablet);
					text-align: var(--uikit-hero-content-text-align-tablet);
					padding: var(--uikit-hero-content-padding-tablet);
					justify-content: var(--uikit-hero-content-justify-tablet);
					align-items: var(--uikit-hero-content-align-tablet);
				}
			}

			@media (min-width: 1024px) {
				.uikit-hero--overlay .uikit-hero__content {
					grid-column: var(--uikit-hero-content-grid-desktop);
					text-align: var(--uikit-hero-content-text-align-desktop);
					padding: var(--uikit-hero-content-padding-desktop);
					justify-content: var(--uikit-hero-content-justify-desktop);
					align-items: var(--uikit-hero-content-align-desktop);
				}
			}
		}
	}
</style>