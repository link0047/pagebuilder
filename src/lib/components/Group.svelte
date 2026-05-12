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
	class="wcag-ui-group"
	role="group"
	data-direction={direction}
	style:--wcag-ui-group-gap={gap}>
	{@render children?.()}
</div>

<style>
	.wcag-ui-group {
	--wcag-ui-group-gap: 0;

		display: flex;
		flex-direction: column;
		gap: var(--wcag-ui-group-gap);
	}

	.wcag-ui-group[data-direction="horizontal"] {
		flex-direction: row;
	}
</style>
