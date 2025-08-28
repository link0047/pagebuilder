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
		width: 1200,
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
	class="uikit-storyblock"
	style:--uikit-storyblock-background={backgroundColor}
>
	{#if title}
		<header 
			class="uikit-storyblock__header"
			class:uikit-storyblock__header--alignment-center={titleAlignment === "center"}
			class:uikit-storyblock__header--alignment-right={titleAlignment === "right"}
		>
			<h2 class="uikit-storyblock__title">
				{title}
			</h2>
			{#if imageURL}
				<div class="uikit-storyblock__hero-image">
					<picture class="uikit-storyblock__media">
						<Image src={imageURL} width={DIMENSIONS.width} height={DIMENSIONS.height} alt="" />
					</picture>
				</div>
			{/if}
		</header>
	{/if}
	<div class="uikit-storyblock__container">
		{@render children?.()}
	</div>
</section>

<style>
	:root {
		--uikit-storyblock-columns: 12;
		--uikit-storyblock-gap: 1rem;
		--uikit-storyblock-background: #fff;
	}
	
	.uikit-storyblock {
		max-width: 1200px;
		width: 100%;
		display: grid;
		gap: 1rem;
		container-type: inline-size;
		background-color: var(--uikit-storyblock-background);
		padding-bottom: 1rem;
	}

	.uikit-storyblock__header {
		display: grid;
	}
	
	.uikit-storyblock__title {
		margin: 0;
		line-height: 1.2;
		font-weight: 600;
		font-size: 1.75rem;
	}

	.uikit-storyblock__header--alignment-center {
		text-align: center;
	}
	
	.uikit-storyblock__header--alignment-right {
		text-align: right;
	}
	
	.uikit-storyblock__hero-image {
		width: 100%;
	}
	
	.uikit-storyblock__container {
		display: grid;
		grid-template-columns: repeat(var(--uikit-storyblock-columns), 1fr);
		gap: var(--uikit-storyblock-gap);
	}
</style>