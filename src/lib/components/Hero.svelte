<script lang="ts">
  import type { Snippet } from "svelte";
  import Image from "./Image.svelte";
  import { BREAKPOINTS } from "$lib/constants/breakpoints";

  type HeroContentPlacement =
    | "top-left"    | "top-center"    | "top-right"
    | "inline-left" | "center"        | "inline-right"
    | "bottom-left" | "bottom-center" | "bottom-right";

  type HeroImage = {
    src: string;
    src2x?: string;
  };

  type HeroContent = {
    placement?: HeroContentPlacement;
    padding?: string;
    gap?: string;
    textAlign?: "left" | "center" | "right";
  };

  type HeroBreakpointConfig = {
    image?: HeroImage;
    content?: HeroContent;
  };

  type HeroConfig = {
    mobile: Required<HeroBreakpointConfig>;
    tablet?: HeroBreakpointConfig;
    desktop?: HeroBreakpointConfig;
    wide?: HeroBreakpointConfig;
  };

  type Props = {
    config?: HeroConfig;
    layout?: "overlay" | "split-start" | "split-end";
    alt?: string;
    href?: string;
    width?: number;
    height?: number;
    loading?: "eager" | "lazy";
    fetchpriority?: "high" | "low" | "auto";
    children?: Snippet;
    [key: string]: unknown;
  };

  const DEFAULT_CONTENT: Required<HeroContent> = {
    placement: "center",
    padding: "1rem",
    gap: "0.5rem",
    textAlign: "left",
  };

  const DEFAULT_CONFIG: HeroConfig = {
    mobile: {
      image: { src: "https://placehold.co/390x260" },
      content: { placement: "center", padding: "1rem", textAlign: "left" },
    },
    tablet: {
      image: { src: "https://placehold.co/768x320" },
    },
    desktop: {
      image: { src: "https://placehold.co/1024x400" },
    },
    wide: {
      image: { src: "https://placehold.co/1400x480" },
    },
  };

  let {
    config = DEFAULT_CONFIG,
    layout = "overlay",
    alt = "",
    href,
    width = 1400,
    height = 460,
    loading = "eager",
    fetchpriority = "auto",
    children,
    ...restProps
  }: Props = $props();

  const resolved = $derived.by(() => {
    const mobileSrc = config?.mobile?.image ?? { src: "https://placehold.co/390x260" };
    const mobileContent = { ...DEFAULT_CONTENT, ...config?.mobile?.content };
    const mobile = { image: mobileSrc, content: mobileContent };

    const tabletContent = config?.tablet?.content ?? {};
    const tablet = {
      image: config?.tablet?.image ?? mobile.image,
      content: {
        ...mobile.content,
        ...tabletContent,
        placement: tabletContent.placement || mobile.content.placement,
        padding: tabletContent.padding || mobile.content.padding,
        gap: tabletContent.gap || mobile.content.gap,
        textAlign: tabletContent.textAlign || mobile.content.textAlign,
      },
    };

    const desktopContent = config?.desktop?.content ?? {};
    const desktop = {
      image: config?.desktop?.image ?? tablet.image,
      content: {
        ...tablet.content,
        ...desktopContent,
        placement: desktopContent.placement || tablet.content.placement,
        padding: desktopContent.padding || tablet.content.padding,
        gap: desktopContent.gap || tablet.content.gap,
        textAlign: desktopContent.textAlign || tablet.content.textAlign,
      },
    };

    const wideContent = config?.wide?.content ?? {};
    const wide = {
      image: config?.wide?.image ?? desktop.image,
      content: {
        ...desktop.content,
        ...wideContent,
        placement: wideContent.placement || desktop.content.placement,
        padding: wideContent.padding || desktop.content.padding,
        gap: wideContent.gap || desktop.content.gap,
        textAlign: wideContent.textAlign || desktop.content.textAlign,
      },
    };

    return { mobile, tablet, desktop, wide };
  });

  function srcset(image: HeroImage): string {
    return image.src2x
      ? `${image.src} 1x, ${image.src2x} 2x`
      : image.src;
  }

  function placementToValign(placement: HeroContentPlacement): "start" | "center" | "end" {
    if (placement.startsWith("top")) return "start";
    if (placement.startsWith("bottom")) return "end";
    return "center";
  }

  function placementToHalign(placement: HeroContentPlacement): "start" | "center" | "end" {
    if (placement.endsWith("right")) return "end";
    if (placement.endsWith("center")) return "center";
    return "start";
  }

  const tag = $derived(href ? "a" : "div");
</script>

{#snippet responsiveImage()}
  <picture class="hero__media">

    <source
      media="(min-width: {BREAKPOINTS.desktop}px)"
      srcset={srcset(resolved.desktop.image)}
    />
    <source
      media="(min-width: {BREAKPOINTS.tablet}px)"
      srcset={srcset(resolved.tablet.image)}
    />
    <Image
      src={resolved.mobile.image.src}
      {width}
      {height}
      {alt}
      {loading}
      {fetchpriority}
    />
  </picture>
{/snippet}

<div
  class="hero"
  class:hero--overlay={layout === "overlay"}
  class:hero--split-start={layout === "split-start"}
  class:hero--split-end={layout === "split-end"}
  {...restProps}
>
  <svelte:element this={tag} class="hero__visual" href={href || undefined}>
    {@render responsiveImage()}
  </svelte:element>

  {#if children}
    <div
      class="hero__content"
      style:--hero-content-padding-mobile={resolved.mobile.content.padding}
      style:--hero-content-padding-tablet={resolved.tablet.content.padding}
      style:--hero-content-padding-desktop={resolved.desktop.content.padding}
      style:--hero-content-padding-wide={resolved.wide.content.padding}
      style:--hero-content-gap-mobile={resolved.mobile.content.gap}
      style:--hero-content-gap-tablet={resolved.tablet.content.gap}
      style:--hero-content-gap-desktop={resolved.desktop.content.gap}
      style:--hero-content-gap-wide={resolved.wide.content.gap}
      style:--hero-content-text-align-mobile={resolved.mobile.content.textAlign}
      style:--hero-content-text-align-tablet={resolved.tablet.content.textAlign}
      style:--hero-content-text-align-desktop={resolved.desktop.content.textAlign}
      style:--hero-split-valign-mobile={placementToValign(resolved.mobile.content.placement)}
      style:--hero-split-valign-tablet={placementToValign(resolved.tablet.content.placement)}
      style:--hero-split-valign-desktop={placementToValign(resolved.desktop.content.placement)}
      style:--hero-split-halign-mobile={placementToHalign(resolved.mobile.content.placement)}
      style:--hero-split-halign-tablet={placementToHalign(resolved.tablet.content.placement)}
      style:--hero-split-halign-desktop={placementToHalign(resolved.desktop.content.placement)}
    >
      {@render children()}
    </div>
  {/if}
</div>

<style>
  @layer variables, base, variants, responsive;

  @layer variables {
    .hero {
      --hero-border-radius: 0.75rem;
      --hero-font-family: system-ui, -apple-system, BlinkMacSystemFont,
        "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      --hero-content-padding-mobile: 1rem;
      --hero-content-padding-tablet: 1rem;
      --hero-content-padding-desktop: 1rem;
      --hero-content-padding-wide: 1rem;
      --hero-content-gap-mobile: 0.5rem;
      --hero-content-gap-tablet: 0.5rem;
      --hero-content-gap-desktop: 0.5rem;
      --hero-content-gap-wide: 0.5rem;
      --hero-content-text-align-mobile: left;
      --hero-content-text-align-tablet: ;
      --hero-content-text-align-desktop: ;
      --hero-split-valign-mobile: center;
      --hero-split-valign-tablet: center;
      --hero-split-valign-desktop: center;
      --hero-split-halign-mobile: start;
      --hero-split-halign-tablet: start;
      --hero-split-halign-desktop: start;
    }
  }

  @layer base {
    .hero {
      position: relative;
      display: grid;
      grid-template-columns: repeat(12, 1fr);
      container-type: inline-size;
      font-family: var(--hero-font-family);
      border-radius: var(--hero-border-radius);
      overflow: hidden;
    }

    .hero__visual {
      grid-column: 1 / -1;
      grid-row: 1;
      display: block;
      width: 100%;
      height: auto;
      overflow: hidden;
    }

    .hero__content {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      text-align: var(--hero-content-text-align-mobile);
      padding: var(--hero-content-padding-mobile);
      z-index: 1;
    }
  }

  @layer variants {
    /* ── Split ─────────────────────────────────────────────── */

    .hero--split-start {
      grid-template-columns: 1fr 1fr;
      grid-template-areas: "visual content";
    }

    .hero--split-end {
      grid-template-columns: 1fr 1fr;
      grid-template-areas: "content visual";
    }

    .hero--split-start .hero__visual {
      border-start-end-radius: 0;
      border-end-end-radius: 0;
    }

    .hero--split-end .hero__visual {
      border-start-start-radius: 0;
      border-end-start-radius: 0;
    }

    :is(.hero--split-start, .hero--split-end) .hero__visual {
      grid-area: visual;
    }

    :is(.hero--split-start, .hero--split-end) .hero__content {
      grid-area: content;
      justify-content: var(--hero-split-valign-mobile, center);
      align-items: var(--hero-split-halign-mobile, start);
    }

    /* ── Overlay ───────────────────────────────────────────── */

    .hero--overlay .hero__content {
      grid-column: 1 / -1;
      grid-row: 1;
      align-self: var(--hero-split-valign-mobile, center);
      justify-self: var(--hero-split-halign-mobile, start);
    }
  }

  @layer responsive {
    @container (min-width: 668px) {
      .hero__content {
        padding: var(--hero-content-padding-tablet);
        gap: var(--hero-content-gap-tablet);
        text-align: var(--hero-content-text-align-tablet, var(--hero-content-text-align-mobile));
      }

      :is(.hero--split-start, .hero--split-end) .hero__content {
        justify-content: var(--hero-split-valign-tablet, center);
        align-items: var(--hero-split-halign-tablet, start);
      }

      .hero--overlay .hero__content {
        align-self: var(--hero-split-valign-tablet, center);
        justify-self: var(--hero-split-halign-tablet, start);
      }
    }

    @container (min-width: 1025px) {
      .hero__content {
        padding: var(--hero-content-padding-desktop);
        gap: var(--hero-content-gap-desktop);
        text-align: var(--hero-content-text-align-desktop, var(--hero-content-text-align-tablet, var(--hero-content-text-align-mobile)));
      }

      :is(.hero--split-start, .hero--split-end) .hero__content {
        justify-content: var(--hero-split-valign-desktop, center);
        align-items: var(--hero-split-halign-desktop, start);
      }

      .hero--overlay .hero__content {
        align-self: var(--hero-split-valign-desktop, center);
        justify-self: var(--hero-split-halign-desktop, start);
      }
    }

    @supports not (container-type: inline-size) {
      @media (min-width: 668px) {
        .hero__content {
          padding: var(--hero-content-padding-tablet);
          gap: var(--hero-content-gap-tablet);
          text-align: var(--hero-content-text-align-tablet, var(--hero-content-text-align-mobile));
        }

        :is(.hero--split-start, .hero--split-end) .hero__content {
          justify-content: var(--hero-split-valign-tablet, center);
          align-items: var(--hero-split-halign-tablet, start);
        }

        .hero--overlay .hero__content {
          align-self: var(--hero-split-valign-tablet, center);
          justify-self: var(--hero-split-halign-tablet, start);
        }
      }

      @media (min-width: 1025px) {
        .hero__content {
          padding: var(--hero-content-padding-desktop);
          gap: var(--hero-content-gap-desktop);
          text-align: var(--hero-content-text-align-desktop, var(--hero-content-text-align-tablet, var(--hero-content-text-align-mobile)));
        }

        :is(.hero--split-start, .hero--split-end) .hero__content {
          justify-content: var(--hero-split-valign-desktop, center);
          align-items: var(--hero-split-halign-desktop, start);
        }

        .hero--overlay .hero__content {
          align-self: var(--hero-split-valign-desktop, center);
          justify-self: var(--hero-split-halign-desktop, start);
        }
      }
    }
  }
</style>
