<script lang="ts">
	import type { Snippet } from "svelte";

	type Size = "sm" | "md" | "lg";
	type Alignment = "left" | "center" | "right";

	type Props = {
		tag?: string;
		size: Size;
		alignment: Alignment;
		border: boolean;
		italic: boolean;
		bg: boolean;
		children?: Snippet;
	}

	let {
		tag = "blockquote",
		size = "md",
		alignment = "left",
		border = true,
		italic = true,
		bg = false,
		children
	}: Props = $props();
</script>

<svelte:element
	this={tag}
	class="wcag-ui-blockquote"
	class:wcag-ui-blockquote--font-italic={italic}
	class:wcag-ui-blockquote--size-sm={size === "sm"}
	class:wcag-ui-blockquote--size-lg={size === "lg"}
	class:wcag-ui-blockquote--border={border}
	class:wcag-ui-blockquote--bg={bg}
>
	{@render children?.()}
</svelte:element>

<style>
	.wcag-ui-blockquote {
		--wcag-ui-blockquote-color: #212121;
		--wcag-ui-blockquote-font-weight: 500;
		--wcag-ui-blockquote-font-size: 1rem;

		margin-block: 1rem;
		margin-inline: 0;
		padding: 1rem;
		font-size: var(--wcag-ui-blockquote-font-size);
		font-weight: var(--wcag-ui-blockquote-font-weight);
		color: var(--wcag-ui-blockquote-color);
	}

	.wcag-ui-blockquote--font-italic {
		font-style: italic;
	}

	.wcag-ui-blockquote--size-sm {
		--wcag-ui-blockquote-font-size: .875rem;
	}

	.wcag-ui-blockquote--size-lg {
		--wcag-ui-blockquote-font-size: 1.125rem;
	}

	.wcag-ui-blockquote--border {
		border-inline-start: .25rem solid #bbb;
	}

	.wcag-ui-blockquote--bg {
		background-color: oklch(98.5% .002 247.839);
	}
</style>
