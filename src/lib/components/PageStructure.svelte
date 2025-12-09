<script lang="ts">
	import Self from "./PageStructure.svelte";
  import Button from "./Button.svelte";
  import Tree from "./Tree.svelte";
  import TreeItem from "./TreeItem.svelte";
  import { getAppState } from "./app-state.svelte";

  type ComponentMeta = {
    locked: boolean;
    hidden: boolean;
    label: string;
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

  // Union type for all possible node types
  type PageTreeNode = RootNode | ComponentNode;

	type Props = {
    pageTree?: PageTreeNode,
    path?: number[];
	}

  const knownComponents = ["Hero", "StoryBlock", "CollectionBlock", "Card", "ProductCard", "StoryCard",  "FeaturedCategories", "FeaturedCategory"];
  const componentsWithChildren = new Set(["StoryBlock", "CollectionBlock", "FeaturedCategories"]);

	let {
		pageTree = $bindable(),
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

  $inspect($state.snapshot(appState.pageTree));
</script>

{#if pageTree?.type === "root" && pageTree.children.length > 0}
	<Tree>
    {#each pageTree.children as child, index}
      <Self pageTree={child} path={[...path, index]}/>
    {/each}
  </Tree>
{/if}

{#if pageTree?.type === "component" && isKnownComponent}
  <TreeItem hasChildren={canHaveChildren && !!pageTree.children && pageTree.children.length > 0}>
    {#snippet text()}
      {#if pageTree.meta}
        <span class="">
          <Button onclick={editProperties} variant="ghost">
            <span>{pageTree.meta.label}</span>
          </Button>
          <Button onclick={deleteComponent} variant="ghost">
            delete
          </Button>
        </span>  
      {/if}   
    {/snippet}

    {#if canHaveChildren && pageTree.children}
      {#each pageTree.children as child, index}
        <Self pageTree={child} path={[...path, index]} />
      {/each}
    {/if}
  </TreeItem>

  {#if canHaveChildren}
    {#if pageTree.name === "StoryBlock"}
      <Button onclick={() => addCard()}>
        Add Story Card
      </Button>
    {:else if pageTree.name === "FeaturedCategories"}
      <Button size="sm" onclick={() => addFeaturedCategory()}>
        Add Featured Category
      </Button>
    {/if}
  {/if}
{/if}

<style>

</style>