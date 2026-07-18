<script lang="ts">
  import type { RootNode } from "$lib/components/types";
  import { onMount } from "svelte";
  import PageDocument from "$lib/components/PageDocument.svelte";

  let tree = $state<RootNode | null>(null);

  onMount(() => {
    import("$lib/components/web-components/pagebuilder-overlay");

    const overlay = document.createElement("pagebuilder-overlay");
    document.body.appendChild(overlay);

    const controller = new AbortController();
    const { signal } = controller;

    let hoverTimer: ReturnType<typeof setTimeout> | null = null;

    window.addEventListener("message", (event) => {
      if (event.origin !== window.location.origin) return;

      // console.log(event.data?.type);
      switch (event.data?.type) {
        case "tree-update": {
          tree = event.data.tree;
          break;
        }
        case "preview-hover": {
          // forwarded back from parent — update overlay
          const path = event.data.path as string | null;
          overlay.setAttribute("hovered-path", path ?? "");
          break;
        }
        case "preview-scroll-to": {
          const path = event.data.path as string | null;
          if (!path) return;
          const el = document.querySelector(`[data-component-path="${path}"]`) as HTMLElement | null;
          el?.scrollIntoView({ behavior: "smooth", block: "nearest" });
          break;
        }
      }
    }, { signal });

    document.addEventListener("pointerenter", ({ target }) => {
      if (!(target instanceof Element)) return;
      const el = (target as Element)?.closest("[data-component-path]") as HTMLElement | null;
      if (!el) return;

      if (hoverTimer) clearTimeout(hoverTimer);
      hoverTimer = setTimeout(() => {
        const path = el.dataset.componentPath ?? null;
        window.parent.postMessage(
          { type: "preview-hover", path },
          window.location.origin
        );
      }, 300);
    }, { capture: true, signal });

    document.addEventListener("pointerleave", ({ target }) => {
      if (!(target instanceof Element)) return;
      const el = (target as Element)?.closest("[data-component-path]") as HTMLElement | null;
      if (!el) return;

      if (hoverTimer) {
        clearTimeout(hoverTimer);
        hoverTimer = null;
      }

      window.parent.postMessage(
        { type: "preview-hover", path: null },
        window.location.origin
      );
    }, { capture: true, signal });

    document.addEventListener("click", (event) => {
      const { target } = event;
      // prevent link navigation in preview
      const link = target instanceof Element
        ? target.closest("a") as HTMLAnchorElement | null
        : null;

      if (link) {
        event.preventDefault();
        event.stopPropagation();
      }
      const el = target instanceof Element
        ? (target as Element)?.closest("[data-component-path]") as HTMLElement | null
        : null;

      window.parent.postMessage({
        type: "preview-click",
        path: el?.dataset.componentPath ?? null
      }, window.location.origin);
    }, { signal });

    window.parent.postMessage({ type: "preview-ready" }, window.location.origin);

    return () => {
      if (hoverTimer) clearTimeout(hoverTimer);
      controller.abort();
      overlay.remove();
    };
  });
</script>

{#if tree}
  <PageDocument pageTree={tree} />
{/if}
