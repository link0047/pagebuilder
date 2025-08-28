import { getContext, setContext } from "svelte";

const APP_KEY = Symbol("pagetree");

type ComponentMeta = {
  locked: boolean;
  hidden: boolean;
  label: string;
  id?: string;
  parentId?: string;
};

type ComponentNode = {
  type: "component";
  name: string;
  meta: ComponentMeta;
  props: Record<string, any>;
  data: Record<string, any>;
  children?: PageTreeNode[];
};

type RootNode = {
  name: string;
  type: "root";
  children: PageTreeNode[];
};

type PageTreeNode = RootNode | ComponentNode;
type TreePath = number[];
type PreviewMode = "mobile" | "tablet" | "desktop";

class AppState {
  #isPropertiesPanelOpen = $state(false);
  selectedComponentPath = $state<number[] | null>(null);
  selectedComponent = $state<ComponentNode | null>(null);
  #pageTree = $state<RootNode>({
		name: "root",
		type: "root",
		children: []
	});
  #previewMode = $state<PreviewMode>("desktop");

  constructor() {}
  
  get pageTree(): RootNode {
    return this.#pageTree;
  }

  get isPropertiesPanelOpen() {
    return this.#isPropertiesPanelOpen;
  }

  set isPropertiesPanelOpen(value) {
    this.#isPropertiesPanelOpen = value;
  }

  get previewMode(): PreviewMode {
    return this.#previewMode;
  }

  set previewMode(mode: PreviewMode) {
    this.#previewMode = mode;
  }

  get previewWidth(): number {
    switch (this.#previewMode) {
      case "mobile":
        return 375;
      case "tablet":
        return 768;
      case "desktop":
        return 1200;
      default:
        return 1200;
    }
  }

  addComponent(
    component: Omit<ComponentNode, "meta"> & { meta: Partial<ComponentMeta> },
    path: TreePath = []
  ): void {
    const target = this.getNodeAtPath(path);
    if (!target) return;

    const newComponent: ComponentNode = {
      ...component,
      meta: {
        locked: false,
        hidden: false,
        label: component.name,
        id: crypto.randomUUID(),
        ...component.meta
      }
    };

    if (target.type === "root" || target.children) {
      target.children = target.children || [];
      target.children.push(newComponent);
    }
  }

  removeComponent(path: TreePath): boolean {
    if (path.length === 0) return false;
    
    const parentPath = path.slice(0, -1);
    const childIndex = path[path.length - 1];
    const parent = this.getNodeAtPath(parentPath);
    
    if (!parent || !parent.children || !parent.children[childIndex]) {
      return false;
    }
    
    parent.children.splice(childIndex, 1);
    return true;
  }

  selectComponentForEditing(path: number[]) {
    const component = this.getNodeAtPath(path);
    if (component?.type === "component") {
      this.selectedComponentPath = path;
      this.selectedComponent = component;
      this.isPropertiesPanelOpen = true;
    }
  }

  updateComponentProperty(propertyPath: string, value: any) {
    if (!this.selectedComponentPath) return;

    const component = this.getNodeAtPath(this.selectedComponentPath);
    if (component?.type !== "component") return;

    const parts = propertyPath.split(".");
    const [section, ...keyParts] = parts;
    
    let target: Record<string, any>;
    if (section === "props") {
      target = component.props;
    } else if (section === "data") {
      target = component.data;
    } else if (section === "meta") {
      target = component.meta as Record<string, any>;
    } else {
      return;
    }

    if (keyParts.length === 1) {
      // Simple property like "props.title"
      target[keyParts[0]] = value;
    } else {
      // Nested property like "props.images.desktop" or "props.promo.value"
      let current = target;
      
      // Navigate to the nested property, creating objects as needed
      for (let i = 0; i < keyParts.length - 1; i++) {
        const key = keyParts[i];
        if (!current[key] || typeof current[key] !== 'object') {
          current[key] = {};
        }
        current = current[key];
      }
      
      // Set the final value
      const finalKey = keyParts[keyParts.length - 1];
      current[finalKey] = value;
    }

    // Update the selected component reference to trigger reactivity
    this.selectedComponent = component;
  }

  closePropertiesPanel() {
    this.isPropertiesPanelOpen = false;
    this.selectedComponentPath = null;
    this.selectedComponent = null;
  }

  getNodeAtPath(path: TreePath): PageTreeNode | null {
    let current: PageTreeNode = this.#pageTree;
    
    for (const index of path) {
      if (!current.children || !current.children[index]) {
        return null;
      }
      current = current.children[index];
    }
    
    return current;
  }
}

export function setAppState(): AppState {
  return setContext(APP_KEY, new AppState());
}

export function getAppState() {
  return getContext<AppState>(APP_KEY);
}