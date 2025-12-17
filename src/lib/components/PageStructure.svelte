<script lang="ts">
	import PageStructure from "./PageStructure.svelte";
  import Button from "./Button.svelte";
  import Tree from "./Tree.svelte";
  import TreeItem from "./TreeItem.svelte";
  import { getAppState } from "./app-state.svelte";
  import Icon from "./Icon.svelte";

  type ComponentMeta = {
    locked: boolean;
    hidden: boolean;
    label: string;
  };

  type ComponentNode = {
    id?: string;
    type: "component";
    name: string;
    meta: ComponentMeta;
    props: Record<string, any>;
    data: Record<string, any>;
    children?: PageTreeNode[];
  };

  type RootNode = {
    id?: string;
    name: string;
    type: "root";
    children: PageTreeNode[];
  };

  // Union type for all possible node types
  type PageTreeNode = RootNode | ComponentNode;

	type Props = {
    pageTree?: PageTreeNode,
    path?: number[];
	}

  const knownComponents = ["Hero", "StoryBlock", "CollectionBlock", "Card", "ProductCard", "StoryCard",  "FeaturedCategories", "FeaturedCategory"];
  const componentsWithChildren = new Set(["StoryBlock", "CollectionBlock", "FeaturedCategories"]);

	let {
		pageTree,
    path = []
	}: Props = $props();

  let appState = getAppState();
  let canHaveChildren = $derived(pageTree?.type === "component" && componentsWithChildren.has(pageTree.name));
  let isKnownComponent = $derived(pageTree?.type === "component" &&  knownComponents.includes(pageTree.name));

  function deleteComponent() {
    if (appState && path.length > 0) {
      appState.removeComponent(path)
    }
  }

  function editProperties() {
    if (appState && path.length > 0) {
      appState.selectComponentForEditing(path);
    }
  }

  function addCard() {
    if (appState && canHaveChildren) {
      // Default card component to add
      const defaultCard = {
        id: crypto.randomUUID(),
        type: "component" as const,
        name: "StoryCard",
        props: {
          // headline: "New Card",
          // subhead: "Card subtitle",
          // supportingText: "Card description",
          images: {
            desktop: "",
            tablet: "",
            mobile: "",
          },
          backgroundColor: "#fff",
          textAlignment: "center"
        },
        data: {},
        meta: {
          label: "Story Card",
          locked: false,
          hidden: false
        }
      };

      appState.addComponent(defaultCard, path);
    }
  }

  function addFeaturedCategory() {
    if (appState && canHaveChildren) {
      const defaultCategory = {
        id: crypto.randomUUID(),
        type: "component" as const,
        name: "FeaturedCategory",
        props: {
          image: "",
          text: "",
          href: ""
        },
        data: {},
        meta: {
          label: "Featured Category"
        }
      };

      appState.addComponent(defaultCategory, path);
    }
  }
</script>

{#if pageTree?.type === "root" && pageTree.children.length > 0}
{#key pageTree.children.length}
	<Tree>
    {#each pageTree.children as child, index (child.id)}
      <PageStructure pageTree={child} path={[...path, index]} />
    {/each}
  </Tree>
  {/key}
{/if}

{#if pageTree?.type === "component" && isKnownComponent}
  <TreeItem 
    hasChildren={canHaveChildren && !!pageTree.children && pageTree.children.length > 0}
    expanded={true}
  >
    {#snippet text()}
      {#if pageTree.meta}
      <span class="uikit-page-structure-meta">
        <button class="uikit-page-structure-meta__edit-properties" type="button" onclick={editProperties}>
          <span>{pageTree.meta.label}</span>
        </button>
        <Button onclick={deleteComponent} variant="ghost" size="sm" shape="rounded-square">
          <Icon size="16">
            <use href="#delete" />
          </Icon>
        </Button>
      </span>  
      {/if}   
    {/snippet}

    {#if canHaveChildren && pageTree.children}
      {#each pageTree.children as child, index (child.id)}
        <PageStructure pageTree={child} path={[...path, index]} />
      {/each}
    {/if}

    {#if canHaveChildren}
      {#if pageTree.name === "StoryBlock"}
        <TreeItem>
          {#snippet text()}
            <div class="uikit-page-structure-add-action">
              <button class="uikit-page-structure-add-action__button" type="button" onclick={() => addCard()}>
                <Icon>
                  <use href="#plus-circle-outline" />
                </Icon>
                Add Story Card
              </button>
            </div>
          {/snippet}
        </TreeItem>
      {:else if pageTree.name === "FeaturedCategories"}
        <TreeItem>
          {#snippet text()}
            <div class="uikit-page-structure-add-action">
              <button class="uikit-page-structure-add-action__button" type="button" onclick={() => addFeaturedCategory()}>
                <Icon>
                  <use href="#plus-circle-outline" />
                </Icon>
                Add Featured Category
              </button>
            </div>
          {/snippet}
        </TreeItem>
      {/if}
    {/if}
  </TreeItem>
{/if}

<style>
  .uikit-page-structure-meta {
    display: flex;
    height: 100%;
    width: 100%;
    flex-direction: row;
    gap: .25rem;
    padding-block: .25rem;
    padding-inline-end: .5rem;
  }

  .uikit-page-structure-add-action__button,
  .uikit-page-structure-meta__edit-properties {
    flex-grow: 1;
    background-color: transparent;
    border: none;
    text-align: start;
    padding: 0;
    margin: 0;
    cursor: pointer;
  }

  .uikit-page-structure-add-action__button {
    display: inline-flex;
    align-items: center;
    gap: .5ch;
    letter-spacing: .04em;
    font-weight: 500;
    height: 2.5rem;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
    color: #2a508f;
  }
</style>