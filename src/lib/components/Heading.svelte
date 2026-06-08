<script lang="ts">
	import type { Snippet } from "svelte";

	type Tag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
	type Weight = "normal" | "medium" | "semibold" | "bold" | "extrabold";
	type Size = "sm" | "md" | "lg";
	type Alignment = "left" | "center" | "right";

	type Props = {
		tag?: Tag;
		size?: Size;
		weight?: Weight;
		alignment?: Alignment;
		color?: string;
		visuallyHidden?: boolean;
		children?: Snippet;
		[key: string]: unknown;
	}

	let {
		tag = "h2",
		size,
		weight,
		alignment = "left",
		color = "inherit",
		visuallyHidden = false,
		children,
		...restProps
	}: Props = $props();
</script>

<svelte:element
	this={tag}
	class="wcag-ui-heading"
	class:wcag-ui-heading--visually-hidden={visuallyHidden}
	class:wcag-ui-heading--h1={tag === "h1"}
	class:wcag-ui-heading--h2={tag === "h2"}
	class:wcag-ui-heading--h3={tag === "h3"}
	class:wcag-ui-heading--h4={tag === "h4"}
	class:wcag-ui-heading--h5={tag === "h5"}
	class:wcag-ui-heading--h6={tag === "h6"}
	class:wcag-ui-heading--weight-normal={weight === "normal"}
	class:wcag-ui-heading--weight-medium={weight === "medium"}
	class:wcag-ui-heading--weight-semibold={weight === "semibold"}
	class:wcag-ui-heading--weight-bold={weight === "bold"}
	class:wcag-ui-heading--weight-extrabold={weight === "extrabold"}
	class:wcag-ui-heading--size-sm={size === "sm"}
	class:wcag-ui-heading--size-md={size === "md"}
	class:wcag-ui-heading--size-lg={size === "lg"}
	class:wcag-ui-heading--align-center={alignment === "center"}
	class:wcag-ui-heading--align-right={alignment === "right"}
	style="--wcag-ui-heading-color:{color}"
	{...restProps}
>
	{@render children?.()}
</svelte:element>

<style>
	.wcag-ui-heading {
		margin: 0;
		color: var(--wcag-ui-heading-color, inherit);
		font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
	}

	.wcag-ui-heading--visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }

	.wcag-ui-heading--h1 {
		font-size: 3rem;
		font-weight: 400;
		letter-spacing: -0.01562em;
	}

	.wcag-ui-heading--h2 {
		font-size: 2.5rem;
		font-weight: 400;
		letter-spacing: -0.00833em;
	}

	.wcag-ui-heading--h3 {
		font-size: 2.25rem;
		font-weight: 500;
		letter-spacing: 0em;
	}

	.wcag-ui-heading--h4 {
		font-size: 2rem;
		font-weight: 500;
		letter-spacing: 0.00735em;
	}

	.wcag-ui-heading--h5 {
		font-size: 1.75rem;
		font-weight: 600;
		letter-spacing: 0em;
	}

	.wcag-ui-heading--h6 {
		font-size: 1.5rem;
		font-weight: 600;
		letter-spacing: 0.0075em;
	}

	.wcag-ui-heading--weight-normal { font-weight: 400; }
	.wcag-ui-heading--weight-medium { font-weight: 500; }
	.wcag-ui-heading--weight-semibold { font-weight: 600; }
	.wcag-ui-heading--weight-bold { font-weight: 700; }
	.wcag-ui-heading--weight-extrabold { font-weight: 800; }

	.wcag-ui-heading--size-sm { font-size: 1.25rem; }
	.wcag-ui-heading--size-md { font-size: 2.5rem; }
	.wcag-ui-heading--size-lg { font-size: 4rem; }

	.wcag-ui-heading--align-center { text-align: center; }
	.wcag-ui-heading--align-right { text-align: right; }
</style>
