<script lang="ts">
	import { type Snippet } from "svelte";

	type Props = {
		children?: Snippet;
		title?: string;
		headingId?: string;
		headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
		maxColumns?: number;
		gap?: string;
		containerGap?: string;
	};
	
	let {
		children,
		title = "Featured Categories",
		headingId = "featured-categories-heading",
		headingLevel = 2,
		maxColumns,
		gap,
		containerGap
	}: Props = $props();

	const HeadingTag = `h${headingLevel}` as const;
</script>

<section 
	class="uikit-featured-categories"
	aria-labelledby={headingId}
	style:--uikit-featured-categories-gap={gap}
	style:--uikit-featured-categories-container-gap={containerGap}
	style:--uikit-featured-categories-max-columns={maxColumns}
>
	<header class="uikit-featured-categories__header">
		<svelte:element 
			this={HeadingTag}
			id={headingId}
			class="uikit-featured-categories__heading"
		>
			Featured Categories
		</svelte:element>
	</header>
	<nav
		class="uikit-featured-categories__container"
		aria-label="Browse main product categories"
	>
		{@render children?.()}
	</nav>
</section>

<style>
	:root {
		--uikit-featured-categories-gap: 0.5rem;
		--uikit-featured-categories-container-gap: 1rem;
		--uikit-featured-categories-max-columns: 6;
	}
	
	.uikit-featured-categories {
		display: grid;
		gap: var(--uikit-featured-categories-gap);
		max-width: 1200px;
		min-width: 320px;
		container-type: inline-size;
		font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
	}
	
	.uikit-featured-categories__header {
		height: 2rem;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.uikit-featured-categories__heading {
		margin: 0;
	  line-height: 1;
	  font-weight: 600;
	  font-size: 1.4rem;
		letter-spacing: .03em;
	}
	
	.uikit-featured-categories__container {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--uikit-featured-categories-container-gap);
	}

	@container (min-width: 768px) {
		.uikit-featured-categories__container {
			grid-template-columns: repeat(var(--uikit-featured-categories-max-columns), 1fr);
		}
	}
	
	@supports not (container-type: inline-size) {
		@media(min-width: 768px) {
			.uikit-featured-categories__container {
				grid-template-columns: repeat(var(--uikit-featured-categories-max-columns), 1fr);
			}
		}
	}
</style>