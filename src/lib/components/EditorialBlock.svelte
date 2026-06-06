<script lang="ts">
  import type { Snippet } from "svelte";
  import BlockSection, {
    type BlockImage,
    type Alignment,
    type HeadingLevel,
    type ImagePlacement,
    type TitleSize,
  } from "./BlockSection.svelte";

  type Props = {
    children?: Snippet;
    title?: string;
    titleAlignment?: Alignment;
    titleSize?: TitleSize;
    titleColor?: string;
    titleWeight?: string;
    headingLevel?: HeadingLevel;
    backgroundColor?: string;
    image?: BlockImage;
    imagePlacement?: ImagePlacement;
    [key: string]: unknown;
  };

  let {
    children,
    title,
    titleAlignment = "left",
    titleSize = "md",
    titleColor,
    titleWeight,
    headingLevel = 2,
    backgroundColor,
    image,
    imagePlacement = "below",
    ...restProps
  }: Props = $props();
</script>

<BlockSection
  {title}
  {titleAlignment}
  {titleSize}
  {titleColor}
  {titleWeight}
  {headingLevel}
  backgroundColor={backgroundColor ?? undefined}
  {image}
  {imagePlacement}
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
</style>
