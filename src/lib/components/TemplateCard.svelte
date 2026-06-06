<script lang="ts">
  import Image from "$lib/components/Image.svelte";

  type Props = {
    label: string;
    thumbnailSrc: string;
    selected?: boolean;
  };

  let { label, thumbnailSrc, selected = false }: Props = $props();
</script>

<div class="template-card" class:template-card--selected={selected}>
  <div class="template-card__image">
    <Image width={104} height={144} src={thumbnailSrc} alt="" />
  </div>
  <span class="template-card__label">{label}</span>
</div>

<style>
  .template-card {
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    justify-content: center;
    align-self: start;
    gap: 0.5rem;
  }

  .template-card__image {
    display: block;
    max-width: 104px;
    max-height: 144px;
    overflow: hidden;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.06), 0 8px 24px rgba(0, 0, 0, 0.08);
    border-radius: 0.75rem;
    outline: 2px solid transparent;
  }

  :global(.build-picker__option:focus) .template-card__image {
    outline-color: #007acc;
  }

  .template-card__label {
    font-size: 0.8125rem;
    color: #454545;
    text-wrap: pretty;
    padding: 0.25rem;
    border-radius: 0.25rem;
    line-height: 1;
  }

  :global(.build-picker__option:focus) .template-card__label {
    background: #007acc;
    color: #fff;
  }
</style>
