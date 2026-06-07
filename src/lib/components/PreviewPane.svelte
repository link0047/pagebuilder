<script lang="ts">
  import type { Snippet } from "svelte";
  import type { MaybeElement } from "./types";

  import Banner from "./Banner.svelte";
  import { getAppState } from "./app-state.svelte";

  type Props = {
    children?: Snippet;
    maxWidth?: string | null;
    ref?: MaybeElement;
    outerRef?: MaybeElement;
  };

  let {
    ref = $bindable(),
    outerRef = $bindable(),
    children,
    maxWidth = "1400px",
  }: Props = $props();

  let appState = getAppState();
  let hasBanner = $derived(appState.statusMessage !== null);
</script>

<main
  bind:this={outerRef}
  id="preview-pane"
  class="preview-viewport"
  style:padding-block-start={hasBanner ? "calc(1.5rem + 3rem)" : "1.5rem"}
>
  <Banner
    placement="floating-top"
    open={appState.statusMessage !== null}
    closable
    onclose={() => appState.setStatusMessage(null)}
    style="--wcag-ui-banner-float-spacing: 0px; border-radius: 0;"
  >
    {appState.statusMessage}
  </Banner>
  <div
    bind:this={ref}
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
    position: relative;
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
