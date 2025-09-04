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

  type Props = {
    title?: string,
  }

  let {
    title,
  }: Props = $props();

  let appState = getAppState();

  const isOpen = $derived(appState.isPropertiesPanelOpen);
  const selectedComponent = $derived(appState.selectedComponent);
  const schema = $derived(selectedComponent && isValidComponentName(selectedComponent.name) ? componentSchemas[selectedComponent.name] : null);

  function closePanel() {
    appState.closePropertiesPanel();
  }

  function updateProperty(property: string, value: unknown) {
    if (!selectedComponent) return;
    
    const parts = property.split(".");
    if (parts.length === 2) {
      // Simple property like "props.title"
      appState.updateComponentProperty(property, value);
      return;
    }
    
    // Nested property like "props.images.desktop" or "props.promo.value"
    const [section, ...keyParts] = parts;
    
    let target: Record<string, any>;
    if (section === "props") {
      target = selectedComponent.props;
    } else if (section === "data") {
      target = selectedComponent.data;
    } else if (section === "meta") {
      target = selectedComponent.meta as Record<string, any>;
    } else {
      return;
    }
    
    // Navigate to the nested property and create objects as needed
    let current = target;
    for (let i = 0; i < keyParts.length - 1; i++) {
      if (!current[keyParts[i]] || typeof current[keyParts[i]] !== "object") {
        current[keyParts[i]] = {};
      }
      current = current[keyParts[i]];
    }
    
    // Set the final value
    const finalKey = keyParts[keyParts.length - 1];
    current[finalKey] = value;
    
    appState.updateComponentProperty(property, value);
  }

  function isValidComponentName(name: string): name is ComponentName {
    return name in componentSchemas;
  }

  function getCurrentValue(property: string): any {
    if (!selectedComponent) return "";
    
    const parts = property.split('.');
    const [section, ...keyParts] = parts;

    let source: Record<string, any>;
    if (section === "props") {
      source = selectedComponent.props;
    } else if (section === "data") {
      source = selectedComponent.data;
    } else if (section === "meta") {
      source = selectedComponent.meta as Record<string, any>;
    } else {
      return "";
    }

    // Navigate through nested properties
    let current = source;
    for (const key of keyParts) {
      if (current && typeof current === "object" && key in current) {
        current = current[key];
      } else {
        return "";
      }
    }

    return current ?? "";
  }
</script>

{#snippet renderControls(control: ControlSchema)}
  {#if control.type === "segmentedbutton"}
    <SegmentedControl 
      headingLabel={control.label} 
      value={getCurrentValue((control.property as string)) || control.defaultValue}
    >
      {#each control.options || [] as option}
        <SegmentedButton
          value={typeof option === "string" ? option : option.value}
          onclick={() => {
            if (control.property) {
              updateProperty(control.property, option);
            }
          }
        }>
          {typeof option === "string" ? option : option.text}
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
      value={getCurrentValue((control.property as string)) || control.defaultValue}
      oninput={(event: Event) => {
        const target = event.target as HTMLInputElement;
        if (control.property) {
          updateProperty(control.property, target.value);
        }
      }}
    />
  {:else if control.type === "textarea"}
    <Textarea 
      label={control.label}
      value={getCurrentValue((control.property as string)) || control.defaultValue}
      oninput={(event: Event) => {
        const target = event.target as HTMLInputElement;
        if (control.property) {
          updateProperty(control.property, target.value);
        }
      }}
    />
  {:else if control.type === "select"}
    <Select 
      label={control.label} 
      value={getCurrentValue((control.property as string)) || control.defaultValue}
      description={control.description}
      onchange={(event: Event) => {
        const target = event.target as HTMLInputElement;
        if (control.property) {
          updateProperty(control.property, target.value);
        }
      }}
    >
      {#each control.options || [] as option}
      {#if typeof option === "string"}
        <option value={option}>{option}</option>
      {:else}
        <option value={option.value}>{option.text}</option>
      {/if}
    {/each}
    </Select>
  {:else if control.type === "colorpicker"}
    <ColorPicker
      label={control.label}
      value={getCurrentValue((control.property as string)) || control.defaultValue}
      onchange={(event: Event) => {
        const target = event.target as HTMLInputElement;
        if (control.property) {
          updateProperty(control.property, target.value);
        }
      }}
    />
  {/if}
{/snippet}

<div class="uikit-properties-panel" aria-hidden={!isOpen} role="dialog" aria-modal="true" aria-labelledby="panel-title">
  <header class="uikit-properties-panel__header">
    <Button variant="ghost" shape="square" onclick={closePanel} aria-label="Close properties panel">
      <Icon>
        <path d="M15.41 16.58 10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.42Z"/>
      </Icon>
    </Button>
    <span class="uikit-properties-panel__title" id="panel-title">
      {title}
    </span>
  </header>
  <div class="uikit-properties-panel__content">
    {#if isOpen && selectedComponent && schema}
      {#each schema.sections as section}
        <PropertiesPanelSection title={section.title} icon={section.icon}>
          {#each section.controls as control}
            {#if ["segmentedbutton", "textfield", "textarea", "select", "colorpicker", "hint"].includes(control.type)}
              {@render renderControls(control)}
            {:else if control.type === "tabs"}
              <Tabs>
                <TabList>
                  {#each control.tabs || [] as tab}
                    <Tab>
                      {tab.label}
                    </Tab>
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
  .uikit-properties-panel {
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
    --uikit-button-border-radius: .5rem;
  }

  .uikit-properties-panel[aria-hidden="true"] {
    opacity: 0;
    pointer-events: none;
  }

  .uikit-properties-panel__header {
    height: 3rem;
    border-bottom: .0625rem solid #ebebeb;
    display: grid;
    grid-template-columns: auto 1fr;
    align-items: center;
  }

  .uikit-properties-panel__content {
    padding-inline: .5rem;
    padding-block: 1rem;
    overflow-y: scroll;
    display: flex;
    flex-flow: column nowrap;
    gap: 1.5rem;
  }
</style>