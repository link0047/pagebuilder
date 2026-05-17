import { getContext, setContext } from "svelte";
import type { TabsConfig, Tab } from "./tabs.types";

const TABS_KEY = Symbol("TABS");

let tabId = 0;
let panelId = 0;
let headingId = 0;

class TabState {
  #tabs = $state<Tab[]>([]);
  #panels = $state<string[]>([]);
  #headingId = $state<string | null>(null);
  #selectedTabValue = $state<string | null>(null);
  #config: () => TabsConfig;

  constructor(config: () => TabsConfig) {
    this.#config = config;
    this.#selectedTabValue = config().value ?? null;
  }

  get config() {
    return this.#config();
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
      this.#headingId = `uikit-tabs-heading-${headingId++}`;
    }
    return this.#headingId;
  }

  get selectedTabValue(): string | null {
    return this.#selectedTabValue;
  }

  isTabSelected(tabValue: string): boolean {
    return this.#selectedTabValue === tabValue;
  }

  registerTabElement(tabId: string, element: HTMLElement): void {
    const tab = this.#tabs.find(t => t.id === tabId);
    if (tab) {
      tab.element = element;
    }
  }

  addTab(value?: string): { id: string; value: string } {
    const id = `uikit-tab-${tabId++}`;
    const resolvedValue = value ?? id;

    if (this.#tabs.find(t => t.value === resolvedValue)) {
      console.warn(`Tab with value "${resolvedValue}" already exists`);
      return { id, value: resolvedValue };
    }

    const tab: Tab = { id, value: resolvedValue, element: null };

    this.#tabs.push(tab);

    if (this.#tabs.length === 1 && !this.#selectedTabValue) {
      this.#selectedTabValue = resolvedValue;
    } else if (this.config.value && this.config.value === resolvedValue) {
      this.#selectedTabValue = resolvedValue;
    }

    return { id, value: resolvedValue };
  }

  removeTab(tabValue: string): void {
    const tabIndex = this.#tabs.findIndex((t) => t.value === tabValue);
    if (tabIndex === -1) return;

    this.#tabs.splice(tabIndex, 1);

    if (this.#selectedTabValue === tabValue) {
      if (this.#tabs.length > 0) {
        const newActiveIndex = Math.min(tabIndex, this.#tabs.length - 1);
        this.#selectedTabValue = this.#tabs[newActiveIndex]?.value ?? null;
      } else {
        this.#selectedTabValue = null;
      }
    }
  }

  setSelectedTab(tabValue: string): void {
    const tab = this.#tabs.find((t) => t.value === tabValue);
    if (!tab) {
      console.warn(`Tab with value "${tabValue}" does not exist`);
      return;
    }
    this.#selectedTabValue = tabValue;
    // Notify the parent so bind:value works.
    this.#config().onValueChange(tabValue);
  }

  selectNextTab(): void {
    if (this.#tabs.length === 0) return;
    const currentIndex = this.#tabs.findIndex((t) => t.value === this.#selectedTabValue);
    const nextIndex = (currentIndex + 1) % this.#tabs.length;
    const tab = this.#tabs[nextIndex];
    this.setSelectedTab(tab.value);
    tab.element?.focus();
  }

  selectPreviousTab(): void {
    if (this.#tabs.length === 0) return;
    const currentIndex = this.#tabs.findIndex((t) => t.value === this.#selectedTabValue);
    const prevIndex = currentIndex === 0 ? this.#tabs.length - 1 : currentIndex - 1;
    const tab = this.#tabs[prevIndex];
    this.setSelectedTab(tab.value);
    tab.element?.focus();
  }

  selectFirstTab(): void {
    if (this.#tabs.length === 0) return;
    const firstTab = this.#tabs[0];
    this.setSelectedTab(firstTab.value);
    firstTab.element?.focus();
  }

  selectLastTab(): void {
    if (this.#tabs.length === 0) return;
    const lastTab = this.#tabs[this.#tabs.length - 1];
    this.setSelectedTab(lastTab.value);
    lastTab.element?.focus();
  }

  addPanel(): string {
    const id = `uikit-panel-${panelId++}`;

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

  getPanelIdForTab(tabValue: string): string | undefined {
    const currentIndex = this.#tabs.findIndex((t) => t.value === tabValue);
    return this.#panels[currentIndex];
  }

  getTabValueForPanelIndex(index: number): string | undefined {
    return this.#tabs[index]?.value;
  }
}

export type { TabState };

export function setTabState(config: () => TabsConfig) {
  return setContext(TABS_KEY, new TabState(config));
}

export function getTabState(): TabState {
  return getContext(TABS_KEY);
}
