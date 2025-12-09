<script lang="ts">
  import { page } from "$app/state";
  import AppHeader from "$lib/components/AppHeader.svelte";
  import NavigationRail from "$lib/components/NavigationRail.svelte";
  import NavigationRailItem from "$lib/components/NavigationRailItem.svelte";
  import Button from "$lib/components/Button.svelte";
  import Icon from "$lib/components/Icon.svelte";
  import Iconset from "$lib/components/Iconset.svelte";
  import SegmentedControl from "$lib/components/SegmentedControl.svelte";
  import SegmentedButton from "$lib/components/SegmentedButton.svelte";
  import Avatar from "$lib/components/Avatar.svelte";
  import Menu from "$lib/components/Menu.svelte";
  import MenuItem from "$lib/components/MenuItem.svelte";
  import { setAppState } from "$lib/components/app-state.svelte";
  import type { LayoutProps } from "./$types";
  import { copyToClipboard } from "$lib/utils/clipboard";
  import { attempt } from "$lib/utils/attempt";
  import { getInitials } from "$lib/utils/getInitials";
  import { signout, getUser } from "$lib/api/auth.remote";
  import { createBuild } from "$lib/api/builds.remote";

  let {
    children
  }: LayoutProps = $props();

  let avatarRef = $state<HTMLButtonElement>();
  let isCopied = $state(false);
  let isLoading = $state(false);

  const appState = setAppState();
  const copyButtonText = $derived(() => {
    if (isLoading) return "Copying...";
    if (isCopied) return "Copied!";
    return "Copy Code";
  });

  async function handleCopyHTML() {
    isLoading = true;
    
    try {
      const formData = new FormData();
      formData.append("props", JSON.stringify({ pageTree: appState?.pageTree }));

      const [fetchError, response] = await attempt(
        fetch("/api/generate-html", {
          method: "POST",
          body: formData
        })
      );

      if (fetchError) {
        console.error("Fetch error:", fetchError);
        return;
      }

      if (!response.ok) {
        console.error(`HTTP error! status: ${response.status}`);
        return;
      }

      const [parseError, res] = await attempt(response.json());
      
      if (parseError) {
        console.error("JSON parse error:", parseError);
        return;
      }

      if (!res.success || !res.html) {
        console.error("Invalid response:", res);
        return;
      }

      const [copyError, copySuccess] = await attempt(copyToClipboard(res.html));
      
      if (copyError || !copySuccess) {
        console.error("Failed to copy to clipboard:", copyError);
        return;
      }

      // Success!
      isCopied = true;
      console.log("HTML copied to clipboard");
      
      // Reset success state after 2 seconds
      setTimeout(() => {
        isCopied = false;
      }, 2000);
      
    } finally {
      isLoading = false;
    }
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

  const activeRoute = $derived.by(() => {
    const path = page.url.pathname;
    if (path.startsWith("/editor/builds")) return "builds";
    if (path.startsWith("/editor/templates")) return "templates";
    if (path.startsWith("/editor")) return "editor";
    return "editor";
  });

  const { name } = await getUser();

  const userInitials = getInitials(name);
  $inspect({ avatarRef });
</script>

{#snippet headerLeading()}
  <span class="app-title">Page Builder</span>
{/snippet}

{#snippet headerTrailing()}
  <SegmentedControl size="sm" bind:value={appState.previewMode}>
    <SegmentedButton value="desktop">
      <Icon size="1rem">
        <use href="#desktop" />
      </Icon>
    </SegmentedButton>
    <SegmentedButton value="tablet">
      <Icon size="1rem">
        <use href="#tablet" />
      </Icon>
    </SegmentedButton>
    <SegmentedButton value="mobile">
      <Icon size="1rem">
        <use href="#mobile" />
      </Icon>
    </SegmentedButton>
  </SegmentedControl>
  <Button 
    color="success"
    disabled={isLoading}
    onclick={handleCopyHTML}>
    <Icon size={16}>
      <use href="#content-copy" />
    </Icon>
    {copyButtonText()}
  </Button>
  <Button onclick={saveBuild} disabled={appState.pageTree.children.length === 0}>
    Save
  </Button>
{/snippet}

<Iconset>
  <symbol id="desktop">
    <path d="M20,17.9H4c-1.7,0-3-1.3-3-3V4.9c0-1.7,1.3-3,3-3h16c1.7,0,3,1.3,3,3v10c0,1.7-1.3,3-3,3ZM4,3.9c-.6,0-1,.4-1,1v10c0,.6.4,1,1,1h16c.6,0,1-.4,1-1V4.9c0-.6-.4-1-1-1H4ZM17,20.9c0-.6-.4-1-1-1h-8c-.6,0-1,.4-1,1s.4,1,1,1h8c.6,0,1-.4,1-1ZM11,17.9v3.2c0,.4.4.8,1,.8s1-.4,1-.8v-3.2"/>
  </symbol>
  <symbol id="tablet">
    <path d="M18,23H6c-1.7,0-3-1.3-3-3V4c0-1.7,1.3-3,3-3h12c1.7,0,3,1.3,3,3v16c0,1.7-1.3,3-3,3ZM6,3c-.6,0-1,.4-1,1v16c0,.6.4,1,1,1h12c.6,0,1-.4,1-1V4c0-.6-.4-1-1-1H6ZM13,18c0-.6-.4-1-1-1h0c-.6,0-1,.4-1,1s.5,1,1,1,1-.4,1-1Z"/>
  </symbol>
  <symbol id="mobile">
    <path d="M17,23H7c-1.7,0-3-1.3-3-3V4c0-1.7,1.3-3,3-3h10c1.7,0,3,1.3,3,3v16c0,1.7-1.3,3-3,3ZM7,3c-.6,0-1,.4-1,1v16c0,.6.4,1,1,1h10c.6,0,1-.4,1-1V4c0-.6-.4-1-1-1H7ZM13,18c0-.6-.4-1-1-1h0c-.6,0-1,.4-1,1s.5,1,1,1,1-.4,1-1Z"/>
  </symbol>
  <symbol id="image">
    <path d="M19 2H5C3.3 2 2 3.3 2 5v14c0 1.7 1.3 3 3 3h14c1.7 0 3-1.3 3-3V5c0-1.7-1.3-3-3-3ZM4 19V5c0-.6.4-1 1-1h14c.6 0 1 .4 1 1v7.6l-1.4-1.4c-1.2-1.2-3.1-1.2-4.2 0L5.6 20H5c-.6 0-1-.4-1-1Zm15 1H8.4l7.4-7.4c.4-.4 1-.4 1.4 0l2.8 2.8V19c0 .6-.4 1-1 1ZM9 12c1.7 0 3-1.3 3-3s-1.3-3-3-3-3 1.3-3 3 1.3 3 3 3Zm0-4c.6 0 1 .4 1 1s-.4 1-1 1-1-.4-1-1 .4-1 1-1Z"/>
  </symbol>
  <symbol id="video">
    <path d="M21.5 6.4c-.3 0-.5 0-.8.2L17 8.8V8c0-1.7-1.3-3-3-3H4C2.3 5 1 6.3 1 8v8c0 1.7 1.3 3 3 3h10c1.7 0 3-1.3 3-3v-1.1l3.7 2.4c.3.2.5.2.8.2.5 0 1-.2 1.3-.7.2-.2.3-.5.3-.8V7.9c0-.8-.7-1.5-1.5-1.5ZM15 16c0 .6-.4 1-1 1H4c-.6 0-1-.4-1-1V8c0-.6.4-1 1-1h10c.6 0 1 .4 1 1v8Zm6-.9-4-2.7V11l4-2.3v6.4Z"/>
  </symbol>
  <symbol id="styling" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/>
    <circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/>
    <circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/>
    <circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/>
    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/>
  </symbol>
  <symbol id="content">
    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
  </symbol>
  <symbol id="layout">
    <path d="M3,3V21H21V3H3M5,5H19V19H5V5M7,7V9H17V7H7M7,11V13H17V11H7M7,15V17H14V15H7Z"/>
  </symbol>
  <symbol id="text">
    <path d="M20 8c-.6 0-1-.4-1-1V5H5v2c0 .6-.4 1-1 1s-1-.4-1-1V4c0-.6.4-1 1-1h16c.6 0 1 .4 1 1v3c0 .6-.4 1-1 1Zm-4 12c0-.6-.4-1-1-1H9c-.6 0-1 .4-1 1s.4 1 1 1h6c.6 0 1-.4 1-1ZM11 5v15.1c0 .5.4.9 1 .9s1-.4 1-.9V5"/>
  </symbol>
  <symbol id="content-positioning">
    <path d="M19 21.8H5c-1.5 0-2.8-1.2-2.8-2.8V5c0-1.5 1.2-2.8 2.8-2.8h14c1.5 0 2.8 1.2 2.8 2.8v14c0 1.5-1.2 2.8-2.8 2.8ZM5 3.8c-.7 0-1.2.6-1.2 1.2v14c0 .7.6 1.2 1.2 1.2h14c.7 0 1.2-.6 1.2-1.2V5c0-.7-.6-1.2-1.2-1.2H5ZM10 9h4c.6 0 1 .4 1 1v4c0 .6-.4 1-1 1h-4c-.6 0-1-.4-1-1v-4c0-.6.4-1 1-1Zm2.8-2v-.3c.3 0 .6 0 .8-.2.3-.3.3-.8 0-1.1l-1-1s-.2-.1-.2-.2h-.6s-.2 0-.2.2l-1 1c-.3.3-.3.8 0 1.1s.5.3.8.2V7c0 .4.3.8.8.8s.8-.3.8-.8Zm-.5 12.7s.2 0 .2-.2l1-1c.3-.3.3-.8 0-1.1s-.5-.3-.8-.2v-.3c0-.4-.3-.8-.8-.8s-.8.3-.8.8v.3c-.3 0-.6 0-.8.2s-.3.8 0 1.1l1 1s.2.1.2.2h.6Zm-5.8-6.2c.2-.2.3-.5.2-.8H7c.4 0 .8-.3.8-.8s-.3-.8-.8-.8h-.3c0-.3 0-.6-.2-.8s-.8-.3-1.1 0l-1 1s-.1.2-.2.2v.6s0 .2.2.2l1 1c.1.1.3.2.5.2s.4 0 .5-.2Zm12 0 1-1s.1-.2.2-.2v-.6s0-.2-.2-.2l-1-1c-.3-.3-.8-.3-1.1 0s-.3.5-.2.8h-.3c-.4 0-.8.3-.8.8s.3.8.8.8h.3c0 .3 0 .6.2.8s.3.2.5.2.4 0 .5-.2Z"/>
  </symbol>
  <symbol id="editor">
    <path d="M14.06,9L15,9.94L5.92,19H5V18.08L14.06,9M17.66,3C17.41,3 17.15,3.1 16.96,3.29L15.13,5.12L18.88,8.87L20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18.17,3.09 17.92,3 17.66,3M14.06,6.19L3,17.25V21H6.75L17.81,9.94L14.06,6.19Z" />
  </symbol>
  <symbol id="builds">
    <path d="M21,16.5C21,16.88 20.79,17.21 20.47,17.38L12.57,21.82C12.41,21.94 12.21,22 12,22C11.79,22 11.59,21.94 11.43,21.82L3.53,17.38C3.21,17.21 3,16.88 3,16.5V7.5C3,7.12 3.21,6.79 3.53,6.62L11.43,2.18C11.59,2.06 11.79,2 12,2C12.21,2 12.41,2.06 12.57,2.18L20.47,6.62C20.79,6.79 21,7.12 21,7.5V16.5M12,4.15L10.11,5.22L16,8.61L17.96,7.5L12,4.15M6.04,7.5L12,10.85L13.96,9.75L8.08,6.35L6.04,7.5M5,15.91L11,19.29V12.58L5,9.21V15.91M19,15.91V9.21L13,12.58V19.29L19,15.91Z" />
  </symbol>
  <symbol id="templates">
    <path d="M16 0H8C6.9 0 6 .9 6 2V18C6 19.1 6.9 20 8 20H20C21.1 20 22 19.1 22 18V6L16 0M20 18H8V2H15V7H20V18M4 4V22H20V24H4C2.9 24 2 23.1 2 22V4H4Z" />
  </symbol>
  <symbol id="content-copy">
    <path d="M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z" />
  </symbol>
  <symbol id="logout">
    <path d="M17 7L15.59 8.41L18.17 11H8V13H18.17L15.59 15.58L17 17L22 12M4 5H12V3H4C2.9 3 2 3.9 2 5V19C2 20.1 2.9 21 4 21H12V19H4V5Z" />
  </symbol>
  <symbol id="edit">
		<path d="M5,3C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19H5V5H12V3H5M17.78,4C17.61,4 17.43,4.07 17.3,4.2L16.08,5.41L18.58,7.91L19.8,6.7C20.06,6.44 20.06,6 19.8,5.75L18.25,4.2C18.12,4.07 17.95,4 17.78,4M15.37,6.12L8,13.5V16H10.5L17.87,8.62L15.37,6.12Z" />
	</symbol>
	<symbol id="duplicate">
		<path d="M11,17H4A2,2 0 0,1 2,15V3A2,2 0 0,1 4,1H16V3H4V15H11V13L15,16L11,19V17M19,21V7H8V13H6V7A2,2 0 0,1 8,5H19A2,2 0 0,1 21,7V21A2,2 0 0,1 19,23H8A2,2 0 0,1 6,21V19H8V21H19Z" />
	</symbol>
	<symbol id="delete">
		<path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" />
	</symbol>
</Iconset>

<div class="app">
  <AppHeader leading={headerLeading} trailing={headerTrailing} />
  <NavigationRail>
    <NavigationRailItem href={"/editor"} active={activeRoute === "editor"} data-sveltekit-preload-data="tap">
      {#snippet icon()}
				<Icon>
          <use href="#editor" />
        </Icon>
			{/snippet}
			Editor
    </NavigationRailItem>
    <NavigationRailItem href={"/editor/builds"} active={activeRoute === "builds"} data-sveltekit-preload-data="tap">
			{#snippet icon()}
				<Icon>
					<use href="#builds" />
				</Icon>
			{/snippet}
			Builds
		</NavigationRailItem>
		<NavigationRailItem href={"/editor/templates"} active={activeRoute === "templates"} data-sveltekit-preload-data="tap">
			{#snippet icon()}
				<Icon>
					<use href="#templates" />
				</Icon>
			{/snippet}
			Templates
		</NavigationRailItem>
    {#snippet end()}
      <Avatar bind:ref={avatarRef} text={userInitials} shape="circle" tag="button" />
    {/snippet}
  </NavigationRail>
  {@render children?.()}
</div>

<Menu anchor={avatarRef} placement="right-end">
  <form {...signout}>
    <MenuItem type="submit">
      {#snippet leading()}
        <Icon>
          <use href="#logout" />
        </Icon>
      {/snippet}
      Signout
    </MenuItem>
  </form>
</Menu>

<style>
  .app {
    display: grid;
    grid-template-areas:
			"header header header"
			"rail sidebar preview";
    grid-template-columns: minmax(0, auto) minmax(0, auto) 1fr;
    grid-template-rows: minmax(0, auto) 1fr;
    height: 100dvh;
    background-color: #f1f1f1;
  }

  .app-title {
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
    font-weight: 700;
    font-size: 1rem;
  }
</style>