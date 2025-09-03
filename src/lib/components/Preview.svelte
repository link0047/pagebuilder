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