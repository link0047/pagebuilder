<script lang="ts">
  import { deleteBuild, duplicateBuild, getBuilds } from "$lib/api/builds.remote";
  import AppSidebarHeader from "$lib/components/AppSidebarHeader.svelte";
  import EmptyState from "$lib/components/EmptyState.svelte";
  import Button from "$lib/components/Button.svelte";
	import Icon from "$lib/components/Icon.svelte";
  import Tabs from "$lib/components/Tabs.svelte";
  import TabList from "$lib/components/TabList.svelte";
  import Tab from "$lib/components/Tab.svelte";
  import TabPanel from "$lib/components/TabPanel.svelte";
  import BuildCard from "$lib/components/BuildCard.svelte";
  import ScrollableArea from "$lib/components/ScrollableArea.svelte";
  import Menu from "$lib/components/Menu.svelte";
  import MenuItem from "$lib/components/MenuItem.svelte";
  import Dialog from "$lib/components/Dialog.svelte";
  import RecentCard from "$lib/components/RecentCard.svelte";
  import { getAppState } from "$lib/components/app-state.svelte";
  import { goto } from "$app/navigation";

  const BUILDS_TABS = {
    ALL: "all",
    MY_BUILDS: "my-builds"
  } as const;

  type BuildsTab = typeof BUILDS_TABS[keyof typeof BUILDS_TABS];

  type BuildData = {
    id: string;
    name: string;
    build_type: string;
    updated_at: string;
    content: any; // or RootNode if you import it
    thumbnail_url: string | null;
    author: string;
  };

  let isDialogOpen = $state(false);
  let newBuildButtonRef = $state<HTMLButtonElement>();
  let buildMoreButtonRef = $state<HTMLButtonElement>();
  let activeBuildsTab = $state<BuildsTab>(BUILDS_TABS.ALL);

  const appState = getAppState();
  const templates = ["Blank", "Spencer's Homepage", "Spirit Homepage"];

  let buildsPromise = $state(getBuilds());
  let recentBuilds = $derived.by(() => {
    return buildsPromise.then(builds => builds.slice(0, 5));
  });

  function editBuild(build: BuildData) {
    goto("/editor");
    appState.loadBuild(build?.content);
  }

  async function handleDeletingBuild(build: BuildData) {
    const { id } = build;
    
    // Optimistically update UI
    buildsPromise = buildsPromise.then(builds => 
      builds.filter(b => b.id !== id)
    );
    
    try {
      await deleteBuild({ id });
    } catch (error) {
      // On error, refetch to restore correct state
      buildsPromise = getBuilds();
      console.error('Failed to delete build:', error);
    }
  }

  async function handleDuplicatingBuild(build: BuildData) {
    const { id } = build;
    
    try {
      const duplicated = await duplicateBuild({ id });
      
      // Add the duplicated build to the list
      buildsPromise = buildsPromise.then(builds => 
        [duplicated, ...builds]
      );
    } catch (error) {
      console.error('Failed to duplicate build:', error);
    }
  }
</script>

<AppSidebarHeader title="Builds">
  {#snippet action()}
    <Button color="primary" bind:ref={newBuildButtonRef}>
      <Icon>
        <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
      </Icon>
      New
    </Button>
    <Dialog
      title="Create New Build" 
      disclosure={newBuildButtonRef}
      size="lg"
      bind:open={isDialogOpen}
    >
      <div class="builds-dialog-content">
        <section class="build-section build-section--templates" aria-labelledby="templates-heading">
          <h3 class="build-section__heading" id="templates-heading">Templates</h3>
          <div class="build-section__wrapper">
            {#each templates as template}
              <div class="build-card">
                <div class="build-card__screenshot"></div>
                <span class="build-card__label">{template}</span>
              </div>
            {/each}
          </div>
        </section>
        
        <section class="build-section build-section--recent" aria-labelledby="start-from-recent-heading">
          <h3 class="build-section__heading" id="start-from-recent-heading">Start From Recent</h3>
          <div class="build-section__wrapper">
            {#await recentBuilds}
              <p class="loading-text">Loading recent builds...</p>
            {:then builds}
              {#if builds.length === 0}
                <p class="empty-text">No recent builds yet</p>
              {:else}
                {#each builds as build}
                  <RecentCard data={build} />
                {/each}
              {/if}
            {:catch error}
              <p class="error-text">Failed to load recent builds</p>
            {/await}
          </div>
        </section>
      </div>
      {#snippet footer()}
        <div class="builds-dialog-actions">
          <Button variant="ghost" onclick={() => isDialogOpen = false}>
            Cancel
          </Button>
          <Button color="success">
            Create
          </Button>
        </div>
      {/snippet}
    </Dialog>
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
        {#await buildsPromise}
          {"loading"}
        {:then builds} 
          {#if builds.length === 0}
            <EmptyState title="No Builds Yet" description={`Click "+ New Build" above to create the first one.`} />
          {:else}
            <div class="builds-container">
              {#each builds as build (build.id)}
                <BuildCard {build}>
                  {#snippet actions()}
                    <Button color="secondary" variant="outlined" size="sm" onclick={() => editBuild(build)}>
                      <Icon size="16">
                        <use href={`#edit`} />
                      </Icon>
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm" shape="circle" bind:ref={buildMoreButtonRef}>
                      <Icon size="16">
                        <use href="#dots-vertical" />
                      </Icon>
                    </Button>
                    <Menu anchor={buildMoreButtonRef}>
                      <MenuItem onclick={() => handleDuplicatingBuild(build)}>
                        {#snippet leading()}
                          <Icon size="16">
                            <use href="#duplicate" />
                          </Icon>
                        {/snippet}
                        Duplicate
                      </MenuItem>
                      <MenuItem onclick={() => handleDeletingBuild(build)}>
                        {#snippet leading()}
                          <Icon size="16">
                            <use href="#delete" />
                          </Icon>
                        {/snippet}
                        Delete
                      </MenuItem>
                    </Menu>
                  {/snippet}
                </BuildCard>
              {/each}
            </div>
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
  .build-section {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	
	.build-section__heading {
		font-size: 1rem;
		margin: 0;
		line-height: 1;
		color: #4f4f4f;
	}
	
	.build-section__wrapper {
		display: flex;
		flex-direction: row;
		gap: 1rem;
	}

  .build-section--recent .build-section__wrapper {
    flex-direction: column;
    gap: .5rem;
  }
	
	.build-card {
		display: flex;
		flex-direction: column;
		gap: .25rem;
		align-items: center;
	}
	
	.build-card__screenshot {
		display: flex;
		width: 120px;
		aspect-ratio: 1 / 1.25;
		border: 2px solid #b0b0b0;
		border-radius: .5rem;
	}

	.build-card__label {
		text-align: center;
		font-size: .875rem;
		color: #454545;
	}

  .builds-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .builds-content {
    display: flex;
    flex-direction: column;
    gap: .5rem;
    padding: .5rem;
  }

  .builds-dialog-content {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .builds-dialog-actions {
    width: fit-content;
    margin-inline-start: auto;
  }
</style>