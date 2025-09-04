<script lang="ts">
  import { type Snippet } from "svelte";
  import { generateId }	from "$lib/utils/unique-id-generator.js";
  import Icon from "./Icon.svelte";

  type Props = {
    children?: Snippet,
    title: string,
    icon?: string
  };

  const id = generateId("properties-section");
  const uid = `uikit-properties-section-title-${id}`;

  let {
    children,
    title,
    icon
  }: Props = $props();
</script>

<div class="uikit-properties-section" role="group" aria-labelledby={uid}>
  <div class="uikit-properties-section__header">
    {#if icon}
      <Icon size="1rem">
        <use href="#{icon}"/>
      </Icon>
    {/if}
    <span id={uid} class="uikit-properties-section__title">{title}</span>
  </div>
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

  .uikit-properties-section__header {
    display: flex;
    align-items: center;
    gap: 1ch;
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