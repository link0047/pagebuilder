<script lang="ts">
	import Image from "./Image.svelte";

	type Props = {
		image?: string;
		width?: number;
		height?: number;
		alt?: string;
		text?: string;
		href?: string;
		ariaLabel?: string;
		[key: string]: unknown;
	};

	let {
		image,
		width = 232,
		height = 232,
		alt = "",
		text,
		href,
		ariaLabel,
		...restProps
	}: Props = $props();
</script>

<a
	class="spn-ui-featured-category"
	{href}
	aria-label={ariaLabel}
	{...restProps}
>
	<picture class="spn-ui-featured-category__media">
		<source srcset={image} media="(min-width: 561px)" />
		<Image
			src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII="
			{width}
	    {height}
	    alt={alt || `${text} category image`}
		/>
	</picture>
	<div
		class="spn-ui-featured-category__text"
		aria-hidden={ariaLabel ? "true" : undefined}
	>
		{text}
	</div>
</a>

<style>
	.spn-ui-featured-category,
	.spn-ui-featured-category:visited {
		display: flex;
		flex-flow: column nowrap;
		text-align: center;
		color: #212121;
		min-height: 2.5rem;
		align-items: center;
		justify-content: center;
		background-color: #f5f5f5;
		border-radius: .25rem;
		text-decoration: underline;
		text-decoration-color: transparent;
		transition: text-decoration-color 0.2s cubic-bezier(0.4, 0, 0.2, 1), color 0.15s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.spn-ui-featured-category__media {
		display: none;
	}

	.spn-ui-featured-category:focus-visible {
		outline: 2px dashed #212121;
	}

	.spn-ui-featured-category:hover {
		text-decoration-color: currentColor;
		color: #000;
	}

	@container (min-width: 768px) {
		.spn-ui-featured-category,
		.spn-ui-featured-category:visited  {
			background-color: transparent;
		}

		.spn-ui-featured-category__media {
			display: block;
		}

		.spn-ui-featured-category {
			background-color: #fff;
		}

		.spn-ui-featured-category__text {
			font-size: .9375rem;
			font-weight: 500;
		}
	}

	@media (prefers-contrast: high) {
	  .spn-ui-featured-category:focus-visible {
	    outline-style: solid;
	    outline-width: 3px;
	    outline-offset: 2px;
	  }
	}

	@media (prefers-reduced-motion: reduce) {
		.spn-ui-featured-category {
			transition: none;
		}
	}
</style>
