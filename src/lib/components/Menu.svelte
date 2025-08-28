<script lang="ts">
	import { type Snippet } from "svelte";

	type Props = {
		children?: Snippet,
	}
	
	let { 
		children 
	}: Props = $props();
</script>

<div role="menu" class="uikit-menu">
  {@render children?.()}
</div>

<style>
	.uikit-menu { 
		
		font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
	}
</style>