<script lang="ts">
  import type { Snippet } from "svelte";

  type Props = {
    children?: Snippet;
    [key: string]: unknown;
  };

  let { children, ...restProps }: Props = $props();
</script>

<wcag-ui-carousel-item {...restProps}>
  {@render children?.()}
</wcag-ui-carousel-item>
