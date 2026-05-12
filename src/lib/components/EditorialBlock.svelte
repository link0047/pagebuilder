<script lang="ts">
	import { type Snippet } from "svelte";
	import Image from "./Image.svelte";

	type TitleAlignment = "left" | "center" | "right";
	type ImagePosition = "above" | "below" | "overlay";
	type OverlayPosition = "top-left" | "top-center" | "top-right" | "center-left" | "center" | "center-right" | "bottom-left" | "bottom-center" | "bottom-right";

	type Props = {
		children?: Snippet,
		title?: string,
		titleAlignment?: TitleAlignment,
		backgroundColor?: string | null,
		imageURL?: string,
	}

	const DIMENSIONS = {
		width: 1400,
		height: 260
	} as const;

	let {
		children,
		title,
		titleAlignment = "left",
		backgroundColor = null,
		imageURL,
	}: Props = $props();
</script>

<section
	class="spn-ui-editorial-block"
	style:--spn-ui-editorialblock-background={backgroundColor}
>
	{#if title}
		<header
			class="spn-ui-editorial-block__header"
			class:spn-ui-editorial-block__header--alignment-center={titleAlignment === "center"}
			class:spn-ui-editorial-block__header--alignment-right={titleAlignment === "right"}
		>
			<h2 class="spn-ui-editorial-block__title">
				{title}
			</h2>
			{#if imageURL}
				<div class="spn-ui-editorial-block__hero-image">
				<picture class="spn-ui-editorial-block__media">
						<Image src={imageURL} width={DIMENSIONS.width} height={DIMENSIONS.height} alt="" />
					</picture>
				</div>
			{/if}
		</header>
	{/if}
	<div class="spn-ui-editorial-block__container">
		{@render children?.()}
	</div>
</section>

<style>
	:root {
		--spn-ui-editorialblock-columns: 12;
		--spn-ui-editorialblock-gap: 1rem;
		--spn-ui-editorialblock-background: #fff;
	}

	.spn-ui-editorial-block {
		max-width: 1400px;
		width: 100%;
		display: grid;
		gap: 1rem;
		container-type: inline-size;
		background-color: var(--spn-ui-editorialblock-background);
		padding-bottom: 1rem;
	}

	.spn-ui-editorial-block__header {
		display: grid;
	}

	.spn-ui-editorial-block__title {
		margin: 0;
		line-height: 1.2;
		font-weight: 600;
		font-size: 1.75rem;
	}

	.spn-ui-editorial-block__header--alignment-center {
		text-align: center;
	}

	.spn-ui-editorial-block__header--alignment-right {
		text-align: right;
	}

	.spn-ui-editorial-block__hero-image {
		width: 100%;
	}

	.spn-ui-editorial-block__container {
		display: grid;
		grid-template-columns: repeat(var(--spn-ui-editorialblock-columns), 1fr);
		gap: var(--spn-ui-editorialblock-gap);
	}
</style>
