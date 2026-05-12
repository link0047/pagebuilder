<script lang="ts">
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
  import DOMPurify from "dompurify";

  type Props = { title?: string; };

  let { title }: Props = $props();

  let appState = getAppState();

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

  // All reads and writes go through AppState — no local duplication
  function getValue(property: string): any {
    return appState.getPropertyValue(property);
  }

  function setValue(property: string, value: unknown): void {
    let safeValue = value;
    if (typeof value === "string") {
      safeValue = DOMPurify.sanitize(value, {
        ALLOW_UNKNOWN_PROTOCOLS: false,
      });
    }

    appState.updateProperty(property, safeValue);
  }

  function resolveOptionValue(option: string | { value: string; text: string }): string {
    return typeof option === "string" ? option : option.value;
  }

  function resolveOptionLabel(option: string | { value: string; text: string }): string {
    return typeof option === "string" ? option : option.text;
  }
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
  class="properties-panel"
  role="complementary"
  aria-label={title}
  aria-hidden={!isOpen}
>
  <header class="properties-panel__header">
    <Button
      size="sm"
      variant="ghost"
      shape="rounded-square"
      onclick={() => appState.deselectComponent()}
      aria-label="Close properties panel"
    >
      <Icon>
        <path d="M15.41 16.58 10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.42Z" />
      </Icon>
    </Button>
    <span class="properties-panel__title">
      {title}
    </span>
  </header>

  <div class="properties-panel__content">
    {#if isOpen && selectedComponent && schema}
      {#each schema.sections as section}
        <PropertiesPanelSection title={section.title} icon={section.icon}>
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
                    <Group gap="0.5rem">
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
    --uikit-button-border-radius: 0.5rem;
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
    grid-template-columns: auto 1fr;
    align-items: center;
    padding-inline: 0.5rem;
  }

  .properties-panel__content {
    padding-inline: 0.5rem;
    padding-block: 1rem;
    overflow-y: scroll;
    display: flex;
    flex-flow: column nowrap;
    gap: 1.5rem;
  }
</style>
