<script lang="ts">
  import { type Snippet } from "svelte";
  import { generateId }	from "$lib/utils/unique-id-generator.js";

  type Props = {
    children?: Snippet,
    title: string
  }

  const id = generateId("properties-section");
  const uid = `uikit-properties-section-title-${id}`;

  let {
    children,
    title
  }: Props = $props();
</script>

<div class="uikit-properties-section" role="group" aria-labelledby={uid}>
  <span id={uid} class="uikit-properties-section__title">{title}</span>
  <div class="uikit-properties-section__content">
    {@render children?.()}
  </div>
</div>

<style>
  .uikit-properties-section {
    display: flex;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
    gap: .5rem;
    flex-flow: column nowrap;
  }

  .uikit-properties-section__title {
    font-size: 1rem;
    font-weight: 500;
    line-height: 1.1;
    color: #303030;
    user-select: none;
  }

  .uikit-properties-section__content {
    display: flex;
    gap: .5rem;
    flex-flow: column nowrap;
    padding-inline-start: .5rem;
    --uikit-textfield-label-color: #4d4d4d;
  }
</style>