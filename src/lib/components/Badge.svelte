<script lang="ts">
  import type { Snippet } from "svelte";

  export type Variant = "filled" | "outlined";
  export type Color = "primary" | "secondary" | "success" | "danger" | "warning" | "info" | "default" | "neutral";
  export type Size = "sm" | "md" | "lg";
  export type Shape = "default" | "square" | "pill";
  export type Position = {
    corner: "top-left" | "top-right" | "bottom-left" | "bottom-right";
    gap?: string | number;
  }

  type Props = {
    children?: Snippet;
    variant?: Variant;
    color?: Color;
    size?: Size;
    shape?: Shape;
    position?: Position;
  }

  let {
    children,
    variant = "filled",
    color = "default",
    size = "md",
    shape = "default",
    position = undefined,
  }: Props = $props();

  const VALID_CSS_UNITS = /^-?\d*\.?\d+(px|rem|em|vh|vw|%)$/;
  const gapValue = $derived.by(() => {
    const raw = position?.gap;

    if (raw == null || (typeof raw === 'string' && !raw.trim())) return "0px";

    if (typeof raw === "number") return `${raw}px`;

    const trimmed = raw.trim();

    // Pure number — append px
    if (isFinite(Number(trimmed))) return `${trimmed}px`;

    // Valid CSS value with unit
    if (VALID_CSS_UNITS.test(trimmed)) return trimmed;

    // Invalid — fall back to default
    return "0px";
  });

  const isFlush = $derived(gapValue === "0px");
</script>

<span
  class="wcag-ui-badge"
  class:wcag-ui-badge--outlined={variant === "outlined"}
  class:wcag-ui-badge--primary={color === "primary"}
  class:wcag-ui-badge--secondary={color === "secondary"}
  class:wcag-ui-badge--success={color === "success"}
  class:wcag-ui-badge--warning={color === "warning"}
  class:wcag-ui-badge--danger={color === "danger"}
  class:wcag-ui-badge--info={color === "info"}
  class:wcag-ui-badge--neutral={color === "neutral"}
  class:wcag-ui-badge--size-sm={size === "sm"}
  class:wcag-ui-badge--size-lg={size === "lg"}
  class:wcag-ui-badge--shape-square={shape === "square"}
  class:wcag-ui-badge--shape-pill={shape === "pill"}
  data-position={position?.corner}
  data-flush={position != null && isFlush ? "" : undefined}
  style={gapValue !== "0px" ? `--wcag-ui-badge-gap: ${gapValue};` : undefined}
>
  <span class="wcag-ui-badge__content">
    {@render children?.()}
  </span>
</span>

<style>
  @layer variables, base, colors, variants, sizes, shapes, positions;

  @layer variables {
    :root {
      --wcag-ui-badge-color: #e6e6e7;
      --wcag-ui-badge-bg-color: #333335;
      --wcag-ui-badge-outlined-color: #333335;
      --wcag-ui-badge-gap: 0px;
      --wcag-ui-badge-height: 1.5rem;
      --wcag-ui-badge-padding-inline: .5rem;
      --wcag-ui-badge-border-width: 0;
      --wcag-ui-badge-border-style: solid;
      --wcag-ui-badge-border-color: #66676a;
      --wcag-ui-badge-border-radius: .25rem;
      --wcag-ui-badge-font-size: .75rem;
      --wcag-ui-badge-font-weight: 500;
      --wcag-ui-badge-line-height: 1;
      --wcag-ui-badge-letter-spacing: .04em;
      --wcag-ui-badge-font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    }
  }

  @layer base {
    .wcag-ui-badge {
      display: inline-flex;
      align-items: center;
      width: fit-content;
      border-radius: var(--wcag-ui-badge-border-radius);
      border: var(--wcag-ui-badge-border-width) var(--wcag-ui-badge-border-style) var(--wcag-ui-badge-border-color);
      padding-inline-start: var(--wcag-ui-badge-padding-inline);
      padding-inline-end: calc(
        var(--wcag-ui-badge-padding-inline) - var(--wcag-ui-badge-letter-spacing)
      );
      height: var(--wcag-ui-badge-height);
      color: var(--wcag-ui-badge-color);
      background-color: var(--wcag-ui-badge-bg-color);
      box-sizing: border-box;
      font-family: var(--wcag-ui-badge-font-family);
      font-size: var(--wcag-ui-badge-font-size);
      font-weight: var(--wcag-ui-badge-font-weight);
      line-height: var(--wcag-ui-badge-line-height);
      letter-spacing: var(--wcag-ui-badge-letter-spacing);
      text-transform: uppercase;
      gap: .5ch;
      max-width: 100%;
    }
    .wcag-ui-badge__content {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  @layer colors {
    .wcag-ui-badge--primary {
      --wcag-ui-badge-color: #fff;
      --wcag-ui-badge-outlined-color: #2a508f;
      --wcag-ui-badge-bg-color: #2a508f;
      --wcag-ui-badge-border-color: #2a508f;
    }

    .wcag-ui-badge--secondary {
      --wcag-ui-badge-color: #333335;
      --wcag-ui-badge-outlined-color: #333335;
      --wcag-ui-badge-bg-color: #e5e6e7;
      --wcag-ui-badge-border-color: #a8a8a8;
    }

    .wcag-ui-badge--success {
      --wcag-ui-badge-color: #fff;
      --wcag-ui-badge-outlined-color: #008a00;
      --wcag-ui-badge-bg-color: #008a00;
      --wcag-ui-badge-border-color: #008a00;
    }

    .wcag-ui-badge--warning {
      --wcag-ui-badge-color: #4c2100;
      --wcag-ui-badge-outlined-color: #a35200;
      --wcag-ui-badge-bg-color: #ffb224;
      --wcag-ui-badge-border-color: #ffb224;
    }

    .wcag-ui-badge--danger {
      --wcag-ui-badge-color: #fff;
      --wcag-ui-badge-outlined-color: #b22327;
      --wcag-ui-badge-bg-color: #cb2a2f;
      --wcag-ui-badge-border-color: #cb2a2f;
    }

    .wcag-ui-badge--info {
      --wcag-ui-badge-color: #fff;
      --wcag-ui-badge-outlined-color: #0062d1;
      --wcag-ui-badge-bg-color: #0062d1;
      --wcag-ui-badge-border-color: #0062d1;
    }

    .wcag-ui-badge--neutral {
      --wcag-ui-badge-color: #38393b;
      --wcag-ui-badge-outlined-color: #38393b;
      --wcag-ui-badge-bg-color: #fafafa;
      --wcag-ui-badge-border-color: #e5e6e7;
    }
  }

  @layer variants {
    .wcag-ui-badge--outlined {
      --wcag-ui-badge-bg-color: transparent;
      --wcag-ui-badge-border-width: 2px;
      --wcag-ui-badge-color: var(--wcag-ui-badge-outlined-color, #333335);
    }
  }

  @layer sizes {
    .wcag-ui-badge--size-sm {
      --wcag-ui-badge-height: 1.25rem;
      --wcag-ui-badge-font-size: .6875rem;
    }
    .wcag-ui-badge--size-lg {
      --wcag-ui-badge-height: 2rem;
    }
  }

  @layer shapes {
    .wcag-ui-badge--shape-pill {
      --wcag-ui-badge-padding-inline: .75rem;
      --wcag-ui-badge-border-radius: calc(var(--wcag-ui-badge-height) / 2);
    }
    .wcag-ui-badge--shape-square {
      --wcag-ui-badge-border-radius: 0;
    }
  }

  @layer positions {
    [data-position] {
      position: absolute;
    }

    [data-position="top-left"] {
      inset: var(--wcag-ui-badge-gap) auto auto var(--wcag-ui-badge-gap);
    }

    [data-position="top-right"] {
      inset: var(--wcag-ui-badge-gap) var(--wcag-ui-badge-gap) auto auto;
    }

    [data-position="bottom-left"] {
      inset: auto auto var(--wcag-ui-badge-gap) var(--wcag-ui-badge-gap);
    }

    [data-position="bottom-right"] {
      inset: auto var(--wcag-ui-badge-gap) var(--wcag-ui-badge-gap) auto;
    }

    [data-flush][data-position="top-left"] {
      border-start-start-radius: 0;
      border-start-end-radius: 0;
      border-end-start-radius: 0;
    }

    [data-flush][data-position="top-right"] {
      border-start-start-radius: 0;
      border-start-end-radius: 0;
      border-end-end-radius: 0;
    }

    [data-flush][data-position="bottom-left"] {
      border-start-start-radius: 0;
      border-end-start-radius: 0;
      border-end-end-radius: 0;
    }

    [data-flush][data-position="bottom-right"] {
      border-start-end-radius: 0;
      border-end-start-radius: 0;
      border-end-end-radius: 0;
    }
  }
</style>
