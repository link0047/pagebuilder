<script lang="ts">
  type Alignment = "left" | "center" | "right";
  type Props = {
    title?: string;
    titleAlignment?: Alignment;
    backgroundColor?: string;
  }

  let {
    title,
    titleAlignment = "center",
    backgroundColor,
  }: Props = $props();

  const items = Array(6).fill(null);
</script>

<section
  class="spn-ui-rec-block"
  style:--spn-ui-rec-block-bg={backgroundColor}
  style:--spn-ui-rec-block-title-alignment={titleAlignment}
>
  {#if title}
    <header class="spn-ui-rec-block__header">
      <h2 class="spn-ui-rec-block__title">{title}</h2>
    </header>
  {/if}
  <div class="spn-ui-rec-block__grid">
    {#each items as _}
      <div class="spn-ui-rec-block__card">
        <div class="spn-ui-rec-block__image"></div>
        <div class="spn-ui-rec-block__line spn-ui-rec-block__line--short"></div>
        <div class="spn-ui-rec-block__line spn-ui-rec-block__line--long"></div>
        <div class="spn-ui-rec-block__line spn-ui-rec-block__line--medium"></div>
        <div class="spn-ui-rec-block__footer">
          <div class="spn-ui-rec-block__line spn-ui-rec-block__line--price"></div>
          <div class="spn-ui-rec-block__pill"></div>
        </div>
      </div>
    {/each}
  </div>
</section>

<style>
  .spn-ui-rec-block {
    --spn-ui-rec-block-bg: transparent;
    --spn-ui-rec-block-title-alignment: center;
    --spn-ui-rec-block-columns: 2;
    --spn-ui-rec-block-peek: 0.5;
    --spn-ui-rec-block-gap: 0.75rem;

    display: flex;
    flex-flow: column;
    gap: 0;
    background-color: var(--spn-ui-rec-block-bg);
  }

  .spn-ui-rec-block__header {
    min-height: 3.5rem;
    display: flex;
    align-items: center;
  }

  .spn-ui-rec-block__title {
    flex: 1;
    margin: 0;
    line-height: 1.2;
    font-weight: 600;
    font-size: 1.5rem;
    color: #000;
    text-align: var(--spn-ui-rec-block-title-alignment);
  }

  .spn-ui-rec-block__grid {
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: calc(
      (100% - (var(--spn-ui-rec-block-columns) + var(--spn-ui-rec-block-peek) - 1) * var(--spn-ui-rec-block-gap))
      / (var(--spn-ui-rec-block-columns) + var(--spn-ui-rec-block-peek))
    );
    gap: var(--spn-ui-rec-block-gap);
    overflow-x: hidden;
    overflow-y: hidden;
  }

  .spn-ui-rec-block__card {
    background: #f5f5f5;
    border-radius: 0.75rem;
    padding: 0.75rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .spn-ui-rec-block__image {
    width: 100%;
    aspect-ratio: 1;
    background: #e8e8e8;
    border-radius: 0.5rem;
  }

  .spn-ui-rec-block__line {
    height: 0.625rem;
    background: #e8e8e8;
    border-radius: 0.25rem;
  }

  .spn-ui-rec-block__line--short  { width: 50%; }
  .spn-ui-rec-block__line--medium { width: 65%; }
  .spn-ui-rec-block__line--long   { width: 85%; }
  .spn-ui-rec-block__line--price  { width: 35%; height: 0.875rem; }

  .spn-ui-rec-block__pill {
    height: 1.5rem;
    width: 30%;
    background: #e8e8e8;
    border-radius: 99rem;
  }

  .spn-ui-rec-block__footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  @media (min-width: 668px) {
    .spn-ui-rec-block {
      --spn-ui-rec-block-columns: 4;
      --spn-ui-rec-block-peek: 0;
    }
  }
  @media (min-width: 1025px) {
    .spn-ui-rec-block {
      --spn-ui-rec-block-columns: 6;
      --spn-ui-rec-block-peek: 0;
    }
  }
</style>
