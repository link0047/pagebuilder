<script lang="ts">
  import { type Snippet, onMount } from "svelte";
  import { BREAKPOINTS } from "$lib/constants/breakpoints";
  import BlockSection, {
    type BlockImage,
    type Alignment,
    type TitleSize,
    type HeadingLevel,
    type ImagePlacement,
  } from "./BlockSection.svelte";

  type Props = {
    title?: string;
    titleAlignment?: Alignment;
    titleSize?: TitleSize;
    titleColor?: string;
    titleWeight?: string;
    headingLevel?: HeadingLevel;
    backgroundColor?: string;
    image?: BlockImage;
    imagePlacement?: ImagePlacement;
    children?: Snippet;
    ctaBackgroundColor?: string;
    ctaTextColor?: string;
    breakpoints?: Record<string, { slidesPerView: number; slidesPerGroup?: number }>;
  };

  let {
    title,
    titleAlignment = "center",
    titleSize = "md",
    titleColor,
    titleWeight,
    headingLevel = 2,
    backgroundColor = "#f6f5f1",
    image,
    imagePlacement = "above",
    ctaBackgroundColor,
    ctaTextColor,
    breakpoints = {
      [BREAKPOINTS.mobile]: { slidesPerView: 2.5, slidesPerGroup: 2.5 },
      [BREAKPOINTS.tablet]: { slidesPerView: 4, slidesPerGroup: 4 },
      [BREAKPOINTS.desktop]: { slidesPerView: 5, slidesPerGroup: 5 }
    },
    children
  }: Props = $props();

  onMount(async () => {
    await import("$lib/components/web-components/wcag-ui-carousel");
    await import("$lib/components/web-components/wcag-ui-carousel-item");
  });

  const inlineStyle = $derived([
    ctaBackgroundColor && `--product-card-cta-bg-color: ${ctaBackgroundColor}`,
    ctaTextColor && `--product-card-cta-text-color: ${ctaTextColor}`,
  ].filter(Boolean).join("; "));
</script>

<BlockSection
  {title}
  {titleAlignment}
  {titleSize}
  {titleColor}
  {titleWeight}
  {headingLevel}
  {backgroundColor}
  {image}
  {imagePlacement}
  style={inlineStyle}
>
  <div class="collection-block__content">
    <wcag-ui-carousel breakpoints={JSON.stringify(breakpoints)}>
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
