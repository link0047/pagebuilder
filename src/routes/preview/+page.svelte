<script lang="ts">
  import type { RootNode } from "$lib/components/types";
  import { onMount } from "svelte";
  import Page from "$lib/components/Page.svelte";
  import Preview from "$lib/components/Preview.svelte";
  import Heading from "$lib/components/Heading.svelte";

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
      if (event.data?.type === "tree-update") {
        tree = event.data.tree;
      }
      if (event.data?.type === "preview-hover") {
        // forwarded back from parent — update overlay
        const path = event.data.path as string | null;
        overlay.setAttribute("hovered-path", path ?? "");
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

      console.log(target);
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
  <Page spacing={tree.settings?.spacing ?? "2rem"} {...tree.settings}>
    {#if tree.heading}
      <Heading
        tag={tree.heading.tag ?? "h1"}
        visuallyHidden={tree.heading.hidden}
        size={tree.heading.size}
        weight={tree.heading.weight}
        alignment={tree.heading.alignment}
        color={tree.heading.color}
      >
        {tree.heading.text ?? ""}
      </Heading>
    {/if}
    <Preview pageTree={tree} />
  </Page>
{/if}
