<script lang="ts">
	import { onMount, getContext, setContext, type Snippet } from "svelte";
	import { getTreeState, LEVEL_KEY } from "./tree-state.svelte";
	
  type Props = {
    children?: Snippet;
    text?: Snippet;
    expanded?: boolean;
    hasChildren?: boolean;
    tag?: "li" | "button" | "div";
    [key: string]: unknown;
  }

	let {
		children,
		text,
		expanded = false,
    hasChildren: hasChildrenProp, 
		tag = "li",
		...restProps 
	}: Props = $props();

	let ref = $state<HTMLElement>();
	let contentRef: HTMLDivElement;
	
	const treeState = getTreeState();
	const parentLevel: number = getContext<number>(LEVEL_KEY) ?? 0;
	const currentLevel: number = parentLevel + 1;
	
	setContext<number>(LEVEL_KEY, currentLevel);
	
	const hasChildren = $derived<boolean>(hasChildrenProp ?? (typeof children === "function"));
	const itemState = $derived(treeState.getItem(ref!));
	const isSelected = $derived<boolean>(ref ? treeState.isSelected(ref) : false);
	const isExpanded = $derived<boolean>(ref ? treeState.isExpanded(ref) : false);
	const isFirstItem = $derived<boolean>(ref ? treeState.isFirstItem(ref) : false);
	const isFocused = $derived<boolean>(ref ? treeState.isFocused(ref) : false);
	const tabindex = $derived.by((): number => {
		if (!ref) return -1;
		if (isSelected) return 0;
		if (treeState.hasNoSelection() && treeState.isFirstItem(ref)) {
			return 0;
		}
		return -1;
	});

	function handleClick(event: MouseEvent): void {
		if (!ref) return;

		event.stopPropagation();
		treeState.updateItem(ref, "selected", true);
		treeState.selectItem(ref);
	}

	function handleExpandClick() {
    if (!ref) return;

		if (treeState.isExpanded(ref)) {
			treeState.collapseTreeItem(ref);
		} else {
			treeState.expandTreeItem(ref);
		}
	}

	onMount(() => {
		treeState.registerItem(ref!, {
			level: currentLevel,
			hasChildren
		});

		if (expanded) {
			treeState.expandTreeItem(ref!);
		}

		return () => {
			treeState.unregisterItem(ref!);
		}
	});
</script>

<svelte:element
	bind:this={ref}
	this={tag}
	class="uikit-treeitem"
	class:uikit-treeitem--focused={isFocused}
	role="treeitem"
	aria-level={currentLevel}
	aria-selected={isSelected}
	aria-expanded={hasChildren ? isExpanded : null}
	tabindex={tabindex}
	style="--uikit-treeitem-depth:{parentLevel}"
  {...restProps}
>
	<div
		class="uikit-treeitem__content" 
		bind:this={contentRef}
		onclick={handleClick}
		role="none"
	>
		{#if hasChildren}
			<svg
				role="presentation"
				class="uikit-treeitem__expand-icon"
				focusable="false"
				aria-hidden="true" 
				viewBox="0 0 24 24"
				onclick={handleExpandClick}
			>
				<path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
			</svg>
		{/if}
		<span class="uikit-treeitem__text">
			{@render text?.()}
		</span>
	</div>
	{#if hasChildren}
		<ul
			role="group"
			class="uikit-treeitem__group"
			hidden={!isExpanded}
		>
			{@render children?.()}
		</ul>
	{/if}
</svelte:element>

<style>
	.uikit-treeitem {
		position: relative;
		box-sizing: border-box;
		display: flex;
		flex-flow: column;
		justify-content: center;
		background-color: transparent;
		cursor: pointer;
		border-radius: .25rem;
		--uikit-treeitem-indentation-size: 1.5rem;
	}

	.uikit-treeitem {
		outline: none;
	}

	.uikit-treeitem__expand-icon {
		width: var(--uikit-treeitem-indentation-size);
		height: var(--uikit-treeitem-indentation-size);
		fill: currentcolor;
	}
	
	.uikit-treeitem__content {
		display: flex;
		gap: .5rem;
		align-items: center;
		min-height: 2rem;
		border-radius: .25rem;
		user-select: none;
		padding-inline-start: calc(.5rem + var(--uikit-treeitem-indentation-size) * var(--uikit-treeitem-depth));
	}

	.uikit-treeitem__group {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.uikit-treeitem__group[hidden]:not([hidden="until-found"]) {
	  display: none !important;
	}

	.uikit-treeitem[aria-selected="true"] > .uikit-treeitem__content {
		background-color: #d2e3f6;
	}

	.uikit-treeitem[aria-selected="true"] {
		background-color: #eef3fc;
	}

	.uikit-treeitem--focused > .uikit-treeitem__content,
	.uikit-treeitem__content:hover {
		background-color: hsla(220, 20%, 65%, 0.08);
	}

	.uikit-treeitem[aria-expanded="true"] > .uikit-treeitem__content > .uikit-treeitem__expand-icon {
		transform: rotate(90deg);
	}
</style>