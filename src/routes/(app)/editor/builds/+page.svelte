<script lang="ts">
  import {
    getBuilds,
    getUserBuilds,
    type BuildListItem
  } from "$lib/api/builds.remote";
  import { duplicateBuildAction, deleteBuildAction } from "$lib/api/builds.actions";
  import { BuildsPage } from "$lib/utils/builds-page.svelte";
  import { openBuild } from "$lib/utils/openBuild";
  import { copyToClipboard } from "$lib/utils/clipboard";
  import { storage } from "$lib/utils/storage";
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
  import SegmentedControl from "$lib/components/SegmentedControl.svelte";
  import SegmentedButton from "$lib/components/SegmentedButton.svelte";
  import { getAppState } from "$lib/components/app-state.svelte";

  const BUILDS_TABS = {
    ALL: "all",
    MY_BUILDS: "my-builds"
  } as const;

  const VIEW_KEY = "builds:view";
  type ViewMode = "grid" | "list";
  type BuildsTab = typeof BUILDS_TABS[keyof typeof BUILDS_TABS];

  let newBuildButtonRef = $state<HTMLButtonElement>();
  let isNewBuildOpen = $state(false);
  let allBuildMoreButtonRefs = $state<Record<string, HTMLButtonElement>>({});
  let myBuildMoreButtonRefs = $state<Record<string, HTMLButtonElement>>({});
  let activeBuildsTab = $state<BuildsTab>(BUILDS_TABS.ALL);
  let editingBuildId = $state<string | null>(null);
  let viewMode = $state<ViewMode>((storage.getItem(VIEW_KEY) as ViewMode) ?? "grid");
  let showSkeleton = $state(false);
  let skeletonTimer: ReturnType<typeof setTimeout>;

  const appState = getAppState();

  const allBuilds = new BuildsPage((args) => getBuilds(args));
  const myBuilds = new BuildsPage((args) => getUserBuilds(args));

  let currentPage = $derived(activeBuildsTab === BUILDS_TABS.MY_BUILDS ? myBuilds : allBuilds);

  function setViewMode(mode: ViewMode) {
    viewMode = mode;
    storage.setItem(VIEW_KEY, mode);
  }

  async function editBuild(build: BuildListItem) {
    editingBuildId = build.id;
    await openBuild(appState, build);
    editingBuildId = null;
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

  onMount(() => {
    allBuilds.loadFirst();
    myBuilds.loadFirst();
  });

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
    <div
      class="builds-container"
      class:builds-container--grid={viewMode === "grid"}
      class:builds-container--list={viewMode === "list"}
    >
      {#each page.items as build (build.id)}
        <BuildCard {build} {viewMode} onclick={viewMode === "grid" ? () => editBuild(build) : undefined}>
          {#snippet actions()}
            {#if build.locked_by && build.locked_by !== appState.user?.id}
              <Badge color="warning">
                {#snippet icon()}
                  <Icon size="16">
                    <use href="#lock-alert-outline" />
                  </Icon>
                {/snippet}
                Editing by {build.locked_by_name ?? "another user"}
              </Badge>
            {:else if appState.currentBuildId === build.id}
              <Badge color="info">
                {#snippet icon()}
                  <Icon size="16">
                    <use href="#pencil-outline" />
                  </Icon>
                {/snippet}
                Editing
              </Badge>
            {:else}
              <Button
                color="secondary"
                variant="outlined"
                size="sm"
                onclick={() => editBuild(build)}
                loading={editingBuildId === build.id}
                disabled={editingBuildId !== null}
              >
                <Icon size="16">
                  <use href="#edit" />
                </Icon>
                Edit
              </Button>
            {/if}
            <Button variant="ghost" size="sm" shape="circle" bind:ref={moreButtonRefs[build.id]}>
              <Icon size="16">
                <use href="#dots-vertical" />
              </Icon>
            </Button>
            <Menu anchor={moreButtonRefs[build.id]}>
              <MenuItem onclick={() => handleShareBuild(build)}>
                {#snippet leading()}
                  <Icon size="16">
                    <use href="#share" />
                  </Icon>
                {/snippet}
                Share
              </MenuItem>
              <MenuItem
                onclick={() => handleDuplicatingBuild(build)}
                disabled={appState.currentBuildId === build.id}
              >
                {#snippet leading()}
                  <Icon size="16">
                    <use href="#duplicate" />
                  </Icon>
                {/snippet}
                Duplicate
              </MenuItem>
              <MenuItem
                onclick={() => handleDeletingBuild(build)}
                disabled={appState.currentBuildId === build.id || (!!build.locked_by && build.locked_by !== appState.user?.id)}
              >
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
    <SegmentedControl
      value={viewMode}
      onchange={(v) => setViewMode(v as ViewMode)}
      label="View mode"
      size="sm"
    >
      <SegmentedButton value="grid" aria-label="Grid view">
        <Icon size="16">
          <path d="M3 11H11V3H3M5 5H9V9H5M13 21H21V13H13M15 15H19V19H15M3 21H11V13H3M5 15H9V19H5M13 3V11H21V3M19 9H15V5H19Z" />
        </Icon>
      </SegmentedButton>
      <SegmentedButton value="list" aria-label="List view">
        <Icon size="16">
          <path d="M11 15H17V17H11V15M9 7H7V9H9V7M11 13H17V11H11V13M11 9H17V7H11V9M9 11H7V13H9V11M21 5V19C21 20.1 20.1 21 19 21H5C3.9 21 3 20.1 3 19V5C3 3.9 3.9 3 5 3H19C20.1 3 21 3.9 21 5M19 5H5V19H19V5M9 15H7V17H9V15Z" />
        </Icon>
      </SegmentedButton>
    </SegmentedControl>
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

  .builds-container--grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.5rem;
  }

  .builds-container--list {
    grid-template-columns: 1fr;
    gap: 0.5rem;
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
