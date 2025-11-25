<script lang="ts">
  import AppSidebar from "$lib/components/AppSidebar.svelte";
  import PropertiesPanel from "$lib/components/PropertiesPanel.svelte";
	import PreviewPane from "$lib/components/PreviewPane.svelte";
  import Preview from "$lib/components/Preview.svelte";
  import { getAppState } from "$lib/components/app-state.svelte";
  import type { LayoutProps } from "./$types";

  let {
    children
  }: LayoutProps = $props();

  const appState = getAppState();
</script>

<AppSidebar>
  {@render children?.()}
  <PropertiesPanel title={appState.selectedComponent?.meta.label} />
</AppSidebar>
<PreviewPane maxWidth="{appState.previewWidth}px">
  <Preview bind:pageTree={appState.pageTree} />
</PreviewPane>