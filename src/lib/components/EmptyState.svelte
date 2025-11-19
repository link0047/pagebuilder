<script lang="ts">
  import { type Snippet } from "svelte";
  import Icon from "./Icon.svelte";

  type Props = {
    icon?: Snippet;
    title: string;
    description: string;
  }

  let {
    icon,
    title,
    description
  }: Props = $props();
</script>

<div class="empty-state">
  {#if icon}
    <Icon size="4rem">
      {@render icon()}
    </Icon>
  {/if}
  <h2 class="empty-state__title">{title}</h2>
  <p class="empty-state__description">{description}</p>
</div>

<style>
  .empty-state {
    display: flex;
    flex-flow: column wrap;
    gap: .5rem;
    text-align: center;
    align-items: center;
  }

  .empty-state__title {
    font-size: 1rem;
    font-weight: 600;
    color: #1a1a1a;
    margin: 0;
  }

  .empty-state__description {
    font-size: .875rem;
    color: #666;
    line-height: 1;
    margin: 0;
    text-wrap: balance;
  }
</style>