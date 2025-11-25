<script lang="ts">
	import { type Snippet } from "svelte";

	type Props = {
		children?: Snippet;
		maxWidth?: string | null;
	}
	
	 let { 
		 children,
		 maxWidth = "1200px"
	 }: Props = $props();
</script>

<main class="preview-viewport">
	<div 
		class="preview-content"
		style:--uikit-preview-max-width={maxWidth}
	>
		<div class="page">
			{@render children?.()}
		</div>
	</div>
</main>

<style>
	:root {
		--uikit-preview-max-width: 1200px;
	}

	.preview-viewport {
		grid-area: preview;
		padding: 1.5rem;
		display: inline-flex;
		justify-content: center;
		align-items: center;
		overflow: hidden;
	}
	
	.preview-content {
		width: 100%;
		overflow-y: scroll;
		max-width: var(--uikit-preview-max-width);
		height: 100%;
		max-height: 100dvh;
		background-color: #fff;
		border-radius: .5rem;
		box-shadow: 0 0 1px 0 rgba(29, 34, 40, .1), 0 2px 4px 0 rgba(29, 34, 40, .08);
	}

	.page {
		font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
		background-color: #fff;
  	direction: ltr;
		display: flex;
		flex-flow: column nowrap;
		gap: 2rem;
		padding-inline: .5rem;
	}
</style>