<script lang="ts">
	import { type Snippet, onDestroy } from "svelte";
	import { getTabState } from "./tabs-state.svelte";

	type Props = { children: Snippet; };

	let { children }: Props = $props();

	const tabState = getTabState();
	const panelId = tabState.addPanel();
	const panelIndex = tabState.panels.length - 1;

	const correspondingTabValue = $derived(tabState.getTabValueForPanelIndex(panelIndex));
	const isSelected = $derived(correspondingTabValue != null && tabState.isTabSelected(correspondingTabValue));
	const correspondingTabId = $derived(tabState.tabs.find((t) => t.value === correspondingTabValue)?.id);

	onDestroy(() => {
		tabState.removePanel(panelId);
	});
</script>

<div
	id={panelId}
	class="wcag-ui-tabs__panel"
	role="tabpanel"
	aria-labelledby={correspondingTabId}
	tabindex="0"
	hidden={!isSelected}
>
	{@render children?.()}
</div>

<style>
	.wcag-ui-tabs__panel {
		border-top: none;
		border-bottom-left-radius: .5rem;
		border-bottom-right-radius: .5rem;
		border: none;
		box-sizing: border-box;
		padding: .5rem;
	}

	.wcag-ui-tabs__panel[hidden] {
		display: none;
	}
</style>
