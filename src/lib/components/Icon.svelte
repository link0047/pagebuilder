<script lang="ts">
	import { type Snippet } from "svelte";

	type Props = {
		viewBox?: string;
		children?: Snippet;
		size?: string | null;
		"aria-label"?: string;
		[key: string]: unknown;
	};
	
	 let { 
		 viewBox = "0 0 24 24",
		 children,
		 size,
		 ...restProps
	 }: Props = $props();

	 const hasAccessibleLabel = restProps["aria-label"] || restProps["aria-labelledby"];
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	class="icon"
	{viewBox}
	{...restProps}
	aria-hidden={hasAccessibleLabel ? undefined : "true"}
	role={hasAccessibleLabel ? "img" : undefined}
	style:--uikit-icon-width={size}
	style:--uikit-icon-height={size}
>
	{@render children?.()}
</svg>

<style>	
	.icon {
		width: var(--uikit-icon-width, 1.5rem);
		height: var(--uikit-icon-height, 1.5rem);
		fill: var(--uikit-icon-fill, currentcolor);
  	stroke: var(--uikit-icon-stroke, none);
	}
</style>