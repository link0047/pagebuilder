<script lang="ts">
	import { type Snippet } from "svelte";

	type Direction = "vertical" | "horizontal";
	type Props = {
		children?: Snippet,
		direction?: Direction,
		gap?: string
	}
	
	let {
		children,
		direction = "vertical",
		gap
	}: Props = $props();
</script>

<div
	class="uikit-group"
	role="group"
	data-direction={direction}
	style:--uikit-group-gap={gap}>
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