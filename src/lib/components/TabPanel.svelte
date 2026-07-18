<script lang="ts">
  import { type Snippet, onDestroy } from "svelte";
  import { getTabState } from "./tabs-state.svelte";

  type Props = { children: Snippet; };

  let { children }: Props = $props();

  const tabState = getTabState();
  const config = $derived(tabState.config);
  const panelId = tabState.addPanel();
  const panelIndex = tabState.panels.length - 1;

  const correspondingTabValue = $derived(tabState.getTabValueForPanelIndex(panelIndex));
  const isSelected = $derived(correspondingTabValue != null && tabState.isTabSelected(correspondingTabValue));
  const correspondingTabId = $derived(tabState.tabs.find((t) => t.value === correspondingTabValue)?.id);

  onDestroy(() => {
    tabState.removePanel(panelId);
  });
</script>

<div
  id={panelId}
  class="wcag-ui-tabs__panel"
  class:wcag-ui-tabs__panel--outlined={config.variant === "outlined"}
  class:wcag-ui-tabs__panel--underline={config.variant === "underline"}
  role="tabpanel"
  aria-labelledby={correspondingTabId}
  tabindex="0"
  hidden={!isSelected}
>
  {@render children?.()}
</div>

<style>
  :root {
    --wcag-ui-tabs-panel-padding-inline: .5rem;
    --wcag-ui-tabs-panel-padding-block: .5rem;
  }

  .wcag-ui-tabs__panel {
    box-sizing: border-box;
    padding-inline: var(--wcag-ui-tabs-panel-padding-inline);
    padding-block: var(--wcag-ui-tabs-panel-padding-block);
  }

  .wcag-ui-tabs__panel--outlined {
    border: 1px solid #c5c5cb;
    border-top: none;
    border-bottom-left-radius: .5rem;
    border-bottom-right-radius: .5rem;
  }

  .wcag-ui-tabs__panel--underline {
    --wcag-ui-tabs-panel-padding-inline: 0;
  }

  .wcag-ui-tabs__panel[hidden] {
    display: none;
  }
</style>
