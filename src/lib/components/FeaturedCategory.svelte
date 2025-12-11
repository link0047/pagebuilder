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
	class="uikit-featured-category"
	{href}
	aria-label={ariaLabel}
	{...restProps}
>
	<picture class="uikit-featured-category__media">
		<source srcset={image} media="(min-width: 561px)" />
		<Image
			src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII="
			{width} 
	    {height} 
	    alt={alt || `${text} category image`} 
		/>
	</picture>
	<div
		class="uikit-featured-category__text"
		aria-hidden={ariaLabel ? "true" : null}
	>
		{text}
	</div>
</a>

<style>
	.uikit-featured-category,
	.uikit-featured-category:visited {
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

	.uikit-featured-category__media {
		display: none;
	}

	.uikit-featured-category:focus-visible {
		outline: 2px dashed #212121;
	}

	.uikit-featured-category:hover {
		text-decoration-color: currentColor;
		color: #000;
	}

	@container (min-width: 768px) {
		.uikit-featured-category,
		.uikit-featured-category:visited  {
			background-color: transparent;
		}

		.uikit-featured-category__media {
			display: block;
		}

		.uikit-featured-category {
			background-color: #fff;
		}

		.uikit-featured-category__text {
			font-size: 1.375rem;
		}
	}

	@media (prefers-contrast: high) {
	  .uikit-featured-category:focus-visible {
	    outline-style: solid;
	    outline-width: 3px;
	    outline-offset: 2px;
	  }
	}

	@media (prefers-reduced-motion: reduce) {
		.uikit-featured-category {
			transition: none;
		}
	}
</style>