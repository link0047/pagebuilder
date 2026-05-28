<script lang="ts">
  type LoadingStrategy = "lazy" | "eager";
	type DecodingStrategy = "async" | "sync" | "auto";
	type FetchPriority = "high" | "low" | "auto";
  type Shape = "circle" | "squircle" | "hexagon" | "triangle" | "heart";
  type Size = "xs" | "sm" | "md" | "lg" | "xl";
  type Tag = "div" | "button";

  type Props = {
    tag?: Tag;
    src?: string;
    loading?: LoadingStrategy;
    decoding?: DecodingStrategy;
    fetchpriority?: FetchPriority;
    alt?: string;
    text?: string;
    size?: Size;
    shape?: Shape;
    ref?: HTMLElement;
    [key: string]: unknown;
  };

  const SIZE_MAP = {
    "xs": 24,
    "sm": 32,
    "md": 48,
    "lg": 56,
    "xl": 64
  };

  let {
    tag = "div",
    src,
    loading = "lazy",
    decoding = "async",
    fetchpriority = "auto",
    alt = "Avatar",
    text,
    size = "md",
    shape,
    ref = $bindable(),
    ...restProps
  }: Props = $props();

  let imageSize = $derived(SIZE_MAP[size] || 48);
</script>

<svelte:element
  bind:this={ref}
  this={tag}
  type={tag === "button" ? "button" : undefined}
  class="wcag-ui-avatar"
  class:wcag-ui-avatar--size-xs={size === "xs"}
  class:wcag-ui-avatar--size-sm={size === "sm"}
  class:wcag-ui-avatar--size-lg={size === "lg"}
  class:wcag-ui-avatar--size-xl={size === "xl"}
  class:wcag-ui-avatar--shape-circle={shape === "circle"}
  class:wcag-ui-avatar--shape-squircle={shape === "squircle"}
  class:wcag-ui-avatar--shape-hexagon={shape === "hexagon"}
  class:wcag-ui-avatar--shape-triangle={shape === "triangle"}
  class:wcag-ui-avatar--shape-heart={shape === "heart"}
  {...restProps}
>
  {#if src}
    <img class="wcag-ui-avatar__image" width={imageSize} height={imageSize} {src} {loading} {decoding} {fetchpriority} {alt} />
  {:else if text}
    { text }
  {/if}
</svelte:element>

<style>
  .wcag-ui-avatar {
    display: flex;
    aspect-ratio: 1 / 1;
    touch-action: manipulation;
    user-select: none;
    appearance: none;
    border: none;
    overflow: hidden;
    width: 3rem;
    align-items: center;
    justify-content: center;
    border-radius: .25rem;
    background-color: #333335;
    color: #fff;
  }

  .wcag-ui-avatar[type="button"] {
    cursor: pointer;
  }

  .wcag-ui-avatar__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .wcag-ui-avatar--size-xs {
    width: 1.5rem;
  }

  .wcag-ui-avatar--size-sm {
    width: 2rem;
  }

  .wcag-ui-avatar--size-lg {
    width: 4rem;
  }

  .wcag-ui-avatar--shape-circle {
    border-radius: 50%;
  }

  .wcag-ui-avatar--shape-squircle, .wcag-ui-avatar--shape-hexagon, .wcag-ui-avatar--shape-triangle, .wcag-ui-avatar--shape-heart {
    mask-size: contain;
    mask-repeat: no-repeat;
    mask-position: center;
  }

  .wcag-ui-avatar--shape-squircle {
    mask-image: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nMjAwJyBoZWlnaHQ9JzIwMCcgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJz48cGF0aCBkPSdNMTAwIDBDMjAgMCAwIDIwIDAgMTAwczIwIDEwMCAxMDAgMTAwIDEwMC0yMCAxMDAtMTAwUzE4MCAwIDEwMCAwWicvPjwvc3ZnPg==)
  }

  .wcag-ui-avatar--shape-hexagon {
    mask-image: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nMTgyJyBoZWlnaHQ9JzIwMScgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJz48cGF0aCBkPSdNLjMgNjUuNDg2YzAtOS4xOTYgNi42ODctMjAuMDYzIDE0LjIxMS0yNS4wNzhsNjEuODYtMzUuOTQ2YzguMzYtNS4wMTYgMjAuODk5LTUuMDE2IDI5LjI1OCAwbDYxLjg2IDM1Ljk0NmM4LjM2IDUuMDE1IDE0LjIxMSAxNS44ODIgMTQuMjExIDI1LjA3OHY3MS4wNTVjMCA5LjE5Ni02LjY4NyAyMC4wNjMtMTQuMjExIDI1LjA3OWwtNjEuODYgMzUuOTQ1Yy04LjM2IDQuMTgtMjAuODk5IDQuMTgtMjkuMjU4IDBMMTQuNTEgMTYxLjYyQzYuMTUxIDE1Ny40NC4zIDE0NS43MzcuMyAxMzYuNTRWNjUuNDg2WicgZmlsbD0nYmxhY2snIGZpbGwtcnVsZT0nbm9uemVybycvPjwvc3ZnPg==)
  }

  .wcag-ui-avatar--shape-triangle {
    mask-image: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nMTc0JyBoZWlnaHQ9JzE0OScgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJz48cGF0aCBmaWxsPSdibGFjaycgZD0nbTg3IDE0OC40NzYtODYuNjAzLjE4NUw0My44NiA3NC40MjMgODcgMGw0My4xNCA3NC40MjMgNDMuNDYzIDc0LjIzOHonIGZpbGwtcnVsZT0nZXZlbm9kZCcvPjwvc3ZnPg==)
  }

  .wcag-ui-avatar--shape-heart {
    mask-image: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nMjAwJyBoZWlnaHQ9JzE4NScgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJz48cGF0aCBkPSdNMTAwIDE4NC42MDZhMTUuMzg0IDE1LjM4NCAwIDAgMS04LjY1My0yLjY3OEM1My41NjUgMTU2LjI4IDM3LjIwNSAxMzguNjk1IDI4LjE4MiAxMjcuNyA4Ljk1MiAxMDQuMjY0LS4yNTQgODAuMjAyLjAwNSA1NC4xNDYuMzA4IDI0LjI4NyAyNC4yNjQgMCA1My40MDYgMGMyMS4xOTIgMCAzNS44NjkgMTEuOTM3IDQ0LjQxNiAyMS44NzlhMi44ODQgMi44ODQgMCAwIDAgNC4zNTYgMEMxMTAuNzI1IDExLjkyNyAxMjUuNDAyIDAgMTQ2LjU5NCAwYzI5LjE0MiAwIDUzLjA5OCAyNC4yODcgNTMuNCA1NC4xNTEuMjYgMjYuMDYxLTguOTU2IDUwLjEyMi0yOC4xNzYgNzMuNTU0LTkuMDIzIDEwLjk5NC0yNS4zODMgMjguNTgtNjMuMTY1IDU0LjIyOGExNS4zODQgMTUuMzg0IDAgMCAxLTguNjUzIDIuNjczWicgZmlsbD0nYmxhY2snIGZpbGwtcnVsZT0nbm9uemVybycvPjwvc3ZnPg==)
  }
</style>
