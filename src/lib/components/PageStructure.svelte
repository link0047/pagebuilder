<script lang="ts">
	import Self from "./PageStructure.svelte";
  import Button from "./Button.svelte";
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

  const knownComponents = ["Hero", "HeroWithText", "HeroWithVideo", "StoryBlock", "CollectionBlock", "Card", "CardWithVideo", "CardWithPromo", "CardWithText","ProductCard", "StoryCard"];
  const componentsWithChildren = new Set(["StoryBlock", "CollectionBlock"]);

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
</script>

{#if pageTree?.type === "root" && pageTree.children.length > 0}
	{#each pageTree.children as child, index}
		<Self pageTree={child} path={[...path, index]}/>
	{/each}
{/if}

{#if pageTree?.type === "component" && isKnownComponent}
  <div class="item">
    {#if pageTree.meta}
      <span>
        <button type="button" onclick={editProperties} class="edit-btn">
          <span>{pageTree.meta.label}</span>
        </button>
        <button type="button" onclick={deleteComponent} class="delete-btn">
          delete
        </button>
      </span>
    {/if}

    {#if canHaveChildren && pageTree.children}
      <div class="group">
        {#each pageTree.children as child, index}
          <Self pageTree={child} path={[...path, index]} />
        {/each}
      </div>
    {/if}
    {#if canHaveChildren}
      <Button onclick={() => addCard()}>
        Add Story Card
      </Button>
    {/if}
  </div>
{/if}