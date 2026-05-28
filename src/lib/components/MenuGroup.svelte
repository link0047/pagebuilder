<script lang="ts">
	import type { Snippet } from "svelte";
	import { generateId } from "$lib/utils/unique-id-generator";

	type Props = {
		children?: Snippet,
		label: string
	}

	let {
		label,
		children
	}: Props = $props();

	const id = generateId("menugroup");
  const headingId = `wcag-ui-menu-group-${id}`;
</script>

<div role="group" aria-labelledby={headingId} class="wcag-ui-menu-group">
  <div id={headingId} role="presentation" class="wcag-ui-menu-group__heading">
    {label}
  </div>
  {@render children?.()}
</div>

<style>
	.wcag-ui-menu-group {
		display: flex;
		flex-flow: column nowrap;
	}

	/*.wcag-ui-menu-group__heading {

	}*/
</style>
