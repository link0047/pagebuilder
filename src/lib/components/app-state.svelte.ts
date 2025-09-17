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

  renderChildren(children: PageTreeNode[]): string {
    return children.map(child => this.renderNode(child)).join("\n");
  }

  renderComponent(node: ComponentNode) {
    switch(node.name) {
      case "Hero": {
        const { props } = node;
        const {
          images = {},
          alt = '',
          headline,
          subheading,
          supportingText,
          href,
          layout = 'overlay',
          contentConfig = {},
          width = 1200,
          height = 460,
          breakpoints,
          backgroundColor = '#fff'
        } = props;

        const hasContent = headline || subheading || supportingText;

        const imageHTML = `
          <picture class="uikit-hero__media">
            ${images.desktop ? `<source srcset="${images.desktop}" media="(min-width: 1024px)">` : ''}
            ${images.tablet ? `<source srcset="${images.tablet}" media="(min-width: 768px)">` : ''}
            <img src="${images.mobile || ''}" width="${width}" height="${height}" alt="${alt}" loading="eager">
          </picture>
        `;

        const visualElement = href 
          ? `<a class="uikit-hero__visual" href="${href}">${imageHTML}</a>`
          : `<div class="uikit-hero__visual">${imageHTML}</div>`;

        const contentHTML = hasContent ? `
          <div class="uikit-hero__content" style="
            --uikit-hero-content-grid-mobile="${contentConfig.mobile?.grid.start} / ${contentConfig?.mobile.grid.span}"
            --uikit-hero-content-grid-tablet="${contentConfig.tablet?.grid.start} / ${contentConfig?.tablet.grid.span}"
            --uikit-hero-content-grid-desktop="${contentConfig.desktop?.grid.start} / ${contentConfig?.desktop.grid.span}"
            --uikit-hero-content-text-align-mobile: ${contentConfig.mobile?.textAlign || 'center'};
            --uikit-hero-content-text-align-tablet: ${contentConfig.tablet?.textAlign || 'center'};
            --uikit-hero-content-text-align-desktop: ${contentConfig.desktop?.textAlign || 'center'};
            --uikit-hero-content-padding-mobile: ${contentConfig.mobile?.padding || '1rem'};
            --uikit-hero-content-padding-tablet: ${contentConfig.tablet?.padding || '1rem'};
            --uikit-hero-content-padding-desktop: ${contentConfig.desktop?.padding || '1rem'};
            --uikit-hero-content-justify-mobile: ${contentConfig.mobile?.justify || 'center'};
            --uikit-hero-content-justify-tablet: ${contentConfig.tablet?.justify || 'center'};
            --uikit-hero-content-justify-desktop: ${contentConfig.desktop?.justify || 'center'};
            --uikit-hero-content-align-mobile: ${contentConfig.mobile?.align || 'center'};
            --uikit-hero-content-align-tablet: ${contentConfig.tablet?.align || 'center'};
            --uikit-hero-content-align-desktop: ${contentConfig.desktop?.align || 'center'};
          ">
            ${headline ? `<h2 class="uikit-hero__headline">${headline}</h2>` : ''}
            ${subheading ? `<h3 class="uikit-hero__subheading">${subheading}</h3>` : ''}
            ${supportingText ? `<p class="uikit-hero__supportingText">${supportingText}</p>` : ''}
          </div>
        ` : '';

        return `
          <div class="uikit-hero uikit-hero--${layout}" style="
            --uikit-hero-breakpoint-tablet="${breakpoints?.tablet}px"
            --uikit-hero-breakpoint-desktop="${breakpoints?.desktop}px"
          ">
            ${visualElement}
            ${contentHTML}
          </div>
        `;
      }
      case "HeroCTA": {
        const { props } = node;
        return "";
      }
      case "CollectionBlock": {
        const { props } = node;
        return "";
      }
      case "ProductCard": {
        const { props } = node;
        return "";
      }
      case "StoryBlock": {
        const { props } = node;
        const {
          title = "",
          titleAlignment = "center",
          backgroundColor = "#fff"
        } = props;

        const childrenHTML = node.children ? node.children.map(child => this.renderNode(child)).join("") : "";

        return `
          <section 
            class="uikit-storyblock"
            style:--uikit-storyblock-background=${backgroundColor}
          >
            {#if title}
              <header 
                class="uikit-storyblock__header uikit-storyblock__header--alignment-${titleAlignment}"
              >
                <h2 class="uikit-storyblock__title">
                  ${title}
                </h2>
              </header>
            {/if}
            <div class="uikit-storyblock__container">
               ${childrenHTML}
            </div>
          </section>
        `;
      }
      case "StoryCard": {
        const { props, meta } = node;
        const {
          href = "",
          images = {},
          alt = "",
          video = "",
          headline = "",
          subhead = "",
          supportingText = "",
          textAlignment = "center",
          spanColumn = {},
          spanRow = {},
          promo = {},
          hidden,
          backgroundColor = "#fff",
          textColor = "#212121"
        } = props;

        const hasContent = headline || subhead || supportingText

        return `
        <div 
          class="uikit-story-card uikit-story-card--textAlignment-{textAlignment}" style="
          --uikit-storycard-column-d=${spanColumn.desktop || null}
          --uikit-storycard-column-m=${spanColumn.mobile || null}
          --uikit-storycard-row-d=${spanRow.desktop || null}
          --uikit-storycard-row-m=${spanRow.mobile || null}
          --uikit-storycard-background=${backgroundColor}
	        --uikit-storycard-color=${textColor}
          --uikit-storycard-display-d=${hidden.desktop ? "none" : "block"}
          --uikit-storycard-display-m=${hidden.mobile ? "none" : "block"}"
        >
          <a class="uikit-story-card__link" href=${href}>
            <picture class="uikit-story-card__media">
              <source media="(max-width: 560px)" srcset=${images?.mobile}>
              <img src={images?.desktop} alt="${alt}" width="${280}" height="${280}" />
            </picture>
            ${hasContent ? `
            <div class="uikit-story-card__content">
              ${headline && subhead ? `
                <hgroup class="uikit-story-card__heading-group">
                  <h3 class="uikit-story-card__headline">${headline}</h3>
                  <p class="uikit-story-card__subhead">${subhead}</p>
                </hgroup>
              ` : headline ? `
                <h3 class="uikit-story-card__headline">${headline}</h3>
              ` : subhead ? `
                <p class="uikit-story-card__subhead">${subhead}</p>
              ` : ""}
              ${supportingText ? `
                <div class="uikit-story-card__supportingText">
                  ${supportingText}
                </div>
              ` : ""}
            </div>
            ` : ""}
          </a>
        </div>
        `;
      }
      case "FeaturedCategories": {
        const { props } = node;
        return "";
      }
      case "FeaturedCategory": {
        const { props } = node;
        return "";
      }
      default:
        return "";
    }
  }

  renderNode(node: PageTreeNode): string {
    if (node.type === "root") {
      return this.renderChildren(node.children);
    }

    if (node.type === "component") {
      return this.renderComponent(node);
    }

    return "";
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