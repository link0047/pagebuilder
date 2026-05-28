<script lang="ts">
  import { type Snippet } from "svelte";

  type Props = {
    leading?: Snippet;
    trailing?: Snippet;
    children?: Snippet;
    [key: string]: unknown;
  };

  let {
    leading,
    trailing,
    children,
    ...restProps
  }: Props = $props();
</script>

<li
  class="wcag-ui-list__item"
  {...restProps}
>
  {#if leading}
    <div class="wcag-ui-list__leading">
      {@render leading()}
    </div>
  {/if}
  <div class="wcag-ui-list__content">
    {@render children?.()}
  </div>
  {#if trailing}
    <div class="wcag-ui-list__trailing">
      {@render trailing()}
    </div>
  {/if}
</li>

<style>
  .wcag-ui-list__item {
    min-height: 2.5rem;
    display: grid;
    grid-template-columns: auto 1fr auto;
    grid-template-areas: "leading content trailing";
    align-items: center;
    justify-content: start;
    padding-inline: 0.5rem;
    row-gap: 0.5rem;
  }

  .wcag-ui-list__leading {
    grid-area: leading;
  }

  .wcag-ui-list__content {
    grid-area: content;
  }

  .wcag-ui-list__trailing {
    grid-area: trailing;
  }
</style>
