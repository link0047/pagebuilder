<script lang="ts">
  import { type Snippet } from "svelte";
  import Card from "./Card.svelte";
  import Badge from "./Badge.svelte";
  import Separator from "./Separator.svelte";
  import { getRelativeTime } from "$lib/utils/relativeTime";

  type ViewMode = "grid" | "list";

  type BuildData = {
    name: string;
    build_type: string;
    author: string;
    updated_at: string;
    updated_by_name: string;
    thumbnail_url: string | null;
    locked_by_name: string | null;
  };

  type Props = {
    build: BuildData;
    viewMode?: ViewMode;
    actions?: Snippet;
    onclick?: () => void;
  };

  let { build, viewMode = "list", actions, onclick }: Props = $props();

  const isUpdatedByDifferentPerson = $derived(build.updated_by_name !== build.author);
</script>

<Card layout="media-top" shape="rounded" hoverable tag={onclick ? "button" : "div"} {onclick}>
  {#snippet media()}
    {#if build.thumbnail_url}
      <div
        class="build-thumbnail"
        class:build-thumbnail--grid={viewMode === "grid"}
      >
        <img
          src={build.thumbnail_url}
          alt="Preview of {build.name}"
          class="build-thumbnail__img"
        />
        {#if viewMode === "grid"}
          <span class="build-thumbnail__title">{build.name}</span>
        {/if}
      </div>
    {/if}
  {/snippet}

  {#if viewMode === "list"}
    <div class="build-content">
      <div class="build-content__header">
        <h3 class="build-content__name">{build.name}</h3>
        <Badge shape="pill" variant="outlined">{build.build_type}</Badge>
      </div>

      <div class="build-content__meta">
        <span class="build-content__meta-row">
          <span class="build-content__label">Created by</span>
          <span class="build-content__value">{build.author}</span>
        </span>
        <span class="build-content__meta-row">
          <span class="build-content__label">Updated</span>
          <span class="build-content__value">
            {getRelativeTime(build.updated_at)}{isUpdatedByDifferentPerson ? ` by ${build.updated_by_name.split(" ")[0]}` : ""}
          </span>
        </span>
      </div>

      {#if build.locked_by_name}
        <div class="build-content__locked">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
          </svg>
          Editing by {build.locked_by_name}
        </div>
      {/if}

      {#if actions}
        <Separator />
        <div class="build-content__actions">
          {@render actions()}
        </div>
      {/if}
    </div>
  {/if}
</Card>

<style>
  .build-thumbnail {
    position: relative;
    width: 100%;
    aspect-ratio: 16 / 9;
    overflow: hidden;
    background: #f0f0f0;
    border-bottom: 1px solid #eee;
    border-radius: var(--wcag-ui-card-border-radius) var(--wcag-ui-card-border-radius) 0 0;
  }

  .build-thumbnail--grid {
    aspect-ratio: 4 / 3;
    border-radius: var(--wcag-ui-card-border-radius);
  }

  .build-thumbnail__img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: top center;
    display: block;
  }

  .build-thumbnail__title {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 0.35rem 0.5rem;
    font-size: 0.75rem;
    font-weight: 600;
    color: #fff;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.65) 0%, transparent 100%);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-shadow: 0 1px 8px rgba(0, 0, 0, 0.8);
  }

  .build-content {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 0.5rem 0.5rem 0.25rem;
  }

  .build-content__header {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.35rem;
  }

  .build-content__name {
    font-size: 0.9375rem;
    font-weight: 600;
    margin: 0;
    line-height: 1.2;
    color: #111;
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .build-content__meta {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
  }

  .build-content__meta-row {
    display: flex;
    align-items: baseline;
    gap: 0.35ch;
    font-size: 0.8125rem;
    min-width: 0;
  }

  .build-content__label {
    color: #999;
    font-weight: 400;
    flex-shrink: 0;
  }

  .build-content__value {
    color: #444;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    min-width: 0;
  }

  .build-content__locked {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    font-size: 0.75rem;
    font-weight: 500;
    color: #92400e;
    background: #fef3c7;
    border: 1px solid #fcd34d;
    border-radius: 0.25rem;
    padding: 0.2rem 0.5rem;
    width: fit-content;
  }

  .build-content__actions {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 0.5rem;
    align-items: center;
    width: 100%;
  }
</style>
