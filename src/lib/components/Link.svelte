<script lang="ts">
  import type { Snippet } from "svelte";

  type Tag = "a" | "div";
  type Variant = "default" | "outlined" | "button";
  type Underline = "always" | "hover" | "none";
  type Color =
    | "inherit"
    | "primary"
    | "secondary"
    | "success"
    | "danger"
    | "warning"
    | "info"
    | "default"
    | "neutral";
  type Shape = "default" | "pill";

  type CustomColor = {
    base?: {
      color?: string;
      bgColor?: string;
      borderColor?: string;
    };
    hover?: {
      color?: string;
      bgColor?: string;
      borderColor?: string;
    };
    focus?: {
      color?: string;
      bgColor?: string;
      borderColor?: string;
    };
  };

  type Props = {
    href: string;
    external?: boolean;
    underline?: Underline;
    variant?: Variant;
    color?: Color;
    shape?: Shape;
    fullWidth?: boolean;
    customColor?: CustomColor;
    children?: Snippet;
    [key: string]: unknown;
  };

  let {
    href,
    external = false,
    underline = "hover",
    variant = "default",
    color = "inherit",
    shape = "default",
    fullWidth = false,
    customColor,
    children,
    ...restProps
  }: Props = $props();

  // Build inline CSS custom property overrides from customColor
  let customStyle = $derived((() => {
    if (!customColor) return undefined;
    const props: string[] = [];

    if (customColor.base?.color)
      props.push(`--wcag-ui-link-color: ${customColor.base.color}`);
    if (customColor.base?.bgColor)
      props.push(`--wcag-ui-link-bg-color: ${customColor.base.bgColor}`);
    if (customColor.base?.borderColor)
      props.push(`--wcag-ui-link-border-color: ${customColor.base.borderColor}`);

    if (customColor.hover?.color)
      props.push(`--wcag-ui-link-hover-color: ${customColor.hover.color}`);
    if (customColor.hover?.bgColor)
      props.push(`--wcag-ui-link-hover-bg-color: ${customColor.hover.bgColor}`);
    if (customColor.hover?.borderColor)
      props.push(`--wcag-ui-link-hover-border-color: ${customColor.hover.borderColor}`);

    if (customColor.focus?.color)
      props.push(`--wcag-ui-link-focus-color: ${customColor.focus.color}`);
    if (customColor.focus?.bgColor)
      props.push(`--wcag-ui-link-focus-bg-color: ${customColor.focus.bgColor}`);
    if (customColor.focus?.borderColor)
      props.push(`--wcag-ui-link-outline-color: ${customColor.focus.borderColor}`);

    return props.length ? props.join("; ") : undefined;
  })());

  const tag: Tag = $derived(href ? "a" : "div");
</script>

<svelte:element
  this={tag}
  {href}
  target={external ? "_blank" : undefined}
  rel={external ? "noopener noreferrer" : undefined}
  class="wcag-ui-link"
  class:wcag-ui-link--underline-always={underline === "always"}
  class:wcag-ui-link--underline-hover={underline === "hover"}
  class:wcag-ui-link--underline-none={underline === "none"}
  class:wcag-ui-link--outlined={variant === "outlined"}
  class:wcag-ui-link--button={variant === "button"}
  class:wcag-ui-link--color-primary={color === "primary"}
  class:wcag-ui-link--color-secondary={color === "secondary"}
  class:wcag-ui-link--color-success={color === "success"}
  class:wcag-ui-link--color-danger={color === "danger"}
  class:wcag-ui-link--color-warning={color === "warning"}
  class:wcag-ui-link--color-info={color === "info"}
  class:wcag-ui-link--color-default={color === "default"}
  class:wcag-ui-link--color-neutral={color === "neutral"}
  class:wcag-ui-link--shape-pill={shape === "pill"}
  class:wcag-ui-link--full-width={fullWidth}
  style={customStyle}
  {...restProps}
>
  {@render children?.()}
</svelte:element>

<style>
  @layer variables, base, layout, underline, variants, colors, shapes, states;

  @layer variables {
    :root {
      --wcag-ui-link-height: 2.5rem;
      --wcag-ui-link-padding-inline: 0.75rem;

      /* Typography */
      --wcag-ui-link-font-size: inherit;
      --wcag-ui-link-font-weight: 400;
      --wcag-ui-link-letter-spacing: 0.04em;
      --wcag-ui-link-font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";

      /* Color tokens — inherit by default */
      --wcag-ui-link-color: inherit;
      --wcag-ui-link-bg-color: transparent;
      --wcag-ui-link-decoration: none;

      /* Border / shape */
      --wcag-ui-link-border-width: 0px;
      --wcag-ui-link-border-style: solid;
      --wcag-ui-link-border-color: transparent;
      --wcag-ui-link-border-radius: 0.25rem;

      /* Focus ring */
      --wcag-ui-link-outline-color: #007acc;
      --wcag-ui-link-outline-style: solid;
      --wcag-ui-link-outline-width: 2px;
      --wcag-ui-link-outline-offset: 2px;
      --wcag-ui-link-focus-bg-color: ;
      --wcag-ui-link-focus-color: ;

      /* Hover tokens */
      --wcag-ui-link-hover-color: inherit;
      --wcag-ui-link-hover-bg-color: transparent;
      --wcag-ui-link-hover-border-color: transparent;
      --wcag-ui-link-hover-decoration: underline;
    }
  }

  @layer base {
    .wcag-ui-link {
      width: fit-content;
      box-sizing: border-box;
      font-family: var(--wcag-ui-link-font-family);
      font-size: var(--wcag-ui-link-font-size);
      font-weight: var(--wcag-ui-link-font-weight);
      color: var(--wcag-ui-link-color);
      background-color: var(--wcag-ui-link-bg-color);
      text-decoration: var(--wcag-ui-link-decoration);
      border: var(--wcag-ui-link-border-width) var(--wcag-ui-link-border-style) var(--wcag-ui-link-border-color);
      border-radius: var(--wcag-ui-link-border-radius);
      transition: background-color 0.2s, color 0.2s, border-color 0.2s;
      cursor: pointer;
    }

    .wcag-ui-link--full-width {
      width: 100%;
    }
  }

  @layer layout {
    .wcag-ui-link {
      display: inline;
      padding: 0;
    }

    .wcag-ui-link--outlined,
    .wcag-ui-link--button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      height: var(--wcag-ui-link-height);
      padding-inline: var(--wcag-ui-link-padding-inline);
      --wcag-ui-link-border-radius: 0.5rem;
      --wcag-ui-link-hover-decoration: none;
    }

    .wcag-ui-link--button {
      letter-spacing: var(--wcag-ui-link-letter-spacing);
    }
  }

  /* ── Underline prop ─────────────────────────────────────────────────────── */
  @layer underline {
    .wcag-ui-link--underline-always {
      --wcag-ui-link-decoration: underline;
      --wcag-ui-link-hover-decoration: underline;
    }

    .wcag-ui-link--underline-hover {
      --wcag-ui-link-decoration: none;
      --wcag-ui-link-hover-decoration: underline;
    }

    .wcag-ui-link--underline-none {
      --wcag-ui-link-decoration: none;
      --wcag-ui-link-hover-decoration: none;
    }
  }

  /* ── Variant prop ───────────────────────────────────────────────────────── */
  @layer variants {
    .wcag-ui-link--outlined {
      --wcag-ui-link-border-width: 2px;
      --wcag-ui-link-border-color: #66676a;
      --wcag-ui-link-color: #38393b;
      --wcag-ui-link-hover-bg-color: #eeeeef;
      --wcag-ui-link-hover-border-color: #66676a;
    }

    .wcag-ui-link--button {
      --wcag-ui-link-color: #fff;
      --wcag-ui-link-bg-color: #333335;
      --wcag-ui-link-border-color: #333335;
      --wcag-ui-link-hover-bg-color: #555659;
      --wcag-ui-link-hover-color: #fff;
      --wcag-ui-link-hover-border-color: #555659;
    }
  }

  /* ── Color prop ─────────────────────────────────────────────────────────── */
  @layer colors {
    /* ── primary ── */
    .wcag-ui-link--color-primary:not(.wcag-ui-link--outlined):not(.wcag-ui-link--button) {
      --wcag-ui-link-color: #174eab;
      --wcag-ui-link-hover-color: #2a62c4;
    }

    .wcag-ui-link--outlined.wcag-ui-link--color-primary {
      --wcag-ui-link-border-color: #174eab;
      --wcag-ui-link-color: #174eab;
      --wcag-ui-link-hover-color: #2a62c4;
      --wcag-ui-link-hover-bg-color: rgba(23, 78, 171, 0.06);
      --wcag-ui-link-hover-border-color: #174eab;
      --wcag-ui-link-outline-color: #5077b5;
    }

    .wcag-ui-link--button.wcag-ui-link--color-primary {
      --wcag-ui-link-bg-color: #2a508f;
      --wcag-ui-link-border-color: #2a508f;
      --wcag-ui-link-color: #fff;
      --wcag-ui-link-hover-bg-color: #3f619a;
      --wcag-ui-link-hover-border-color: #3f619a;
      --wcag-ui-link-hover-color: #fff;
      --wcag-ui-link-outline-color: #5077b5;
    }

    /* ── secondary ── */
    .wcag-ui-link--color-secondary:not(.wcag-ui-link--outlined):not(.wcag-ui-link--button) {
      --wcag-ui-link-color: #555659;
      --wcag-ui-link-hover-color: #38393b;
    }

    .wcag-ui-link--outlined.wcag-ui-link--color-secondary {
      --wcag-ui-link-border-color: #a8a8a8;
      --wcag-ui-link-color: #38393b;
      --wcag-ui-link-hover-bg-color: #f2f2f2;
      --wcag-ui-link-hover-border-color: #a8a8a8;
      --wcag-ui-link-outline-color: #777779;
    }

    .wcag-ui-link--button.wcag-ui-link--color-secondary {
      --wcag-ui-link-bg-color: #e5e6e7;
      --wcag-ui-link-border-color: #e5e6e7;
      --wcag-ui-link-color: #38393b;
      --wcag-ui-link-hover-bg-color: #c9c9c9;
      --wcag-ui-link-hover-border-color: #c9c9c9;
      --wcag-ui-link-hover-color: #38393b;
      --wcag-ui-link-outline-color: #777779;
    }

    /* ── success ── */
    .wcag-ui-link--color-success:not(.wcag-ui-link--outlined):not(.wcag-ui-link--button) {
      --wcag-ui-link-color: #076d08;
      --wcag-ui-link-hover-color: #008a00;
    }

    .wcag-ui-link--outlined.wcag-ui-link--color-success {
      --wcag-ui-link-border-color: #008a00;
      --wcag-ui-link-color: #076d08;
      --wcag-ui-link-hover-bg-color: #f4f9f4;
      --wcag-ui-link-hover-border-color: #008a00;
      --wcag-ui-link-outline-color: #00a700;
    }

    .wcag-ui-link--button.wcag-ui-link--color-success {
      --wcag-ui-link-bg-color: #008a00;
      --wcag-ui-link-border-color: #008a00;
      --wcag-ui-link-color: #fff;
      --wcag-ui-link-hover-bg-color: #076d08;
      --wcag-ui-link-hover-border-color: #076d08;
      --wcag-ui-link-hover-color: #fff;
      --wcag-ui-link-outline-color: #00a700;
    }

    /* ── danger ── */
    .wcag-ui-link--color-danger:not(.wcag-ui-link--outlined):not(.wcag-ui-link--button) {
      --wcag-ui-link-color: #cb2a2f;
      --wcag-ui-link-hover-color: #e5484d;
    }

    .wcag-ui-link--outlined.wcag-ui-link--color-danger {
      --wcag-ui-link-border-color: #cb2a2f;
      --wcag-ui-link-color: #cb2a2f;
      --wcag-ui-link-hover-bg-color: #fff0f0;
      --wcag-ui-link-hover-border-color: #cb2a2f;
      --wcag-ui-link-outline-color: #f76469;
    }

    .wcag-ui-link--button.wcag-ui-link--color-danger {
      --wcag-ui-link-bg-color: #cb2a2f;
      --wcag-ui-link-border-color: #cb2a2f;
      --wcag-ui-link-color: #fff;
      --wcag-ui-link-hover-bg-color: #e5484d;
      --wcag-ui-link-hover-border-color: #e5484d;
      --wcag-ui-link-hover-color: #fff;
      --wcag-ui-link-outline-color: #f76469;
    }

    /* ── warning ── */
    .wcag-ui-link--color-warning:not(.wcag-ui-link--outlined):not(.wcag-ui-link--button) {
      --wcag-ui-link-color: #a35200;
      --wcag-ui-link-hover-color: #d98c00;
    }

    .wcag-ui-link--outlined.wcag-ui-link--color-warning {
      --wcag-ui-link-border-color: #ffb224;
      --wcag-ui-link-color: #a35200;
      --wcag-ui-link-hover-bg-color: #fff4d6;
      --wcag-ui-link-hover-border-color: #ffb224;
      --wcag-ui-link-outline-color: #d98c00;
    }

    .wcag-ui-link--button.wcag-ui-link--color-warning {
      --wcag-ui-link-bg-color: #ffb224;
      --wcag-ui-link-border-color: #ffb224;
      --wcag-ui-link-color: #4c2100;
      --wcag-ui-link-hover-bg-color: #ffc96b;
      --wcag-ui-link-hover-border-color: #ffc96b;
      --wcag-ui-link-hover-color: #4c2100;
      --wcag-ui-link-outline-color: #d98c00;
    }

    /* ── info ── */
    .wcag-ui-link--color-info:not(.wcag-ui-link--outlined):not(.wcag-ui-link--button) {
      --wcag-ui-link-color: #0062d1;
      --wcag-ui-link-hover-color: #0072f5;
    }

    .wcag-ui-link--outlined.wcag-ui-link--color-info {
      --wcag-ui-link-border-color: #0062d1;
      --wcag-ui-link-color: #0068d6;
      --wcag-ui-link-hover-bg-color: #e0f0ff;
      --wcag-ui-link-hover-border-color: #0062d1;
      --wcag-ui-link-outline-color: #4a98ff;
    }

    .wcag-ui-link--button.wcag-ui-link--color-info {
      --wcag-ui-link-bg-color: #0062d1;
      --wcag-ui-link-border-color: #0062d1;
      --wcag-ui-link-color: #fff;
      --wcag-ui-link-hover-bg-color: #0072f5;
      --wcag-ui-link-hover-border-color: #0072f5;
      --wcag-ui-link-hover-color: #fff;
      --wcag-ui-link-outline-color: #4a98ff;
    }

    /* ── default ── */
    .wcag-ui-link--color-default:not(.wcag-ui-link--outlined):not(.wcag-ui-link--button) {
      --wcag-ui-link-color: #38393b;
      --wcag-ui-link-hover-color: #555659;
    }

    .wcag-ui-link--outlined.wcag-ui-link--color-default {
      --wcag-ui-link-border-color: #333335;
      --wcag-ui-link-color: #38393b;
      --wcag-ui-link-hover-bg-color: rgba(0, 0, 0, 0.05);
      --wcag-ui-link-hover-border-color: #333335;
    }

    .wcag-ui-link--button.wcag-ui-link--color-default {
      --wcag-ui-link-bg-color: #333335;
      --wcag-ui-link-border-color: #333335;
      --wcag-ui-link-color: #fff;
      --wcag-ui-link-hover-bg-color: #555659;
      --wcag-ui-link-hover-border-color: #555659;
      --wcag-ui-link-hover-color: #fff;
    }

    /* ── neutral ── */
    .wcag-ui-link--color-neutral:not(.wcag-ui-link--outlined):not(.wcag-ui-link--button) {
      --wcag-ui-link-color: #555659;
      --wcag-ui-link-hover-color: #38393b;
    }

    .wcag-ui-link--outlined.wcag-ui-link--color-neutral {
      --wcag-ui-link-border-color: #e5e6e7;
      --wcag-ui-link-color: #38393b;
      --wcag-ui-link-hover-bg-color: #f0f0f0;
      --wcag-ui-link-hover-border-color: #d1d2d3;
      --wcag-ui-link-outline-color: #a8a8a8;
    }

    .wcag-ui-link--button.wcag-ui-link--color-neutral {
      --wcag-ui-link-bg-color: #fafafa;
      --wcag-ui-link-border-color: #e5e6e7;
      --wcag-ui-link-color: #38393b;
      --wcag-ui-link-hover-bg-color: #f0f0f0;
      --wcag-ui-link-hover-border-color: #d1d2d3;
      --wcag-ui-link-hover-color: #38393b;
      --wcag-ui-link-outline-color: #a8a8a8;
    }
  }

  /* ── Shape prop ─────────────────────────────────────────────────────────── */
  @layer shapes {
    /* pill also works on plain default links */
    .wcag-ui-link--outlined.wcag-ui-link--shape-pill,
    .wcag-ui-link--button.wcag-ui-link--shape-pill {
      --wcag-ui-link-border-radius: 9999px;
      padding-inline: calc(var(--wcag-ui-link-padding-inline) * 1.5);
    }

    .wcag-ui-link--shape-pill:not(.wcag-ui-link--outlined):not(.wcag-ui-link--button) {
      border-radius: 9999px;
    }
  }

  /* ── States ─────────────────────────────────────────────────────────────── */
  @layer states {
    .wcag-ui-link:hover {
      color: var(--wcag-ui-link-hover-color);
      background-color: var(--wcag-ui-link-hover-bg-color);
      border-color: var(--wcag-ui-link-hover-border-color);
      text-decoration: var(--wcag-ui-link-hover-decoration);
    }

    .wcag-ui-link:focus-visible {
      outline: var(--wcag-ui-link-outline-width) var(--wcag-ui-link-outline-style)
        var(--wcag-ui-link-outline-color);
      outline-offset: var(--wcag-ui-link-outline-offset);
      /* customColor.focus.bgColor */
      background-color: var(--wcag-ui-link-focus-bg-color, var(--wcag-ui-link-bg-color));
      /* customColor.focus.color */
      color: var(--wcag-ui-link-focus-color, var(--wcag-ui-link-color));
    }
  }
</style>
