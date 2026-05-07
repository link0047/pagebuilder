<script lang="ts">
	import { type Snippet } from "svelte";
	import { setTreeState } from "./tree-state.svelte";

	type Props = {
		children?: Snippet;
		multiselect?: boolean;
		label?: string;
		[key: string]: unknown;
	};

	let {
		children,
		multiselect = false,
		label,
		...restProps
	}: Props = $props();

	// `multiselect` is intentionally read once at initialisation. Changing it
	// after mount is not supported — it would require rebuilding the entire
	// TreeState, discarding all selection, focus, and expansion state.
	// svelte-ignore state_referenced_locally
	const treeState = setTreeState(multiselect);

	function handleKeydown(event: KeyboardEvent) {
		const { key } = event;

		switch (key) {
			case "Enter":
			case " ": {
				const focused = treeState.focusedItem;
				if (focused) {
					event.preventDefault();
					treeState.selectItem(focused);
				}
				break;
			}
			case "ArrowUp":
				event.preventDefault();
				treeState.focusPrev();
				break;
			case "ArrowDown":
				event.preventDefault();
				treeState.focusNext();
				break;
			case "ArrowLeft":
				event.preventDefault();
				if (treeState.isFocusedItemExpanded()) {
					treeState.collapseFocused();
				} else {
					treeState.focusParent();
				}
				break;
			case "ArrowRight":
				event.preventDefault();
				if (treeState.isFocusedItemCollapsed()) {
					treeState.expandFocused();
				}
				// Already expanded or leaf: do nothing (spec-correct)
				break;
			case "Home":
				event.preventDefault();
				treeState.focusFirst();
				break;
			case "End":
				event.preventDefault();
				treeState.focusLast();
				break;
			case "*":
				event.preventDefault();
				treeState.expandSiblings();
				break;
			default:
				break;
		}
	}

	function handleFocusin() {
		treeState.focusOnEntry();
	}
</script>

<ul
	class="uikit-tree"
	role="tree"
	aria-multiselectable={multiselect}
	aria-label={label}
	onkeydown={handleKeydown}
	onfocusin={handleFocusin}
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
