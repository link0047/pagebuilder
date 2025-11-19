import { getContext, setContext } from "svelte";
import type { TabsConfig, Tab } from "./tabs.types";

const TABS_KEY = Symbol("TABS");

class TabState {
	static tabId = 0;
	static panelId = 0;
	static headingId = 0;
	
	#tabs = $state<Tab[]>([]);
	#panels = $state<string[]>([]);
	#headingId = $state<string | null>(null);
	#selectedTabId = $state<string | null>(null);
	#config = $state<TabsConfig>({} as TabsConfig);
	
	constructor(config: TabsConfig) {
		this.#config = config;
	}

	get config() {
		return this.#config;
	}

	get tabs(): Tab[] {
		return this.#tabs;
	}
	
	get panels(): string[] {
		return this.#panels;
	}

	get headingId(): string {
    // Generate only when first accessed
    if (!this.#headingId) {
      this.#headingId = `uikit-tabs-heading-${TabState.headingId++}`;
    }
    return this.#headingId;
  }

	isTabSelected(tabId: string): boolean {
		return this.#selectedTabId === tabId;
	}

	registerTabElement(tabId: string, element: HTMLElement): void {
    const tab = this.#tabs.find(t => t.id === tabId);
    if (tab) {
      tab.element = element;
    }
  }
	
	addTab(): string {
    const id = `uikit-tab-${TabState.tabId++}`;
    const tab = { id, element: null };
    
    if (this.#tabs.find(t => t.id === id)) {
      console.warn(`Tab with id "${id}" already exists`);
      return id;
    }
    
    this.#tabs.push(tab);
    
    if (this.#tabs.length === 1 || !this.#selectedTabId) {
      this.#selectedTabId = id;
    }
    
    return id;
  }

	removeTab(tabId: string): void {
		const tabIndex = this.#tabs.findIndex(t => t.id === tabId);
		if (tabIndex === -1) return;

		this.#tabs.splice(tabIndex, 1);

		if (this.#selectedTabId === tabId) {
			if (this.#tabs.length > 0) {
				const newActiveIndex = Math.min(tabIndex, this.#tabs.length - 1);
				this.#selectedTabId = this.#tabs[newActiveIndex]?.id || null;
			} else {
				this.#selectedTabId = null;
			}
		}
	}

	setSelectedTab(tabId: string): void {
		const tabIndex = this.#tabs.findIndex(t => t.id === tabId);
		if (tabIndex !== -1) {
			this.#selectedTabId = tabId;
		} else {
			console.warn(`Tab with id "${tabId}" does not exist`);
		}
	}

	selectNextTab(): void {
    if (this.#tabs.length === 0) return;
    const currentIndex = this.#tabs.findIndex(t => t.id === this.#selectedTabId);
    const nextIndex = (currentIndex + 1) % this.#tabs.length;
		const tab = this.#tabs[nextIndex];
    this.#selectedTabId = tab.id;
		tab.element?.focus();
  }
	
	selectPreviousTab(): void {
		if (this.#tabs.length === 0) return;

		const currentIndex = this.#tabs.findIndex(t => t.id === this.#selectedTabId);
		const prevIndex = currentIndex === 0 ? this.#tabs.length - 1 : currentIndex - 1;
		const tab = this.#tabs[prevIndex];
		this.#selectedTabId = tab.id;
		tab.element?.focus();
	}

	selectFirstTab(): void {
	  if (this.#tabs.length === 0) return;
		
	  const firstTab = this.#tabs[0];
	  this.#selectedTabId = firstTab.id;
	  firstTab.element?.focus();
	}
	
	selectLastTab(): void {
	  if (this.#tabs.length === 0) return;
		
	  const lastTab = this.#tabs[this.#tabs.length - 1];
	  this.#selectedTabId = lastTab.id;
	  lastTab.element?.focus();
	}

	addPanel(): string {
		const id = `uikit-panel-${TabState.panelId++}`;

		if (this.#panels.indexOf(id) !== -1) {
			console.warn(`Panel with id "${id}" already exists`);
			return id;
		}

		this.#panels.push(id);
		
		return id;
	}

	removePanel(panelId: string): void {
		const panelIndex = this.#panels.indexOf(panelId);
		if (panelIndex === -1) return;

		this.#panels.splice(panelIndex, 1);
	}

	getPanelIdForTab(tabId: string): string | undefined {
		const currentIndex = this.#tabs.findIndex(t => t.id === tabId);
		return this.#panels[currentIndex];
	}
}

export type { TabState };

export function setTabState(config: TabsConfig) {
	return setContext(TABS_KEY, new TabState(config));
}

export function getTabState(): TabState {
	return getContext(TABS_KEY);
}