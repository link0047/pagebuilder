<script lang="ts">
  import type { Snippet } from "svelte";
  import { BREAKPOINTS } from "$lib/constants/breakpoints";
  import Image from "./Image.svelte";

  export type Alignment = "left" | "center" | "right";
  export type TitleSize = "sm" | "md" | "lg" | "xl" | "2xl" | string;
  export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
  export type ImagePlacement = "above" | "below";

  export type ImageSource = {
    src: string;
    src2x?: string;
  };

  export type BlockImage = {
    mobile: ImageSource;
    tablet?: ImageSource;
    desktop?: ImageSource;
  };

  export const TITLE_SIZES: Record<string, string> = {
    sm: "1.25rem",
    md: "1.5rem",
    lg: "1.75rem",
    xl: "2rem",
    "2xl": "2.5rem",
  };

  type Props = {
    children?: Snippet;
    header?: Snippet;
    title?: string;
    titleSize?: string;
    titleColor?: string;
    titleWeight?: string;
    titleAlignment?: Alignment;
    headingLevel?: HeadingLevel;
    backgroundColor?: string;
    image?: BlockImage;
    imagePlacement?: ImagePlacement;
    [key: string]: unknown;
  };

  let {
    children,
    header,
    title,
    titleSize,
    titleColor,
    titleWeight,
    titleAlignment = "center",
    headingLevel = 2,
    backgroundColor,
    image,
    imagePlacement = "above",
    ...restProps
  }: Props = $props();

  const headingId = crypto.randomUUID();
  const HeadingTag = $derived(`h${headingLevel}`);

  const resolvedImage = $derived.by(() => {
    if (!image) return null;
    const mobile = image.mobile;
    const tablet = image.tablet ?? mobile;
    const desktop = image.desktop ?? tablet;
    return { mobile, tablet, desktop };
  });

  function srcset(source: ImageSource): string {
    return source.src2x
      ? `${source.src} 1x, ${source.src2x} 2x`
      : source.src;
  }

  const resolvedTitleSize = $derived(TITLE_SIZES[titleSize as string] ?? titleSize);

  const hasHeading = $derived(!!title || !!header);
  const hasImage = $derived(!!resolvedImage);
  const hasHeader = $derived(hasHeading || hasImage);
</script>

{#snippet headerImage()}
  {#if resolvedImage}
    <picture class="spn-ui-block__image">
      <source
        media="(min-width: {BREAKPOINTS.desktop}px)"
        srcset={srcset(resolvedImage.desktop)}
      />
      <source
        media="(min-width: {BREAKPOINTS.tablet}px)"
        srcset={srcset(resolvedImage.tablet)}
      />
      <Image
        src={resolvedImage.mobile.src}
        srcset={srcset(resolvedImage.mobile)}
        alt=""
        width={1400}
        height={260}
      />
    </picture>
  {/if}
{/snippet}

{#snippet headerHeading()}
  {#if header}
    <div id={headingId} class="spn-ui-block__header-content">
      {@render header()}
    </div>
  {:else if title}
    <svelte:element
      this={HeadingTag}
      id={headingId}
      class="spn-ui-block__title"
    >
      {title}
    </svelte:element>
  {/if}
{/snippet}

<section
  class="spn-ui-block"
  aria-labelledby={hasHeading ? headingId : undefined}
  style:--spn-ui-block-bg={backgroundColor}
  style:--spn-ui-block-title-weight={titleWeight}
  style:--spn-ui-block-title-size={resolvedTitleSize}
  style:--spn-ui-block-title-color={titleColor}
  style:--spn-ui-block-title-align={titleAlignment}
  {...restProps}
>
  {#if hasHeader}
    <header class="spn-ui-block__header">
      {#if imagePlacement === "above"}
        {@render headerImage()}
        {@render headerHeading()}
      {:else}
        {@render headerHeading()}
        {@render headerImage()}
      {/if}
    </header>
  {/if}
  <div class="spn-ui-block__content">
    {@render children?.()}
  </div>
</section>

<style>
  @layer variables, base;

  @layer variables {
    .spn-ui-block {
      --spn-ui-block-bg: transparent;
      --spn-ui-block-title-align: center;
      --spn-ui-block-border-radius: 1rem;
      --spn-ui-block-padding-block-end: 1rem;
      --spn-ui-block-header-padding-inline: 1rem;
      --spn-ui-block-header-padding-block: 1rem;
      --spn-ui-block-title-size: 1.5rem;
      --spn-ui-block-title-weight: 600;
      --spn-ui-block-title-color: #212121;
      --spn-ui-block-title-line-height: 1.2;
    }
  }

  @layer base {
    .spn-ui-block {
      display: flex;
      flex-direction: column;
      border-radius: var(--spn-ui-block-border-radius);
      background-color: var(--spn-ui-block-bg);
      padding-block-end: var(--spn-ui-block-padding-block-end);
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    }

    .spn-ui-block:not(:has(.spn-ui-block__header)) {
      padding-block-start: var(--spn-ui-block-padding-block-end);
    }

    .spn-ui-block__header {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .spn-ui-block__image {
      display: block;
      width: 100%;
      overflow: hidden;
    }

    .spn-ui-block__title {
      margin: 0;
      width: 100%;
      line-height: var(--spn-ui-block-title-line-height);
      font-weight: var(--spn-ui-block-title-weight);
      font-size: var(--spn-ui-block-title-size);
      color: var(--spn-ui-block-title-color);
      text-align: var(--spn-ui-block-title-align);
      overflow-wrap: break-word;
      word-break: break-word;
      padding-inline: var(--spn-ui-block-header-padding-inline);
      padding-block: var(--spn-ui-block-header-padding-block);
    }

    .spn-ui-block__header-content {
      display: block;
    }

    .spn-ui-block__content {
      flex: 1;
    }
  }
</style>
