<script lang="ts">
  import { type Snippet } from "svelte";
  import BlockSection, {
    type Alignment,
    type HeadingLevel,
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
    maxColumns?: number;
    containerGap?: string;
    [key: string]: unknown;
  };

  let {
    children,
    title = "Featured Categories",
    titleAlignment = "center",
    titleSize = "md",
    titleColor,
    titleWeight,
    headingLevel = 2,
    maxColumns = 6,
    containerGap,
    ...restProps
  }: Props = $props();

  const inlineStyle = $derived([
    "container-type: inline-size",
  ].join("; "));
</script>

<BlockSection
  {title}
  {titleAlignment}
  {titleSize}
  {titleColor}
  {titleWeight}
  {headingLevel}
  style={inlineStyle}
  {...restProps}
>
  <nav
    class="featured-categories__container"
    aria-label="Browse main product categories"
    style:--featured-categories-container-gap={containerGap}
    style:--featured-categories-max-columns={maxColumns}
  >
    {@render children?.()}
  </nav>
</BlockSection>

<style>
  .featured-categories__container {
    --featured-categories-container-gap: 0.5rem;
    --featured-categories-max-columns: 6;

    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--featured-categories-container-gap);
  }

  @container (min-width: 768px) {
    .featured-categories__container {
      --featured-categories-container-gap: 1rem;
      grid-template-columns: repeat(var(--featured-categories-max-columns), 1fr);
    }
  }

  @supports not (container-type: inline-size) {
    @media (min-width: 768px) {
      .featured-categories__container {
        --featured-categories-container-gap: 1rem;
        grid-template-columns: repeat(var(--featured-categories-max-columns), 1fr);
      }
    }
  }
</style>
