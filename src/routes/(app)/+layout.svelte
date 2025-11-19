<script lang="ts">
  import AppHeader from "$lib/components/AppHeader.svelte";
  import Button from "$lib/components/Button.svelte";
  import Icon from "$lib/components/Icon.svelte";
  import SegmentedControl from "$lib/components/SegmentedControl.svelte";
  import SegmentedButton from "$lib/components/SegmentedButton.svelte";
  import { setAppState } from "$lib/components/app-state.svelte";
  import type { LayoutProps } from "./$types";
  import Iconset from "$lib/components/Iconset.svelte";
  import { copyToClipboard } from "$lib/utils/clipboard";
  import { attempt } from "$lib/utils/attempt";
  import { signout } from "$lib/api/auth.remote";

  let {
    children
  }: LayoutProps = $props();

  let isCopied = $state(false);
  let isLoading = $state(false);
  const appState = setAppState();
  const copyButtonText = $derived(() => {
    if (isLoading) return "Copying...";
    if (isCopied) return "Copied!";
    return "Copy Code";
  });

  async function handleSignout() {
    console.log(signout);
  }

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
    disabled={isLoading}
    onclick={handleCopyHTML}>
    {copyButtonText()}
  </Button>
  <form {...signout}>
    <Button type="submit">
      sign out
    </Button>
  </form>
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
</Iconset>
<div class="app">
  <AppHeader leading={headerLeading} trailing={headerTrailing} />
  {@render children?.()}
</div>

<style>
  .app {
    display: grid;
    grid-template-areas: 
      "header header"
      "sidebar preview";
    grid-template-columns: minmax(0, auto) 1fr;
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