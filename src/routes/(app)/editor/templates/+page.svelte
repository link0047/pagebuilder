<script lang="ts">
  import { getTemplates } from "$lib/api/builds.remote";
  import AppSidebarHeader from "$lib/components/AppSidebarHeader.svelte";
  import EmptyState from "$lib/components/EmptyState.svelte";
  import ScrollableArea from "$lib/components/ScrollableArea.svelte";
  import BuildCardSkeleton from "$lib/components/BuildCardSkeleton.svelte";

  let showSkeleton = $state(false);
  let skeletonTimer: ReturnType<typeof setTimeout>;

  const templatesQuery = getTemplates();

  $effect(() => {
    if (templatesQuery.loading) {
      skeletonTimer = setTimeout(() => {
        showSkeleton = true;
      }, 250);
    } else {
      clearTimeout(skeletonTimer);
      showSkeleton = false;
    }

    return () => clearTimeout(skeletonTimer);
  });
</script>

<AppSidebarHeader title="Templates"></AppSidebarHeader>
<ScrollableArea>
  {#if templatesQuery.loading && showSkeleton}
    <BuildCardSkeleton />
  {:else if templatesQuery.current}
    {@const templates = templatesQuery.current}
    {#if templates.length === 0}
      <EmptyState title="No Templates Yet" description="Templates are reusable starting points for new builds" />
    {:else}
      {#each templates as template}
        {template}
      {/each}
    {/if}
  {:else if templatesQuery.error}
    <EmptyState title="Error" description="Failed to load templates" />
  {/if}
</ScrollableArea>
