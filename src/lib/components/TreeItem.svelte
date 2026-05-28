<script lang="ts">
	import { onMount, getContext, setContext, type Snippet } from "svelte";
	import { getTreeState, LEVEL_KEY } from "./tree-state.svelte";

	type Props = {
		children?: Snippet;
		text?: Snippet;
		expanded?: boolean;
		hasChildren?: boolean;
		tag?: "li" | "div";
		[key: string]: unknown;
	};

	let {
		children,
		text,
		expanded = false,
		hasChildren: hasChildrenProp,
		tag = "li",
		...restProps
	}: Props = $props();

	let ref = $state<HTMLElement | undefined>();

	const treeState = getTreeState();
	const parentLevel: number = getContext<number>(LEVEL_KEY) ?? 0;
	const currentLevel: number = parentLevel + 1;

	setContext<number>(LEVEL_KEY, currentLevel);

	const hasChildren = $derived<boolean>(hasChildrenProp ?? typeof children === "function");
	const isSelected = $derived<boolean>(ref ? treeState.isSelected(ref) : false);
	const isExpanded = $derived<boolean>(ref ? treeState.isExpanded(ref) : false);
	const isFocused = $derived<boolean>(ref ? treeState.isFocused(ref) : false);

	// Roving tabindex: the focused item holds tabindex=0. Before anything is
	// focused, the first root item holds it so the tree is reachable by Tab.
	const tabindex = $derived.by((): number => {
		if (!ref) return -1;
		if (isFocused) return 0;
		if (treeState.focusedItem === null && treeState.isFirstRootItem(ref)) return 0;
		return -1;
	});

	// Calls element.focus() when this item becomes the focused item.
	// Kept here (not in TreeState) so the state class stays DOM-free.
	$effect(() => {
    if (isFocused && ref && document.activeElement !== ref) {
      ref.focus({ preventScroll: true });
    }
  });

	function handleClick(event: MouseEvent): void {
		if (!ref) return;
		event.stopPropagation();
		treeState.selectItem(ref);
		// Sync the roving focus position to the clicked item so that subsequent
		// keyboard navigation starts from the right place.
		treeState.focusOnClick(ref);
	}

	function handleExpandClick(event: MouseEvent) {
		event.stopPropagation();
		if (!ref) return;

		if (treeState.isExpanded(ref)) {
			treeState.collapse(ref);
		} else {
			treeState.expand(ref);
		}
	}

	onMount(() => {
		if (!ref) return;

		treeState.registerItem(ref, { level: currentLevel, hasChildren });

		if (expanded && hasChildren) {
			treeState.expand(ref);
		}

		return () => {
			if (ref instanceof HTMLElement) {
				treeState.unregisterItem(ref);
			}
		};
	});

	// Only syncs hasChildren when the children slot changes dynamically.
	// Never touches expansion state.
	$effect(() => {
		if (ref) {
			treeState.updateItem(ref, "hasChildren", hasChildren);
		}
	});
</script>

<svelte:element
	this={tag}
	bind:this={ref}
	class="wcag-ui-treeitem"
	class:wcag-ui-treeitem--focused={isFocused}
	role="treeitem"
	aria-level={currentLevel}
	aria-selected={isSelected}
	aria-expanded={hasChildren ? isExpanded : undefined}
	{tabindex}
	style="--wcag-ui-treeitem-depth:{parentLevel}"
	{...restProps}
>
	<div
		class="wcag-ui-treeitem__content"
		onclick={handleClick}
		role="none"
	>
		{#if hasChildren}
			<button
				class="wcag-ui-treeitem__expand-btn"
				tabindex="-1"
				aria-label={isExpanded ? "Collapse" : "Expand"}
				onclick={handleExpandClick}
			>
				<svg
					class="wcag-ui-treeitem__expand-icon"
					focusable="false"
					aria-hidden="true"
					viewBox="0 0 24 24"
				>
					<path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
				</svg>
			</button>
		{:else}
			<span class="wcag-ui-treeitem__expand-spacer" aria-hidden="true"></span>
		{/if}
		<span class="wcag-ui-treeitem__text">
			{@render text?.()}
		</span>
	</div>
	{#if hasChildren}
		<ul
			role="group"
			class="wcag-ui-treeitem__group"
			hidden={!isExpanded}
		>
			{@render children?.()}
		</ul>
	{/if}
</svelte:element>

<style>
	.wcag-ui-treeitem {
		position: relative;
		box-sizing: border-box;
		display: flex;
		flex-flow: column;
		justify-content: center;
		background-color: transparent;
		cursor: pointer;
		border-radius: 0.25rem;
		--wcag-ui-treeitem-indentation-size: 1.5rem;
	}

	.wcag-ui-treeitem:focus {
		outline: none;
	}

	.wcag-ui-treeitem:focus-visible {
		outline: 2px solid currentColor;
		outline-offset: 1px;
	}

	.wcag-ui-treeitem__expand-btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: var(--wcag-ui-treeitem-indentation-size);
		height: var(--wcag-ui-treeitem-indentation-size);
		padding: 0;
		margin: 0;
		border: none;
		background: transparent;
		cursor: pointer;
		color: inherit;
		border-radius: 0.2rem;
		flex-shrink: 0;
	}

	.wcag-ui-treeitem__expand-btn:focus-visible {
		outline: 2px solid currentColor;
		outline-offset: 1px;
	}

	.wcag-ui-treeitem__expand-spacer {
		display: inline-block;
		width: var(--wcag-ui-treeitem-indentation-size);
		height: var(--wcag-ui-treeitem-indentation-size);
		flex-shrink: 0;
	}

	.wcag-ui-treeitem__expand-icon {
		width: var(--wcag-ui-treeitem-indentation-size);
		height: var(--wcag-ui-treeitem-indentation-size);
		fill: currentcolor;
		transition: transform 150ms ease;
	}

	.wcag-ui-treeitem__content {
		display: flex;
		gap: 0.5rem;
		align-items: center;
		min-height: 2rem;
		border-radius: 0.25rem;
		user-select: none;
		padding-inline-start: calc(
			0.5rem + var(--wcag-ui-treeitem-indentation-size) * var(--wcag-ui-treeitem-depth)
		);
	}

	.wcag-ui-treeitem__text {
		width: 100%;
	}

	.wcag-ui-treeitem__group {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.wcag-ui-treeitem__group[hidden]:not([hidden="until-found"]) {
		display: none !important;
	}

	.wcag-ui-treeitem[aria-selected="true"] > .wcag-ui-treeitem__content {
		background-color: #d2e3f6;
	}

	.wcag-ui-treeitem[aria-selected="true"] {
		background-color: #eef3fc;
	}

	.wcag-ui-treeitem--focused > .wcag-ui-treeitem__content,
	.wcag-ui-treeitem__content:hover {
		background-color: hsla(220, 20%, 65%, 0.08);
	}

	.wcag-ui-treeitem[aria-expanded="true"]
		> .wcag-ui-treeitem__content
		> .wcag-ui-treeitem__expand-btn
		> .wcag-ui-treeitem__expand-icon {
		transform: rotate(90deg);
	}
</style>
