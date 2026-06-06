<script lang="ts">
  import type { RootNode } from "$lib/components/types";
  import { getRecentBuilds } from "$lib/api/builds.remote";
  import { getAppState } from "$lib/components/app-state.svelte";
  import { openBuild } from "$lib/utils/openBuild";
  import { goto } from "$app/navigation";
  import Dialog from "$lib/components/Dialog.svelte";
  import Button from "$lib/components/Button.svelte";
  import Icon from "$lib/components/Icon.svelte";
  import BuildPicker from "$lib/components/BuildPicker.svelte";
  import RecentRow from "$lib/components/RecentRow.svelte";
  import TemplateCard from "$lib/components/TemplateCard.svelte";

  type Props = {
    open: boolean;
    disclosure: HTMLElement | undefined;
  };

  let { open = $bindable(false), disclosure }: Props = $props();

  const appState = getAppState();
  const recentBuildsQuery = getRecentBuilds();

  const BLANK_TEMPLATE_THUMB = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGgAAACQCAIAAABrv7mCAAABkElEQVR4Ae3BMQEAAAwCIO0fmmXwHxR5uyJvV+Ttirxdkbcr8nZF3q7I2xV5uyJvV+Ttirxdkbcr8nZF3q7I2xV5uyJvV+Ttirxdkbcr8nZF3q7I2xV5uyJvV+Ttirxdkbcr8nZF3q7I2xV5uyJvV+Ttirxdkbcr8nZF3q7I2xV5uyJvV+Ttirxdkbcr8nZF3q7I2xV5uyJvV+Ttirxdkbcr8nZF3q7I2xV5uyJvV+Ttirxdkbcr8nZF3q7I2xV5uyJvV+Ttirxdkbcr8nZF3q7I2xV5uyJvV+Ttirxdkbcr8nZF3q7I2xV5uyJvV+Ttirxdkbcr8nZF3q7I2xV5uyJvV+Ttirxdkbcr8nZF3q7I2xV5uyJvV+Ttirxdkbcr8nZF3q7I2xV5uyJvV+Ttirxdkbcr8nZF3q7I2xV5uyJvV+Ttirxdkbcr8nZF3q7I2xV5uyJvV+Ttirxdkbcr8nZF3q7I2xV5uyJvV+Ttirxdkbcr8nZF3q7I2xV5uyJvV+Ttirxdkbcr8nZF3q7I2x3wma7wuRrxjAAAAABJRU5ErkJggg==";


  const EMPTY_ROOT: RootNode = { name: "root", type: "root", children: [] };

  type TemplateOption = {
    id: string;
    label: string;
    thumbnailSrc: string;
    buildType: string;
    content: RootNode;
  };

  const templateOptions: TemplateOption[] = [
    {
      id: "blank",
      label: "Blank Document",
      thumbnailSrc: BLANK_TEMPLATE_THUMB,
      buildType: "custom",
      content: EMPTY_ROOT
    }
    // real templates from getTemplates() get appended here once wired
  ];

  type Selection =
    | { kind: "template"; id: string }
    | { kind: "recent"; id: string };

  let templatePickerRef = $state<HTMLElement>();
  let selection = $state<Selection>({ kind: "template", id: "blank" });
  let isOpeningBuild = $state(false);

  let footerLabel = $derived(selection.kind === "recent" ? "Open" : "Create");
  let selectedTemplateId = $derived(selection.kind === "template" ? selection.id : null);
  let selectedRecentId = $derived(selection.kind === "recent" ? selection.id : null);
  let initialFocusTarget = $derived(
    templatePickerRef?.querySelector<HTMLElement>('[role="option"]') ?? undefined
  );

  function formatBuildDate(d = new Date()): string {
    return d.toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" });
  }

  function selectTemplate(id: string) {
    selection = { kind: "template", id };
  }

  function selectRecent(id: string) {
    selection = { kind: "recent", id };
  }

  async function activateTemplate(template: TemplateOption) {
    if (isOpeningBuild) return;
    isOpeningBuild = true;
    try {
      const name = `${template.label} - ${formatBuildDate()}`;
      // Load as a NEW, unsaved build (no id → appState treats it as new on save).
      appState.loadBuild(template.content, undefined, name);
      await goto("/editor");
      open = false;
    } finally {
      isOpeningBuild = false;
    }
  }

  async function activateRecent(id: string) {
    if (isOpeningBuild) return;
    const build = recentBuildsQuery.current?.find((b) => b.id === id);
    if (!build) return;
    isOpeningBuild = true;
    try {
      const result = await openBuild(appState, build);
      if (result.ok) open = false; // only close the dialog once the build actually opened
    } finally {
      isOpeningBuild = false;
    }
  }

  function handleFooterAction() {
    if (selection.kind === "recent") {
      activateRecent(selection.id);
    } else {
      const template = templateOptions.find((t) => t.id === selection.id);
      if (template) activateTemplate(template);
    }
  }
</script>

<Dialog
  title="Create New Build"
  {disclosure}
  size="lg"
  bind:open
  trigger={false}
  initialFocus={initialFocusTarget}
  closeOnEsc={!isOpeningBuild}
  closeOnOutsideClick={!isOpeningBuild}
  hasCloseButton={!isOpeningBuild}
>
  <div class="dialog-content" inert={isOpeningBuild}>
    <section class="section" aria-labelledby="templates-heading">
      <h3 class="section__heading" id="templates-heading">Templates</h3>
      <BuildPicker
        bind:ref={templatePickerRef}
        items={templateOptions}
        getId={(t) => t.id}
        selectedId={selectedTemplateId}
        ariaLabel="Templates"
        orientation="horizontal"
        onSelect={(id) => selectTemplate(id)}
        onActivate={(_, t) => activateTemplate(t)}
      >
        {#snippet option(template, { selected })}
          <TemplateCard label={template.label} thumbnailSrc={template.thumbnailSrc} {selected} />
        {/snippet}
      </BuildPicker>
    </section>

    <section class="section" aria-labelledby="recent-heading">
      <h3 class="section__heading" id="recent-heading">Start From Recent</h3>
      {#if recentBuildsQuery.loading}
        <p class="muted">Loading recent builds...</p>
      {:else if recentBuildsQuery.error}
        <p class="error">Failed to load recent builds</p>
      {:else if recentBuildsQuery.current && recentBuildsQuery.current.length > 0}
        <div class="recent-header" aria-hidden="true">
          <span class="recent-header__icon"><Icon size="16"><use href="#file-document-outline" /></Icon></span>
          <span>Name</span>
          <span class="recent-header__date">Last opened by you</span>
        </div>
        <BuildPicker
          items={recentBuildsQuery.current}
          getId={(b) => b.id}
          selectedId={selectedRecentId}
          ariaLabel="Recent builds"
          orientation="vertical"
          striped
          onSelect={(id) => selectRecent(id)}
          onActivate={(id) => activateRecent(id)}
        >
          {#snippet option(build, { selected })}
            <RecentRow {build} {selected} />
          {/snippet}
        </BuildPicker>
      {:else}
        <p class="muted">No recent builds yet</p>
      {/if}
    </section>
  </div>

  {#snippet footer()}
    <div class="actions">
      <Button variant="ghost" onclick={() => (open = false)} disabled={isOpeningBuild}>Cancel</Button>
      <Button color="success" loading={isOpeningBuild} onclick={() => handleFooterAction()}>{footerLabel}</Button>
    </div>
  {/snippet}
</Dialog>

<style>
  .dialog-content {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .section {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .section__heading {
    font-size: 1rem;
    margin: 0;
    line-height: 1;
    color: #4f4f4f;
  }

  .recent-header {
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    gap: 0.75rem;
    padding: 0.375rem 0.75rem;
    border-bottom: 1px solid #e5e5e5;
    font-size: 0.8125rem;
    font-weight: 600;
    color: #4f4f4f;
  }

  .recent-header__icon {
    display: flex;
    color: #9b9b9b;
  }

  .recent-header__date {
    white-space: nowrap;
  }

  .muted,
  .error {
    font-size: 0.875rem;
    color: #6b6b6b;
    margin: 0;
  }

  .error {
    color: #b91c1c;
  }

  .actions {
    display: flex;
    gap: 0.75rem;
    width: fit-content;
    margin-inline-start: auto;
  }
</style>
