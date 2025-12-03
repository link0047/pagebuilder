import { getContext, setContext } from "svelte";
import { SvelteMap, SvelteSet } from "svelte/reactivity";

const TREE_KEY = Symbol("TREE");
export const LEVEL_KEY = Symbol("TREE_LEVEL");

type TreeItemData = {
	level: number;
	hasChildren: boolean;
	selected?: boolean;
}

class TreeState {
	#items = new SvelteMap<HTMLElement, TreeItemData>();
	#focusedItem = $state<HTMLElement | null>(null);
	#selectedItems = new SvelteSet<HTMLElement>();
	#expandedItems = new SvelteSet<HTMLElement>();
	#firstRootItem = $state<HTMLElement | null>(null);
	#multiselect: boolean;

	constructor(multiselect: boolean = false) {
		this.#multiselect = multiselect;
	}

	get items() {
		return this.#items;
	}

	get focusedItem() {
		return this.#focusedItem;
	}

	registerItem(element: HTMLElement, data: TreeItemData) {
		this.#items.set(element, data);

		if (data.level === 1 && !this.#firstRootItem) {
			this.#firstRootItem = element;
		}
	}

	setFocus() {
		if (!this.#focusedItem) {
			this.setFocusedItem(this.#firstRootItem);
		}
	}

	getItem(element: HTMLElement) {
		return this.#items.get(element);
	}

	updateItem<K extends keyof TreeItemData>(element: HTMLElement, key: K, value: TreeItemData[K]) {
		const item = this.#items.get(element);
		if (item) {
			item[key] = value;
		}
	}

	expandFocusedItem() {
    if (this.#focusedItem) {
		  this.expandTreeItem(this.#focusedItem);	
    }
	}

	collapseFocusedItem() {
    if (this.#focusedItem) {
		  this.collapseTreeItem(this.#focusedItem);
    }
	}

	selectItem(element: HTMLElement) {
		if (this.#multiselect) {
			this.#selectedItems.add(element);
		} else {
			this.#selectedItems.clear();
			this.#selectedItems.add(element);
		}
	}

	hasNoSelection() {
		return this.#selectedItems.size === 0;
	}
	
	isFirstItem(element: HTMLElement) {
		return this.#firstRootItem === element;
	}
	
	isSelected(element: HTMLElement) {
		return this.#selectedItems.has(element);
	}

	isFocused(element: HTMLElement) {
		return this.#focusedItem === element;
	}
	
	unregisterItem(element: HTMLElement) {
		this.#items.delete(element);
		this.#selectedItems.delete(element);
		this.#expandedItems.delete(element);
		
		// Clear focus if this was the focused item
		if (this.#focusedItem === element) {
			this.#focusedItem = null;
		}

		if (this.#firstRootItem === element) {
			// Find next root-level item
			this.#firstRootItem = null;
			for (const [el, data] of this.#items) {
				if (data.level === 1) {
					this.#firstRootItem = el;
					break;
				}
			}
		}
	}
	
	setFocusedItem(element: HTMLElement | null) {
		this.#focusedItem = element;
		element?.focus();
	}

	setFocusToPrevItem() {
		if (!this.#focusedItem) {
			this.setFocusedItem(this.#firstRootItem);
			return;
		}
		
		const parent = this.#focusedItem.parentElement;
		if (!parent) return;

		// Check if this is the first root-level item
		const isFirstRootChild = this.#focusedItem === parent.firstElementChild && parent.classList.contains("uikit-tree");
		if (isFirstRootChild) return;
		
		// Try to find previous sibling
		let prev = this.#focusedItem.previousElementSibling as HTMLElement | null;
		while (prev && !prev.classList.contains("uikit-treeitem")) {
			prev = prev.previousElementSibling as HTMLElement | null;
		}
		
		// If no previous sibling and parent is a group, go to the parent treeitem
		if (parent.classList.contains("uikit-treeitem__group") && prev === null) {
			const grandParent = parent.parentElement;
      if (grandParent) {
        this.setFocusedItem(grandParent);
      }
			return;
		}
		
		// If previous sibling exists, go to its last visible descendant
		if (prev) {
			this.setFocusedItem(this.#findLastVisibleDescendant(prev));
			return;
		}
	}
	
	// Helper method to find the last visible descendant
	#findLastVisibleDescendant(element: HTMLElement): HTMLElement {
		const data = this.#items.get(element);
		
		// If not expanded or no children, return element itself
		if (!data?.hasChildren || !this.isExpanded(element)) {
			return element;
		}
		
		// Find last child and recurse
		const group = element.lastElementChild as HTMLElement | null;
    if (!group) return element;

		let lastChild = group.lastElementChild as HTMLElement | null;
		while (lastChild && !lastChild.classList.contains("uikit-treeitem")) {
			lastChild = lastChild.previousElementSibling as HTMLElement | null;
		}
		
		if (lastChild) {
			return this.#findLastVisibleDescendant(lastChild);
		}
		
		return element;
	}
	
	setFocusToNextItem() {
		if (!this.#focusedItem) {
			this.setFocusedItem(this.#firstRootItem);
			return;
		}
		
		const currentData = this.#items.get(this.#focusedItem);
		const parent = this.#focusedItem.parentElement;
    if (!parent) return;
		
		// Check if this is the last root-level item
		const isLastRootChild = this.#focusedItem === parent.lastElementChild && parent.classList.contains("uikit-tree"); 
		if (isLastRootChild) return;
		
		// If current item has children and is expanded, go to first child
		if (currentData?.hasChildren && this.isExpanded(this.#focusedItem)) {
			const group = this.#focusedItem.lastElementChild as HTMLElement | null;
      if (group) {
        let next = group.firstElementChild as HTMLElement | null;
        while (next && !next.classList.contains("uikit-treeitem")) {
          next = next.nextElementSibling as HTMLElement | null;
        }
        if (next) {
          this.setFocusedItem(next);
          return;
        }
      }
		}
		
		// Try to find next sibling
		let next = this.#focusedItem.nextElementSibling as HTMLElement | null;
		while (next && !next.classList.contains("uikit-treeitem")) {
			next = next.nextElementSibling as HTMLElement | null;
		}
		
		if (next) {
			this.setFocusedItem(next);
			return;
		}
		
		// No next sibling, walk up to find ancestor's next sibling
		let currentParent = parent as HTMLElement | null;;
		while (currentParent && currentParent.classList.contains("uikit-treeitem__group")) {
      // The treeitem that owns this group
			const ancestor = currentParent.parentElement as HTMLElement | null;
			if (!ancestor) break;

			// Try to find ancestor's next sibling
			let ancestorNext = ancestor.nextElementSibling as HTMLElement | null;
			while (ancestorNext && !ancestorNext.classList.contains("uikit-treeitem")) {
				ancestorNext = ancestorNext.nextElementSibling as HTMLElement | null;
			}
			
			if (ancestorNext) {
				this.setFocusedItem(ancestorNext);
				return;
			}
			
			// Continue walking up
			currentParent = ancestor.parentElement as HTMLElement | null;;
		}
		
		// Reached the root with no next item - do nothing
	}

	setFocusToParentItem() {
		if (!this.#focusedItem) return;
		
		const parent = this.#focusedItem.parentElement;
		
		// If parent is a group, go to the grandparent (the treeitem that owns this group)
		if (parent && parent.classList.contains("uikit-treeitem__group")) {
			const grandParent = parent.parentElement;
			// Only focus if grandparent is a treeitem (not root)
			if (grandParent && grandParent.classList.contains("uikit-treeitem")) {
				this.setFocusedItem(grandParent);
			}
			// If grandparent is root tree element, do nothing (already at root level)
		}
	}

	canExpandFocusedItem() {
		if (!this.#focusedItem) return false;
		const data = this.#items.get(this.#focusedItem);
		return data?.hasChildren && !this.isExpanded(this.#focusedItem);
	}

	focusedItemExpandable() {
		if (!this.#focusedItem) return false;
		const data = this.#items.get(this.#focusedItem);
		return data?.hasChildren ?? false;
	}
	
	canCollapseFocusedItem() {
		if (!this.#focusedItem) return false;
		const data = this.#items.get(this.#focusedItem);
		return data?.hasChildren && this.isExpanded(this.#focusedItem);
	}

	collapseTreeItem(element: HTMLElement) {
		this.#expandedItems.delete(element);
	}
	
	expandTreeItem(element: HTMLElement) {
		this.#expandedItems.add(element);
	}
	
	isExpanded(element: HTMLElement) {
		return this.#expandedItems.has(element);
	}
}

export function setTreeState(multiselect: boolean = false): TreeState {
	return setContext(TREE_KEY, new TreeState(multiselect));
}

export function getTreeState(): TreeState {
	return getContext(TREE_KEY);
}