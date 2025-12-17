<script lang="ts">
	import { type Snippet } from "svelte";
	import { getCarouselState } from "./carousel-state.svelte";

	type Props = {
		children?: Snippet;
	};
	
	let {
		children
	}: Props = $props();

	const carousel = getCarouselState();
	const slideNumber = carousel.registerSlide();
	const isActive = $derived(carousel.currentSlide === slideNumber);
</script>

<div
	class="uikit-carousel__item" 
	class:uikit-carousel__item--active={isActive}
	role="group" 
	aria-roledescription="slide" 
	aria-label={`${slideNumber} of ${carousel.totalSlides}`}
>
	{@render children?.()}
</div>

<style>
	.uikit-carousel__item {
		position: relative;
		padding: .5rem;
		border: 1px solid #eeeeec;
		border-radius: .25rem;
		background-color: #f2f2f2;
		contain: content;
		scroll-snap-align: start;
		scroll-snap-stop: always;
		transition: border-color .2s ease-in-out;
		cursor: pointer;
	}

	.uikit-carousel__item:hover {
		border-color: #e1e1e1;
	}
</style>