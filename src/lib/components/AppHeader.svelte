<script lang="ts">
	import { type Snippet } from "svelte";

	type Props = {
		children?: Snippet,
	}

	let {
		children
	}: Props = $props();
</script>

<header class="app-header">
	{@render children?.()}
</header>

<style>	
	.app-header {
		grid-area: header;
		display: flex;
		align-items: center;
		padding-inline: .5rem;
		height: 3.5rem;
		box-shadow: 0 .125rem .0625rem #0000000d, 0 0 .0625rem #42474c73;
		background-color: color-mix(in oklab, #fff 90%, transparent);
		position: relative;
		z-index: 100;
	}
</style>