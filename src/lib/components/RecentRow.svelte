<script lang="ts">
  import type { BuildListItem } from "$lib/api/builds.remote";
  import Icon from "$lib/components/Icon.svelte";

  type Props = {
    build: BuildListItem;
    selected?: boolean;
  };

  let { build, selected = false }: Props = $props();

  const dateLabel = $derived(
    new Date(build.updated_at).toLocaleDateString(undefined, { month: "short", day: "numeric" })
  );
</script>

<div class="recent-row" class:recent-row--selected={selected}>
  <span class="recent-row__icon" aria-hidden="true">
    <Icon size="24"><use href="#file-document-outline" /></Icon>
  </span>
  <span class="recent-row__main">
    <span class="recent-row__name">{build.name}</span>
    <span class="recent-row__subtitle">{build.author}</span>
  </span>
  <span class="recent-row__date">{dateLabel}</span>
</div>

<style>
  .recent-row {
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    gap: 0.75rem;
    width: 100%;
    padding: 0.625rem 0.75rem;
    border-radius: 0.375rem;
    background: var(--row-bg, transparent);
    outline: 2px solid transparent;
    outline-offset: -2px;
  }

  .recent-row:hover {
    background: color-mix(in srgb, var(--row-bg, transparent) 92%, black);
  }

  :global(.build-picker__option:focus) .recent-row {
    outline-color: #2563eb;
  }

  .recent-row--selected {
    --row-bg: #e8f0fe;
  }

  .recent-row__icon {
    display: flex;
    color: #2b579a;
  }

  .recent-row__main {
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
    min-width: 0;
  }

  .recent-row__name {
    font-size: 0.9375rem;
    color: #1a1a1a;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .recent-row__subtitle {
    font-size: 0.8125rem;
    color: #6b6b6b;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .recent-row__date {
    font-size: 0.8125rem;
    color: #6b6b6b;
    white-space: nowrap;
  }
</style>
