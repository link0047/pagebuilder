<script lang="ts">
  import type { Snippet } from "svelte";
  import type { Props as SplitButtonProps } from "./SplitButton.svelte";

  import SplitButton from "./SplitButton.svelte";
  import { EditableLabelState } from "./editablelabel-state.svelte";

  type Props = SplitButtonProps & {
    value?: string | undefined | null;
    editMode?: boolean;
    oncommit?: (value: string) => void;
    menuItems?: Snippet;
  };

  let {
    value = $bindable(""),
    editMode = $bindable(false),
    oncommit,
    menuItems,
    children,
    ...restProps
  }: Props = $props();

  const state = new EditableLabelState({
    getValue: () => value,
    setValue: (v) => (value = v),
    getEditMode: () => editMode,
    setEditMode: (v) => (editMode = v),
    oncommit: (v) => oncommit?.(v),
  });
</script>

<span id={state.liveRegionId} aria-live="polite" aria-atomic="true" class="visually-hidden">
  {state.announcement}
</span>
<span id={state.descriptionId} class="visually-hidden">{state.descriptionText}</span>

<SplitButton
  aria-describedby={state.descriptionId}
  onpointerdown={state.handlePointerdown}
  onclick={state.handleClick}
  menuHidden={state.isEditing}
  aria-disabled={state.isEditing || undefined}
  bind:ref={state.buttonRef}
  {menuItems}
  {...restProps}
>
  <span class="wcag-ui-edit-label" data-editing={state.isEditing || undefined}>
    <span
      class="wcag-ui-edit-label__text"
      id={state.inputId}
      aria-hidden={state.isEditing || undefined}
    >
      {value}
    </span>
    <input
      bind:this={state.inputRef}
      bind:value
      type="text"
      class="wcag-ui-edit-label__input"
      aria-labelledby={state.inputId}
      aria-hidden={state.isEditing ? undefined : true}
      tabindex={state.isEditing ? 0 : -1}
      onkeydown={state.handleKeydown}
      onblur={state.handleBlur}
    />
  </span>
</SplitButton>

<style>
  .visually-hidden {
    clip-path: inset(50%);
    height: 1px;
    width: 1px;
    margin: -1px;
    overflow: hidden;
    padding: 0;
    position: absolute;
    white-space: nowrap;
    border: 0;
  }

  .wcag-ui-edit-label__text {
    --wcag-ui-edit-label-color: transparent;
    --wcag-ui-edit-label-border-radius: .125rem;
    font-size: .875rem;
  }

  .wcag-ui-edit-label__input {
    position: absolute;
    inset: 0;
    pointer-events: none;
    opacity: 0;
    font-size: .875rem;
    z-index: -1;
    border: none;
    border-radius: var(--wcag-ui-edit-label-border-radius, 2px);
    outline-offset: 2px;
    outline: 2px solid var(--wcag-ui-edit-label-color, currentcolor);
    color: inherit;
    font-family: inherit;
    font-weight: inherit;
    text-align: inherit;
    padding: 0;
    margin: 0;
  }

  [data-editing] .wcag-ui-edit-label__text {
    opacity: 0;
  }

  [data-editing] .wcag-ui-edit-label__input {
    opacity: 1;
    pointer-events: unset;
    z-index: 1;
  }

  [data-editing] .wcag-ui-edit-label__input:focus {
    --wcag-ui-edit-label-color: #007acc;
  }
</style>
