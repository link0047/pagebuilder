<script lang="ts">
  import type { Snippet } from "svelte";
  import type { Props as SplitButtonProps } from "./SplitButton.svelte";

  import { tick } from "svelte";
  import SplitButton from "./SplitButton.svelte";

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

  let inputId = crypto.randomUUID();
  let descriptionId = crypto.randomUUID();
  let liveRegionId = crypto.randomUUID();
  let inputRef: HTMLInputElement | undefined;
  let buttonRef: HTMLButtonElement | undefined = $state();
  let isEditing = $state(false);
  let snapshot = "";
  // Flag to suppress commitEdit when Escape cancels
  let cancelling = false;
  let announcement = $state("");

  async function startEditing() {
    snapshot = value ?? "";
    cancelling = false;
    isEditing = true;
    await tick();
    inputRef?.focus();
    inputRef?.select();
  }

  function handlePointerdown(event: PointerEvent) {
    // Only handle real pointer events; keyboard-triggered clicks have pointerType ""
    if (event.pointerType !== "") {
      event.preventDefault();
      startEditing();
    }
  }

  function handleClick(event: MouseEvent) {
    // Keyboard-activated clicks have no pointer coordinates (detail === 0 for Space,
    // or we can rely on pointerdown having already handled real pointer events)
    if (!isEditing && (event.detail === 0 || (event as PointerEvent).pointerType === "")) {
      startEditing();
    }
  }

  function commitEdit() {
    if (cancelling) return;
    if (typeof value === "string" && !value.trim()) value = snapshot;
    isEditing = false;
    editMode = false;
    oncommit?.(value ?? "");
    announcement = `Label updated to ${value}`;
    buttonRef?.focus();
  }

  function cancelEdit() {
    cancelling = true;
    value = snapshot;
    isEditing = false;
    editMode = false;
    announcement = "Edit cancelled";
    buttonRef?.focus();
  }

  function handleBlur() {
    if (!cancelling) {
      commitEdit();
    }
    cancelling = false;
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === "Enter") {
      event.preventDefault();
      commitEdit();
    }
    if (event.key === "Escape") {
      event.preventDefault();
      cancelEdit();
    }
  }

  $effect(() => {
    if (editMode) {
      startEditing();
    }
  });

  // Derive the description text so it updates when editing state changes
  let descriptionText = $derived(isEditing ? "Press Enter to confirm, Escape to cancel" : "Press to edit");
</script>

<span id={liveRegionId} aria-live="polite" aria-atomic="true" class="visually-hidden">
  {announcement}
</span>
<span id={descriptionId} class="visually-hidden">{descriptionText}</span>

<SplitButton
  aria-describedby={descriptionId}
  onpointerdown={handlePointerdown}
  onclick={handleClick}
  menuHidden={isEditing}
  aria-disabled={isEditing || undefined}
  bind:ref={buttonRef}
  {menuItems}
  {...restProps}
>
  <span class="wcag-ui-edit-label" data-editing={isEditing || undefined}>
    <span
      class="wcag-ui-edit-label__text"
      id={inputId}
      aria-hidden={isEditing || undefined}
    >
      {value}
    </span>
    <input
      bind:this={inputRef}
      bind:value
      type="text"
      class="wcag-ui-edit-label__input"
      aria-labelledby={inputId}
      aria-hidden={isEditing ? undefined : true}
      tabindex={isEditing ? 0 : -1}
      onkeydown={handleKeydown}
      onblur={handleBlur}
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
