<script lang="ts">
  import type { PartialComponentNode } from "./component-registry";
  import type { PageSection } from "./types";
  import type { ControlSchema } from "./component-schema";

  import { getAppState } from "./app-state.svelte";
  import { componentSchemas, sectionSchemas, type ComponentName } from "./component-schema";
  import PropertiesPanelSection from "./PropertiesPanelSection.svelte";
  import Icon from "./Icon.svelte";
  import Button from "./Button.svelte";
  import SegmentedControl from "./SegmentedControl.svelte";
  import SegmentedButton from "./SegmentedButton.svelte";
  import LabelledCard from "./LabelledCard.svelte";
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
  // --- new controls ---
  import SpacingField from "./SpacingField.svelte";
  import LinkField from "./LinkField.svelte";
  import ImageUrlField from "./ImageUrlField.svelte";
  import ArrayField from "./ArrayField.svelte";
  import Slider from "./Slider.svelte";

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
  const selectedSection = $derived(appState.selectedSection);
  const sectionSchema = $derived(
    selectedSection ? sectionSchemas[selectedSection] : null
  );

  const SIMPLE_CONTROLS = [
    "segmentedbutton", "textfield", "textarea", "select",
    "colorpicker", "hint", "number", "checkbox",
    "spacing-field", "link-field", "image-url-field", "slider",
    "group", "labelled-card", "tabs",
  ];

  function isValidComponentName(name: string): name is ComponentName {
    return name in componentSchemas;
  }

  function sanitizeValue(property: string, value: unknown): unknown {
    if (typeof value !== "string") return value;

    const trimmed = value.trim();

    const isUrlProperty = property.endsWith(".href") ||
      property.endsWith(".src") ||
      property.endsWith(".src2x") ||
      property.endsWith(".url") ||
      property === "props.href" ||
      property === "props.src";

    if (isUrlProperty && DANGEROUS_PROTOCOLS.test(trimmed)) {
      console.warn("Security: URL protocols containing scripts are not allowed.");
      return "";
    }

    return value;
  }

  function getValue(property: string): any {
    switch (selectedSection) {
      case "page":
        return appState.getPageSettingValue(property);
      case "heading":
        return appState.getPageHeadingValue(property);
      default:
        return appState.getPropertyValue(property);
    }
  }

  function setValue(property: string, value: unknown): void {
    const sanitized = sanitizeValue(property, value);
    switch (selectedSection) {
      case "page":
        appState.updatePageSetting({ [property]: sanitized });
        break;
      case "heading":
        appState.updatePageHeading({ [property]: sanitized });
        break;
      default:
        appState.updateProperty(property, sanitized);
    }
  }

  function resolveOptionValue(option: string | { value: string; text: string }): string {
    return typeof option === "string" ? option : option.value;
  }

  function resolveOptionLabel(option: string | { value: string; text: string }): string {
    return typeof option === "string" ? option : option.text;
  }

  const ROOT_FONT_SIZE = 16;

  // Legacy token scale, in px. Old token-based sizes ("md") resolve to a
  // slider position so existing content works without migration.
  const LEGACY_SIZE_TOKENS: Record<string, number> = {
    sm: 20, md: 24, lg: 28, xl: 32, "2xl": 40,
  };

  /** Drop trailing zeros: 24.0 -> "24", 1.25 -> "1.25". */
  function trimZeros(n: number): string {
    return String(Number(n.toFixed(2)));
  }

  /**
   * Coerce a stored value into a slider number, in the control's unit.
   * Handles raw numbers (gap), unit-suffixed CSS strings, and legacy tokens.
   * A rem value read into a px slider is converted, so content saved by an
   * earlier rem-based build still lands in the right place.
   */
  function toNumber(raw: unknown, control: ControlSchema): number {
    const fallback = (control.defaultValue as number) ?? control.min ?? 0;
    if (raw == null || raw === "") return Number(fallback) || 0;
    if (typeof raw === "number") return raw;

    const str = String(raw).trim();
    if (str in LEGACY_SIZE_TOKENS) return LEGACY_SIZE_TOKENS[str];

    const parsed = parseFloat(str);
    if (!Number.isFinite(parsed)) return Number(fallback) || 0;

    // Convert between rem and px when the stored unit differs from the
    // control's unit.
    const storedRem = /rem\s*$/i.test(str);
    if (storedRem && control.unit === "px") return parsed * ROOT_FONT_SIZE;
    if (!storedRem && /px\s*$/i.test(str) && control.unit === "rem") {
      return parsed / ROOT_FONT_SIZE;
    }

    return parsed;
  }

  // Rebase an item-relative property onto its array-field index.
  function rebase(base: string | undefined, index: number, prop?: string): string {
    if (!base) return prop ?? "";
    return prop ? `${base}.${index}.${prop}` : `${base}.${index}`;
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
    if (ref) ref.inert = !isOpen;
  });
</script>

<!--
  renderControls now takes an optional `basePath`/`index` so the same renderer
  works both at top level (basePath undefined) and inside an ArrayField item
  (basePath = "props.subheadings", index = row). When basePath is set, each
  control's `property` is treated as item-relative and rebased.
-->
{#snippet renderControls(control: ControlSchema, basePath?: string, index?: number)}
  <!-- `absolute` opts a control out of rebasing: firstItemControls render
       inside an array row but write block-level props, so their paths are
       already complete. -->
  {@const prop = basePath != null && index != null && !control.absolute
    ? rebase(basePath, index, control.property)
    : control.property}

  {#if control.type === "segmentedbutton"}
    <SegmentedControl
      headingLabel={control.label}
      value={getValue(prop as string) || control.defaultValue}
    >
      {#each control.options || [] as option}
        <SegmentedButton
          value={resolveOptionValue(option)}
          onclick={() => prop && setValue(prop, resolveOptionValue(option))}
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
      hideLabel={control.hideLabel}
      placeholder={control.placeholder}
      description={control.description}
      value={getValue(prop as string) || control.defaultValue}
      oninput={(event: Event) => prop && setValue(prop, (event.target as HTMLInputElement).value)}
    />

  {:else if control.type === "number"}
    <Textfield
      type="number"
      label={control.label || ""}
      placeholder={control.placeholder}
      description={control.description}
      value={getValue(prop as string) || control.defaultValue}
      oninput={(event: Event) => prop && setValue(prop, (event.target as HTMLInputElement).value)}
    />

  {:else if control.type === "textarea"}
    <Textarea
      label={control.label}
      value={getValue(prop as string) || control.defaultValue}
      oninput={(event: Event) => prop && setValue(prop, (event.target as HTMLInputElement).value)}
    />

  {:else if control.type === "select"}
    <Select
      label={control.label}
      value={getValue(prop as string) || control.defaultValue}
      description={control.description}
      onchange={(event: Event) => prop && setValue(prop, (event.target as HTMLSelectElement).value)}
    >
      {#each control.options || [] as option}
        <option value={resolveOptionValue(option)}>{resolveOptionLabel(option)}</option>
      {/each}
    </Select>

  {:else if control.type === "colorpicker"}
    <ColorPicker
      label={control.label}
      value={getValue(prop as string) || control.defaultValue}
      onchange={(value) => prop && setValue(prop, value)}
    />

  {:else if control.type === "checkbox"}
    <Checkbox
      checked={getValue(prop as string) ?? control.defaultValue ?? false}
      onchange={(event: Event) => prop && setValue(prop, (event.target as HTMLInputElement).checked)}
    >
      {control.label}
    </Checkbox>

  {:else if control.type === "slider"}
    <Slider
      label={control.label ?? ""}
      value={toNumber(getValue(prop as string), control)}
      min={control.min}
      max={control.max}
      step={control.step}
      onchange={(value) => {
        if (!prop) return;
        const n = Array.isArray(value) ? value[0] : value;
        // When the control declares a unit, store a CSS string ("2rem");
        // otherwise store the raw number (e.g. heading gap in px).
        setValue(prop, control.unit ? `${trimZeros(n)}${control.unit}` : n);
      }}
    >
      {#snippet hint(v: number)}
        {trimZeros(v)}{control.unit ?? ""}
      {/snippet}
    </Slider>

  {:else if control.type === "spacing-field"}
    <SpacingField
      label={control.label}
      sides={control.sides}
      allowNegative={control.allowNegative}
      linkable={control.linkable}
      value={getValue(prop as string) || {}}
      onUpdate={(side, value) => prop && setValue(`${prop}.${side}`, value)}
    />

  {:else if control.type === "link-field"}
    <LinkField
      label={control.label}
      description={control.description}
      value={getValue(prop as string) || {}}
      onUpdate={(value) => prop && setValue(prop, value)}
    />

  {:else if control.type === "image-url-field"}
    <ImageUrlField
      label={control.label}
      placeholder={control.placeholder}
      description={control.description}
      value={getValue(prop as string) || ""}
      onUpdate={(value) => prop && setValue(prop, value)}
    />

  {:else if control.type === "labelled-card"}
    <!-- Handled here rather than only in the section loop so cards also work
         inside an ArrayField item, where basePath/index must propagate to the
         children. LabelledCard stacks its children; use a nested `group` to
         put controls side by side. -->
    <LabelledCard label={control.label}>
      {#each control.controls || [] as child}
        {@render renderControls(child, basePath, index)}
      {/each}
    </LabelledCard>

  {:else if control.type === "tabs"}
    <!-- In renderControls, not the section loop, so tabs also work nested and
         so basePath/index reach the tab's children. -->
    <Tabs>
      <TabList>
        {#each control.tabs || [] as tab}
          <Tab>{tab.label}</Tab>
        {/each}
      </TabList>
      {#each control.tabs || [] as tab}
        <TabPanel>
          <Group direction="vertical" gap="1rem">
            {#each tab.controls as tabControl}
              {@render renderControls(tabControl, basePath, index)}
            {/each}
          </Group>
        </TabPanel>
      {/each}
    </Tabs>

  {:else if control.type === "group"}
    <Group direction={control.direction ?? "horizontal"} gap={control.gap}>
      {#each control.controls || [] as child}
        {@render renderControls(child, basePath, index)}
      {/each}
    </Group>
  {/if}
{/snippet}

<div
  bind:this={ref}
  class="properties-panel"
  role="complementary"
  aria-label={title}
  aria-hidden={!isOpen}
  data-sidebar-panel
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
        <Icon><use href="#chevron-left" /></Icon>
      </Button>
    </div>
    <div class="properties-panel__label">
      {#if selectedComponent}
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
      {:else}
        {title}
      {/if}
    </div>
    {#if selectedComponent}
      <div class="properties-panel__options-button">
        <Button size="sm" variant="ghost" shape="rounded-square" bind:ref={optionsButtonRef}>
          <Icon><use href="#dots-horizontal" /></Icon>
        </Button>
      </div>
    {/if}
  </header>

  <div class="properties-panel__content">
    {#if isOpen && selectedComponent && schema}
      {#each schema.sections as section}
        <PropertiesPanelSection label={section.title} icon={section.icon} collapsed={section.collapsed}>
          {#each section.controls as control}
            {#if SIMPLE_CONTROLS.includes(control.type)}
              {@render renderControls(control)}

            {:else if control.type === "array-field"}
              <ArrayField
                label={control.label}
                addLabel={control.addLabel}
                itemLabel={control.itemLabel}
                max={control.max}
                min={control.min}
                itemFallback={control.itemFallback}
                items={appState.getArrayValue(control.property as string)}
                itemControls={control.item?.controls ?? []}
                firstItemControls={control.firstItemControls ?? []}
                onAdd={() => control.property && appState.addArrayItem(control.property, control.defaultItem ?? {})}
                onRemove={(i) => control.property && appState.removeArrayItem(control.property, i)}
                onMove={(i, dir) => control.property && appState.moveArrayItem(control.property, i, dir)}
              >
                {#snippet renderItemControl({ control: itemControl, index })}
                  {@render renderControls(itemControl, control.property, index)}
                {/snippet}
              </ArrayField>


            {/if}
          {/each}
        </PropertiesPanelSection>
      {/each}

    {:else if isOpen && selectedSection && sectionSchema}
      {#each sectionSchema.sections as section}
        <PropertiesPanelSection label={section.title} icon={section.icon} collapsed={section.collapsed}>
          {#each section.controls as control}
            {#if SIMPLE_CONTROLS.includes(control.type)}
              {@render renderControls(control)}
            {/if}
          {/each}
        </PropertiesPanelSection>
      {/each}
    {/if}
  </div>
</div>

{#if selectedComponent}
  <Menu anchor={optionsButtonRef}>
    <MenuItem onclick={() => editMode = true}>
      {#snippet leading()}<Icon size="16"><use href="#pencil-outline" /></Icon>{/snippet}
      Rename
    </MenuItem>
    <MenuItem onclick={handleDuplicate}>
      {#snippet leading()}<Icon size="16"><use href="#duplicate" /></Icon>{/snippet}
      Duplicate
    </MenuItem>
    <MenuItem onclick={handleDelete}>
      {#snippet leading()}<Icon size="16"><use href="#delete" /></Icon>{/snippet}
      Delete
    </MenuItem>
  </Menu>
{/if}

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

  .properties-panel__back-button { grid-area: back; }

  .properties-panel__label {
    grid-area: label;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding: .25rem;
  }

  .properties-panel__options-button { grid-area: options; }

  .properties-panel__content {
    padding-inline: 0.5rem;
    padding-block: 1rem;
    overflow-y: scroll;
    display: flex;
    flex-flow: column nowrap;
    gap: 0.5rem;
  }
</style>
