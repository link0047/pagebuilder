<script lang="ts">
	import type { Snippet } from "svelte";
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
	class="wcag-ui-carousel__item"
	class:wcag-ui-carousel__item--active={isActive}
	role="group"
	aria-roledescription="slide"
	aria-label={`${slideNumber} of ${carousel.totalSlides}`}
	data-wcag-ui-carousel-slide
>
	{@render children?.()}
</div>

<style>
	.wcag-ui-carousel__item {
		position: relative;
		contain: content;
		scroll-snap-align: start;
		scroll-snap-stop: always;
		transition: border-color .2s ease-in-out;
	}
</style>
