import { getContext, setContext } from "svelte";
import { SvelteMap, SvelteSet } from "svelte/reactivity";

const TREE_KEY = Symbol("TREE");
export const LEVEL_KEY = Symbol("TREE_LEVEL");

type TreeItemData = {
	level: number;
	hasChildren: boolean;
};

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

	// --- Getters ---

	get items() {
		return this.#items;
	}

	// Proper getter: read-only external access to the reactive private field.
	// Components can read and react to this in $derived/$effect, but cannot
	// assign it — all mutations go through focusOn*() methods.
	get focusedItem(): HTMLElement | null {
		return this.#focusedItem;
	}

	// --- Registration ---

	registerItem(element: HTMLElement, data: TreeItemData) {
		this.#items.set(element, data);

		if (data.level === 1 && !this.#firstRootItem) {
			this.#firstRootItem = element;
		}
	}

	unregisterItem(element: HTMLElement) {
		this.#items.delete(element);
		this.#selectedItems.delete(element);
		this.#expandedItems.delete(element);

		if (this.#focusedItem === element) {
			this.#focusedItem = null;
		}

		if (this.#firstRootItem === element) {
			this.#firstRootItem = null;
			for (const [el, data] of this.#items) {
				if (data.level === 1) {
					this.#firstRootItem = el;
					break;
				}
			}
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

	// --- Focus ---

	// Called when a user clicks an item: moves the roving focus position to that item.
	focusOnClick(element: HTMLElement) {
		this.#focusOn(element);
	}

	// Called on focusin: ensures the tree has a focus position when first tabbed into.
	focusOnEntry() {
		if (!this.#focusedItem) {
			this.#focusOn(this.#firstRootItem);
		}
	}

	// Internal: the single place #focusedItem is written.
	// Does NOT call element.focus() — that side-effect lives in TreeItem's $effect.
	#focusOn(element: HTMLElement | null) {
		this.#focusedItem = element;
	}

	isFocused(element: HTMLElement) {
		return this.#focusedItem === element;
	}

	// --- Selection ---

	selectItem(element: HTMLElement) {
		if (this.#multiselect) {
			this.#selectedItems.add(element);
		} else {
			this.#selectedItems.clear();
			this.#selectedItems.add(element);
		}
	}

	isSelected(element: HTMLElement) {
		return this.#selectedItems.has(element);
	}

	isSelectionEmpty() {
		return this.#selectedItems.size === 0;
	}

	isFirstRootItem(element: HTMLElement) {
		return this.#firstRootItem === element;
	}

	// --- Expansion ---

	expand(element: HTMLElement) {
		this.#expandedItems.add(element);
	}

	collapse(element: HTMLElement) {
		this.#expandedItems.delete(element);
	}

	isExpanded(element: HTMLElement) {
		return this.#expandedItems.has(element);
	}

	expandFocused() {
		if (this.#focusedItem) this.expand(this.#focusedItem);
	}

	collapseFocused() {
		if (this.#focusedItem) this.collapse(this.#focusedItem);
	}

	// True when the focused item has children and is currently collapsed.
	isFocusedItemCollapsed() {
		if (!this.#focusedItem) return false;
		const data = this.#items.get(this.#focusedItem);
		return (data?.hasChildren ?? false) && !this.isExpanded(this.#focusedItem);
	}

	// True when the focused item has children and is currently expanded.
	isFocusedItemExpanded() {
		if (!this.#focusedItem) return false;
		const data = this.#items.get(this.#focusedItem);
		return (data?.hasChildren ?? false) && this.isExpanded(this.#focusedItem);
	}

	// --- Private DOM helpers ---
	// All traversal uses role attribute selectors — transparent to wrapper elements
	// and Svelte transition nodes.

	/** Direct [role=treeitem] children of a container. */
	#directTreeItems(container: HTMLElement): HTMLElement[] {
		return Array.from(container.querySelectorAll<HTMLElement>(":scope > [role='treeitem']"));
	}

	/** The [role=group] child of a treeitem, if present. */
	#getGroup(element: HTMLElement): HTMLElement | null {
		return element.querySelector<HTMLElement>(":scope > [role='group']");
	}

	/** Last visible (recursively expanded) descendant of an item. */
	#findLastVisibleDescendant(element: HTMLElement): HTMLElement {
		const data = this.#items.get(element);
		if (!data?.hasChildren || !this.isExpanded(element)) return element;

		const group = this.#getGroup(element);
		if (!group) return element;

		const children = this.#directTreeItems(group);
		const last = children[children.length - 1];
		if (!last) return element;

		return this.#findLastVisibleDescendant(last);
	}

	/** The treeitem ancestor that owns the group this element lives in, if any. */
	#parentTreeItem(element: HTMLElement): HTMLElement | null {
		const group = element.closest<HTMLElement>("[role='group']");
		if (!group) return null;
		return group.closest<HTMLElement>("[role='treeitem']") ?? null;
	}

	/** The [role=tree] root ancestor. */
	#treeRoot(element: HTMLElement): HTMLElement | null {
		return element.closest<HTMLElement>("[role='tree']");
	}

	// --- Keyboard navigation ---

	focusPrev() {
		if (!this.#focusedItem) {
			this.#focusOn(this.#firstRootItem);
			return;
		}

		const parentGroup = this.#focusedItem.parentElement;
		if (!parentGroup) return;

		const siblings = this.#directTreeItems(parentGroup);
		const idx = siblings.indexOf(this.#focusedItem);

		if (idx === 0) {
			// First in group — move up to the owning treeitem (no-op at root)
			if (parentGroup.getAttribute("role") === "group") {
				const owner = this.#parentTreeItem(this.#focusedItem);
				if (owner) this.#focusOn(owner);
			}
			return;
		}

		this.#focusOn(this.#findLastVisibleDescendant(siblings[idx - 1]));
	}

	focusNext() {
		if (!this.#focusedItem) {
			this.#focusOn(this.#firstRootItem);
			return;
		}

		const data = this.#items.get(this.#focusedItem);

		// Expanded with children — descend into first child
		if (data?.hasChildren && this.isExpanded(this.#focusedItem)) {
			const group = this.#getGroup(this.#focusedItem);
			if (group) {
				const children = this.#directTreeItems(group);
				if (children[0]) {
					this.#focusOn(children[0]);
					return;
				}
			}
		}

		// Try next sibling, then walk up ancestors until we find one or hit root
		let current: HTMLElement = this.#focusedItem;
		while (current) {
			const parentGroup = current.parentElement;
			if (!parentGroup) break;

			const siblings = this.#directTreeItems(parentGroup);
			const idx = siblings.indexOf(current);

			if (idx < siblings.length - 1) {
				this.#focusOn(siblings[idx + 1]);
				return;
			}

			// No next sibling — stop at root, otherwise walk up
			if (parentGroup.getAttribute("role") === "tree") return;

			const owner = this.#parentTreeItem(current);
			if (!owner) return;
			current = owner;
		}
	}

	focusParent() {
		if (!this.#focusedItem) return;
		const parent = this.#parentTreeItem(this.#focusedItem);
		if (parent) this.#focusOn(parent);
	}

	focusFirst() {
		if (this.#firstRootItem) this.#focusOn(this.#firstRootItem);
	}

	focusLast() {
		const anchor =
			(this.#focusedItem ? this.#treeRoot(this.#focusedItem) : null) ??
			(this.#firstRootItem ? this.#treeRoot(this.#firstRootItem) : null);

		if (!anchor) return;

		const rootItems = this.#directTreeItems(anchor);
		const last = rootItems[rootItems.length - 1];
		if (last) this.#focusOn(this.#findLastVisibleDescendant(last));
	}

	// Expand all siblings of the focused item at the same level (* key)
	expandSiblings() {
		if (!this.#focusedItem) return;

		const parentGroup = this.#focusedItem.parentElement;
		if (!parentGroup) return;

		for (const sibling of this.#directTreeItems(parentGroup)) {
			if (this.#items.get(sibling)?.hasChildren) {
				this.expand(sibling);
			}
		}
	}
}

export function setTreeState(multiselect: boolean = false): TreeState {
	return setContext(TREE_KEY, new TreeState(multiselect));
}

export function getTreeState(): TreeState {
	return getContext(TREE_KEY);
}
