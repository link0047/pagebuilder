<script lang="ts">
  import { type Snippet } from "svelte";

  type Props = {
    children?: Snippet
  };

  let {
    children
  }: Props = $props();
</script>

<section class="uikit-collection-block">
  {@render children?.()}
</section>

<style></style>