<script lang="ts">
  import { type Snippet } from "svelte";

  type Props =  {
    children?: Snippet;
    action?: Snippet;
    title: string;
  };

  let {
    children,
    action,
    title
  }: Props = $props();
</script>

<header class="app-sidebar-header">
  <div class="app-sidebar-header__top">
    <h2 class="app-sidebar-header__title">{title}</h2>
    {#if action}
      <div class="app-sidebar-header__action">
        {@render action()}
      </div>
    {/if}
  </div>
  {#if children}
    <div class="app-sidebar-header__content">
      {@render children()}
    </div>
  {/if}
</header>

<style>
  .app-sidebar-header {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    gap: 0;
    border-bottom: 1px solid #e0e0e0;
  }

  .app-sidebar-header__top {
    height: 3.5rem;
    display: grid;
    align-items: center;
    grid-template-columns: 1fr minmax(0, auto);
    padding-inline: .5rem;
  }

  .app-sidebar-header__title {
    font-size: 1.115rem;
    font-weight: 700;
    color: #1a1a1a;
  }

  .app-sidebar-header__content {
    padding-inline: .5rem;
    padding-block-end: 1rem;
  }
</style>