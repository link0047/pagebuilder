<script lang="ts">
  import AppHeader from "$lib/components/AppHeader.svelte";
  import Button from "$lib/components/Button.svelte";
  import Icon from "$lib/components/Icon.svelte";
  import SegmentedControl from "$lib/components/SegmentedControl.svelte";
  import SegmentedButton from "$lib/components/SegmentedButton.svelte";
  import { setAppState } from "$lib/components/app-state.svelte";
  import { type LayoutProps } from "./$types";
  import Iconset from "$lib/components/Iconset.svelte";

  let { 
    data,
    children
  }: LayoutProps = $props();

  const appState = setAppState();
</script>

<div class="app">
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
  </Iconset>
  <AppHeader>
    <Button onclick={() => {
      console.log(appState?.pageTree);
    }}>
      get state
    </Button>
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
  </AppHeader>
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
</style>