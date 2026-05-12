<script lang="ts">
  import type { Snippet } from "svelte";
  import { BREAKPOINTS } from "$lib/constants/breakpoints";
  import Image from "./Image.svelte";

  type OverlayPlacement =
    | "top-left"    | "top-center"    | "top-right"
    | "inline-left" | "center"        | "inline-right"
    | "bottom-left" | "bottom-center" | "bottom-right";

  type ResponsivePlacement = {
    mobile?: OverlayPlacement;
    tablet?: OverlayPlacement;
    desktop?: OverlayPlacement;
  };

  type OverlayConfig = {
    placement?: OverlayPlacement | ResponsivePlacement;
    padding?: string;
  };

  type ImageSources = {
    mobile?: string;
    tablet?: string;
    desktop?: string;
  };

  type TextAlignment = "left" | "center" | "right";

  type AlignmentResult = { align: string; justify: string };

  type Props = {
    children?: Snippet;
    headline?: string;
    subhead?: string;
    supportingText?: string;
    images?: ImageSources;
    editoralcardActions?: Snippet;
    overlay?: OverlayConfig;
    href?: string;
    alt?: string;
    textAlignment?: TextAlignment;
    backgroundColor?: string;
    textColor?: string;
    hidden?: { desktop: boolean; tablet: boolean; mobile: boolean };
    spanColumn?: { desktop: string; tablet: string; mobile: string };
    spanRow?: { desktop: string; tablet: string; mobile: string };
    [key: string]: unknown;
  };

  let {
    children,
    headline,
    subhead,
    supportingText,
    images,
    editoralcardActions,
    overlay,
    href,
    alt = "",
    textAlignment = "center",
    backgroundColor = "#fff",
    textColor = "#212121",
    hidden = { desktop: false, tablet: false, mobile: false },
    spanColumn = { desktop: "span 3", tablet: "span 4", mobile: "span 6" },
    spanRow = { desktop: "span 1", tablet: "span 1", mobile: "span 1" },
    ...restProps
  }: Props = $props();

  const resolvedImages = $derived.by(() => {
    const mobile = images?.mobile ?? "";
    const tablet = images?.tablet ?? mobile;
    const desktop = images?.desktop ?? tablet;
    return { mobile, tablet, desktop };
  });

  function normalizePlacement(
    placement: OverlayPlacement | ResponsivePlacement | undefined
  ): Required<ResponsivePlacement> {
    if (!placement) return { mobile: "top-left", tablet: "top-left", desktop: "top-left" };
    if (typeof placement === "string") return { mobile: placement, tablet: placement, desktop: placement };
    return {
      mobile: placement.mobile ?? "top-left",
      tablet: placement.tablet ?? placement.mobile ?? "top-left",
      desktop: placement.desktop ?? placement.tablet ?? placement.mobile ?? "top-left",
    };
  }

  function placementToAlign(placement: OverlayPlacement): AlignmentResult {
    const map: Record<OverlayPlacement, AlignmentResult> = {
      "top-left":      { align: "flex-start", justify: "flex-start" },
      "top-center":    { align: "flex-start", justify: "center" },
      "top-right":     { align: "flex-start", justify: "flex-end" },
      "inline-left":   { align: "center",     justify: "flex-start" },
      "center":        { align: "center",     justify: "center" },
      "inline-right":  { align: "center",     justify: "flex-end" },
      "bottom-left":   { align: "flex-end",   justify: "flex-start" },
      "bottom-center": { align: "flex-end",   justify: "center" },
      "bottom-right":  { align: "flex-end",   justify: "flex-end" },
    };
    return map[placement] ?? { align: "flex-start", justify: "flex-start" };
  }

  const overlayPlacement = $derived(normalizePlacement(overlay?.placement));
</script>

<div
  class="spn-ui-editorial-card"
  class:spn-ui-editorial-card--textAlignment-left={textAlignment === "left"}
  class:spn-ui-editorial-card--textAlignment-right={textAlignment === "right"}
  style:--spn-ui-editoralcard-column-m={spanColumn.mobile || null}
  style:--spn-ui-editoralcard-column-t={spanColumn.tablet || null}
  style:--spn-ui-editoralcard-column-d={spanColumn.desktop || null}
  style:--spn-ui-editoralcard-row-m={spanRow.mobile || null}
  style:--spn-ui-editoralcard-row-t={spanRow.tablet || null}
  style:--spn-ui-editoralcard-row-d={spanRow.desktop || null}
  style:--spn-ui-editoralcard-background={backgroundColor}
  style:--spn-ui-editoralcard-color={textColor}
  style:--spn-ui-editoralcard-display-m={hidden.mobile ? "none" : "block"}
  style:--spn-ui-editoralcard-display-t={hidden.tablet ? "none" : "block"}
  style:--spn-ui-editoralcard-display-d={hidden.desktop ? "none" : "block"}
  style:--spn-ui-editorialcard-overlay-padding={overlay?.padding ?? "0.5rem"}
  {...restProps}
>
  <a class="spn-ui-editorial-card__link" {href}>
    <div class="spn-ui-editorial-card__media-container">
      {#if children}
        <div
          class="spn-ui-editorial-card__overlay"
          style:--spn-ui-editorialcard-overlay-align-m={placementToAlign(overlayPlacement.mobile).align}
          style:--spn-ui-editorialcard-overlay-justify-m={placementToAlign(overlayPlacement.mobile).justify}
          style:--spn-ui-editorialcard-overlay-align-t={placementToAlign(overlayPlacement.tablet).align}
          style:--spn-ui-editorialcard-overlay-justify-t={placementToAlign(overlayPlacement.tablet).justify}
          style:--spn-ui-editorialcard-overlay-align-d={placementToAlign(overlayPlacement.desktop).align}
          style:--spn-ui-editorialcard-overlay-justify-d={placementToAlign(overlayPlacement.desktop).justify}
        >
          {@render children()}
        </div>
      {/if}
      <picture class="spn-ui-editorial-card__media">
        <source
          media="(min-width: {BREAKPOINTS.desktop}px)"
          srcset={resolvedImages.desktop}
        />
        <source
          media="(min-width: {BREAKPOINTS.tablet}px)"
          srcset={resolvedImages.tablet}
        />
        <Image src={resolvedImages.mobile} {alt} width={280} height={280} />
      </picture>
    </div>

    {#if headline || subhead || supportingText}
      <div class="spn-ui-editorial-card__content">
        {#if headline && subhead}
          <hgroup class="spn-ui-editorial-card__heading-group">
            <h3 class="spn-ui-editorial-card__headline">{headline}</h3>
            <p class="spn-ui-editorial-card__subhead">{subhead}</p>
          </hgroup>
        {:else if headline}
          <h3 class="spn-ui-editorial-card__headline">{headline}</h3>
        {:else if subhead}
          <p class="spn-ui-editorial-card__subhead">{subhead}</p>
        {/if}
        {#if supportingText}
          <div class="spn-ui-editorial-card__supportingText">
            {supportingText}
          </div>
        {/if}
      </div>
    {/if}
  </a>

  {#if editoralcardActions}
    <div class="spn-ui-editorial-card__actions">
      {@render editoralcardActions()}
    </div>
  {/if}
</div>

<style>
  @layer variables, base, variants, responsive;

  @layer variables {
    .spn-ui-editorial-card {
      --spn-ui-editorialcard-overlay-padding: 0.5rem;
      --spn-ui-editoralcard-display-m: block;
      --spn-ui-editoralcard-display-t: block;
      --spn-ui-editoralcard-display-d: block;
      --spn-ui-editoralcard-background: #fff;
      --spn-ui-editoralcard-color: #212121;
      --spn-ui-editoralcard-column-m: span 6;
      --spn-ui-editoralcard-column-t: span 4;
      --spn-ui-editoralcard-column-d: span 3;
      --spn-ui-editoralcard-row-m: span 1;
      --spn-ui-editoralcard-row-t: span 1;
      --spn-ui-editoralcard-row-d: span 1;
      --spn-ui-editoralcard-text-alignment: center;
      --spn-ui-editoralcard-font-family: system-ui, -apple-system,
        BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif,
        "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
      --spn-ui-editorialcard-overlay-align-m: flex-start;
      --spn-ui-editorialcard-overlay-justify-m: flex-start;
      --spn-ui-editorialcard-overlay-align-t: flex-start;
      --spn-ui-editorialcard-overlay-justify-t: flex-start;
      --spn-ui-editorialcard-overlay-align-d: flex-start;
      --spn-ui-editorialcard-overlay-justify-d: flex-start;
      --spn-ui-editorialcard-overlay-bg: ;
    }
  }

  @layer base {
    .spn-ui-editorial-card {
      position: relative;
      background-color: var(--spn-ui-editoralcard-background);
      font-family: var(--spn-ui-editoralcard-font-family);
      grid-column: var(--spn-ui-editoralcard-column-m);
      grid-row: var(--spn-ui-editoralcard-row-m);
      border-radius: 1rem;
      overflow: hidden;
      height: fit-content;
      display: var(--spn-ui-editoralcard-display-m);
      text-align: var(--spn-ui-editoralcard-text-alignment);
      container-type: inline-size;
    }

    .spn-ui-editorial-card__media-container {
      position: relative;
      overflow: hidden;
    }

    .spn-ui-editorial-card__overlay {
      position: absolute;
      inset: 0;
      z-index: 1;
      display: flex;
      flex-direction: column;
      justify-content: var(--spn-ui-editorialcard-overlay-align-m);
      align-items: var(--spn-ui-editorialcard-overlay-justify-m);
      background-color: var(--spn-ui-editorialcard-overlay-bg);
      padding: var(--spn-ui-editorialcard-overlay-padding);
      box-sizing: border-box;
      pointer-events: none;
    }

    .spn-ui-editorial-card__overlay > :global(*) {
      pointer-events: auto;
    }

    .spn-ui-editorial-card__link,
    .spn-ui-editorial-card__link:visited {
      display: block;
      text-decoration: none;
      color: var(--spn-ui-editoralcard-color);
    }

    .spn-ui-editorial-card__link:is(:hover, :focus-visible) {
      text-decoration: underline;
      cursor: pointer;
    }

    .spn-ui-editorial-card__content {
      box-sizing: border-box;
      min-height: 3rem;
      display: flex;
      flex-flow: column nowrap;
      color: var(--spn-ui-editoralcard-color);
    }

    .spn-ui-editorial-card__content:not(:empty) {
      padding-block: 1rem;
      padding-inline: 1rem;
    }

    .spn-ui-editorial-card__headline {
      margin: 0;
      line-height: 1.4;
      font-size: 1.2rem;
    }

    .spn-ui-editorial-card__subhead {
      margin: 0;
      line-height: 1.2;
      font-weight: 500;
      font-size: 1.125rem;
    }

    .spn-ui-editorial-card__supportingText {
      font-size: 1rem;
      line-height: 1.2;
    }

    .spn-ui-editorial-card__actions {
      width: 100%;
    }

    .spn-ui-editorial-card__actions:empty {
      display: none;
    }
  }

  @layer variants {
    .spn-ui-editorial-card--textAlignment-left {
      --spn-ui-editoralcard-text-alignment: left;
    }

    .spn-ui-editorial-card--textAlignment-right {
      --spn-ui-editoralcard-text-alignment: right;
    }
  }

  @layer responsive {
    @container (min-width: 668px) {
      .spn-ui-editorial-card {
        grid-column: var(--spn-ui-editoralcard-column-t);
        grid-row: var(--spn-ui-editoralcard-row-t);
        display: var(--spn-ui-editoralcard-display-t);
      }

      .spn-ui-editorial-card__overlay {
        justify-content: var(--spn-ui-editorialcard-overlay-align-t);
        align-items: var(--spn-ui-editorialcard-overlay-justify-t);
      }
    }

    @container (min-width: 1025px) {
      .spn-ui-editorial-card {
        grid-column: var(--spn-ui-editoralcard-column-d);
        grid-row: var(--spn-ui-editoralcard-row-d);
        display: var(--spn-ui-editoralcard-display-d);
      }

      .spn-ui-editorial-card__overlay {
        justify-content: var(--spn-ui-editorialcard-overlay-align-d);
        align-items: var(--spn-ui-editorialcard-overlay-justify-d);
      }
    }

    @supports not (container-type: inline-size) {
      @media (min-width: 668px) {
        .spn-ui-editorial-card {
          grid-column: var(--spn-ui-editoralcard-column-t);
          grid-row: var(--spn-ui-editoralcard-row-t);
          display: var(--spn-ui-editoralcard-display-t);
        }
        .spn-ui-editorial-card__overlay {
          justify-content: var(--spn-ui-editorialcard-overlay-align-t);
          align-items: var(--spn-ui-editorialcard-overlay-justify-t);
        }
      }
      @media (min-width: 1025px) {
        .spn-ui-editorial-card {
          grid-column: var(--spn-ui-editoralcard-column-d);
          grid-row: var(--spn-ui-editoralcard-row-d);
          display: var(--spn-ui-editoralcard-display-d);
        }
        .spn-ui-editorial-card__overlay {
          justify-content: var(--spn-ui-editorialcard-overlay-align-d);
          align-items: var(--spn-ui-editorialcard-overlay-justify-d);
        }
      }
    }
  }
</style>
