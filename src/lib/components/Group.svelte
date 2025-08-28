<script lang="ts">
	import { type Snippet } from "svelte";

	type Direction = "stacked" | "horizontal";
	type Props = {
		children?: Snippet,
		direction?: Direction,
		gap?: string
	}
	
	let {
		children,
		direction = "stacked",
		gap
	}: Props = $props();

	let validGap = $derived(gap?.length ? `--uikit-group-gap: ${gap}` : undefined);
</script>

<div
	class="uikit-group"
	role="group"
	data-direction={direction}
	style={validGap}>
	{@render children?.()}
</div>

<style>	
	.uikit-group {
		display: flex;
		flex-direction: column;
		gap: var(--uikit-group-gap, 0);
	}

	.uikit-group[data-direction="horizontal"] {
		flex-direction: row;
	}
</style>