<script lang="ts">
  import { type Snippet } from "svelte";
  import { getBoundingRects } from "$lib/utils/getBoundingRects";

  type Props = {
    children?: Snippet;
    label?: string;
  };

  let {
    children,
    label = "List"
  }: Props = $props();
</script>

<ul
  role="list"
  class="uikit-list"
  data-testid="list"
  aria-label={label}
>
  {@render children?.()}
</ul>

<style>
  .uikit-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
  }
</style>
