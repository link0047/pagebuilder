<script lang="ts">
	import { type Snippet } from "svelte";
	import { setTabState } from "./tabs-state.svelte";
	import type { TabsVariant, TabsSize, TabsColor, TabsShape } from "./tabs.types";

	type Props = {
		children: Snippet;
		variant?: TabsVariant;
		size?: TabsSize;
		color?: TabsColor;
		shape?: TabsShape;
		fullWidth?: boolean;
		value?: string;
	};
	
	let {
		children,
		variant = "outlined",
		size = "md",
		color = "default",
		shape = "default",
		fullWidth = false,
		value = $bindable()
	}: Props = $props();

	setTabState({ variant, size, color, shape, fullWidth });
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