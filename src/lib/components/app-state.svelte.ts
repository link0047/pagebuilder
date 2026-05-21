import type { ComponentNode, RootNode, PageTreeNode, TreePath, PreviewMode } from "./types";
import type { PartialComponentNode } from "./component-registry";
import type { User } from "better-auth";

import { getContext, setContext } from "svelte";
import { PREVIEW_WIDTHS } from "$lib/constants/breakpoints";
import { generateId } from "$lib/utils/unique-id-generator";

const APP_KEY = Symbol("pagetree");

const EMPTY_TREE: RootNode = {
  name: "root",
  type: "root",
  children: [],
};

class AppState {
  // -------------------------
  // Private state
  // -------------------------

  #pageTree = $state<RootNode>(structuredClone(EMPTY_TREE));
  #previewMode = $state<PreviewMode>("desktop");

  #currentBuildId = $state<string | null>(null);
  #buildName = $state<string | null>(null);
  #user = $state<User | null>(null);
  #lastSavedAt = $state<Date | null>(null);
  #isDirty = $state(false);

  #isLocked = $state(false);
  #lockedBy = $state<string | null>(null);

  #selectedComponentPath = $state<number[] | null>(null);
  #selectedComponent = $state<ComponentNode | null>(null);
  #isPropertiesPanelOpen = $state(false);

  #hoveredComponentPath = $state<number[] | null>(null);

  // -------------------------
  // Getters — page tree
  // -------------------------

  get pageTree(): RootNode {
    return this.#pageTree;
  }

  // -------------------------
  // Getters — preview
  // -------------------------

  get previewMode(): PreviewMode {
    return this.#previewMode;
  }

  set previewMode(mode: PreviewMode) {
    this.#previewMode = mode;
  }

  get previewWidth(): number {
    return PREVIEW_WIDTHS[this.#previewMode] ?? PREVIEW_WIDTHS.desktop;
  }

  // -------------------------
  // Getters — build identity
  // -------------------------

  get currentBuildId(): string | null {
    return this.#currentBuildId;
  }

  get buildName(): string | null {
    return this.#buildName;
  }

  get lastSavedAt(): Date | null {
    return this.#lastSavedAt;
  }

  get isDirty(): boolean {
    return this.#isDirty;
  }

  // -------------------------
  // Getters — lock state
  // -------------------------

  get isLocked(): boolean {
    return this.#isLocked;
  }

  get lockedBy(): string | null {
    return this.#lockedBy;
  }

  // -------------------------
  // Getters — selection
  // -------------------------

  get selectedComponent(): ComponentNode | null {
    return this.#selectedComponent;
  }

  get selectedComponentPath(): number[] | null {
    return this.#selectedComponentPath;
  }

  get isPropertiesPanelOpen(): boolean {
    return this.#isPropertiesPanelOpen;
  }

  // -------------------------
  // Getters — hover
  // -------------------------

  get hoveredComponentPath(): number[] | null {
    return this.#hoveredComponentPath;
  }

  get user() {
    return this.#user;
  }

  setUser(user: User): void {
    this.#user = user;
  }

  // -------------------------
  // Build management
  // -------------------------

  loadBuild(
    buildData: RootNode,
    buildId?: string,
    buildName?: string,
  ): void {
    if (!buildData || buildData.type !== "root") {
      console.error("Invalid build data: expected a root node");
      return;
    }

    this.#pageTree = structuredClone(buildData);
    this.#currentBuildId = buildId ?? null;
    this.#buildName = buildName ?? null;
    this.#lastSavedAt = null;
    this.#isDirty = false;
    this.#resetSelection();
  }

  clearBuild(): void {
    this.#pageTree = structuredClone(EMPTY_TREE);
    this.#currentBuildId = null;
    this.#buildName = null;
    this.#lastSavedAt = null;
    this.#isDirty = false;
    this.#isLocked = false;
    this.#lockedBy = null;
    this.#resetSelection();
  }

  getSavePayload(): { content: RootNode; isNew: boolean; id: string | null } {
    return {
      content: $state.snapshot(this.#pageTree) as RootNode,
      isNew: !this.#currentBuildId,
      id: this.#currentBuildId,
    };
  }

  onSaveSuccess(id: string, name: string): void {
    this.#currentBuildId = id;
    this.#buildName = name;
    this.#isDirty = false;
    this.#lastSavedAt = new Date();
  }

  renameBuild(name: string): void {
    this.#buildName = name;
  }

  // -------------------------
  // Lock management
  // -------------------------

  acquireLock(userId: string): void {
    this.#isLocked = true;
    this.#lockedBy = userId;
  }

  releaseLock(): void {
    this.#isLocked = false;
    this.#lockedBy = null;
  }

  // -------------------------
  // Tree mutation
  // -------------------------

  insertComponent(
    component: PartialComponentNode,
    path: TreePath = []
  ): void {
    const target = this.getNodeAtPath(path);
    if (!target) return;

    const newComponent = this.#normalizeComponent(component);

    if (target.type === "root" || target.children) {
      target.children = target.children ?? [];
      target.children.push(newComponent);
      this.#isDirty = true;
    }
  }

  removeComponent(path: TreePath): boolean {
    if (path.length === 0) return false;

    const parentPath = path.slice(0, -1);
    const childIndex = path[path.length - 1];
    const parent = this.getNodeAtPath(parentPath);

    if (!parent?.children?.[childIndex]) return false;

    parent.children.splice(childIndex, 1);
    this.#isDirty = true;
    return true;
  }

  moveComponent(path: TreePath, direction: "up" | "down"): boolean {
    if (path.length === 0) return false;

    const parentPath = path.slice(0, -1);
    const index = path[path.length - 1];
    const parent = this.getNodeAtPath(parentPath);

    if (!parent?.children) return false;

    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= parent.children.length) return false;

    const children = parent.children;
    [children[index], children[targetIndex]] = [children[targetIndex], children[index]];

    this.#isDirty = true;
    return true;
  }

  // -------------------------
  // Selection
  // -------------------------

  selectComponent(path: number[]): void {
    const component = this.getNodeAtPath(path);
    if (component?.type !== "component") return;

    this.#selectedComponentPath = path;
    this.#selectedComponent = component;
    this.#isPropertiesPanelOpen = true;
  }

  deselectComponent(): void {
    this.#resetSelection();
  }

  // -------------------------
  // Hover
  // -------------------------

  hoverComponent(path: number[] | null): void {
    this.#hoveredComponentPath = path;
  }

  // -------------------------
  // Property updates
  // -------------------------

  updateProperty(propertyPath: string, value: any): void {
    if (!this.#selectedComponentPath) return;

    const component = this.getNodeAtPath(this.#selectedComponentPath);
    if (component?.type !== "component") return;

    const target = this.#resolveSection(component, propertyPath);
    if (!target) return;

    const keyParts = propertyPath.split(".").slice(1);
    this.#setNestedValue(target, keyParts, value);

    this.#selectedComponent = component;
    this.#isDirty = true;
  }

  getPropertyValue(propertyPath: string): any {
    if (!this.#selectedComponent) return "";

    const source = this.#resolveSection(this.#selectedComponent, propertyPath);
    if (!source) return "";

    const keyParts = propertyPath.split(".").slice(1);
    return this.#getNestedValue(source, keyParts) ?? "";
  }

  // -------------------------
  // Tree traversal
  // -------------------------

  getNodeAtPath(path: TreePath): PageTreeNode | null {
    let current: PageTreeNode = this.#pageTree;

    for (const index of path) {
      if (!current.children?.[index]) return null;
      current = current.children[index];
    }

    return current;
  }

  // -------------------------
  // Private helpers
  // -------------------------

  #normalizeComponent(component: PartialComponentNode): ComponentNode {
    return {
      ...component,
      id: component.id ?? crypto.randomUUID(),
      props: {
        ...component.props,
        ...(component.name === "RecommendationBlock" && !component.props.blockId
          ? { blockId: `spn-ui-recblock-${generateId("recblock")}` }
          : {}),
      },
      meta: {
        locked: false,
        hidden: false,
        label: component.name,
        ...component.meta,
        id: crypto.randomUUID(),
      },
      children: component.children?.map((child) => this.#normalizeComponent(child)),
    };
  }

  #resetSelection(): void {
    this.#selectedComponentPath = null;
    this.#selectedComponent = null;
    this.#isPropertiesPanelOpen = false;
  }

  #resolveSection(
    component: ComponentNode,
    propertyPath: string
  ): Record<string, any> | null {
    const section = propertyPath.split(".")[0];

    if (section === "props") return component.props;
    if (section === "data") return component.data;
    if (section === "meta") return component.meta as Record<string, any>;

    return null;
  }

  #setNestedValue(target: Record<string, any>, keyParts: string[], value: any): void {
    let current = target;

    for (let i = 0; i < keyParts.length - 1; i++) {
      const key = keyParts[i];
      if (!current[key] || typeof current[key] !== "object") {
        current[key] = {};
      }
      current = current[key];
    }

    current[keyParts[keyParts.length - 1]] = value;
  }

  #getNestedValue(source: Record<string, any>, keyParts: string[]): any {
    let current = source;

    for (const key of keyParts) {
      if (current && typeof current === "object" && key in current) {
        current = current[key];
      } else {
        return undefined;
      }
    }

    return current;
  }
}

export function setAppState(): AppState {
  return setContext(APP_KEY, new AppState());
}

export function getAppState(): AppState {
  return getContext<AppState>(APP_KEY);
}
