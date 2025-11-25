<script lang="ts">
	import { type Snippet } from "svelte";
	import { toCSSUnit } from "$lib/utils/css";

	type Props = {
		viewBox?: string;
		children?: Snippet;
		size?: string | number | null;
		"aria-label"?: string;
		[key: string]: unknown;
	};
	
	let { 
		viewBox = "0 0 24 24",
		children,
		size,
		...restProps
	}: Props = $props();

	let hasAccessibleLabel = $derived(
    !!(restProps["aria-label"] || restProps["aria-labelledby"])
  );
	let cssSize = $derived(toCSSUnit(size));
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	class="icon"
	{viewBox}
	{...restProps}
	aria-hidden={hasAccessibleLabel ? undefined : "true"}
	role={hasAccessibleLabel ? "img" : undefined}
	style:--uikit-icon-width={cssSize}
	style:--uikit-icon-height={cssSize}
>
	{@render children?.()}
</svg>

<style>	
	.icon {
		display: inline-block;
		vertical-align: middle;
		width: var(--uikit-icon-width, 1.5rem);
		height: var(--uikit-icon-height, 1.5rem);
		fill: var(--uikit-icon-fill, currentcolor);
  	stroke: var(--uikit-icon-stroke, none);
		flex-shrink: 0;
	}
</style>