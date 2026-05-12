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
	  --uikit-icon-width: 1.5rem;
	  --uikit-icon-height: 1.5rem;
		--uikit-icon-fill: currentcolor;
		--uikit-icon-stroke: none;

		display: inline-block;
		vertical-align: middle;
		width: var(--uikit-icon-width);
		height: var(--uikit-icon-height);
		fill: var(--uikit-icon-fill);
  	stroke: var(--uikit-icon-stroke);
		flex-shrink: 0;
	}
</style>
