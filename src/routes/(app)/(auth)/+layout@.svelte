<script lang="ts">
  import { type LayoutProps } from "../../$types";

  let {
    children
  }: LayoutProps = $props();
</script>

<div>
  test
  {@render children?.()}
</div>