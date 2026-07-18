<script lang="ts">
  import Card from "./Card.svelte";
  import type { Snippet } from "svelte";

  type Props = {
    children?: Snippet;
    label?: string;
  };

  let { children, label }: Props = $props();
</script>

<Card
  --wcag-ui-card-padding-block=".75rem"
  --wcag-ui-card-padding-inline=".75rem"
>
  <div class="wcag-ui-labelled-card">
    {#if label}
      <span class="wcag-ui-labelled-card__label">{label}</span>
    {/if}
    <div class="wcag-ui-labelled-card__controls">
      {@render children?.()}
    </div>
  </div>
</Card>

<style>
  @layer variables, base;

  @layer variables {
    :root {
      --wcag-ui-labelled-card-label-color: #898781;
      --wcag-ui-labelled-card-label-size: 0.875rem;
      --wcag-ui-labelled-card-gap-inner: 0.5rem;
      --wcag-ui-labelled-card-gap-controls: 1rem;
      --wcag-ui-labelled-card-line-height: 1;
    }
  }

  @layer base {
    .wcag-ui-labelled-card,
    .wcag-ui-labelled-card__controls {
      display: flex;
      flex-flow: column;
      min-width: 0;
    }

    .wcag-ui-labelled-card {
      gap: var(--wcag-ui-labelled-card-gap-inner);
    }

    .wcag-ui-labelled-card__controls {
      gap: var(--wcag-ui-labelled-card-gap-controls);
    }

    .wcag-ui-labelled-card__label {
      line-height: var(--wcag-ui-labelled-card-line-height);
      color: var(--wcag-ui-labelled-card-label-color);
      font-size: var(--wcag-ui-labelled-card-label-size);
    }
  }
</style>
