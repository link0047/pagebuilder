<script lang="ts">
  import { getBuilds } from "$lib/api/builds.remote";
  import AppSidebarHeader from "$lib/components/AppSidebarHeader.svelte";
  import EmptyState from "$lib/components/EmptyState.svelte";
  import Button from "$lib/components/Button.svelte";
	import Icon from "$lib/components/Icon.svelte";
  import Tabs from "$lib/components/Tabs.svelte";
  import TabList from "$lib/components/TabList.svelte";
  import Tab from "$lib/components/Tab.svelte";
  import TabPanel from "$lib/components/TabPanel.svelte";
  import ScrollableArea from "$lib/components/ScrollableArea.svelte";

  const BUILDS_TABS = {
    ALL: "all",
    MY_BUILDS: "my-builds"
  } as const;

  type BuildsTab = typeof BUILDS_TABS[keyof typeof BUILDS_TABS];

  let activeBuildsTab = $state<BuildsTab>(BUILDS_TABS.ALL);
</script>

<AppSidebarHeader title="Builds">
  {#snippet action()}
    <Button color="primary">
      <Icon>
        <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
      </Icon>
      New
    </Button>
  {/snippet}
</AppSidebarHeader>
<ScrollableArea>
  <div class="builds-content">
    <Tabs variant="enclosed" size="sm" fullWidth value={activeBuildsTab}>
      <TabList>
        <Tab value={BUILDS_TABS.ALL}>All Builds</Tab>
        <Tab value={BUILDS_TABS.MY_BUILDS}>My Builds</Tab>
      </TabList>
      <TabPanel>
        {#await getBuilds()}
          {"loading"}
        {:then builds} 
          {#if builds.length === 0}
            <EmptyState title="No Builds Yet" description={`Click "+ New Build" above to create the first one.`} />
          {:else}
            {#each builds as build}
              <div>
                {JSON.stringify(build)}
              </div>
            {/each}
          {/if}
        {/await}
      </TabPanel>
      <TabPanel>
        <EmptyState title="No Builds Yet" description={`Click "+ New Build" above or go to the Editor tab to create your first page`} />
      </TabPanel>
    </Tabs>
  </div>
</ScrollableArea>

<style>
  .builds-content {
    display: flex;
    flex-direction: column;
    gap: .5rem;
    padding: .5rem;
  }
</style>