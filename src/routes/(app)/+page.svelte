<script lang="ts">
	import AppSidebar from "$lib/components/AppSideBar.svelte";
	import PreviewPane from "$lib/components/PreviewPane.svelte";
	import PropertiesPanel from "$lib/components/PropertiesPanel.svelte";
	import Preview from "$lib/components/Preview.svelte";
	import Button from "$lib/components/Button.svelte";
	import Icon from "$lib/components/Icon.svelte";
	import Popover from "$lib/components/Popover.svelte";
  import PageStructure from "$lib/components/PageStructure.svelte";
  import { getAppState } from "$lib/components/app-state.svelte";
  import { getBuilds, getTemplates, createBuild } from "$lib/api/builds.remote";
  import Tabs from "$lib/components/Tabs.svelte";
  import TabList from "$lib/components/TabList.svelte";
  import Tab from "$lib/components/Tab.svelte";
  import TabPanel from "$lib/components/TabPanel.svelte";
  import EmptyState from "$lib/components/EmptyState.svelte";

  const appState = getAppState();
  const APP_TABS = {
    BUILDS: "builds",
    TEMPLATES: "templates",
    EDITOR: "editor"
  } as const;
    const BUILDS_TABS = {
    ALL: "all",
    MY_BUILDS: "my-builds"
  } as const;

  type BuildsTab = typeof BUILDS_TABS[keyof typeof BUILDS_TABS];
  type AppTab = typeof APP_TABS[keyof typeof APP_TABS];

  let addSectionButtonRef = $state<HTMLButtonElement>();
  let isPopoverOpen = $state(false);
  let activeAppTab = $state<AppTab>(APP_TABS.BUILDS);
  let activeBuildsTab = $state<BuildsTab>(BUILDS_TABS.ALL);

  function addHero() {
		isPopoverOpen = false;

    appState.addComponent({
      type: "component",
			name: "Hero",
      data: {
        content: "test"
      },
      props: {
        images: {
          desktop: "https://placehold.co/1200x460",
          tablet: "https://placehold.co/460x380",
          mobile: "https://placehold.co/460x380",
        },
        width: 1200,
        height: 460
      },
      meta: {}
    });
	}

  function addStoryBlock() {
    isPopoverOpen = false;

    appState.addComponent({
      type: "component",
			name: "StoryBlock",
      data: {},
      props: {
        titleAlignment: "center"
      },
      meta: {},
      children: [{
        type: "component",
        name: "StoryCard",
        data: {},
        props: {
          images: {
            desktop: "",
            tablet: "",
            mobile: "",
          }
        },
        meta: {
          label: "StoryCard",
          locked: false,
          hidden: false
        },
      }]
    });
  }

  function addFeaturedCategories() {
    isPopoverOpen = false;

    appState.addComponent({
      type: "component",
      name: "FeaturedCategories",
      data: {},
      props: {},
      meta: {},
      children: [{
        type: "component",
        name: "FeaturedCategory",
        data: {},
        props: {
          image: "",
          text: "",
          href: ""
        },
        meta: {
          label: "Featured Category",
          locked: false,
          hidden: false
        },
      }]
    });
  }

  function generateHomepageTimestamp() {
    const now = new Date();
    const dateOptions: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "numeric",
      year: "numeric"
    };
    const timeOptions: Intl.DateTimeFormatOptions = {
      hour: "numeric",
      minute: "2-digit",
      hour12: true
    };

    const formattedDate = now.toLocaleDateString("en-US", dateOptions);
    const formattedTime = now.toLocaleTimeString("en-US", timeOptions);

    return `Homepage - ${formattedDate} ${formattedTime}`;
  }

  async function saveBuild() {
    const content = $state.snapshot(appState.pageTree);
    const name = generateHomepageTimestamp();
    await createBuild({
      name,
      buildType: "homepage",
      content,
      thumbnailUrl: "https://placehold.co/400x400"
    });
  }
</script>

<AppSidebar>
  <Tabs variant="underline" fullWidth value={activeAppTab}>
    <TabList>
      <Tab value={APP_TABS.BUILDS}>Builds</Tab>
      <Tab value={APP_TABS.TEMPLATES}>Templates</Tab>
      <Tab value={APP_TABS.EDITOR}>Editor</Tab>
    </TabList>
    <TabPanel>
      <div class="panel-content">
        <Button color="primary" fullWidth>
          <Icon>
            <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
          </Icon>
          New Build
        </Button>
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
                    {build}
                  {/each}
                {/if}
              {/await}
            </TabPanel>
            <TabPanel>
              <EmptyState title="No Builds Yet" description={`Click "+ New Build" above or go to the Editor tab to create your first page`} />
            </TabPanel>
          </Tabs>
      </div>
    </TabPanel>
    <TabPanel>
      <div class="panel-content">
        {#await getTemplates()}
          {"loading"}
        {:then templates} 
          {#if templates.length === 0}
            <EmptyState title="No Templates Yet" description="Templates are reusable starting points for new builds" />
          {:else}
            {#each templates as build}
              {build}
            {/each}
          {/if}
        {/await}
      </div>
    </TabPanel>
    <TabPanel>
      <header class="panel-header">
        <h1 class="panel-header__title">
          Home Page
        </h1>
      </header>
      <div class="panel-content">
        <PageStructure bind:pageTree={appState.pageTree} />
        <Button color="primary" variant="ghost" bind:ref={addSectionButtonRef}>
          <Icon>
            <path d="M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M13,7H11V11H7V13H11V17H13V13H17V11H13V7Z" />
          </Icon>
          Add Section
        </Button>
        <Button onclick={saveBuild}>
          Save
        </Button>
      </div>
      {#if appState.pageTree.children.length === 0}
        <EmptyState title="No sections yet" description={`Click "Add Section" to get started`}>
          {#snippet icon()}
            <path d="M3 21H11V13H3M5 15H9V19H5M3 11H11V3H3M5 5H9V9H5M13 3V11H21V3M19 9H15V5H19M18 16H21V18H18V21H16V18H13V16H16V13H18Z" />
          {/snippet}
        </EmptyState>
      {/if}
      <Popover anchor={addSectionButtonRef} placement="right-start" bind:open={isPopoverOpen}>
        <div>
          <ul>
            <li>
              <button type="button" onclick={addHero}>
                Hero
              </button>
            </li>
            <li>
              <button type="button" onclick={addFeaturedCategories}>
                Featured Categories
              </button>
            </li>
            <li>
              <button type="button" onclick={addStoryBlock}>
                Story Block
              </button>
            </li>
            <li>Collection Block</li>
            <li>Recommendations Zone</li>
          </ul>
        </div>
      </Popover>
    </TabPanel>
  </Tabs>
  <PropertiesPanel title={appState.selectedComponent?.meta.label} />
</AppSidebar>
<PreviewPane maxWidth="{appState.previewWidth}px">
  <Preview bind:pageTree={appState.pageTree} />
</PreviewPane>

<style>
  .panel-content {
    display: grid;
    align-items: center;
    gap: 1rem;
    padding: .5rem;
  }

  .panel-header {
    height: 3rem;
    display: flex;
    align-items: center;
    padding-inline: 1rem;
    box-sizing: border-box;
    border-bottom: 1px solid #e0e0e0;
  }

  .panel-header__title {
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
    color: #1a1a1a;
    user-select: none;
  }
</style>