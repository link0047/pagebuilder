<script lang="ts">
  import type { Snippet } from "svelte";

  type Props = {
    children?: Snippet;
    maxWidth?: string | null;
  };

  let {
    children,
    maxWidth = "1400px",
  }: Props = $props();
</script>

<main class="preview-viewport">
  <div
    class="preview-content"
    style:--uikit-preview-max-width={maxWidth}
  >
    {@render children?.()}
  </div>
</main>

<style>
  /*
    --uikit-preview-max-width is set via inline style above (from the maxWidth prop),
    so no :root default is needed here. Removed the :root block — it was leaking
    a global custom property from a scoped style block, which is misleading.
  */

  .preview-viewport {
    grid-area: preview;
    padding: 1.5rem;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
  }

  .preview-content {
    width: 100%;
    overflow-y: scroll;
    max-width: var(--uikit-preview-max-width);
    height: 100%;
    max-height: 100dvh;
    background-color: #fff;
    border-radius: 0.5rem;
    box-shadow: 0 0 1px 0 rgba(29, 34, 40, 0.1), 0 2px 4px 0 rgba(29, 34, 40, 0.08);
  }
</style>
