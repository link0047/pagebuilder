<script lang="ts">
  import Button from "$lib/components/Button.svelte";
	import Icon from "$lib/components/Icon.svelte";
	import Popover from "$lib/components/Popover.svelte";
  import PageStructure from "$lib/components/PageStructure.svelte";
  import { getAppState } from "$lib/components/app-state.svelte";
  import { createBuild } from "$lib/api/builds.remote";
  import AppSidebarHeader from "$lib/components/AppSidebarHeader.svelte";
  import ScrollableArea from "$lib/components/ScrollableArea.svelte";
  import EmptyState from "$lib/components/EmptyState.svelte";

  const appState = getAppState();

  let addSectionButtonRef = $state<HTMLButtonElement>();
  let isPopoverOpen = $state(false);

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

<AppSidebarHeader title="Page Structure"></AppSidebarHeader>
<ScrollableArea>
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
  {#if appState.pageTree.children.length === 0}
    <EmptyState title="No sections yet" description={`Click "Add Section" to get started`}>
      {#snippet icon()}
        <path d="M3 21H11V13H3M5 15H9V19H5M3 11H11V3H3M5 5H9V9H5M13 3V11H21V3M19 9H15V5H19M18 16H21V18H18V21H16V18H13V16H16V13H18Z" />
      {/snippet}
    </EmptyState>
  {/if}
</ScrollableArea>
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