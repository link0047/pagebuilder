<script lang="ts">
  import Hero from "./Hero.svelte";
	import Card from "./Card.svelte";
  import FeaturedCategories from "./FeaturedCategories.svelte";
  import FeaturedCategory from "./FeaturedCategory.svelte";
  import StoryBlock from "./StoryBlock.svelte";
  import CollectionBlock from "./CollectionBlock.svelte";
  import ProductCard from "./ProductCard.svelte";
  import StoryCard from "./StoryCard.svelte";
	import Self from "./Preview.svelte";

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
    pageTree?: PageTreeNode 
	}

	let {
		pageTree = $bindable()
	}: Props = $props();

  const shouldRender = $derived(pageTree?.type !== "component" || !pageTree.meta.hidden);
</script>

{#if pageTree?.type === "root" && pageTree.children.length <= 0}
  <div class="preview-empty">
    <svg class="preview-empty__icon" width="64" height="64">
      <use href="/favicon.svg" />
    </svg>
    <h2 class="preview-empty__title">Start Building</h2>
    <div class="preview-empty__description">
      Select a build from "My Builds" or go to the "Editor" tab to create a new one
    </div>
  </div>
{/if}

{#if pageTree?.type === "root" && pageTree.children.length > 0}
	{#each pageTree.children as child}
		<Self pageTree={child} />
	{/each}
{/if}

{#if pageTree?.type === "component" && shouldRender}
  {#if pageTree.name === "Hero"}
    <Hero {...pageTree.props} />
  {:else if pageTree.name === "StoryBlock"}
    <StoryBlock {...pageTree.props}>
      {#if pageTree.children}
        {#each pageTree.children as child}
          <Self pageTree={child} />
        {/each}
      {/if}
    </StoryBlock>
  {:else if pageTree.name === "StoryCard"}
    <StoryCard {...pageTree.props}>
      {#if pageTree.data.content}
        {@html pageTree.data.content}
      {/if}
    </StoryCard>
  {:else if pageTree.name === "CollectionBlock"}
    <CollectionBlock {...pageTree.props}>
      {#if pageTree.data.content}
        {@html pageTree.data.content}
      {/if}
      {#if pageTree.children}
        {#each pageTree.children as child}
          <Self pageTree={child} />
        {/each}
      {/if}
    </CollectionBlock>
  {:else if pageTree.name === "ProductCard"}
    <ProductCard {...pageTree.props}>
      {#if pageTree.data.content}
        {@html pageTree.data.content}
      {/if}
    </ProductCard>
  {:else if pageTree.name === "FeaturedCategories"}
    <FeaturedCategories {...pageTree.props}>
      {#if pageTree.children}
        {#each pageTree.children as child}
          <Self pageTree={child} />
        {/each}
      {/if}
    </FeaturedCategories>
  {:else if pageTree.name === "FeaturedCategory"}
    <FeaturedCategory {...pageTree.props} />
  {/if}
{/if}

<style>
  .preview-empty {
    display: flex;
    flex-flow: column;
    align-items: center;
    padding-block: 2rem;
    color: #212121;
    user-select: none;
  }

  .preview-empty__icon {
    width: 4rem;
    height: 4rem;
    fill: currentColor;
  }

  .preview-empty__title {
    font-size: 1.125rem;
    font-weight: 500;
  }

  .preview-empty__description {
    color: #555;
    font-size: .875rem;
    text-align: center;
    text-wrap: balance;
  }
</style>