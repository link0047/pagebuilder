<script lang="ts">
  import { onMount } from "svelte";
  import Page from "$lib/components/Page.svelte";
  import Preview from "$lib/components/Preview.svelte";
  import type { RootNode } from "$lib/components/types";

  let tree = $state<RootNode | null>(null);

  onMount(() => {
    window.addEventListener("message", (e) => {
      if (e.origin !== window.location.origin) return;
      if (e.data?.type === "tree-update") {
        tree = e.data.tree;
      }
    });

    document.addEventListener("pointermove", (e) => {
       const el = (e.target as Element)?.closest("[data-component-path]") as HTMLElement | null;
       const path = el?.dataset.componentPath ?? null;

       window.parent.postMessage(
         { type: "preview-hover", path },
         window.location.origin
       );
     });

     document.addEventListener("pointerleave", () => {
       window.parent.postMessage(
         { type: "preview-hover", path: null },
         window.location.origin
       );
     });

    document.addEventListener("click", () => {
      window.parent.postMessage({ type: "preview-click" }, window.location.origin);
    });

    window.parent.postMessage({ type: "preview-ready" }, window.location.origin);
  });
</script>

{#if tree}
  <Page spacing="2rem">
    <Preview pageTree={tree} />
  </Page>
{/if}
