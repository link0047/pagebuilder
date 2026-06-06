<script lang="ts">
  import {
    getBuilds,
    getUserBuilds,
    type BuildListItem
  } from "$lib/api/builds.remote";
  import { duplicateBuildAction, deleteBuildAction } from "$lib/api/builds.actions";
  import { BuildsPage } from "$lib/utils/builds-page.svelte";
  import { openBuild } from "$lib/utils/openBuild";
  import { onMount } from "svelte";
  import AppSidebarHeader from "$lib/components/AppSidebarHeader.svelte";
  import EmptyState from "$lib/components/EmptyState.svelte";
  import Button from "$lib/components/Button.svelte";
  import Icon from "$lib/components/Icon.svelte";
  import Tabs from "$lib/components/Tabs.svelte";
  import TabList from "$lib/components/TabList.svelte";
  import Tab from "$lib/components/Tab.svelte";
  import TabPanel from "$lib/components/TabPanel.svelte";
  import BuildCard from "$lib/components/BuildCard.svelte";
  import BuildCardSkeleton from "$lib/components/BuildCardSkeleton.svelte";
  import ScrollableArea from "$lib/components/ScrollableArea.svelte";
  import Menu from "$lib/components/Menu.svelte";
  import MenuItem from "$lib/components/MenuItem.svelte";
  import Badge from "$lib/components/Badge.svelte";
  import NewBuildDialog from "$lib/components/NewBuildDialog.svelte";
  import { getAppState } from "$lib/components/app-state.svelte";
  import { copyToClipboard } from "$lib/utils/clipboard";

  const BUILDS_TABS = {
    ALL: "all",
    MY_BUILDS: "my-builds"
  } as const;

  type BuildsTab = typeof BUILDS_TABS[keyof typeof BUILDS_TABS];

  let newBuildButtonRef = $state<HTMLButtonElement>();
  let isNewBuildOpen = $state(false);
  let allBuildMoreButtonRefs = $state<Record<string, HTMLButtonElement>>({});
  let myBuildMoreButtonRefs = $state<Record<string, HTMLButtonElement>>({});
  let activeBuildsTab = $state<BuildsTab>(BUILDS_TABS.ALL);
  let showSkeleton = $state(false);
  let skeletonTimer: ReturnType<typeof setTimeout>;

  const appState = getAppState();

  const allBuilds = new BuildsPage((args) => getBuilds(args));
  const myBuilds = new BuildsPage((args) => getUserBuilds(args));

  onMount(() => {
    allBuilds.loadFirst();
    myBuilds.loadFirst();
  });

  let currentPage = $derived(activeBuildsTab === BUILDS_TABS.MY_BUILDS ? myBuilds : allBuilds);

  async function editBuild(build: BuildListItem) {
    await openBuild(appState, build);
    // On failure openBuild shows the message and returns { ok: false };
    // either way nothing else to do here — success navigates away, failure stays on the list.
  }

  async function handleShareBuild(build: BuildListItem) {
    await copyToClipboard(`${window.location.origin}/preview/${build.id}`);
    appState.setStatusMessage("Link copied to clipboard");
  }

  async function handleDuplicatingBuild(build: BuildListItem) {
    await duplicateBuildAction(build.id, []);
    await allBuilds.reset();
    await myBuilds.reset();
  }

  async function handleDeletingBuild(build: BuildListItem) {
    await deleteBuildAction(build.id, []);
    allBuilds.remove(build.id);
    myBuilds.remove(build.id);
    delete allBuildMoreButtonRefs[build.id];
    delete myBuildMoreButtonRefs[build.id];
  }

  $effect(() => {
    const ids = new Set(allBuilds.items.map((b) => b.id));
    Object.keys(allBuildMoreButtonRefs).forEach((id) => {
      if (!ids.has(id)) delete allBuildMoreButtonRefs[id];
    });
  });

  $effect(() => {
    const ids = new Set(myBuilds.items.map((b) => b.id));
    Object.keys(myBuildMoreButtonRefs).forEach((id) => {
      if (!ids.has(id)) delete myBuildMoreButtonRefs[id];
    });
  });

  $effect(() => {
    if (currentPage.loading) {
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
  <title>Builds - Page Builder</title>
</svelte:head>

{#snippet BuildsList(page: BuildsPage, emptyDescription: string, moreButtonRefs: Record<string, HTMLButtonElement>)}
  {#if page.loading}
    {#if showSkeleton}
      <BuildCardSkeleton />
    {/if}
  {:else if page.error}
    <EmptyState title="Error" description="Failed to load builds" />
  {:else if page.items.length === 0}
    <EmptyState title="No Builds Yet" description={emptyDescription} />
  {:else}
    <div class="builds-container">
      {#each page.items as build (build.id)}
        <BuildCard {build}>
          {#snippet actions()}
            {#if build.locked_by && build.locked_by !== appState.user?.id}
              <Badge color="warning">
                {#snippet icon()}<Icon size="16"><use href="#lock-alert-outline" /></Icon>{/snippet}
                Editing by {build.locked_by_name ?? "another user"}
              </Badge>
            {:else if appState.currentBuildId === build.id}
              <Badge color="info">
                {#snippet icon()}<Icon size="16"><use href="#pencil-outline" /></Icon>{/snippet}
                Editing
              </Badge>
            {:else}
              <Button color="secondary" variant="outlined" size="sm" onclick={() => editBuild(build)}>
                <Icon size="16"><use href="#edit" /></Icon>
                Edit
              </Button>
            {/if}
            <Button variant="ghost" size="sm" shape="circle" bind:ref={moreButtonRefs[build.id]}>
              <Icon size="16"><use href="#dots-vertical" /></Icon>
            </Button>
            <Menu anchor={moreButtonRefs[build.id]}>
              <MenuItem onclick={() => handleShareBuild(build)}>
                {#snippet leading()}<Icon size="16"><use href="#share" /></Icon>{/snippet}
                Share
              </MenuItem>
              <MenuItem
                onclick={() => handleDuplicatingBuild(build)}
                disabled={appState.currentBuildId === build.id}
              >
                {#snippet leading()}<Icon size="16"><use href="#duplicate" /></Icon>{/snippet}
                Duplicate
              </MenuItem>
              <MenuItem
                onclick={() => handleDeletingBuild(build)}
                disabled={appState.currentBuildId === build.id || (!!build.locked_by && build.locked_by !== appState.user?.id)}
              >
                {#snippet leading()}<Icon size="16"><use href="#delete" /></Icon>{/snippet}
                Delete
              </MenuItem>
            </Menu>
          {/snippet}
        </BuildCard>
      {/each}
    </div>

    {#if !page.done}
      <div class="load-more">
        <Button variant="outlined" onclick={() => page.loadMore()} disabled={page.loadingMore}>
          {page.loadingMore ? "Loading…" : "Load more"}
        </Button>
      </div>
    {/if}
  {/if}
{/snippet}

<AppSidebarHeader title="Builds">
  {#snippet action()}
    <Button color="primary" bind:ref={newBuildButtonRef} onclick={() => (isNewBuildOpen = true)}>
      <Icon>
        <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
      </Icon>
      New
    </Button>
    <NewBuildDialog bind:open={isNewBuildOpen} disclosure={newBuildButtonRef} />
  {/snippet}
</AppSidebarHeader>

<ScrollableArea>
  <div class="builds-content">
    <Tabs variant="enclosed" size="sm" fullWidth bind:value={activeBuildsTab}>
      <TabList>
        <Tab value={BUILDS_TABS.ALL}>All Builds</Tab>
        <Tab value={BUILDS_TABS.MY_BUILDS}>My Builds</Tab>
      </TabList>
      <TabPanel>
        {@render BuildsList(allBuilds, `Click "+ New" above to create the first one.`, allBuildMoreButtonRefs)}
      </TabPanel>
      <TabPanel>
        {@render BuildsList(myBuilds, `Click "+ New" above to create your first build`, myBuildMoreButtonRefs)}
      </TabPanel>
    </Tabs>
  </div>
</ScrollableArea>

<style>
  .builds-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .builds-content {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 0.5rem;
  }

  .load-more {
    display: flex;
    justify-content: center;
    padding: 1rem 0;
  }
</style>
