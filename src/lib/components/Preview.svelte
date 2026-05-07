<script lang="ts">
  import Self from "./Preview.svelte";
  import { componentRegistry } from "./component-registry";
  import type { PageTreeNode } from "./types";
  import DOMPurify from "dompurify";

  type Props = {
    pageTree?: PageTreeNode;
  };

  let { pageTree }: Props = $props();

  const shouldRender = $derived(
    pageTree?.type !== "component" || !pageTree.meta.hidden
  );

  // Resolve the Svelte component constructor from the registry, or null if unknown
  const ResolvedComponent = $derived(
    pageTree?.type === "component"
      ? (componentRegistry[pageTree.name] ?? null)
      : null
  );

  // Sanitize data.content once — used by components that render rich text
  const safeContent = $derived(
    pageTree?.type === "component" && pageTree.data?.content
      ? DOMPurify.sanitize(pageTree.data.content)
      : null
  );
</script>

{#if pageTree?.type === "root"}
  {#if pageTree.children.length === 0}
    <div class="preview-empty">
      <svg class="preview-empty__icon" width="64" height="64">
        <use href="/favicon.svg" />
      </svg>
      <h2 class="preview-empty__title">Start Building</h2>
      <p class="preview-empty__description">
        Select a build from "My Builds" or go to the "Editor" tab to create a new one
      </p>
    </div>
  {:else}
    {#each pageTree.children as child}
      <Self pageTree={child} />
    {/each}
  {/if}
{/if}

{#if pageTree?.type === "component" && shouldRender && ResolvedComponent}
  <ResolvedComponent {...pageTree.props}>
    {#if pageTree.children}
      {#each pageTree.children as child}
        <Self pageTree={child} />
      {/each}
    {/if}

    {#if safeContent}
      {@html safeContent}
    {/if}
  </ResolvedComponent>
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
    font-size: 0.875rem;
    text-align: center;
    text-wrap: balance;
  }
</style>
