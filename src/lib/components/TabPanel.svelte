<script lang="ts">
	import { type Snippet } from "svelte";
	import { getTabState } from "./tabs-state.svelte";

	type Props = {
		children: Snippet;
	};
	
	let { children }: Props = $props();
	
	const tabState = getTabState();
	
	const panelId = tabState.addPanel();
	const tabIndex = tabState.panels.length - 1;
	
	const correspondingTabId = $derived(tabState.tabs[tabIndex]?.id);
	const isSelected = $derived(correspondingTabId && tabState.isTabSelected(correspondingTabId));
</script>

<div
	id={panelId}
	class="uikit-tabs__panel"
	role="tabpanel"
	aria-labelledby={correspondingTabId}
	tabindex="0"
	hidden={!isSelected}
>
	{@render children?.()}
</div>