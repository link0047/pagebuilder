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
  import { getBuilds } from "$lib/api/builds.remote";

	let addSectionButtonRef = $state<HTMLButtonElement>();
  let isPopoverOpen = $state(false);

  const appState = getAppState();

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
</script>

<AppSidebar title="Home Page">
  {#each await getBuilds() as build}
    {build}
  {/each}
  <PageStructure bind:pageTree={appState.pageTree} />
  <Button color="primary" variant="ghost" bind:ref={addSectionButtonRef}>
    <Icon>
      <path d="M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M13,7H11V11H7V13H11V17H13V13H17V11H13V7Z" />
    </Icon>
    Add Section
  </Button>
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
  <PropertiesPanel title={appState.selectedComponent?.meta.label} />
</AppSidebar>
<PreviewPane maxWidth="{appState.previewWidth}px">
  <Preview bind:pageTree={appState.pageTree} />
</PreviewPane>