<script lang="ts">
	import { type Snippet, onMount, untrack } from "svelte";
	import Icon from "./Icon.svelte";
	import { setCarouselState, type Breakpoint } from "./carousel-state.svelte";
	import DotIndicator from "./DotIndicator.svelte";

	type PaginationVariant = "dots" | "pill" | "fraction";
	type PaginationVertical = "top" | "bottom";
	type PaginationHorizontal = "start" | "center" | "end";

	type PaginationPlacement = {
		vertical?: PaginationVertical;
		horizontal?: PaginationHorizontal;
		overlay?: boolean;
	};

	type PaginationOptions = {
		variant?: PaginationVariant;
		dynamicDots?: boolean;
		placement?: PaginationPlacement;
	};

	type ControlsMode = "inline" | "overlay" | "grouped";
	type ControlsVertical = "top" | "center" | "bottom";

	type ControlsPlacement = {
		mode: ControlsMode;
		// vertical and inset apply to overlay mode only.
		vertical?: ControlsVertical;
		inset?: string;
		// persistent: disabled arrows stay (dimmed) instead of being removed.
		persistent?: boolean;
		// hoverReveal: arrows appear on hover instead of being always visible.
		hoverReveal?: boolean;
		// placement: positions the shared < dots > row — grouped mode only.
		placement?: PaginationPlacement;
	};

	type IconSnippet = Snippet<[{ disabled: boolean }]>;

	type Props = {
		label?: string;
		slidesPerView?: number;
		slidesPerGroup?: number;
		gap?: string;
		startingIndex?: number;
		breakpoints?: Record<string, Breakpoint>;
		pagination?: boolean | PaginationOptions;
		controls?: boolean | ControlsPlacement;
		equalHeight?: "auto" | "uniform" | (string & {});
		equalHeightSamples?: number;
		prevIcon?: IconSnippet;
		nextIcon?: IconSnippet;
		children?: Snippet;
	};

	let {
		label,
		slidesPerView = 2,
		slidesPerGroup = 1,
		gap = "1rem",
		startingIndex = 1,
		breakpoints,
		pagination = true,
		controls = true,
		equalHeight,
		equalHeightSamples,
		prevIcon,
		nextIcon,
		children
	}: Props = $props();

	const paginationConfig = $derived.by(() => {
		if (pagination === false) return null;
		const defaults = {
			variant: "dots" as PaginationVariant,
			dynamicDots: true,
			placement: {
				vertical: "bottom" as PaginationVertical,
				horizontal: "center" as PaginationHorizontal,
				overlay: false
			}
		};
		if (pagination === true) return defaults;
		return {
			...defaults,
			...pagination,
			// Merge placement one level deeper so a partial placement from the
			// caller doesn't clobber the unspecified axes.
			placement: { ...defaults.placement, ...pagination.placement }
		};
	});

	const controlsConfig = $derived.by(() => {
		if (controls === false) return null;
		const defaults = {
			mode: "inline" as ControlsMode,
			vertical: "center" as ControlsVertical,
			inset: "var(--wcag-ui-carousel-controls-gap)",
			persistent: false,
			hoverReveal: true,
			placement: undefined as PaginationPlacement | undefined
		};
		const merged = controls === true ? defaults : { ...defaults, ...controls };
		// Grouped arrows live in a fixed row: hiding one would reflow the row,
		// and a row that only appears on hover would be odd.
		if (merged.mode === "grouped") {
			merged.persistent = true;
			merged.hoverReveal = false;
		}
		return merged;
	});

	// In grouped mode the arrows travel with the pagination, so the standalone
	// arrows are suppressed and rendered inside the shared row instead.
	const grouped = $derived(controlsConfig?.mode === "grouped");

	// Grouped mode needs a row to live in even if pagination itself is off.
	const showControlsRow = $derived(!!paginationConfig || grouped);

	// Standalone (track-relative) arrows only render for inline/overlay.
	const showTrackArrows = $derived(
		controlsConfig?.mode === "inline" || controlsConfig?.mode === "overlay"
	);

	// Placement owner depends on mode: grouped -> the shared row is a controls
	// concern; otherwise the dots row is positioned by pagination.
	const placement = $derived.by(() => {
		const fallback = {
			vertical: "bottom" as PaginationVertical,
			horizontal: "center" as PaginationHorizontal,
			overlay: false
		};
		if (grouped) {
			return { ...fallback, ...controlsConfig?.placement };
		}
		return paginationConfig?.placement ?? fallback;
	});

	let trackRef: HTMLElement;

	const carouselState = setCarouselState({
		slidesPerView: untrack(() => slidesPerView),
		slidesPerGroup: untrack(() => slidesPerGroup),
		startingIndex: untrack(() => startingIndex),
		breakpoints: untrack(() => breakpoints),
		gap: untrack(() => gap),
	});
	const id = carouselState.id;
	const trackId = carouselState.trackId;

	onMount(() => {
		carouselState.trackElement = trackRef;

		return () => {
			carouselState.destroy();
		};
	});

	// Re-run equal-height whenever the mode, sample count, slide count, or
	// slidesPerView (column width) changes. This single reactive trigger replaces
	// the web component's separate attribute/slotchange/breakpoint re-runs.
	$effect(() => {
		// Touch the reactive deps so the effect re-runs when they change.
		void carouselState.totalSlides;
		void carouselState.slidesPerView;
		carouselState.setEqualHeight(equalHeight, equalHeightSamples);
	});
</script>

{#snippet defaultPrevIcon()}
	{#if grouped}
		<Icon viewBox="0 0 24 24">
			<path d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z" />
		</Icon>
	{:else}
		<Icon viewBox="0 0 12 24">
			<path d="M6.5,22.7c.2.5.6.8,1.1.8.8,0,1.3-.6,1.3-1.3s-.2-.9-.3-1.2l-3.5-9,3.5-9c.1-.3.3-.8.3-1.2,0-.7-.5-1.3-1.3-1.3,0,0,0,0,0,0-.5,0-.9.3-1.1.8l-3.5,8.8c-.2.6-.5,1.3-.5,1.9s.3,1.3.5,1.9l3.5,8.8h0Z" />
		</Icon>
	{/if}
{/snippet}

{#snippet defaultNextIcon()}
	{#if grouped}
		<Icon viewBox="0 0 24 24">
			<path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
		</Icon>
	{:else}
		<Icon viewBox="0 0 12 24">
			<path d="M5,22.7c-.2.5-.6.8-1.1.8-.8,0-1.3-.6-1.3-1.3s.2-.9.3-1.2l3.5-9L2.9,3c-.1-.3-.3-.8-.3-1.2,0-.7.5-1.3,1.3-1.3,0,0,0,0,0,0,.5,0,.9.3,1.1.8l3.5,8.8c.2.6.5,1.3.5,1.9s-.3,1.3-.5,1.9l-3.5,8.8h0Z" />
		</Icon>
	{/if}
{/snippet}

{#snippet prevButton()}
	<button
		type="button"
		class="wcag-ui-carousel__button wcag-ui-carousel__button--prev"
		aria-label="Previous Slide"
		aria-controls={trackId}
		disabled={carouselState.isAtStart}
		onclick={() => carouselState.prev()}
	>
		{#if prevIcon}
			{@render prevIcon({ disabled: carouselState.isAtStart })}
		{:else}
			{@render defaultPrevIcon()}
		{/if}
	</button>
{/snippet}

{#snippet nextButton()}
	<button
		type="button"
		class="wcag-ui-carousel__button wcag-ui-carousel__button--next"
		aria-label="Next Slide"
		aria-controls={trackId}
		disabled={carouselState.isAtEnd}
		onclick={() => carouselState.next()}
	>
		{#if nextIcon}
			{@render nextIcon({ disabled: carouselState.isAtEnd })}
		{:else}
			{@render defaultNextIcon()}
		{/if}
	</button>
{/snippet}

{#snippet paginationBody()}
	{#if paginationConfig?.variant === "fraction"}
		<div class="wcag-ui-carousel__fraction" aria-hidden="true">
			{carouselState.currentPage + 1} / {carouselState.totalPages}
		</div>
	{:else if paginationConfig}
		<div class="wcag-ui-carousel__dots">
			<DotIndicator
				activeShape={paginationConfig.variant === "pill" ? "pill" : "dot"}
				dynamic={paginationConfig.dynamicDots}
				count={carouselState.totalPages}
				color="dark"
				activeIndex={carouselState.currentPage}
			/>
		</div>
	{/if}
{/snippet}

<section
	{id}
	class="wcag-ui-carousel"
	class:wcag-ui-carousel--controls-inline={controlsConfig?.mode === "inline"}
	class:wcag-ui-carousel--controls-overlay={controlsConfig?.mode === "overlay"}
	class:wcag-ui-carousel--controls-grouped={grouped}
	class:wcag-ui-carousel--controls-persistent={controlsConfig?.persistent}
	class:wcag-ui-carousel--controls-hover-reveal={controlsConfig?.hoverReveal}
	class:wcag-ui-carousel--pagination-overlay={placement.overlay}
	style:--wcag-ui-carousel-slide-per-view={carouselState.slidesPerView}
	style:--wcag-ui-carousel-space-between={carouselState.gap}
	style:--wcag-ui-carousel-controls-inset={controlsConfig?.inset}
	data-pagination-vertical={placement.vertical}
	data-pagination-horizontal={placement.horizontal}
	data-controls-vertical={controlsConfig?.vertical}
	aria-roledescription="carousel"
	aria-label={label}
>
	<div class="wcag-ui-carousel__status" role="status" aria-live="polite" aria-atomic="true">
		Slide {carouselState.currentSlide} of {carouselState.totalSlides}
	</div>

	{#if showTrackArrows}
		{@render prevButton()}
		{@render nextButton()}
	{/if}

	<div class="wcag-ui-carousel__viewport">
		<div class="wcag-ui-carousel__track" id={trackId} bind:this={trackRef}>
			{@render children?.()}
		</div>
	</div>

	{#if showControlsRow}
		<div class="wcag-ui-carousel__controls">
			{#if grouped}
				{@render prevButton()}
				{@render paginationBody()}
				{@render nextButton()}
			{:else}
				{@render paginationBody()}
			{/if}
		</div>
	{/if}
</section>

<style>
	.wcag-ui-carousel {
	--wcag-ui-carousel-z-default: 999;
	--wcag-ui-carousel-button-width: 2rem;
	--wcag-ui-carousel-controls-gap: 0;
	--wcag-ui-carousel-controls-inset: var(--wcag-ui-carousel-controls-gap);
	--wcag-ui-carousel-slide-per-view: 2;
	--wcag-ui-carousel-space-between: 1rem;
	--wcag-ui-carousel-button-color: #212121;
	--wcag-ui-carousel-button-bg-hover: rgba(0, 0, 0, 0.15);
	--wcag-ui-carousel-transition-duration: .2s;

		position: relative;
		box-sizing: border-box;
		user-select: none;
	  -webkit-user-drag: none;
		display: flex;
		flex-direction: column;
	}

	.wcag-ui-carousel__status {
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

	.wcag-ui-carousel__viewport {
		position: relative;
		anchor-name: --wcag-ui-carousel-track;
		order: 2;
	}

	/* Inline arrows sit in reserved side gutters, so keep the padding there.
	   Overlay/grouped don't reserve gutters. */
	.wcag-ui-carousel--controls-inline .wcag-ui-carousel__viewport {
		padding-inline: calc(var(--wcag-ui-carousel-button-width) + var(--wcag-ui-carousel-controls-gap));
	}

	.wcag-ui-carousel__track {
		box-sizing: border-box;
		display: grid;
		align-items: start;
		grid-auto-flow: column;
		overflow-x: auto;
		overflow-y: hidden;
		-webkit-overflow-scrolling: touch;
		overscroll-behavior-x: none;
		scroll-behavior: smooth;
    scroll-snap-type: x mandatory;
    scrollbar-width: none;
		grid-auto-columns: calc((100% - (var(--wcag-ui-carousel-slide-per-view) - 1) * var(--wcag-ui-carousel-space-between)) / var(--wcag-ui-carousel-slide-per-view));
		grid-template-rows: repeat(1, max-content);
		column-gap: var(--wcag-ui-carousel-space-between);
		row-gap: 0;
	}

	.wcag-ui-carousel__track::-webkit-scrollbar {
		display: none;
	}

	.wcag-ui-carousel__button {
		border: 1px solid transparent;
		border-radius: .25rem;
		appearance: none;
		display: flex;
		color: var(--wcag-ui-carousel-button-color);
		align-items: center;
		justify-content: center;
		width: var(--wcag-ui-carousel-button-width);
		height: calc(var(--wcag-ui-carousel-button-width) * 2);
		background-color: transparent;
		cursor: pointer;
		transition:
			border-color var(--wcag-ui-carousel-transition-duration) ease-in-out,
			background-color var(--wcag-ui-carousel-transition-duration) ease-in-out,
			opacity var(--wcag-ui-carousel-transition-duration) ease-in-out;
	}

	/* --- Arrows: inline + overlay are positioned relative to the track --- */
	.wcag-ui-carousel--controls-inline .wcag-ui-carousel__button,
	.wcag-ui-carousel--controls-overlay .wcag-ui-carousel__button {
		position: absolute;
		top: 50%;
		z-index: var(--wcag-ui-carousel-z-default);
	  transform: translateY(-50%);

	  @supports (top: anchor(--name center)) {
			position-anchor: --wcag-ui-carousel-track;
	    top: anchor(--wcag-ui-carousel-track center, 50%);
	  }
	}

	.wcag-ui-carousel--controls-inline .wcag-ui-carousel__button--prev { left: 0; }
	.wcag-ui-carousel--controls-inline .wcag-ui-carousel__button--next { right: 0; }

	.wcag-ui-carousel--controls-overlay .wcag-ui-carousel__button--prev {
		left: var(--wcag-ui-carousel-controls-inset);
	}
	.wcag-ui-carousel--controls-overlay .wcag-ui-carousel__button--next {
		right: var(--wcag-ui-carousel-controls-inset);
	}

	/* controls vertical: overlay arrows default centered, configurable to
	   top/bottom. Inset doubles as the vertical inset when top/bottom. */
	.wcag-ui-carousel--controls-overlay[data-controls-vertical="top"] .wcag-ui-carousel__button {
		top: var(--wcag-ui-carousel-controls-inset);
		transform: none;
	}
	.wcag-ui-carousel--controls-overlay[data-controls-vertical="bottom"] .wcag-ui-carousel__button {
		top: auto;
		bottom: var(--wcag-ui-carousel-controls-inset);
		transform: none;
	}

	/* --- hoverReveal: hide arrows until the carousel is hovered --- */
	.wcag-ui-carousel--controls-hover-reveal.wcag-ui-carousel--controls-inline .wcag-ui-carousel__button,
	.wcag-ui-carousel--controls-hover-reveal.wcag-ui-carousel--controls-overlay .wcag-ui-carousel__button {
		opacity: 0;
		pointer-events: none;
	}
	.wcag-ui-carousel--controls-hover-reveal.wcag-ui-carousel--controls-inline:hover .wcag-ui-carousel__button,
	.wcag-ui-carousel--controls-hover-reveal.wcag-ui-carousel--controls-overlay:hover .wcag-ui-carousel__button {
		opacity: 1;
		pointer-events: auto;
	}

	.wcag-ui-carousel__button:not(:disabled):hover {
		background-color: var(--wcag-ui-carousel-button-bg-hover);
	}

	/* --- persistent off (default): disabled arrows are removed --- */
	.wcag-ui-carousel:not(.wcag-ui-carousel--controls-persistent) .wcag-ui-carousel__button:disabled {
		display: none;
	}

	/* --- persistent on: disabled arrows stay, dimmed and inert --- */
	.wcag-ui-carousel--controls-persistent .wcag-ui-carousel__button:disabled {
		opacity: 0.35;
		cursor: default;
		pointer-events: none;
	}

	/* Both on: keep the disabled arrow hidden at rest, dimmed on hover, so the
	   two opacity claims don't fight over source order. */
	.wcag-ui-carousel--controls-hover-reveal.wcag-ui-carousel--controls-persistent .wcag-ui-carousel__button:disabled {
		opacity: 0;
	}
	.wcag-ui-carousel--controls-hover-reveal.wcag-ui-carousel--controls-persistent:hover .wcag-ui-carousel__button:disabled {
		opacity: 0.35;
	}

	/* --- Controls row (pagination, or grouped < | dots | > ) --- */
	.wcag-ui-carousel__controls {
		display: flex;
		align-items: center;
		gap: var(--wcag-ui-carousel-controls-gap);
		width: 100%;
		box-sizing: border-box;
		padding-block: 0.5rem;
	}

	/* horizontal alignment */
	[data-pagination-horizontal="start"] .wcag-ui-carousel__controls { justify-content: flex-start; }
	[data-pagination-horizontal="center"] .wcag-ui-carousel__controls { justify-content: center; }
	[data-pagination-horizontal="end"] .wcag-ui-carousel__controls { justify-content: flex-end; }

	/* vertical placement via flex order */
	[data-pagination-vertical="top"] .wcag-ui-carousel__controls { order: 1; }
	[data-pagination-vertical="bottom"] .wcag-ui-carousel__controls { order: 3; }

	/* Grouped arrows: static in the row, always visible, and square. */
	.wcag-ui-carousel--controls-grouped .wcag-ui-carousel__controls .wcag-ui-carousel__button {
		position: static;
		transform: none;
		opacity: 1;
		pointer-events: auto;
		height: var(--wcag-ui-carousel-button-width);
	}

	/* --- Overlay pagination: float the row over the track --- */
	.wcag-ui-carousel--pagination-overlay .wcag-ui-carousel__controls {
		position: absolute;
		width: auto;
		z-index: var(--wcag-ui-carousel-z-default);
		left: 50%;
		transform: translateX(-50%);
		padding-block: 0;
	}
	.wcag-ui-carousel--pagination-overlay[data-pagination-horizontal="start"] .wcag-ui-carousel__controls {
		left: var(--wcag-ui-carousel-controls-gap);
		transform: none;
	}
	.wcag-ui-carousel--pagination-overlay[data-pagination-horizontal="end"] .wcag-ui-carousel__controls {
		left: auto;
		right: var(--wcag-ui-carousel-controls-gap);
		transform: none;
	}
	.wcag-ui-carousel--pagination-overlay[data-pagination-vertical="top"] .wcag-ui-carousel__controls {
		top: var(--wcag-ui-carousel-controls-gap);
		bottom: auto;
	}
	.wcag-ui-carousel--pagination-overlay[data-pagination-vertical="bottom"] .wcag-ui-carousel__controls {
		bottom: var(--wcag-ui-carousel-controls-gap);
		top: auto;
	}

	.wcag-ui-carousel__dots {
		display: flex;
	}

	@media (prefers-reduced-motion: reduce) {
		.wcag-ui-carousel__track {
			scroll-behavior: auto;
		}
		.wcag-ui-carousel__button {
			transition: none;
		}
	}
</style>
