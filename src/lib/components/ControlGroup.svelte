<script lang="ts">
  import { type Snippet } from "svelte";

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

	const tag = label ? "fieldset" : "div";
</script>

<svelte:element
	this={tag}
	class="uikit-control-group"
	role={label ? undefined : "group"}
	style:--uikit-control-group-columns={col}
	style:--uikit-control-group-rows={row}
>
	{#if label}
		<legend class="uikit-control-group__label">{label}</legend>
	{/if}
	<div class="uikit-control-group__content">
		{@render children?.()}
	</div>
</svelte:element>

<style>
	:root {
		--uikit-control-group-columns: auto;
		--uikit-control-group-rows: auto;
		--uikit-control-group-gap: 1rem;
	}
	
	.uikit-control-group {
		border: none;
		padding: 0;
		margin: 0;
	}

	.uikit-control-group__label {
		color: #111;
		font-size: 1rem;
		line-height: 1;	
		margin-bottom: .25rem;
	}
	
	.uikit-control-group__content {
		display: grid;
		align-items: center;
		gap: var(--uikit-control-group-gap);
		grid-template-columns: repeat(var(--uikit-control-group-columns), 1fr);
		grid-template-rows: var(--uikit-control-group-rows);
	}
</style>