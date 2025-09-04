<script lang="ts">
	import { type Snippet, onMount } from "svelte";
	import { getTabState } from "./tabs-state.svelte";

	type Props = {
		children?: Snippet,
    [key: string]: unknown;
	};

	let {
		children,
    ...restProps
	}: Props = $props();

	let ref: HTMLElement;
	const tabState = getTabState();

	const id = tabState.addTab();
	const panelId = $derived(tabState.getPanelIdForTab(id));
	const tabIndex = tabState.tabs.length - 1;

	function handleClick(event: Event) {
		tabState.setSelectedTab(id);
	}

	function handleKeydown(event: KeyboardEvent) {
		event.stopPropagation();
		event.preventDefault();
		
		switch(event.key) {
			case "ArrowLeft":
				tabState.selectPreviousTab();
				break;
			case "ArrowRight":
				tabState.selectNextTab();
				break;
			case "Home":
				tabState.selectFirstTab();
				break;
			case "End":
				tabState.selectLastTab();
				break;
		}
	}

	onMount(() => {
		tabState.registerTabElement(id, ref);
	});
</script>

<button
	bind:this={ref}
	{id}
	type="button"
	role="tab"
	class="uikit-tabs__tab"
	aria-selected={tabState.isTabSelected(id)}
	aria-controls={panelId}
	onclick={handleClick}
	onkeydown={handleKeydown}
  {...restProps}
>
	{@render children?.()}
</button>

<style>
	.uikit-tabs__tab {
		display: inline-flex;
		box-sizing: border-box;
		margin: 0;
		padding-inline: .75rem;
		align-items: center;
		justify-content: center;
		font-size: .875rem;
		font-weight: 400;
		font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, Oxygen, Ubuntu, Cantarell, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
		height: 2rem;
		color: #52525b;
		border: 1px solid transparent;
		border-radius: .25rem;
		background-color: #fff;
		cursor: pointer;
	}

	.uikit-tabs__tab[aria-selected="true"] {
		color: #212121;
		background-color: #f2f2f2;
		border-color: #989898;
		border-bottom: none;
		border-bottom-left-radius: 0;
		border-bottom-right-radius: 0;
		font-weight: 500;
	}
</style>