<script lang="ts">
  import type { Snippet } from "svelte";
  import BlockSection, {
    type Alignment,
    type HeadingLevel,
    type ImagePlacement,
    type TitleSize,
    type LinkValue,
    type Heading,
    type LayoutSpacing,
    type HeroImage,
  } from "./BlockSection.svelte";

  type Props = {
    children?: Snippet;
    footer?: Snippet;
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
    [key: string]: unknown;
  };

  let {
    children,
    footer,
    headings,
    headingGap,
    titleAlignment = "left",
    headingLevel = 2,
    title,
    // No default here: the shim must be able to tell "unset" from "md", or a
    // heading whose size was never chosen would migrate as an explicit "md".
    titleSize,
    titleColor,
    titleWeight,
    titleLink,
    backgroundColor,
    layout,
    hero,
    imagePlacement = "below",
    ...restProps
  }: Props = $props();
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
  backgroundColor={backgroundColor ?? undefined}
  {layout}
  {hero}
  {imagePlacement}
  {footer}
  {...restProps}
>
  <div class="editorial-block__container">
    {@render children?.()}
  </div>
</BlockSection>

<style>
  .editorial-block__container {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    gap: 1rem;
    container-type: inline-size;
  }

  @media (max-width: 640px) {
    .editorial-block__container {
      gap: 0.5rem;
    }
  }
</style>
