<script lang="ts">
  import { type Snippet } from "svelte";

  type Props = {
    children: Snippet;
    grow?: boolean | 1 | 0;
  };

  let {
    children,
    grow = 1
  }: Props = $props();

  let growValue = typeof grow === "boolean" ? (grow ? 1 : 0) : grow;
</script>

<div 
  class="uikit-scrollable-area"
  style:--uikit-scrollable-area-grow={growValue}
  >
  {@render children?.()}
</div>

<style>
  .uikit-scrollable-area {
    flex-grow: var(--uikit-scrollable-area-grow, 1);
    overflow-y: auto;
    scroll-behavior: smooth;
    scrollbar-width: thin;
    scrollbar-color: hsla(30, 3.3%, 11.8%, 0.35) transparent;
  }

  /* Webkit Fallback */
  .uikit-scrollable-area::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  .uikit-scrollable-area::-webkit-scrollbar-track {
    background: transparent;
  }

  .uikit-scrollable-area::-webkit-scrollbar-thumb {
    background-color: hsla(30, 3.3%, 11.8%, 0.35);
    border-radius: 4px;
  }
</style>