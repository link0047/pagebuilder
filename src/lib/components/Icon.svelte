<script lang="ts">
	import { type Snippet } from "svelte";
	import type { SVGAttributes } from "svelte/elements";
	import { toCSSUnit } from "$lib/utils/css";

	type Props = SVGAttributes<SVGSVGElement> & {
    children?: Snippet;
    size?: string | number | null;
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
	style:--wcag-ui-icon-width={cssSize}
	style:--uikit-icon-height={cssSize}
>
	{@render children?.()}
</svg>

<style>
	@layer variables, base;

	@layer variables {
		:root {
			--wcag-ui-icon-width: 1.5rem;
		  --wcag-ui-icon-height: 1.5rem;
			--wcag-ui-icon-fill: currentcolor;
			--wcag-ui-icon-stroke: none;
		}
	}

	@layer base {
		.icon {
			display: inline-block;
			vertical-align: middle;
			width: var(--wcag-ui-icon-width);
			height: var(--wcag-ui-icon-height);
			fill: var(--wcag-ui-icon-fill);
	  	stroke: var(--wcag-ui-icon-stroke);
			flex-shrink: 0;
		}
	}
</style>
