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
  };

  const DEFAULT_CONTENT: Required<HeroContent> = {
    placement: "center",
    padding: "1rem",
    gap: "0.5rem",
  };

  const DEFAULT_CONFIG: HeroConfig = {
    mobile: {
      image: { src: "https://placehold.co/390x260" },
      content: { placement: "center", padding: "1rem" },
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
  }: Props = $props();

  const resolved = $derived.by(() => {
    const mobileSrc = config?.mobile?.image ?? { src: "https://placehold.co/390x260" };
    const mobileContent = { ...DEFAULT_CONTENT, ...config?.mobile?.content };

    const mobile = { image: mobileSrc, content: mobileContent };
    const tablet = {
      image: config?.tablet?.image ?? mobile.image,
      content: { ...mobile.content, ...config?.tablet?.content },
    };
    const desktop = {
      image: config?.desktop?.image ?? tablet.image,
      content: { ...tablet.content, ...config?.desktop?.content },
    };
    const wide = {
      image: config?.wide?.image ?? desktop.image,
      content: { ...desktop.content, ...config?.wide?.content },
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
  const isSplit = $derived(layout === "split-start" || layout === "split-end");
</script>

{#snippet responsiveImage()}
  <picture class="hero__media">
    <source
      media="(min-width: {BREAKPOINTS.desktopWide}px)"
      srcset={srcset(resolved.wide.image)}
    />
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
>
  <svelte:element this={tag} class="hero__visual" href={href || undefined}>
    {@render responsiveImage()}
  </svelte:element>

  {#if children}
    <div
      class="hero__content"
      data-placement={!isSplit ? resolved.mobile.content.placement : null}
      style:--hero-content-padding-mobile={resolved.mobile.content.padding}
      style:--hero-content-padding-tablet={resolved.tablet.content.padding}
      style:--hero-content-padding-desktop={resolved.desktop.content.padding}
      style:--hero-content-padding-wide={resolved.wide.content.padding}
      style:--hero-content-gap-mobile={resolved.mobile.content.gap}
      style:--hero-content-gap-tablet={resolved.tablet.content.gap}
      style:--hero-content-gap-desktop={resolved.desktop.content.gap}
      style:--hero-content-gap-wide={resolved.wide.content.gap}
      style:--hero-split-valign-mobile={placementToValign(resolved.mobile.content.placement)}
      style:--hero-split-valign-tablet={placementToValign(resolved.tablet.content.placement)}
      style:--hero-split-valign-desktop={placementToValign(resolved.desktop.content.placement)}
      style:--hero-split-valign-wide={placementToValign(resolved.wide.content.placement)}
      style:--hero-split-halign-mobile={placementToHalign(resolved.mobile.content.placement)}
      style:--hero-split-halign-tablet={placementToHalign(resolved.tablet.content.placement)}
      style:--hero-split-halign-desktop={placementToHalign(resolved.desktop.content.placement)}
      style:--hero-split-halign-wide={placementToHalign(resolved.wide.content.placement)}
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
      --hero-split-valign-mobile: center;
      --hero-split-valign-tablet: center;
      --hero-split-valign-desktop: center;
      --hero-split-valign-wide: center;
      --hero-split-halign-mobile: start;
      --hero-split-halign-tablet: start;
      --hero-split-halign-desktop: start;
      --hero-split-halign-wide: start;
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
      padding: var(--hero-content-padding-mobile);
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
      width: 100%;
      height: 100%;
    }

    .hero--overlay .hero__content[data-placement="top-left"]      { align-self: start;  justify-self: start;  }
    .hero--overlay .hero__content[data-placement="top-center"]    { align-self: start;  justify-self: center; }
    .hero--overlay .hero__content[data-placement="top-right"]     { align-self: start;  justify-self: end;    }
    .hero--overlay .hero__content[data-placement="inline-left"]   { align-self: center; justify-self: start;  }
    .hero--overlay .hero__content[data-placement="center"]        { align-self: center; justify-self: center; }
    .hero--overlay .hero__content[data-placement="inline-right"]  { align-self: center; justify-self: end;    }
    .hero--overlay .hero__content[data-placement="bottom-left"]   { align-self: end;    justify-self: start;  }
    .hero--overlay .hero__content[data-placement="bottom-center"] { align-self: end;    justify-self: center; }
    .hero--overlay .hero__content[data-placement="bottom-right"]  { align-self: end;    justify-self: end;    }
  }

  @layer responsive {
    @container (min-width: 668px) {
      .hero__content {
        padding: var(--hero-content-padding-tablet);
        gap: var(--hero-content-gap-tablet);
      }

      :is(.hero--split-start, .hero--split-end) .hero__content {
        justify-content: var(--hero-split-valign-tablet, center);
        align-items: var(--hero-split-halign-tablet, start);
      }

      .hero--overlay .hero__content {
        align-self: unset;
        justify-self: unset;
      }

      .hero--overlay .hero__content[data-placement="top-left"]      { align-self: start;  justify-self: start;  }
      .hero--overlay .hero__content[data-placement="top-center"]    { align-self: start;  justify-self: center; }
      .hero--overlay .hero__content[data-placement="top-right"]     { align-self: start;  justify-self: end;    }
      .hero--overlay .hero__content[data-placement="inline-left"]   { align-self: center; justify-self: start;  }
      .hero--overlay .hero__content[data-placement="center"]        { align-self: center; justify-self: center; }
      .hero--overlay .hero__content[data-placement="inline-right"]  { align-self: center; justify-self: end;    }
      .hero--overlay .hero__content[data-placement="bottom-left"]   { align-self: end;    justify-self: start;  }
      .hero--overlay .hero__content[data-placement="bottom-center"] { align-self: end;    justify-self: center; }
      .hero--overlay .hero__content[data-placement="bottom-right"]  { align-self: end;    justify-self: end;    }
    }

    @container (min-width: 1025px) {
      .hero__content {
        padding: var(--hero-content-padding-desktop);
        gap: var(--hero-content-gap-desktop);
      }

      :is(.hero--split-start, .hero--split-end) .hero__content {
        justify-content: var(--hero-split-valign-desktop, center);
        align-items: var(--hero-split-halign-desktop, start);
      }
    }

    @container (min-width: 1200px) {
      .hero__content {
        padding: var(--hero-content-padding-wide);
        gap: var(--hero-content-gap-wide);
      }

      :is(.hero--split-start, .hero--split-end) .hero__content {
        justify-content: var(--hero-split-valign-wide, center);
        align-items: var(--hero-split-halign-wide, start);
      }
    }

    @supports not (container-type: inline-size) {
      @media (min-width: 668px) {
        .hero__content {
          padding: var(--hero-content-padding-tablet);
          gap: var(--hero-content-gap-tablet);
        }

        :is(.hero--split-start, .hero--split-end) .hero__content {
          justify-content: var(--hero-split-valign-tablet, center);
          align-items: var(--hero-split-halign-tablet, start);
        }
      }
      @media (min-width: 1025px) {
        .hero__content {
          padding: var(--hero-content-padding-desktop);
          gap: var(--hero-content-gap-desktop);
        }

        :is(.hero--split-start, .hero--split-end) .hero__content {
          justify-content: var(--hero-split-valign-desktop, center);
          align-items: var(--hero-split-halign-desktop, start);
        }
      }
      @media (min-width: 1200px) {
        .hero__content {
          padding: var(--hero-content-padding-wide);
          gap: var(--hero-content-gap-wide);
        }

        :is(.hero--split-start, .hero--split-end) .hero__content {
          justify-content: var(--hero-split-valign-wide, center);
          align-items: var(--hero-split-halign-wide, start);
        }
      }
    }
  }
</style>
