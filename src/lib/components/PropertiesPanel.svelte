<script lang="ts">
  import type { PartialComponentNode } from "./component-registry";

  import { getAppState } from "./app-state.svelte";
  import { componentSchemas, type ComponentName, type ControlSchema } from "./component-schema";
  import PropertiesPanelSection from "./PropertiesPanelSection.svelte";
  import Icon from "./Icon.svelte";
  import Button from "./Button.svelte";
  import SegmentedControl from "./SegmentedControl.svelte";
  import SegmentedButton from "./SegmentedButton.svelte";
  import ControlGroup from "./ControlGroup.svelte";
  import Textfield from "./Textfield.svelte";
  import Textarea from "./Textarea.svelte";
  import Tab from "./Tab.svelte";
  import Tabs from "./Tabs.svelte";
  import TabList from "./TabList.svelte";
  import TabPanel from "./TabPanel.svelte";
  import ColorPicker from "./ColorPicker.svelte";
  import Select from "./Select.svelte";
  import Group from "./Group.svelte";
  import Hint from "./Hint.svelte";
  import Checkbox from "./Checkbox.svelte";
  import EditableLabel from "./EditableLabel.svelte";
  import Menu from "$lib/components/Menu.svelte";
  import MenuItem from "$lib/components/MenuItem.svelte";

  type Props = { title?: string; };

  let { title }: Props = $props();

  let appState = getAppState();
  let optionsButtonRef = $state<HTMLButtonElement>();
  let editMode = $state(false);
  let ref = $state<HTMLDivElement | undefined>();

  const DANGEROUS_PROTOCOLS = /^(javascript|data|vbscript):/i;
  const isOpen = $derived(appState.isPropertiesPanelOpen);
  const selectedComponent = $derived(appState.selectedComponent);
  const schema = $derived(
    selectedComponent && isValidComponentName(selectedComponent.name)
      ? componentSchemas[selectedComponent.name]
      : null
  );

  function isValidComponentName(name: string): name is ComponentName {
    return name in componentSchemas;
  }

  function sanitizeValue(property: string, value: unknown): unknown {
    if (typeof value !== "string") return value;

    const trimmed = value.trim();

    const isUrlProperty = property.endsWith(".href") ||
      property.endsWith(".src") ||
      property.endsWith(".src2x") ||
      property === "props.href" ||
      property === "props.src";

    if (isUrlProperty && DANGEROUS_PROTOCOLS.test(trimmed)) {
      console.warn("Security: URL protocols containing scripts are not allowed.");
      return "";
    }

    return value;
  }

  // All reads and writes go through AppState — no local duplication
  function getValue(property: string): any {
    return appState.getPropertyValue(property);
  }

  function setValue(property: string, value: unknown): void {
    appState.updateProperty(property, sanitizeValue(property, value));
  }

  function resolveOptionValue(option: string | { value: string; text: string }): string {
    return typeof option === "string" ? option : option.value;
  }

  function resolveOptionLabel(option: string | { value: string; text: string }): string {
    return typeof option === "string" ? option : option.text;
  }

  function handleDelete() {
    if (appState.selectedComponentPath) {
      appState.removeComponent(appState.selectedComponentPath);
      appState.deselectComponent();
    }
  }

  function handleDuplicate() {
    if (appState.selectedComponent && appState.selectedComponentPath) {
      const { id, ...rest } = structuredClone($state.snapshot(appState.selectedComponent));
      appState.insertComponent(rest as PartialComponentNode, appState.selectedComponentPath.slice(0, -1));
    }
  }

  $effect(() => {
    if (ref) {
      if (isOpen) {
        ref.inert = false;
      } else {
        ref.inert = true;
      }
    }
  });
</script>

{#snippet renderControls(control: ControlSchema)}
  {#if control.type === "segmentedbutton"}
    <SegmentedControl
      headingLabel={control.label}
      value={getValue(control.property as string) || control.defaultValue}
    >
      {#each control.options || [] as option}
        <SegmentedButton
          value={resolveOptionValue(option)}
          onclick={() => {
            if (control.property) {
              setValue(control.property, resolveOptionValue(option));
            }
          }}
        >
          {resolveOptionLabel(option)}
        </SegmentedButton>
      {/each}
    </SegmentedControl>

  {:else if control.type === "hint"}
    <Hint variant="info" icon={true}>
      <span>{control.description}</span>
    </Hint>

  {:else if control.type === "textfield"}
    <Textfield
      label={control.label || ""}
      placeholder={control.placeholder}
      description={control.description}
      value={getValue(control.property as string) || control.defaultValue}
      oninput={(event: Event) => {
        if (control.property) {
          setValue(control.property, (event.target as HTMLInputElement).value);
        }
      }}
    />

  {:else if control.type === "number"}
    <Textfield
      type="number"
      label={control.label || ""}
      placeholder={control.placeholder}
      description={control.description}
      value={getValue(control.property as string) || control.defaultValue}
      oninput={(event: Event) => {
        if (control.property) {
          setValue(control.property, (event.target as HTMLInputElement).value);
        }
      }}
    />

  {:else if control.type === "textarea"}
    <Textarea
      label={control.label}
      value={getValue(control.property as string) || control.defaultValue}
      oninput={(event: Event) => {
        if (control.property) {
          setValue(control.property, (event.target as HTMLInputElement).value);
        }
      }}
    />

  {:else if control.type === "select"}
    <Select
      label={control.label}
      value={getValue(control.property as string) || control.defaultValue}
      description={control.description}
      onchange={(event: Event) => {
        if (control.property) {
          setValue(control.property, (event.target as HTMLSelectElement).value);
        }
      }}
    >
      {#each control.options || [] as option}
        <option value={resolveOptionValue(option)}>{resolveOptionLabel(option)}</option>
      {/each}
    </Select>

  {:else if control.type === "colorpicker"}
    <ColorPicker
      label={control.label}
      value={getValue(control.property as string) || control.defaultValue}
      onchange={(value) => {
        if (control.property) {
          setValue(control.property, value);
        }
      }}
    />
  {:else if control.type === "checkbox"}
    <Checkbox
      checked={getValue(control.property as string) ?? control.defaultValue ?? false}
      onchange={(event: Event) => {
        if (control.property) {
          setValue(control.property, (event.target as HTMLInputElement).checked);
        }
      }}
    >
      {control.label}
    </Checkbox>
  {/if}
{/snippet}

<!--
  role="complementary" is appropriate for a persistent side panel.
  role="dialog" + aria-modal should only be used for true modal dialogs
  that trap focus and block the rest of the UI.
-->
<div
  bind:this={ref}
  class="properties-panel"
  role="complementary"
  aria-label={title}
  aria-hidden={!isOpen}
>
  <header class="properties-panel__header">
    <div class="properties-panel__back-button">
      <Button
        size="sm"
        variant="ghost"
        shape="rounded-square"
        onclick={() => appState.deselectComponent()}
        aria-label="Close properties panel"
      >
        <Icon>
          <use href="#chevron-left" />
        </Icon>
      </Button>
    </div>
    <div class="properties-panel__label">
      <EditableLabel
        size="sm"
        variant="ghost"
        value={title}
        truncate
        bind:editMode
        oncommit={(value) => {
          if (appState.selectedComponentPath) {
            appState.updateProperty("meta.label", value);
          }
        }}
      />
    </div>
    <div class="properties-panel__options-button">
      <Button
        size="sm"
        variant="ghost"
        shape="rounded-square"
        bind:ref={optionsButtonRef}
      >
        <Icon>
          <use href="#dots-horizontal" />
        </Icon>
      </Button>
    </div>
  </header>
  <div class="properties-panel__content">
    {#if isOpen && selectedComponent && schema}
      {#each schema.sections as section}
        <PropertiesPanelSection label={section.title} icon={section.icon} collapsed={section.collapsed}>
          {#each section.controls as control}
            {#if ["segmentedbutton", "textfield", "textarea", "select", "colorpicker", "hint", "number", "checkbox"].includes(control.type)}
              {@render renderControls(control)}
            {:else if control.type === "tabs"}
              <Tabs>
                <TabList>
                  {#each control.tabs || [] as tab}
                    <Tab>{tab.label}</Tab>
                  {/each}
                </TabList>
                {#each control.tabs || [] as tab}
                  <TabPanel>
                    <Group gap="1rem">
                      {#each tab.controls as tabControl}
                        {@render renderControls(tabControl)}
                      {/each}
                    </Group>
                  </TabPanel>
                {/each}
              </Tabs>

            {:else if control.type === "group"}
              <ControlGroup label={control.label} col={2}>
                {#each control.controls || [] as groupControl}
                  {@render renderControls(groupControl)}
                {/each}
              </ControlGroup>
            {/if}
          {/each}
        </PropertiesPanelSection>
      {/each}
    {/if}
  </div>
</div>

<Menu anchor={optionsButtonRef}>
  <MenuItem onclick={() => editMode = true}>
    {#snippet leading()}
      <Icon size="16">
        <use href="#pencil-outline" />
      </Icon>
    {/snippet}
    Rename
  </MenuItem>
  <MenuItem onclick={handleDuplicate}>
    {#snippet leading()}
      <Icon size="16">
        <use href="#duplicate" />
      </Icon>
    {/snippet}
    Duplicate
  </MenuItem>
  <MenuItem onclick={handleDelete}>
    {#snippet leading()}
      <Icon size="16">
        <use href="#delete" />
      </Icon>
    {/snippet}
    Delete
  </MenuItem>
</Menu>

<style>
  .properties-panel {
    position: absolute;
    z-index: 99;
    display: grid;
    grid-template-rows: auto 1fr;
    height: 100%;
    width: 100%;
    background-color: #fff;
    top: 0;
    left: 0;
    transition: opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .properties-panel[aria-hidden="true"] {
    opacity: 0;
    pointer-events: none;
  }

  .properties-panel__header {
    height: 3rem;
    border-bottom: 0.0625rem solid #ebebeb;
    display: grid;
    gap: 0.5rem;
    grid-template-columns: auto 1fr auto;
    grid-template-areas: "back label options";
    align-items: center;
    padding-inline: 0.5rem;
    min-width: 0;
    overflow: hidden;
  }

  .properties-panel__back-button {
    grid-area: back;
  }

  .properties-panel__label {
    grid-area: label;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding: .25rem;
  }

  .properties-panel__options-button {
    grid-area: options;
  }

  .properties-panel__content {
    padding-inline: 0.5rem;
    padding-block: 1rem;
    overflow-y: scroll;
    display: flex;
    flex-flow: column nowrap;
    gap: 0.5rem;
  }
</style>
