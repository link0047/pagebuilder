<script lang="ts">
  import type { LayoutProps } from "./$types";
  import type { PreviewMode } from "$lib/components/types";

  import AppSidebar from "$lib/components/AppSidebar.svelte";
  import PropertiesPanel from "$lib/components/PropertiesPanel.svelte";
	import PreviewPane from "$lib/components/PreviewPane.svelte";
  import { registerMenuClickSource } from "$lib/components/menu-state.svelte";
  import { getAppState } from "$lib/components/app-state.svelte";
  import { onMount, setContext } from "svelte";
  import { BREAKPOINTS } from "$lib/constants/breakpoints";
  import debounce from "$lib/utils/debounced";

  let { children }: LayoutProps = $props();
  const appState = getAppState();

  let previewPaneRef = $state<HTMLElement | null | undefined>(null);
  let previewOuterRef = $state<HTMLElement | null | undefined>(null);
  let iframe = $state<HTMLIFrameElement | null>(null);
  let iframeReady = $state(false);

  function sendToPreview(type: string, data: Record<string, unknown> = {}) {
    iframe?.contentWindow?.postMessage(
      { type, ...data },
      window.location.origin
    );
  }

  function sendTree() {
    iframe?.contentWindow?.postMessage(
      { type: "tree-update", tree: $state.snapshot(appState.pageTree) },
      window.location.origin
    );
  }

  setContext("sendToPreview", sendToPreview);

  onMount(() => {
    const controller = new AbortController();
    const { signal } = controller;

    const unregister = registerMenuClickSource((close) => {
      const handler = (event: MessageEvent) => {
        if (event.data?.type === "preview-click") {
          close();
          const raw = event.data.path as string | null;
          if (raw && appState.pageTree.children.length > 0) {
            const path = raw.split(",").map(Number);
            appState.selectComponent(path);
            sendToPreview("preview-select", { path: raw });
          }
        }
      };
      window.addEventListener("message", handler, { signal });
      return () => window.removeEventListener("message", handler);
    });

    window.addEventListener("message", (event) => {
      if (event.origin !== window.location.origin) return;

      if (event.data?.type === "preview-ready") {
        iframeReady = true;
        sendTree();
      }

      if (event.data?.type === "preview-hover") {
        if (appState.pageTree.children.length === 0) return;
        const raw = event.data.path as string | null;

        if (!raw) {
          appState.hoverComponent(null);
          return;
        }

        appState.hoverComponent(raw.split(",").map(Number));
        sendToPreview("preview-hover", { path: raw });
      }
    }, { signal });

    document.addEventListener("click", (event) => {
      const target = event.target as Element | null;
      if (!target) return;

      // ignore clicks inside the sidebar or on the iframe itself
      const inSidebar = target.closest("[data-sidebar-content]");
      const onIframe = target.closest("iframe");

      if (!inSidebar || !onIframe) {
        sendToPreview("preview-hover", { path: null });
        sendToPreview("preview-select", { path: null });
      }
    }, { signal });

    const handleResize = debounce((entries: ResizeObserverEntry[]) => {
      const { width } = entries[0].contentRect;
      appState.setPreviewPaneWidth(width);

      let newMode: PreviewMode;
      if (width >= BREAKPOINTS.desktop) {
        newMode = "desktop";
      } else if (width >= BREAKPOINTS.tablet) {
        newMode = "tablet";
      } else {
        newMode = "mobile";
      }

      // Only auto-switch down, never up
      const modeOrder: PreviewMode[] = ["mobile", "tablet", "desktop"];
      const currentIndex = modeOrder.indexOf(appState.previewMode);
      const newIndex = modeOrder.indexOf(newMode);

      if (newIndex < currentIndex && newMode !== appState.previewMode) {
        appState.previewMode = newMode;
      }
    }, 150);

    const observer = new ResizeObserver(handleResize);
    if (previewOuterRef) observer.observe(previewOuterRef);

    return () => {
      unregister();
      observer.disconnect();
      handleResize.cancel();
      controller.abort();
    };
  });

  $effect(() => {
    const path = appState.selectedComponentPath?.join(",") ?? null;
    sendToPreview("preview-select", { path });
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

<PreviewPane maxWidth="{appState.previewWidth}px" bind:ref={previewPaneRef} bind:outerRef={previewOuterRef}>
  {#if appState.userResolved && appState.user}
    <iframe
      bind:this={iframe}
      src="/preview"
      title="Page preview"
      id="preview-iframe"
      class="preview-frame"
    ></iframe>
  {/if}
</PreviewPane>

<style>
  .preview-frame {
    display: block;
    border: none;
    width: 100%;
    height: 100%;
  }
</style>
