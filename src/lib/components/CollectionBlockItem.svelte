<script lang="ts">
  import type { Snippet } from "svelte";

  type Props = {
    children?: Snippet;
  };

  let { children }: Props = $props();
</script>

<wcag-ui-carousel-item>
  {@render children?.()}
</wcag-ui-carousel-item>
