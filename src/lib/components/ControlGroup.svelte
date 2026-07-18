<script lang="ts">
  import type { Snippet } from "svelte";

  type Props = {
    label?: string;
    col?: number;
    row?: string;
    children?: Snippet;
  };

	let {
		label,
		row,
		col,
		children
	}: Props = $props();

	const tag = $derived(label ? "fieldset" : "div");
</script>

<svelte:element
	this={tag}
	class="wcag-ui-control-group"
	role={label ? undefined : "group"}
	style:--wcag-ui-control-group-columns={col}
	style:--wcag-ui-control-group-rows={row}
>
	{#if label}
		<legend class="wcag-ui-control-group__label">{label}</legend>
	{/if}
	<div class="wcag-ui-control-group__content">
		{@render children?.()}
	</div>
</svelte:element>

<style>
	:root {
		--wcag-ui-control-group-columns: auto;
		--wcag-ui-control-group-rows: auto;
		--wcag-ui-control-group-gap: 1rem;
		--wcag-ui-control-group-padding-inline: 0;
		--wcag-ui-control-group-padding-block: 0;
	}

	.wcag-ui-control-group {
		border: none;
		padding-inline: var(--wcag-ui-control-group-padding-inline);
		padding-block: var(--wcag-ui-control-group-padding-block);
		margin: 0;
	}

	.wcag-ui-control-group__label {
		color: #111;
		font-size: 1rem;
		line-height: 1;
		margin-bottom: .25rem;
	}

	.wcag-ui-control-group__content {
		display: grid;
		align-items: center;
		gap: var(--wcag-ui-control-group-gap);
		grid-template-columns: repeat(var(--wcag-ui-control-group-columns), 1fr);
		grid-template-rows: var(--wcag-ui-control-group-rows);
	}
</style>
