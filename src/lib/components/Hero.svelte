<script lang="ts">
	import { onMount } from "svelte";
  import Image from "./Image.svelte";
	
	type FetchPriority = "high" | "low" | "auto";
	type HorizontalAlignment = "left" | "center" | "right";
	type VerticalAlignment = "start" | "center" | "end";
  
  type ImageSources = {
    mobile: string;
    tablet?: string;
    desktop?: string;
  }

	type CTAVariant = "filled" | "outlined" | "ghost" | "link";
	type CTAColor = "primary" | "secondary" | "default";
	type CTASize = "small" | "sm" | "medium" | "md" | "large" | "lg";

  type CTA = {
    text: string;
    href: string;
    variant?: CTAVariant;
    size?: CTASize;
		color?: CTAColor;
  }

  type DeviceAlignment = {
    horizontal?: HorizontalAlignment;
    vertical?: VerticalAlignment;
    text?: HorizontalAlignment;
  }

  type GridConfig = {
    columns?: number;
    contentSpan?: number;
    contentStart?: number;
  }

  type HeroContent = {
    headline: string;
    details?: string;
    cta?: CTA | CTA[];
    alignment?: DeviceAlignment & {
      mobile?: DeviceAlignment;
      tablet?: DeviceAlignment;
      desktop?: DeviceAlignment;
    };
    grid?: GridConfig & {
      mobile?: GridConfig;
      tablet?: GridConfig;
      desktop?: GridConfig;
    };
  }

	type Props = {
    images: ImageSources;
    href?: string;
    width?: number;
    height?: number;
    alt: string;
    tabletBreakpoint?: number;
    desktopBreakpoint?: number;
    loading?: "lazy" | "eager";
    fetchpriority?: FetchPriority;
    content?: HeroContent;
    debounceDelay?: number;
    containerQuery?: boolean;
  }
	
	const DIMENSIONS = {
		width: 1200,
		height: 460
	} as const;
	
  const BREAKPOINTS = {
    tablet: 768,
    desktop: 1024
  } as const;

  const DEBOUNCE_DELAY = 100;

  let {
    images,
    href,
    width = DIMENSIONS.width,
    height = DIMENSIONS.height,
    alt,
    tabletBreakpoint = BREAKPOINTS.tablet,
    desktopBreakpoint = BREAKPOINTS.desktop,
    loading = "eager",
    fetchpriority = "auto",
    content,
    debounceDelay = DEBOUNCE_DELAY,
    containerQuery = true
  }: Props = $props();

	let ref: HTMLDivElement;
	let currentDeviceType = $state<"mobile" | "tablet" | "desktop">("desktop");
  let resizeObserver: ResizeObserver | null = null;

	let alignmentConfig = $derived.by(() => {
    if (!content?.alignment) return { 
      horizontal: "left", 
      vertical: "center", 
      text: "left",
      contentHAlign: "flex-start",
      contentVAlign: "center", 
      ctaJustify: "flex-start"
    };
    
    const deviceConfig = content.alignment[currentDeviceType] || {};
    const baseConfig = content.alignment;
    
    const horizontal = deviceConfig.horizontal || baseConfig.horizontal || "left";
    const vertical = deviceConfig.vertical || baseConfig.vertical || "center";
    const text = deviceConfig.text || baseConfig.text || "left";
    
    // Map alignment values to flexbox values for content positioning
    const contentHAlign = horizontal === "center" ? "center" : horizontal === "right" ? "flex-end" : "flex-start";
    const contentVAlign = vertical === "center" ? "center" : vertical === "end" ? "flex-end" : "flex-start";
    const ctaJustify = text === "center" ? "center" : text === "right" ? "flex-end" : "flex-start";
    
    return {
      horizontal,
      vertical,
      text,
      contentHAlign,
      contentVAlign,
      ctaJustify
    };
  });

  // Cached grid calculations
  let gridConfig = $derived.by(() => {
    if (!content?.grid) return { columns: 12, contentSpan: 4, contentStart: 1 };
    
    const deviceConfig = content.grid[currentDeviceType] || {};
    const baseConfig = content.grid;
    
    return {
      columns: deviceConfig.columns || baseConfig.columns || 12,
      contentSpan: deviceConfig.contentSpan || baseConfig.contentSpan || 4,
      contentStart: deviceConfig.contentStart || baseConfig.contentStart || 1
    };
  });

  // Memoized CTA normalization
  let normalizedCTAs = $derived.by(() => {
    if (!content?.cta) return [];
    return Array.isArray(content.cta) ? content.cta : [content.cta];
  });

	function debounce<T extends (...args: any[]) => void>(func: T, wait: number): T {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    
    return ((...args: Parameters<T>) => {
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }
      
      timeoutId = setTimeout(() => {
        timeoutId = null;
        func(...args);
      }, wait);
    }) as T;
  }

  const handleResize = debounce((entries: ResizeObserverEntry[]) => {
    const entry = entries?.[0];
    if (!entry) return;
    
    const containerWidth = entry.contentRect.width;
    
    let newDeviceType: typeof currentDeviceType;
    if (containerWidth < tabletBreakpoint) {
      newDeviceType = "mobile";
    } else if (containerWidth < desktopBreakpoint) {
      newDeviceType = "tablet";  
    } else {
      newDeviceType = "desktop";
    }
    
    if (newDeviceType !== currentDeviceType) {
      currentDeviceType = newDeviceType;
    }
  }, debounceDelay);

  function initializeResizeObserver() {
    if (!ref || !containerQuery) return;
    
    // Clean up existing observer
    if (resizeObserver) {
      resizeObserver.disconnect();
    }
    
    resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(ref);
  }

  function cleanup() {
    if (resizeObserver) {
      resizeObserver.disconnect();
      resizeObserver = null;
    }
  }

	onMount(() => {
    initializeResizeObserver();
    return cleanup;
	});
</script>

{#snippet responsiveImage()}
  <picture class="uikit-hero__media">
    {#if images?.desktop}
      <source srcset={images.desktop} media="(min-width: {desktopBreakpoint}px)">
    {/if}
    {#if images?.tablet}
      <source srcset={images.tablet} media="(min-width: {tabletBreakpoint}px)">
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

{#snippet ctaButton(cta: CTA)}
  <a 
    class="uikit-hero__cta"
		class:uikit-hero__cta--outlined={cta.variant === "outlined"}
		class:uikit-hero__cta--ghost={cta.variant === "ghost"}
		class:uikit-hero__cta--link={cta.variant === "link"}
		class:uikit-hero__cta--sizeSM={cta.size === "small" || cta.size === "sm"}
		class:uikit-hero__cta--sizeLG={cta.size === "large" || cta.size === "lg"}
		class:uikit-hero__cta--primary={cta.color === "primary"}
		class:uikit-hero__cta--secondary={cta.color === "secondary"}
    href={cta.href}
  >
    {cta.text}
  </a>
{/snippet}

<div 
  class="uikit-hero" 
  bind:this={ref}
  style:--uikit-hero-columns={gridConfig.columns}
  style:--uikit-hero-content-span={gridConfig.contentSpan}  
  style:--uikit-hero-content-start={gridConfig.contentStart}
  style:--uikit-hero-content-h-align={alignmentConfig.contentHAlign}
  style:--uikit-hero-content-v-align={alignmentConfig.contentVAlign}
  style:--uikit-hero-text-align={alignmentConfig.text}
  style:--uikit-hero-cta-justify={alignmentConfig.ctaJustify}
  data-device={currentDeviceType}
>
  {#if href}
    <a class="uikit-hero__link" {href}>
      {@render responsiveImage()}
    </a>
  {:else}
    {@render responsiveImage()}
  {/if}
  
  {#if content}
    <div class="uikit-hero__content">
      {#if content.headline}
        <h2 class="uikit-hero__headline">{content.headline}</h2>
      {/if}
      {#if content.details}
        <p class="uikit-hero__details">{content.details}</p>
      {/if}
      {#if normalizedCTAs.length > 0}
        <div class="uikit-hero__ctas">
          {#each normalizedCTAs as cta}
            {@render ctaButton(cta)}
          {/each}
        </div>
      {/if}
    </div>
  {/if}
</div>

<style>
  :root {
    /* Base tokens */
    --uikit-hero-bg: transparent;
    --uikit-hero-color: #212121;
    --uikit-hero-padding: 1rem;
    --uikit-hero-gap: 1rem;
		--uikit-hero-border-radius: 0.75rem;
		--uikit-hero-font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
    
    /* Typography tokens */
    --uikit-hero-headline-size: clamp(1.5rem, 4vw, 2.5rem);
    --uikit-hero-headline-weight: 700;
    --uikit-hero-headline-line-height: 1.1;
    --uikit-hero-details-size: clamp(0.875rem, 2vw, 1.125rem);
    --uikit-hero-details-weight: 400;
    --uikit-hero-details-line-height: 1.4;
    
    /* CTA tokens */
    --uikit-hero-ctas-gap: .5rem;
		--uikit-hero-cta-bg: #fff;
		--uikit-hero-cta-height: 2rem;
		--uikit-hero-cta-color: #212121;
    --uikit-hero-cta-padding-inline: .75rem;
		--uikit-hero-cta-border-radius: calc(var(--uikit-hero-cta-height) / 2);
    --uikit-hero-cta-border-width: 0;
		--uikit-hero-cta-border-color: transparent;
		--uikit-hero-cta-bg-hover: #f2f2f2;
		--uikit-hero-cta-border-color-hover: transparent;
		--uikit-hero-cta-bg-focus: #f2f2f2;
		--uikit-hero-cta-border-color-focus: transparent;
    
    /* Layout defaults */
    --uikit-hero-columns: 12;
    --uikit-hero-content-span: 4;
    --uikit-hero-content-start: 1;
    --uikit-hero-content-h-align: flex-start;
    --uikit-hero-content-v-align: center;
    --uikit-hero-text-align: left;
    --uikit-hero-cta-justify: flex-start;
  }

  .uikit-hero {
    position: relative;
    display: grid;
    grid-template-columns: repeat(var(--uikit-hero-columns), 1fr);
    max-width: 1200px;
    min-width: 320px;
    container-type: inline-size;
		font-family: var(--uikit-hero-font-family);
		border-radius: var(--uikit-hero-border-radius);
		overflow: hidden;
  }

  .uikit-hero__link {
    display: block;
    grid-column: 1 / -1;
    grid-row: 1;
    text-decoration: none;
    color: inherit;
  }

  .uikit-hero__link:hover,
  .uikit-hero__link:focus-visible {
    text-decoration: underline;
    text-decoration-thickness: 2px;
    text-underline-offset: 3px;
  }
  
  .uikit-hero__media {
    display: block;
    grid-column: 1 / -1;
    grid-row: 1;
    width: 100%;
    height: auto;
  }

  .uikit-hero__content {
    display: flex;
    flex-direction: column;
    justify-content: var(--uikit-hero-content-v-align);
    align-items: var(--uikit-hero-content-h-align);
    text-align: var(--uikit-hero-text-align);
    background: var(--uikit-hero-bg);
    color: var(--uikit-hero-color);
    padding: var(--uikit-hero-padding);
    gap: var(--uikit-hero-gap);
    grid-column: var(--uikit-hero-content-start) / span var(--uikit-hero-content-span);
    grid-row: 1;
    z-index: 1;
  }

  .uikit-hero__headline {
    font-size: var(--uikit-hero-headline-size);
    font-weight: var(--uikit-hero-headline-weight);
    line-height: var(--uikit-hero-headline-line-height);
    margin: 0;
  }
  
  .uikit-hero__details {
    font-size: var(--uikit-hero-details-size);
    font-weight: var(--uikit-hero-details-weight);
    line-height: var(--uikit-hero-details-line-height);
    margin: 0;
  }

  .uikit-hero__ctas {
    display: flex;
    flex-wrap: wrap;
    gap: var(--uikit-hero-ctas-gap);
    justify-content: var(--uikit-hero-cta-justify);
  }

  .uikit-hero__cta,
	.uikit-hero__cta:visited {
		box-sizing: border-box;
		font-family: var();
		font-feature-settings: inherit;
    font-variation-settings: inherit;
    display: inline-flex;
    align-items: center;
    gap: 1ch;
		padding-inline: var(--uikit-hero-cta-padding-inline);
		background: var(--uikit-hero-cta-bg);
		height: var(--uikit-hero-cta-height);
    border-radius: var(--uikit-hero-cta-border-radius);
    text-decoration: none;
		font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    border: var(--uikit-hero-cta-border-width) solid var(--uikit-hero-cta-border-color);
    white-space: nowrap;
		color: var(--uikit-hero-cta-color);
	}

  /* CTA Sizes */
	.uikit-hero__cta--sizeSM {
		--uikit-hero-cta-height: 1.5rem;
  }

	.uikit-hero__cta--sizeLG {
		--uikit-hero-cta-height: 2.5rem;
  }

  /* CTA colors */
  .uikit-hero__cta--primary {
    --uikit-hero-cta-bg: #2a508f;
		--uikit-hero-cta-border-width: 1px;
    --uikit-hero-cta-border-color: #2a508f;
    --uikit-hero-cta-color: #fff;
    --uikit-hero-cta-bg-hover: #3f619a;
    --uikit-hero-cta-border-color-hover: #3f619a;
  }

  .uikit-hero__cta--secondary {
    --uikit-hero-cta-bg: #e5e6e7;
		--uikit-hero-cta-border-width: 1px;
    --uikit-hero-cta-border-color: #e5e6e7;
    --uikit-hero-cta-color: #38393b;
    --uikit-hero-cta-bg-hover: #eeeeef;
    --uikit-hero-cta-border-color-hover: #66676a;
  }

	/* CTA Variants */
  .uikit-hero__cta--outlined {
    --uikit-hero-cta-bg: #fff;
		--uikit-hero-cta-border-width: 2px;
    --uikit-hero-cta-border-color: #66676a;
    --uikit-hero-cta-color: #38393b;
		--uikit-hero-cta-bg-hover: #c9c9c9;
    --uikit-hero-cta-border-color-hover: #66676a;
  }

	.uikit-hero__cta--link {
    background-color: transparent;
    border-color: transparent;
    text-decoration: underline;
    --uikit-hero-cta-color: #38393b;
    text-decoration: underline;
    text-underline-offset: 2px;
		--uikit-hero-cta-bg-hover: #eeeeef;
    --uikit-hero-cta-border-color-hover: #eeeeef;
  }

  .uikit-hero__cta--ghost {
    background-color: transparent;
    border-color: transparent;
    --uikit-hero-cta-color: #38393b;
		--uikit-hero-cta-bg-hover: #eeeeef;
    --uikit-hero-cta-border-color-hover: #eeeeef;
  }

	.uikit-hero__cta--primary:is(.uikit-hero__cta--outlined, .uikit-hero__cta--link, .uikit-hero__cta--ghost) {
		--uikit-hero-cta-color: #2a508f;
		--uikit-hero-cta-border-color: #2a508f;
		--uikit-hero-cta-bg-hover: #e9edf3;
	}

	.uikit-hero__cta--secondary:is(.uikit-hero__cta--outlined, .uikit-hero__cta--ghost, .uikit-hero__cta--link) {
		--uikit-hero-cta-border-color: #a8a8a8;
		--uikit-hero-cta-bg-hover: #f2f2f2;
	}

	.uikit-hero__cta:hover {
		background: var(--uikit-hero-cta-bg-hover);
		--uikit-hero-cta-border-color: #e5e6e7;
		border-color: var(--uikit-hero-cta-border-color-hover);
	}

	.uikit-hero__cta:focus-visible {
		background: var(--uikit-hero-cta-bg-focus);
		border-color: var(--uikit-hero-cta-border-color-focus);
		outline: 2px dotted #333;
		outline-offset: 2px;
	}

  /* Responsive container queries */
  @container (max-width: 767px) {
    .uikit-hero {
      --uikit-hero-content-span: var(--uikit-hero-columns);
      --uikit-hero-content-start: 1;
      --uikit-hero-padding: 1.5rem;
    }

    .uikit-hero__ctas {
      flex-direction: column;
      align-items: stretch;
    }

    .uikit-hero__cta {
      justify-content: center;
    }
  }

  @container (min-width: 768px) and (max-width: 1023px) {
    .uikit-hero {
      --uikit-hero-content-span: min(var(--uikit-hero-content-span), 6);
    }
  }

  /* Fallback media queries for browsers without container query support */
  @supports not (container-type: inline-size) {
    @media (max-width: 767px) {
      .uikit-hero {
        --uikit-hero-content-span: var(--uikit-hero-columns);
        --uikit-hero-content-start: 1;
        --uikit-hero-padding: 1.5rem;
      }

      .uikit-hero__ctas {
        flex-direction: column;
        align-items: stretch;
      }

      .uikit-hero__cta {
        justify-content: center;
      }
    }
  }

  /* Utility classes for common alignment patterns */
  .uikit-hero[data-device="mobile"] {
    --uikit-hero-content-h-align: center;
    --uikit-hero-text-align: center;
    --uikit-hero-cta-justify: center;
  }
</style>