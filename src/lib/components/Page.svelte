<script lang="ts">
  import type { Snippet } from "svelte";

  type Tag = "div" | "main";

  type Props = {
    children?: Snippet;
    tag?: Tag;
  };

  let {
    children,
    tag = "div",
  }: Props = $props();
</script>

<svelte:element this={tag} class="page">
  {@render children?.()}
</svelte:element>

<style>
  .page {
    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;
    -webkit-tap-highlight-color: transparent;
    max-width: 87.5rem;
    line-height: 1.5;
    font-weight: 400;
    font-synthesis: none;
    font-feature-settings: "liga" 1;
    font-kerning: normal;
    font-size: 1rem;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
    background-color: #fff;
    direction: ltr;
    display: flex;
    flex-flow: column nowrap;
    gap: 2rem;
    padding-block: .5rem;
    padding-inline: .5rem;
  }

  @media (min-width: 768px) {
    .page {
      padding-block: 1rem;
      padding-inline: 1rem;
    }
  }
</style>
