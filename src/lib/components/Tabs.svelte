<script lang="ts">
	import { type Snippet } from "svelte";
	import { setTabState } from "./tabs-state.svelte";

	type Props = {
		children: Snippet
	};
	
	let {
		children
	}:Props = $props();

	setTabState();
</script>

<div class="uikit-tabs">
	{@render children?.()}	
</div>

<style>
	.uikit-tabs {
		display: flex;
		flex-flow: column nowrap;
		gap: 0;
	}
</style>