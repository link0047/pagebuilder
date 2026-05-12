<script lang="ts">
  import AppSidebar from "$lib/components/AppSidebar.svelte";
  import PropertiesPanel from "$lib/components/PropertiesPanel.svelte";
	import PreviewPane from "$lib/components/PreviewPane.svelte";
  import { registerMenuClickSource } from "$lib/components/menu-state.svelte";
  import { getAppState } from "$lib/components/app-state.svelte";
  import { onMount } from "svelte";
  import type { LayoutProps } from "./$types";

  let { children }: LayoutProps = $props();
  const appState = getAppState();

  let iframe = $state<HTMLIFrameElement | null>(null);
  let iframeReady = $state(false);

  function sendTree() {
    iframe?.contentWindow?.postMessage(
      { type: "tree-update", tree: $state.snapshot(appState.pageTree) },
      window.location.origin
    );
  }

  onMount(() => {
    const unregister = registerMenuClickSource((close) => {
      const handler = (event: MessageEvent) => {
        if (event.data?.type === "preview-click") close();
      };
      window.addEventListener("message", handler);
      return () => window.removeEventListener("message", handler);
    });

    window.addEventListener("message", (event) => {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type === "preview-ready") {
        iframeReady = true;
        sendTree();
      }
    });

    return unregister;
  });

  $effect(() => {
    // Re-runs whenever pageTree changes
    const _ = appState.pageTree;
    if (iframeReady) sendTree();
  });
</script>

<AppSidebar>
  {@render children?.()}
  <PropertiesPanel title={appState.selectedComponent?.meta.label} />
</AppSidebar>

<PreviewPane maxWidth="{appState.previewWidth}px">
  <iframe
    bind:this={iframe}
    src="/preview"
    title="Page preview"
    class="preview-frame"
    sandbox="allow-scripts allow-same-origin allow-forms"
  ></iframe>
</PreviewPane>

<style>
  .preview-frame {
    display: block;
    border: none;
    width: 100%;
    height: 100%;
  }
</style>
