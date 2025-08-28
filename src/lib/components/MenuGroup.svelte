<script lang="ts">
	import { type Snippet } from "svelte";
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
  const headingId = `uikit-menu-group-${id}`;
</script>

<div role="group" aria-labelledby={headingId} class="uikit-menu-group">
  <div id={headingId} role="presentation" class="uikit-menu-group__heading">
    {label}
  </div>
  {@render children?.()}
</div>

<style>
	.uikit-menu-group {
		display: flex;
		flex-flow: column nowrap;
	}

	.uikit-menu-group__heading {
		
	}
</style>