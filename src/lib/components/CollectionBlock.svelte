<script lang="ts">
  import { type Snippet, onMount } from "svelte";
  import { BREAKPOINTS } from "$lib/constants/breakpoints";
  import BlockSection, {
    type Alignment,
    type TitleSize,
    type Heading,
    type LinkValue,
    type HeadingLevel,
    type HeroImage,
    type ImagePlacement,
    type LayoutSpacing,
  } from "./BlockSection.svelte";

  type Props = {
    headings?: Heading[];
    headingGap?: number | string;
    titleAlignment?: Alignment;
    headingLevel?: HeadingLevel;

    // --- shim: delete once every build and template is migrated ---
    /** @deprecated Use `headings`. */
    title?: string;
    /** @deprecated Use `headings[0].size`. */
    titleSize?: TitleSize;
    /** @deprecated Use `headings[0].color`. */
    titleColor?: string;
    /** @deprecated Use `headings[0].weight`. */
    titleWeight?: string;
    /** @deprecated Use `headings[0].link`. */
    titleLink?: LinkValue;
    // --- end shim ---

    backgroundColor?: string;
    layout?: LayoutSpacing;
    hero?: HeroImage;
    imagePlacement?: ImagePlacement;
    children?: Snippet;
    ctaBackgroundColor?: string;
    ctaTextColor?: string;
    breakpoints?: {
      mobile?: { slidesPerView: number; slidesPerGroup?: number };
      tablet?: { slidesPerView: number; slidesPerGroup?: number };
      desktop?: { slidesPerView: number; slidesPerGroup?: number };
    };
    equalHeight?: boolean;
    itemAspectRatio?: string;
    [key: string]: unknown;
  };

  let {
    headings,
    headingGap,
    titleAlignment = "center",
    headingLevel = 2,
    title,
    // No default: the shim must tell "unset" from "md", or an unset size would
    // migrate as an explicit token.
    titleSize,
    titleColor,
    titleWeight,
    titleLink,
    backgroundColor = "#f6f5f1",
    layout,
    hero,
    imagePlacement = "above",
    ctaBackgroundColor,
    ctaTextColor,
    breakpoints = {
      mobile: { slidesPerView: 2.5, slidesPerGroup: 2 },
      tablet: { slidesPerView: 4, slidesPerGroup: 4 },
      desktop: { slidesPerView: 5, slidesPerGroup: 5 },
    },
    equalHeight = false,
    itemAspectRatio,
    children,
    ...restProps
  }: Props = $props();

  const inlineStyle = $derived([
    ctaBackgroundColor && `--product-card-cta-bg-color: ${ctaBackgroundColor}`,
    ctaTextColor && `--product-card-cta-text-color: ${ctaTextColor}`,
  ].filter(Boolean).join("; "));

  const resolvedBreakpoints = $derived.by(() => {
    const bp = breakpoints ?? {};

    const mobile = bp.mobile ?? { slidesPerView: 2.5 };
    const tablet = bp.tablet ?? { slidesPerView: 4 };
    const desktop = bp.desktop ?? { slidesPerView: 5 };

    return {
      [BREAKPOINTS.mobile]: {
        slidesPerView: mobile.slidesPerView,
        slidesPerGroup: Math.floor(mobile.slidesPerGroup ?? mobile.slidesPerView),
      },
      [BREAKPOINTS.tablet]: {
        slidesPerView: tablet.slidesPerView,
        slidesPerGroup: Math.floor(tablet.slidesPerGroup ?? tablet.slidesPerView),
      },
      [BREAKPOINTS.desktop]: {
        slidesPerView: desktop.slidesPerView,
        slidesPerGroup: Math.floor(desktop.slidesPerGroup ?? desktop.slidesPerView),
      },
    };
  });

  onMount(async () => {
    await import("$lib/components/web-components/wcag-ui-carousel");
    await import("$lib/components/web-components/wcag-ui-carousel-item");
  });
</script>

<BlockSection
  {headings}
  {headingGap}
  {titleAlignment}
  {headingLevel}
  {title}
  {titleSize}
  {titleColor}
  {titleWeight}
  {titleLink}
  {backgroundColor}
  {layout}
  {hero}
  {imagePlacement}
  style={inlineStyle}
  {...restProps}
>
  <div
    class="collection-block__content"
    style:--wcag-ui-carousel-item-aspect-ratio={itemAspectRatio}
  >
    <wcag-ui-carousel
      breakpoints={JSON.stringify(resolvedBreakpoints)}
      equal-height={equalHeight ? "" : undefined}
    >
      {@render children?.()}
    </wcag-ui-carousel>
  </div>
</BlockSection>

<style>
  .collection-block__content {
    box-sizing: border-box;
    padding-inline: 0.25rem;
  }
</style>
