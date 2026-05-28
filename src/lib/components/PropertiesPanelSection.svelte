<script lang="ts">
  import type { Snippet } from "svelte";

  import Icon from "./Icon.svelte";
  import Collapse from "./Collapse.svelte";

  type Props = {
    children?: Snippet;
    label: string;
    icon?: string;
    collapsed?: boolean;
  };

  let {
    children,
    label,
    icon,
    collapsed = false,
  }: Props = $props();
</script>

<Collapse open={!collapsed}>
  {#snippet title()}
    <span class="wcag-ui-properties-section-container">
      {#if icon}
        <Icon size="1rem">
          <use href="#{icon}" />
        </Icon>
      {/if}
      <span class="wcag-ui-properties-section__label">{label}</span>
    </span>
  {/snippet}
  <div class="wcag-ui-properties-section__content">
    {@render children?.()}
  </div>
</Collapse>

<style>
  .wcag-ui-properties-section-container {
    display: flex;
    align-items: center;
    gap: 1ch;
  }

  .wcag-ui-properties-section__label {
    font-size: 1rem;
    font-weight: 500;
    line-height: 1.1;
    color: #303030;
    user-select: none;
  }

  .wcag-ui-properties-section__content {
    --wcag-ui-textfield-label-color: #4d4d4d;

    display: flex;
    gap: 1rem;
    flex-flow: column nowrap;
    padding-block: 0.5rem;
  }
</style>
