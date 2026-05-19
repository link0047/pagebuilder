<script lang="ts">
  import type { Snippet } from "svelte";

  type Tag = "div" | "button" | "a";
  type ButtonType = "button" | "submit" | "reset";
  type Variant = "filled" | "outlined" | "elevated";
  type Shape = "squared" | "rounded" | "curved";
  type Elevation = 0 | 1 | 2 | 3 | 4 | 5;
  type Layout = "media-top" | "media-bottom" | "horizontal";
  type HeadlineTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "span" | "div"

  export type Props = {
    children?: Snippet,
    header?: Snippet,
    media?: Snippet,
    content?: Snippet,
    actions?: Snippet,
    headline?: string,
    subhead?: string,
    supportingText?: string,
    shape?: Shape,
    variant?: Variant,
    elevation?: Elevation,
    layout?: Layout,
    tag?: Tag,
    headlineTag?: HeadlineTag,
    href?: string,
    type?: ButtonType,
    selected?: boolean,
    [key: string]: unknown;
  }

  let {
    children,
    header,
    media,
    content,
    actions,
    headline,
    subhead,
    supportingText,
    shape = "rounded",
    variant = "outlined",
    elevation,
    layout,
    tag = "div",
    headlineTag,
    href,
    type,
    selected,
    ...restProps
  }: Props = $props();

  function getValidElevation(elevation: Elevation | undefined, variant: Variant): Elevation {
    const defaultElevation = variant === "elevated" ? 1 : 0;
    return elevation ?? defaultElevation;
  }

  const computedElevation = $derived(getValidElevation(elevation, variant));
  const computedTag = $derived(href ? "a" : tag);
  const computedType = $derived(computedTag === "button" ? (type ?? "button") : undefined);
</script>

<svelte:element
  this={computedTag}
  class="wcag-ui-card"
  data-selected={computedTag === "button" ? selected : undefined}
  class:wcag-ui-card--interactive={computedTag !== "div"}
  class:wcag-ui-card--filled={variant === "filled"}
  class:wcag-ui-card--elevated={variant === "elevated"}
  class:wcag-ui-card--elevation-1={computedElevation === 1}
  class:wcag-ui-card--elevation-2={computedElevation === 2}
  class:wcag-ui-card--elevation-3={computedElevation === 3}
  class:wcag-ui-card--elevation-4={computedElevation === 4}
  class:wcag-ui-card--elevation-5={computedElevation === 5}
  class:wcag-ui-card--shape-squared={shape === "squared"}
  class:wcag-ui-card--shape-curved={shape === "curved"}
  class:wcag-ui-card--layout-media-top={layout === "media-top"}
	class:wcag-ui-card--layout-media-bottom={layout === "media-bottom"}
	class:wcag-ui-card--layout-horizontal={layout === "horizontal"}
  href={computedTag === "a" ? href : undefined}
  type={computedType}
  aria-pressed={computedTag === "button" ? selected : undefined}
  {...restProps}
>
  {#if media}
    <div class="wcag-ui-card__media">{@render media()}</div>
  {/if}
  {#if header}
    <div class="wcag-ui-card__header">{@render header()}</div>
  {:else if headline || subhead}
    <div class="wcag-ui-card__header">
      {#if headline}
        <svelte:element this={headlineTag ?? "span"} class="wcag-ui-card__headline">
          {headline}
        </svelte:element>
      {/if}
      {#if subhead}<span class="wcag-ui-card__subhead">{subhead}</span>{/if}
    </div>
  {/if}
  {#if content}
    <div class="wcag-ui-card__content">{@render content()}</div>
  {:else if supportingText}
    <div class="wcag-ui-card__content">
      <p class="wcag-ui-card__supporting-text">{supportingText}</p>
    </div>
  {/if}
  {#if actions}
    <div class="wcag-ui-card__actions">{@render actions()}</div>
  {/if}
  {@render children?.()}
</svelte:element>

<style>
  @layer variables, base, variants, shapes, layouts, states, accessibility;

  @layer variables {
    :root {
      /* base dimensions */
      --wcag-ui-card-padding-block: .5rem;
      --wcag-ui-card-padding-inline: .5rem;
      --wcag-ui-card-box-shadow: none;
      --wcag-ui-card-background-color: #fff;

      /* typography */
      --wcag-ui-card-font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
      --wcag-ui-card-font-size: 1rem;
      --wcag-ui-card-font-weight: 500;
      --wcag-ui-card-color: #333;

      /* border styles */
      --wcag-ui-card-border-width: 1px;
      --wcag-ui-card-border-style: solid;
      --wcag-ui-card-border-color: #cac4cf;
      --wcag-ui-card-border-radius: .5rem;

      /* layout styles */
      --wcag-ui-card-grid-template-areas:
        "header"
        "media"
        "content"
        "actions";
      --wcag-ui-card-grid-template-rows: auto auto 1fr auto;
      --wcag-ui-card-grid-template-columns: 1fr;

      --wcag-ui-card-header-gap: .25rem;
      --wcag-ui-card-actions-justification: flex-end;
      --wcag-ui-card-actions-gap: .5rem;

      --wcag-ui-card-headline-font-size: 1rem;
      --wcag-ui-card-headline-font-weight: 600;
      --wcag-ui-card-headline-color: inherit;
      --wcag-ui-card-subhead-font-size: .875rem;
      --wcag-ui-card-subhead-font-weight: 400;
      --wcag-ui-card-subhead-color: #666;
      --wcag-ui-card-supporting-text-font-size: .875rem;
      --wcag-ui-card-supporting-text-font-weight: 400;
      --wcag-ui-card-supporting-text-color: #666;
    }
  }

  @layer base {
    .wcag-ui-card {
      position: relative;
      box-sizing: border-box;
      display: grid;
      grid-template-areas: var(--wcag-ui-card-grid-template-areas);
      grid-template-rows: var(--wcag-ui-card-grid-template-rows);
      grid-template-columns: var(--wcag-ui-card-grid-template-columns);
      font-family: var(--wcag-ui-card-font-family);
      font-size: var(--wcag-ui-card-font-size);
      font-weight: var(--wcag-ui-card-font-weight);
      color: var(--wcag-ui-card-color);
      background: var(--wcag-ui-card-background-color);
      padding-block: var(--wcag-ui-card-padding-block);
      padding-inline: var(--wcag-ui-card-padding-inline);
      border: var(--wcag-ui-card-border-width) var(--wcag-ui-card-border-style) var(--wcag-ui-card-border-color);
      border-radius: var(--wcag-ui-card-border-radius);
      box-shadow: var(--wcag-ui-card-box-shadow);
    }

    .wcag-ui-card__header {
      grid-area: header;
      display: flex;
      flex-direction: column;
      gap: var(--wcag-ui-card-header-gap);
    }

    .wcag-ui-card__media {
      grid-area: media;
    }

    .wcag-ui-card__content {
      grid-area: content;
    }

    .wcag-ui-card__actions {
      grid-area: actions;
      display: flex;
      flex-direction: row;
      justify-content: var(--wcag-ui-card-actions-justification);
      align-items: center;
      gap: var(--wcag-ui-card-actions-gap);
    }

    .wcag-ui-card__headline {
      font-size: var(--wcag-ui-card-headline-font-size);
      font-weight: var(--wcag-ui-card-headline-font-weight);
      color: var(--wcag-ui-card-headline-color);
    }

    .wcag-ui-card__subhead {
      font-size: var(--wcag-ui-card-subhead-font-size);
      font-weight: var(--wcag-ui-card-subhead-font-weight);
      color: var(--wcag-ui-card-subhead-color);
    }

    .wcag-ui-card__supporting-text {
      font-size: var(--wcag-ui-card-supporting-text-font-size);
      font-weight: var(--wcag-ui-card-supporting-text-font-weight);
      color: var(--wcag-ui-card-supporting-text-color);
    }
  }

  @layer variants {
    .wcag-ui-card--filled {
    --wcag-ui-card-background-color: #f5f5f5;
      border-color: transparent;
    }

    .wcag-ui-card--elevated {
      border-color: transparent;
    }

    .wcag-ui-card--elevation-1 {
      --wcag-ui-card-box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.3), 0px 1px 3px 1px rgba(0, 0, 0, 0.15);
    }

    .wcag-ui-card--elevation-2 {
      --wcag-ui-card-box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.3), 0px 2px 6px 2px rgba(0, 0, 0, 0.15);
    }

    .wcag-ui-card--elevation-3 {
      --wcag-ui-card-box-shadow: 0px 4px 8px 3px rgba(0, 0, 0, 0.15), 0px 1px 3px 0px rgba(0, 0, 0, 0.30);
    }

    .wcag-ui-card--elevation-4 {
      --wcag-ui-card-box-shadow: 0px 6px 10px 4px rgba(0, 0, 0, 0.15), 0px 2px 3px 0px rgba(0, 0, 0, 0.30);
    }

    .wcag-ui-card--elevation-5 {
      --wcag-ui-card-box-shadow: 0px 8px 12px 6px rgba(0, 0, 0, 0.15), 0px 4px 4px 0px rgba(0, 0, 0, 0.30);
    }
  }

  @layer shapes {
    .wcag-ui-card--shape-squared {
      --wcag-ui-card-border-radius: 0;
    }

    .wcag-ui-card--shape-curved {
      --wcag-ui-card-border-radius: 1rem;
      --wcag-ui-card-padding-inline: .75rem;
    }
  }

  @layer layouts {
    .wcag-ui-card--layout-media-top {
      --wcag-ui-card-grid-template-areas:
        "media"
        "header"
        "content"
        "actions";
    }

    .wcag-ui-card--layout-media-bottom {
      --wcag-ui-card-grid-template-areas:
        "header"
        "content"
        "actions"
        "media";
      --wcag-ui-card-grid-template-rows: auto 1fr auto auto;
    }

    .wcag-ui-card--layout-horizontal {
      --wcag-ui-card-grid-template-areas:
        "media header"
        "media content"
        "media actions";
      --wcag-ui-card-grid-template-rows: auto 1fr auto;
      --wcag-ui-card-grid-template-columns: auto 1fr;
    }
  }

  @layer states {
    .wcag-ui-card--interactive {
      cursor: pointer;
      transition: box-shadow 200ms ease, transform 200ms ease;
    }

    button.wcag-ui-card--interactive {
      appearance: none;
      touch-action: manipulation;
      user-select: none;
    }

    .wcag-ui-card--interactive:focus-visible {
      outline: 3px solid #005fcc;
      outline-offset: 2px;
    }

    .wcag-ui-card--interactive:hover {
      --wcag-ui-card-box-shadow: 0px 4px 8px 3px rgba(0, 0, 0, 0.15), 0px 1px 3px 0px rgba(0, 0, 0, 0.30);
    }

    .wcag-ui-card--interactive:active {
      transform: translateY(1px);
    }

    .wcag-ui-card:is([aria-disabled="true"], :disabled) {
      opacity: 0.38;
      pointer-events: none;
    }

    .wcag-ui-card[data-selected="true"] {
      --wcag-ui-card-border-color: currentColor;
      --wcag-ui-card-border-width: 2px;
    }
  }

  @layer accessibility {
    @media (prefers-reduced-motion: reduce) {
      .wcag-ui-card--interactive {
        transition: none;
      }
    }

    @media (prefers-contrast: more) {
      .wcag-ui-card {
        --wcag-ui-card-border-color: #000;
        --wcag-ui-card-border-width: 2px;
      }
    }
  }
</style>
