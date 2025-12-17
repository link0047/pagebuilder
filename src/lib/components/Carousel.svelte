<script lang="ts">
	import { type Snippet, onMount, untrack } from "svelte";
	import Icon from "./Icon.svelte";
	import { setCarouselState } from "./carousel-state.svelte";

	type Props = {
		label?: string;
		slidesPerView?: number;
		spaceBetween?: string;
		startingIndex?: number;
		children?: Snippet;
	};
	
	let {
		label,
		slidesPerView = 2,
		spaceBetween = "1rem",
		startingIndex = 1,
		children
	} = $props();

	let trackRef: HTMLElement;
	
	const carouselState = setCarouselState({ 
		slidesPerView: untrack(() => slidesPerView), 
		startingIndex: untrack(() => startingIndex)
	});
	const id = carouselState.id;
	const trackId = carouselState.trackId;

	onMount(() => {
		carouselState.trackElement = trackRef;
	})
</script>

<section
	{id}
	class="uikit-carousel"
	style:--uikit-carousel-slide-per-view={slidesPerView}
	style:--uikit-carousel-space-between={spaceBetween}
	aria-roledescription="carousel"
	aria-label={label}
>
	<div class="uikit-carousel__status" role="status" aria-live="polite" aria-atomic="true">
		Slide {carouselState.currentSlide} of {carouselState.totalSlides}
	</div>
	<div class="uikit-carousel__controls">
		<button
			type="button"
			class="uikit-carousel__button uikit-carousel__button--prev"
			aria-label="Previous Slide"
			aria-controls={trackId}
			disabled={carouselState.isAtStart}
			onclick={() => carouselState.prev()}
		>
			<Icon viewBox="0 0 12 24">
				<path d="M6.5,22.7c.2.5.6.8,1.1.8.8,0,1.3-.6,1.3-1.3s-.2-.9-.3-1.2l-3.5-9,3.5-9c.1-.3.3-.8.3-1.2,0-.7-.5-1.3-1.3-1.3,0,0,0,0,0,0-.5,0-.9.3-1.1.8l-3.5,8.8c-.2.6-.5,1.3-.5,1.9s.3,1.3.5,1.9l3.5,8.8h0Z"/>
			</Icon>
		</button>
		<button
			type="button"
			class="uikit-carousel__button uikit-carousel__button--next"
			aria-label="Next Slide"
			aria-controls={trackId}
			disabled={carouselState.isAtEnd}
			onclick={() => carouselState.next()}
		>
			<Icon viewBox="0 0 12 24">
				<path d="M5,22.7c-.2.5-.6.8-1.1.8-.8,0-1.3-.6-1.3-1.3s.2-.9.3-1.2l3.5-9L2.9,3c-.1-.3-.3-.8-.3-1.2,0-.7.5-1.3,1.3-1.3,0,0,0,0,0,0,.5,0,.9.3,1.1.8l3.5,8.8c.2.6.5,1.3.5,1.9s-.3,1.3-.5,1.9l-3.5,8.8h0Z"/>
			</Icon>
		</button>
	</div>
	<div class="uikit-carousel__viewport">
		<div class="uikit-carousel__track" id={trackId} bind:this={trackRef}>
			{@render children?.()}
		</div>
	</div>
</section>

<style>	
	.uikit-carousel {
		--uikit-carousel-slide-per-view: 2;
		--uikit-carousel-space-between: 1rem;

		position: relative;
	}

	.uikit-carousel__status {
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
	
	.uikit-carousel__controls {}
	.uikit-carousel__viewport {}
	.uikit-carousel__track {
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
		grid-auto-columns: calc((100% - (var(--uikit-carousel-slide-per-view) - 1) * var(--uikit-carousel-space-between)) / var(--uikit-carousel-slide-per-view));
		grid-template-rows: repeat(1, max-content);
		column-gap: var(--uikit-carousel-space-between);
		row-gap: 0;
	}

	.uikit-carousel__track::-webkit-scrollbar {
		display: none;
	}
</style>