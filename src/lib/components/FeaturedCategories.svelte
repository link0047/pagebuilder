<script lang="ts">
	import { type Snippet } from "svelte";

	type Props = {
		children?: Snippet;
		title?: string;
		titleAlignment?: "left" | "center" | "right";
		headingId?: string;
		headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
		maxColumns?: number;
		gap?: string;
		containerGap?: string;
	};

	let {
		children,
		title = "Featured Categories",
		titleAlignment = "center",
		headingId = "featured-categories-heading",
		headingLevel = 2,
		maxColumns,
		gap,
		containerGap
	}: Props = $props();

	const HeadingTag = $derived(`h${headingLevel}`);
</script>

<section
	class="spn-ui-featured-categories"
	aria-labelledby={headingId}
	style:--spn-ui-featured-categories-title-align={titleAlignment}
	style:--spn-ui-featured-categories-gap={gap}
	style:--spn-ui-featured-categories-container-gap={containerGap}
	style:--spn-ui-featured-categories-max-columns={maxColumns}
>
	<header class="spn-ui-featured-categories__header">
		<svelte:element
			this={HeadingTag}
			id={headingId}
			class="spn-ui-featured-categories__heading"
		>
			{title}
		</svelte:element>
	</header>
	<nav
		class="spn-ui-featured-categories__container"
		aria-label="Browse main product categories"
	>
		{@render children?.()}
	</nav>
</section>

<style>
	:root {
		--spn-ui-featured-categories-title-align: center;
		--spn-ui-featured-categories-gap: 0.5rem;
		--spn-ui-featured-categories-container-gap: .5rem;
		--spn-ui-featured-categories-max-columns: 6;
		--spn-ui-featured-categories-padding-block: 0;
	}

	.spn-ui-featured-categories {
		display: grid;
		gap: var(--spn-ui-featured-categories-gap);
		max-width: 1400px;
		min-width: 320px;
		container-type: inline-size;
		font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
		padding-block: var(--spn-ui-featured-categories-padding-block);
	}

	.spn-ui-featured-categories__header {
		height: 2rem;
		display: flex;
		align-items: center;
		justify-content: var(--spn-ui-featured-categories-title-align);
	}

	.spn-ui-featured-categories__heading {
		margin: 0;
	  line-height: 1;
	  font-weight: 600;
	  font-size: 1.4rem;
		letter-spacing: .03em;
	}

	.spn-ui-featured-categories__container {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--spn-ui-featured-categories-container-gap);
	}

	@container (min-width: 768px) {
		.spn-ui-featured-categories {
		  --spn-ui-featured-categories-padding-block: 1rem;
		  --spn-ui-featured-categories-container-gap: 1rem;
		}

		.spn-ui-featured-categories__container {
			grid-template-columns: repeat(var(--spn-ui-featured-categories-max-columns), 1fr);
		}
	}

	@supports not (container-type: inline-size) {
		@media(min-width: 768px) {
			.spn-ui-featured-categories {
			  --spn-ui-featured-categories-padding-block: 1rem;
			  --spn-ui-featured-categories-container-gap: 1rem;
			}

			.spn-ui-featured-categories__container {
				grid-template-columns: repeat(var(--spn-ui-featured-categories-max-columns), 1fr);
			}
		}
	}
</style>
