<script lang="ts">
  import type { Snippet } from "svelte";

  type Direction = "vertical" | "horizontal";
  type Props = {
    children?: Snippet,
    direction?: Direction,
    gap?: string,
    columns?: number | string
  }

  let {
    children,
    direction = "vertical",
    gap = "0",
    columns
  }: Props = $props();

  // If columns is provided, create the template.
  // If not, we leave it undefined and let the CSS grid-auto-flow handle it.
  const gridTemplate = $derived(columns ? `repeat(${columns}, minmax(0, 1fr))` : undefined);
</script>

<div
  class="wcag-ui-group"
  role="group"
  data-direction={direction}
  style:--wcag-ui-group-gap={gap}
  style:grid-template-columns={gridTemplate}>
  {@render children?.()}
</div>

<style>
  .wcag-ui-group {
    display: grid;
    gap: var(--wcag-ui-group-gap);
    width: 100%;
    grid-auto-flow: row;
  }

  .wcag-ui-group[data-direction="horizontal"] {
    grid-auto-flow: column;
    grid-auto-columns: 1fr;
  }

  .wcag-ui-group[style*="grid-template-columns"] {
    grid-auto-flow: row;
    grid-auto-columns: auto;
  }
</style>
