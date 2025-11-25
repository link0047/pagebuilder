<script lang="ts">
  import { getTemplates } from "$lib/api/builds.remote";
  import AppSidebarHeader from "$lib/components/AppSidebarHeader.svelte";
  import EmptyState from "$lib/components/EmptyState.svelte";
  import ScrollableArea from "$lib/components/ScrollableArea.svelte";
</script>

<AppSidebarHeader title="Templates"></AppSidebarHeader>
<ScrollableArea>
  {#await getTemplates()}
    {"loading"}
  {:then templates} 
    {#if templates.length === 0}
      <EmptyState title="No Templates Yet" description="Templates are reusable starting points for new builds" />
    {:else}
      {#each templates as template}
        {template}
      {/each}
    {/if}
  {/await}
</ScrollableArea>