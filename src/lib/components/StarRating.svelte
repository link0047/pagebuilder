<script lang="ts">
	import { generateId } from "$lib/utils/unique-id-generator";

	type Props = {
		rating?: number;
		maxRating?: number;
	}

	let {
    rating = 0,
    maxRating = 5,
  }: Props = $props();

	const uid = generateId("star-rating");
	const id = `uikit-starrating-${uid}`;
	const titleId = `${id}-title`;
	const descId = `${id}-desc`;
	const gradientId = `${id}-partial`;

	// Derived state
	const validatedRating = $derived(Math.max(0, Math.min(rating, maxRating)));
	const integerPart = $derived(Math.floor(validatedRating));
	const decimalPart = $derived(validatedRating - integerPart);
	const gradientPercent = $derived(+(decimalPart * 100).toFixed(2));
	const starIndices = $derived(Array.from({ length: maxRating }, (_, i) => i));
	const viewBoxWidth = $derived(24 * maxRating);

	// Warn on invalid rating in dev
	$effect(() => {
		const clamped = Math.max(0, Math.min(rating, maxRating));
		if (clamped !== rating) {
			console.warn(`[StarRating] Rating ${rating} out of bounds. Clamped to ${clamped}.`);
		}
	});

	function getStarFill(index: number): string {
		const starNumber = index + 1;

		// Partial star: this is the star being partially filled
		if (starNumber === Math.ceil(validatedRating) && decimalPart > 0) {
			return `url("#${gradientId}")`;
		}

		return validatedRating >= starNumber ? "currentColor" : "transparent";
	}

	function getRatingDescription(): string {
		const full = integerPart;
		const partial = decimalPart > 0;
		const empty = maxRating - Math.ceil(validatedRating);

		const parts = [
			`${full} full star${full !== 1 ? "s" : ""}`,
			partial ? "1 partial star" : null,
			empty > 0 ? `${empty} empty star${empty !== 1 ? "s" : ""}` : null,
		].filter(Boolean);

		return `${parts.join(", ")} out of ${maxRating} total stars.`;
	}
</script>

<svg
	class="uikit-starrating"
	role="img"
	viewBox="0 0 {viewBoxWidth} 24"
	aria-labelledby="{titleId} {descId}"
>
	<title id={titleId}>Rating: {validatedRating} out of {maxRating}</title>
	<desc id={descId}>{getRatingDescription()}</desc>

	<defs>
		<!--
			Single reusable gradient for the partial star.
			gradientPercent is the exact decimal percentage (e.g. 73.00 for 0.73).
			x1/x2 drive horizontal fill; y1/y2 kept at 0 for a clean left-to-right sweep.
		-->
		<linearGradient id={gradientId} x1="0" x2="1" y1="0" y2="0" gradientUnits="objectBoundingBox">
			<stop offset="{gradientPercent}%" stop-color="currentColor" />
			<stop offset="{gradientPercent}%" stop-color="transparent" />
		</linearGradient>
	</defs>

	{#each starIndices as index (index)}
		<g>
			<!-- Outline/empty star shape -->
			<path class="star-outline" d="M{12 + 24 * index},15.9l-3.8,2.3l1-4.3L{5.9 + 24 * index},11l4.4-0.4l1.7-4l1.7,4l4.4,0.4l-3.3,2.9l1,4.3 M{22 + 24 * index},9.7l-7.2-0.6L{12 + 24 * index},2.5L{9.2 + 24 * index},9.1L{2 + 24 * index},9.7l5.4,4.7l-1.6,7l6.2-3.7l6.2,3.7l-1.6-7L{22 + 24 * index},9.7z"
			/>
			<!-- Fill layer -->
			<path fill={getStarFill(index)} d="M{12 + 24 * index},17.8l6.2,3.7l-1.6-7L{22 + 24 * index},9.7l-7.2-0.6L{12 + 24 * index},2.5L{9.2 + 24 * index},9.1L{2 + 24 * index},9.7l5.4,4.7l-1.6,7L{12 + 24 * index},17.8z"
			/>
		</g>
	{/each}
</svg>

<style>
	:root {
		--uikit-starrating-size: 1.5rem;
		--uikit-starrating-fill-color: gold;
		--uikit-starrating-stroke-color: #ccc;
	}

	.uikit-starrating {
		height: var(--uikit-starrating-size);
		color: var(--uikit-starrating-fill-color);
	}

	.uikit-starrating .star-outline {
		fill: var(--uikit-starrating-stroke-color);
	}
</style>