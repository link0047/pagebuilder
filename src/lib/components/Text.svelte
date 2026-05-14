<script lang="ts">
  import type { Snippet } from "svelte";

  type Size = "sm" | "md" | "lg" | string;
  type Weight = "normal" | "medium" | "semibold" | "bold" | "inherit";
  type Breakpoints<T> = { mobile?: T; tablet?: T; desktop?: T };
  type Responsive<T> = T | Breakpoints<T>;

  type Props = {
    size?: Responsive<Size>;
    weight?: Responsive<Weight>;
    lineHeight?: Responsive<string>;
    italic?: Responsive<boolean>;
    underline?: Responsive<boolean>;
    color?: Responsive<string>;
    truncate?: boolean;
    children?: Snippet;
  }

  let {
    size,
    weight = "inherit",
    lineHeight = "1.2",
    italic = false,
    underline = false,
    color = "inherit",
    truncate = false,
    children
  }: Props = $props();

  function resolve<T>(value: Responsive<T> | undefined, fallback: T): Required<Breakpoints<T>> {
    if (value == null) return { mobile: fallback, tablet: fallback, desktop: fallback };
    if (typeof value === "object" && ("mobile" in value || "tablet" in value || "desktop" in value)) {
      const bp = value as Breakpoints<T>;
      const mobile = bp.mobile ?? fallback;
      const tablet = bp.tablet ?? mobile;
      const desktop = bp.desktop ?? tablet;
      return { mobile, tablet, desktop };
    }
    return { mobile: value as T, tablet: value as T, desktop: value as T };
  }

  const resolvedSize = $derived(resolve(size, undefined as unknown as Size));
  const resolvedWeight = $derived(resolve(weight, "inherit" as Weight));
  const resolvedLineHeight = $derived(resolve(lineHeight, "1.2"));
  const resolvedItalic = $derived(resolve(italic, false));
  const resolvedUnderline = $derived(resolve(underline, false));
  const resolvedColor = $derived(resolve(color, "inherit"));

  const NAMED_SIZES = ["sm", "md", "lg"];
  const WEIGHT_MAP: Record<Weight, string> = {
    normal:   "400",
    medium:   "500",
    semibold: "600",
    bold:     "700",
    inherit:  "inherit",
  };

  function sizeVar(s: Size | undefined): string | undefined {
    if (!s || NAMED_SIZES.includes(s)) return undefined;
    return s;
  }

  function weightVar(w: Weight | undefined): string | undefined {
    if (!w) return undefined;
    return WEIGHT_MAP[w as Weight] ?? w; // named → numeric; custom value pass-through
  }
</script>

<span
  class="wcag-ui-text"
  class:wcag-ui-text--size-sm={resolvedSize.mobile === "sm"}
  class:wcag-ui-text--size-md={resolvedSize.mobile === "md"}
  class:wcag-ui-text--size-lg={resolvedSize.mobile === "lg"}
  class:wcag-ui-text--weight-medium={resolvedWeight.mobile === "medium"}
  class:wcag-ui-text--weight-semibold={resolvedWeight.mobile === "semibold"}
  class:wcag-ui-text--weight-bold={resolvedWeight.mobile === "bold"}
  class:wcag-ui-text--weight-normal={resolvedWeight.mobile === "normal"}
  class:wcag-ui-text--italic={resolvedItalic.mobile}
  class:wcag-ui-text--underline={resolvedUnderline.mobile}
  class:wcag-ui-text--truncate={truncate}

  style:--wcag-ui-text-color-mobile={resolvedColor.mobile}
  style:--wcag-ui-text-color-tablet={resolvedColor.tablet}
  style:--wcag-ui-text-color-desktop={resolvedColor.desktop}
  style:--wcag-ui-text-font-size-mobile={sizeVar(resolvedSize.mobile)}
  style:--wcag-ui-text-font-size-tablet={sizeVar(resolvedSize.tablet)}
  style:--wcag-ui-text-font-size-desktop={sizeVar(resolvedSize.desktop)}
  style:--wcag-ui-text-font-weight-mobile={weightVar(resolvedWeight.mobile)}
  style:--wcag-ui-text-font-weight-tablet={weightVar(resolvedWeight.tablet)}
  style:--wcag-ui-text-font-weight-desktop={weightVar(resolvedWeight.desktop)}
  style:--wcag-ui-text-line-height-mobile={resolvedLineHeight.mobile}
  style:--wcag-ui-text-line-height-tablet={resolvedLineHeight.tablet}
  style:--wcag-ui-text-line-height-desktop={resolvedLineHeight.desktop}
  style:--wcag-ui-text-italic-mobile={resolvedItalic.mobile ? "italic" : "normal"}
  style:--wcag-ui-text-italic-tablet={resolvedItalic.tablet ? "italic" : "normal"}
  style:--wcag-ui-text-italic-desktop={resolvedItalic.desktop ? "italic" : "normal"}
  style:--wcag-ui-text-underline-mobile={resolvedUnderline.mobile ? "underline" : "none"}
  style:--wcag-ui-text-underline-tablet={resolvedUnderline.tablet ? "underline" : "none"}
  style:--wcag-ui-text-underline-desktop={resolvedUnderline.desktop ? "underline" : "none"}
>
  {@render children?.()}
</span>

<style>
  .wcag-ui-text {
    /* Base mobile vars — always set, never omitted */
    --wcag-ui-text-font-size-mobile: inherit;
    --wcag-ui-text-font-weight-mobile: inherit;
    --wcag-ui-text-line-height-mobile: 1.2;
    --wcag-ui-text-italic-mobile: normal;
    --wcag-ui-text-underline-mobile: none;
    --wcag-ui-text-color-mobile: inherit;

    /* Tablet/desktop vars declared but intentionally empty —
       set via inline style only when they differ from the previous breakpoint.
       The media queries fall back to mobile/tablet vars when these are unset. */
    --wcag-ui-text-font-size-tablet: ;
    --wcag-ui-text-font-weight-tablet: ;
    --wcag-ui-text-line-height-tablet: ;
    --wcag-ui-text-italic-tablet: ;
    --wcag-ui-text-underline-tablet: ;
    --wcag-ui-text-color-tablet: ;
    --wcag-ui-text-font-size-desktop: ;
    --wcag-ui-text-font-weight-desktop: ;
    --wcag-ui-text-line-height-desktop: ;
    --wcag-ui-text-italic-desktop: ;
    --wcag-ui-text-underline-desktop: ;
    --wcag-ui-text-color-desktop: ;

    color: var(--wcag-ui-text-color-mobile);
    font-size: var(--wcag-ui-text-font-size-mobile);
    font-weight: var(--wcag-ui-text-font-weight-mobile);
    font-style: var(--wcag-ui-text-italic-mobile);
    text-decoration: var(--wcag-ui-text-underline-mobile);
    line-height: var(--wcag-ui-text-line-height-mobile);
  }

  /* Named sizes — mobile */
  .wcag-ui-text--size-sm { --wcag-ui-text-font-size-mobile: .75rem; }
  .wcag-ui-text--size-md { --wcag-ui-text-font-size-mobile: 1rem; }
  .wcag-ui-text--size-lg { --wcag-ui-text-font-size-mobile: 1.25rem; }

  /* Named weights — mobile */
  .wcag-ui-text--weight-normal   { --wcag-ui-text-font-weight-mobile: 400; }
  .wcag-ui-text--weight-medium   { --wcag-ui-text-font-weight-mobile: 500; }
  .wcag-ui-text--weight-semibold { --wcag-ui-text-font-weight-mobile: 600; }
  .wcag-ui-text--weight-bold     { --wcag-ui-text-font-weight-mobile: 700; }

  .wcag-ui-text--italic    { font-style: italic; }
  .wcag-ui-text--underline { text-decoration: underline; }

  .wcag-ui-text--truncate {
    display: block;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    max-width: 100%;
  }

   @media (min-width: 668px) {
     .wcag-ui-text {
       color: var(--wcag-ui-text-color-tablet);
       font-size: var(--wcag-ui-text-font-size-tablet);
       font-weight: var(--wcag-ui-text-font-weight-tablet);
       font-style: var(--wcag-ui-text-italic-tablet);
       line-height: var(--wcag-ui-text-line-height-tablet);
       text-decoration: var(--wcag-ui-text-underline-tablet);
     }
   }

   @media (min-width: 1025px) {
     .wcag-ui-text {
       color: var(--wcag-ui-text-color-desktop);
       font-size: var(--wcag-ui-text-font-size-desktop);
       font-weight: var(--wcag-ui-text-font-weight-desktop);
       font-style: var(--wcag-ui-text-italic-desktop);
       line-height: var(--wcag-ui-text-line-height-desktop);
       text-decoration: var(--wcag-ui-text-underline-desktop);
     }
   }
</style>
