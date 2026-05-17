<script lang="ts">
  import BlockSection, {
    type Alignment,
    type HeadingLevel,
    type TitleSize,
  } from "./BlockSection.svelte";
  import { generateId } from "$lib/utils/unique-id-generator";

  type Props = {
    title?: string;
    titleAlignment?: Alignment;
    titleSize?: TitleSize;
    titleColor?: string;
    titleWeight?: string;
    headingLevel?: HeadingLevel;
    backgroundColor?: string;
    blockId?: string;
  };

  let uid = generateId("recblock");

  let {
    title,
    titleAlignment = "center",
    titleSize = "md",
    titleColor,
    titleWeight,
    headingLevel = 2,
    backgroundColor,
    blockId = `spn-ui-recblock-${uid}`,
  }: Props = $props();

  const items = Array(6).fill(null);

  const inlineStyle = $derived(
    [`padding-inline: 1rem`].join("; ")
  );
</script>

<BlockSection
  {title}
  {titleAlignment}
  {titleSize}
  {titleColor}
  {titleWeight}
  {headingLevel}
  {backgroundColor}
  data-component="RecommendationBlock"
  data-block-id={blockId}
  style={inlineStyle}
>
  <div class="rec-block__grid">
    {#each items as _}
      <div class="rec-block__card">
        <div class="rec-block__image"></div>
        <div class="rec-block__line rec-block__line--short"></div>
        <div class="rec-block__line rec-block__line--long"></div>
        <div class="rec-block__line rec-block__line--medium"></div>
        <div class="rec-block__footer">
          <div class="rec-block__line rec-block__line--price"></div>
          <div class="rec-block__pill"></div>
        </div>
      </div>
    {/each}
  </div>
</BlockSection>

<style>
  .rec-block__grid {
    --rec-block-columns: 2;
    --rec-block-peek: 0.5;
    --rec-block-gap: 0.75rem;

    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: calc(
      (100% - (var(--rec-block-columns) + var(--rec-block-peek) - 1) * var(--rec-block-gap))
      / (var(--rec-block-columns) + var(--rec-block-peek))
    );
    gap: var(--rec-block-gap);
    overflow-x: hidden;
    overflow-y: hidden;
  }

  .rec-block__card {
    background: #f5f5f5;
    border-radius: 0.75rem;
    padding: 0.75rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .rec-block__image {
    width: 100%;
    aspect-ratio: 1;
    background: #e8e8e8;
    border-radius: 0.5rem;
  }

  .rec-block__line {
    height: 0.625rem;
    background: #e8e8e8;
    border-radius: 0.25rem;
  }

  .rec-block__line--short  { width: 50%; }
  .rec-block__line--medium { width: 65%; }
  .rec-block__line--long   { width: 85%; }
  .rec-block__line--price  { width: 35%; height: 0.875rem; }

  .rec-block__pill {
    height: 1.5rem;
    width: 30%;
    background: #e8e8e8;
    border-radius: 99rem;
  }

  .rec-block__footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  @media (min-width: 668px) {
    .rec-block__grid {
      --rec-block-columns: 4;
      --rec-block-peek: 0;
    }
  }

  @media (min-width: 1025px) {
    .rec-block__grid {
      --rec-block-columns: 6;
      --rec-block-peek: 0;
    }
  }
</style>
