<script lang="ts">
	import { type Snippet, onMount, untrack } from "svelte";
	import Icon from "./Icon.svelte";
	import { setCarouselState, type Breakpoint } from "./carousel-state.svelte";

	type Props = {
		label?: string;
		slidesPerView?: number;
		slidesPerGroup?: number;
		spaceBetween?: string;
		startingIndex?: number;
		breakpoints?: Record<string, Breakpoint>;
		children?: Snippet;
	};

	let {
		label,
		slidesPerView = 2,
		slidesPerGroup = 1,
		spaceBetween = "1rem",
		startingIndex = 1,
		breakpoints,
		children
	}: Props = $props();

	let trackRef: HTMLElement;

	const carouselState = setCarouselState({
		slidesPerView: untrack(() => slidesPerView),
		slidesPerGroup: untrack(() => slidesPerGroup),
		startingIndex: untrack(() => startingIndex),
		breakpoints: untrack(() => breakpoints)
	});
	const id = carouselState.id;
	const trackId = carouselState.trackId;

	onMount(() => {
		carouselState.trackElement = trackRef;

		return () => {
			carouselState.destroy();
		};
	});
</script>

<section
	{id}
	class="wcag-ui-carousel"
	style:--wcag-ui-carousel-slide-per-view={carouselState.slidesPerView}
	style:--wcag-ui-carousel-space-between={carouselState.spaceBetween}
	aria-roledescription="carousel"
	aria-label={label}
>
	<div class="wcag-ui-carousel__status" role="status" aria-live="polite" aria-atomic="true">
		Slide {carouselState.currentSlide} of {carouselState.totalSlides}
	</div>
	<div class="wcag-ui-carousel__controls">
		<button
			type="button"
			class="wcag-ui-carousel__button wcag-ui-carousel__button--prev"
			aria-label="Previous Slide"
			aria-controls={trackId}
			disabled={carouselState.isAtStart}
			onclick={() => carouselState.prev()}
		>
			<Icon viewBox="0 0 12 24">
				<path d="M6.5,22.7c.2.5.6.8,1.1.8.8,0,1.3-.6,1.3-1.3s-.2-.9-.3-1.2l-3.5-9,3.5-9c.1-.3.3-.8.3-1.2,0-.7-.5-1.3-1.3-1.3,0,0,0,0,0,0-.5,0-.9.3-1.1.8l-3.5,8.8c-.2.6-.5,1.3-.5,1.9s.3,1.3.5,1.9l3.5,8.8h0Z" />
			</Icon>
		</button>
		<button
			type="button"
			class="wcag-ui-carousel__button wcag-ui-carousel__button--next"
			aria-label="Next Slide"
			aria-controls={trackId}
			disabled={carouselState.isAtEnd}
			onclick={() => carouselState.next()}
		>
			<Icon viewBox="0 0 12 24">
				<path d="M5,22.7c-.2.5-.6.8-1.1.8-.8,0-1.3-.6-1.3-1.3s.2-.9.3-1.2l3.5-9L2.9,3c-.1-.3-.3-.8-.3-1.2,0-.7.5-1.3,1.3-1.3,0,0,0,0,0,0,.5,0,.9.3,1.1.8l3.5,8.8c.2.6.5,1.3.5,1.9s-.3,1.3-.5,1.9l-3.5,8.8h0Z" />
			</Icon>
		</button>
	</div>
	<div class="wcag-ui-carousel__viewport">
		<div class="wcag-ui-carousel__track" id={trackId} bind:this={trackRef}>
			{@render children?.()}
		</div>
	</div>
</section>

<style>
	.wcag-ui-carousel {
	--wcag-ui-carousel-z-default: 999;
	--wcag-ui-carousel-button-width: 2rem;
	--wcag-ui-carousel-controls-gap: .25rem;
	--wcag-ui-carousel-slide-per-view: 2;
	--wcag-ui-carousel-space-between: 1rem;

		position: relative;
		box-sizing: border-box;
		user-select: none;
	  -webkit-user-drag: none;
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
		padding-inline: calc(var(--wcag-ui-carousel-button-width) + var(--wcag-ui-carousel-controls-gap));
	}

	.wcag-ui-carousel__track {
		box-sizing: border-box;
		display: grid;
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
		color: #212121;
		align-items: center;
		justify-content: center;
		width: var(--wcag-ui-carousel-button-width);
		height: calc(var(--wcag-ui-carousel-button-width) * 2);
		position: absolute;
		top: 50%;
		z-index: var(--wcag-ui-carousel-z-default);
	  transform: translateY(-50%);
		background-color: transparent;
		cursor: pointer;
		transition: border-color .2s ease-in-out, background-color .2s ease-in-out, opacity .2s ease-in-out;
		opacity: 0;
		pointer-events: none;

	  @supports (top: anchor(--name center)) {
			position-anchor: --wcag-ui-carousel-track;
	    top: anchor(--wcag-ui-carousel-track center, 50%);
	  }
	}

	.wcag-ui-carousel:hover .wcag-ui-carousel__button {
		opacity: 1;
		pointer-events: auto;
	}

	.wcag-ui-carousel__button:not(:disabled):hover {
		background-color: color-mix(in srgb, transparent 0%, rgba(0, 0, 0, 0.15));
	}

	.wcag-ui-carousel__button:disabled {
		display: none;
	}

	.wcag-ui-carousel__button--prev {
		left: 0;
	}

	.wcag-ui-carousel__button--next {
		right: 0;
	}
</style>
