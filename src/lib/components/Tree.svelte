<script lang="ts">
	import { type Snippet } from "svelte";
  import { setTreeState } from "./tree-state.svelte";
	
  type Props = {
    children?: Snippet;
    multiselect?: boolean;
    [key: string]: unknown;
  }

	let {
		children,
		multiselect = false,
		...restProps
	}: Props = $props();

	function handleKeyup(event: KeyboardEvent) {
		event.preventDefault();
		const { key } = event;

		switch (key) {
			case "Enter":
			case " ":
				const focusedItem = treeState.focusedItem;
				if (focusedItem) {
					treeState.selectItem(focusedItem);
				}
				break;
			case "ArrowUp":
				treeState.setFocusToPrevItem();
				break;
			case "ArrowDown":
				treeState.setFocusToNextItem();
				break;
			case "ArrowLeft":
				if (!treeState.focusedItemExpandable()) {
					// Not expandable - go to parent (if not root)
					treeState.setFocusToParentItem();
				} else {
					// Is expandable
					if (treeState.canCollapseFocusedItem()) {
						// Expanded - collapse it
						treeState.collapseFocusedItem();
					} else {
						// Collapsed - go to parent (if not root)
						treeState.setFocusToParentItem();
					}
				}
				break;
			case "ArrowRight":
				if (treeState.focusedItemExpandable()) {
					if (treeState.canExpandFocusedItem()) {
						treeState.expandFocusedItem();
					} else {
						treeState.setFocusToNextItem();
					}
				}
				break;
			case "Home":
				break;
			case "End":
				break;
			case "*":
				break;
			default:
				break;
		}
	}

	function handleFocus() {
		treeState.setFocus();
	}
	
	const treeState = setTreeState();
</script>

<ul 
	class="uikit-tree"
	role="tree"
	aria-multiselectable={multiselect}
	onkeyup={handleKeyup}
	onfocusin={handleFocus}
	{...restProps}
>
	{@render children?.()}
</ul>

<style>
	.uikit-tree {
		margin: 0;
		padding: 0;
		list-style: none;
	}
</style>