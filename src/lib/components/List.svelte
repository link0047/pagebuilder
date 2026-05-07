<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";

  type Props = Omit<HTMLAttributes<HTMLUListElement>, "children"> & {
    children?: Snippet;
    label?: string;
    gap?: string;
  };

  let {
    children,
    label = "List",
    gap = "0",
    ...restProps
  }: Props = $props();
</script>

<ul
  role="list"
  class="wcag-list"
  aria-label={label}
  style="--wcag-list-gap:{gap}"
  {...restProps}
>
  {@render children?.()}
</ul>

<style>
  .wcag-list {
    display: flex;
    flex-direction: column;
    gap: var(--wcag-list-gap, 0);
    list-style: none;
    margin: 0;
    padding: 0;
  }
</style>
