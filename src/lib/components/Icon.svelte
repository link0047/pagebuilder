<script lang="ts">
	import { type Snippet } from "svelte";

	type Props = {
		viewBox?: string;
		children?: Snippet;
		size?: string | null;
		[key: string]: unknown;
	};
	
	 let { 
		 viewBox = "0 0 24 24",
		 children,
		 size,
		 ...restProps
	 }: Props = $props();
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	class="icon"
	{viewBox}
	style:--uikit-icon-width={size}
	style:--uikit-icon-height={size}
	{...restProps}
>
	{@render children?.()}
</svg>

<style>
  :root {
		--uikit-icon-width: 1.5rem;
		--uikit-icon-height: 1.5rem;
		--uikit-icon-fill: currentcolor;
	}
	
	.icon {
		width: var(--uikit-icon-width);
		height: var(--uikit-icon-height);
		fill: var(--uikit-icon-fill);
	}
</style>