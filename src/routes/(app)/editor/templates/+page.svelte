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

<svelte:head>
  <title>Templates - Page Builder</title>
</svelte:head>

<AppSidebarHeader title="Templates"></AppSidebarHeader>
<ScrollableArea>
  {#if templatesQuery.loading}
    {#if showSkeleton}
      <BuildCardSkeleton />
    {/if}
  {:else if templatesQuery.error}
    <EmptyState title="Error" description="Failed to load templates" />
  {:else if templatesQuery.current && templatesQuery.current.length === 0}
    <EmptyState title="No Templates Yet" description="Templates are reusable starting points for new builds" />
  {:else if templatesQuery.current}
    {#each templatesQuery.current as template (template.id)}
      {template.name}
    {/each}
  {/if}
</ScrollableArea>
