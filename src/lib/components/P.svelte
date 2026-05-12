<script lang="ts">
	import type { Snippet } from "svelte";

	type Size = "xs" | "sm" | "md" | "lg";
	type Weight = "normal" | "medium" | "semibold" | "bold";
	type Leading = "tight" | "normal" | "relaxed";
	type Alignment = "left" | "center" | "right";
	type Whitespace = "normal" | "pre" | "nowrap";

	type Props = {
		size?: Size;
		weight?: Weight;
		leading?: Leading;
		alignment?: Alignment;
		color?: string;
		whitespace?: Whitespace;
		children?: Snippet;
	}

	let {
		size = "md",
		weight = "normal",
		leading = "normal",
		alignment = "left",
		color,
		whitespace = "normal",
		children
	}: Props = $props();
</script>

<p
	class="wcag-ui-p"
	class:wcag-ui-p--size-xs={size === "xs"}
  class:wcag-ui-p--size-sm={size === "sm"}
  class:wcag-ui-p--size-lg={size === "lg"}
  class:wcag-ui-p--leading-tight={leading === "tight"}
  class:wcag-ui-p--leading-relaxed={leading === "relaxed"}
  class:wcag-ui-p--alignment-center={alignment === "center"}
  class:wcag-ui-p--alignment-right={alignment === "right"}
  class:wcag-ui-p--weight-medium={weight === "medium"}
  class:wcag-ui-p--weight-semibold={weight === "semibold"}
	class:wcag-ui-p--weight-bold={weight === "bold"}
  class:wcag-ui-p--whitespace-pre={whitespace === "pre"}
  class:wcag-ui-p--whitespace-nowrap={whitespace === "nowrap"}
	style:--wcag-ui-p-color={color}
>
	{@render children?.()}
</p>

<style>
  .wcag-ui-p {
		--wcag-ui-p-font-size: 1rem;
		--wcag-ui-p-font-weight: 400;
		--wcag-ui-p-font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
		--wcag-ui-p-line-height: 1.5;
		--wcag-ui-p-letter-spacing: 0.00938em;
		--wcag-ui-p-color: inherit;

		margin-block-start: 0;
		margin-block-end: .5rem;
		color: var(--wcag-ui-p-color, inherit);
		font-family: var(--wcag-ui-p-font-family, system-ui);
		font-weight: var(--wcag-ui-p-font-weight, 400);
		font-size: var(--wcag-ui-p-font-size, 1rem);
		line-height: var(--wcag-ui-p-line-height, 1.5);
		letter-spacing: var(--wcag-ui-p-letter-spacing, 0.00938em);
	}

	/* Sizing */
	.wcag-ui-p--size-xs	{ --wcag-ui-p-font-size: .75rem; }
	.wcag-ui-p--size-sm { --wcag-ui-p-font-size: .875rem; }
	.wcag-ui-p--size-lg { --wcag-ui-p-font-size: 1.125rem; }

	/* Leading */
	.wcag-ui-p--leading-tight   { --wcag-ui-p-line-height: 1.25; }
	.wcag-ui-p--leading-relaxed { --wcag-ui-p-line-height: 1.75; }

	/* Weight */
	.wcag-ui-p--weight-medium   { --wcag-ui-p-font-weight: 500; }
	.wcag-ui-p--weight-semibold { --wcag-ui-p-font-weight: 600; }
	.wcag-ui-p--weight-bold { --wcag-ui-p-font-weight: 700; }

	/* Alignment */
	.wcag-ui-p--alignment-center { text-align: center; }
	.wcag-ui-p--alignment-right  { text-align: right; }

	/* Whitespace */
	.wcag-ui-p--whitespace-pre   { white-space: pre; }
	.wcag-ui-p--whitespace-nowrap { white-space: nowrap; }
</style>
