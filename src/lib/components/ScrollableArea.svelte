<script lang="ts">
  import type { Snippet } from "svelte";

  type Props = {
    children: Snippet;
    grow?: boolean | 1 | 0;
  };

  let {
    children,
    grow = 1
  }: Props = $props();

  let growValue = $derived(typeof grow === "boolean" ? (grow ? 1 : 0) : grow);
</script>

<div
  class="wcag-ui-scrollable-area"
  style:--wcag-ui-scrollable-area-grow={growValue}
  >
  {@render children?.()}
</div>

<style>
  .wcag-ui-scrollable-area {
    --wcag-ui-scrollable-area-grow: ;
    flex-grow: var(--wcag-ui-scrollable-area-grow, 1);
    overflow-y: auto;
    scroll-behavior: smooth;
    scrollbar-width: thin;
    scrollbar-color: hsla(30, 3.3%, 11.8%, 0.35) transparent;
  }

  /* Webkit Fallback */
  .wcag-ui-scrollable-area::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  .wcag-ui-scrollable-area::-webkit-scrollbar-track {
    background: transparent;
  }

  .wcag-ui-scrollable-area::-webkit-scrollbar-thumb {
    background-color: hsla(30, 3.3%, 11.8%, 0.35);
    border-radius: 4px;
  }
</style>
