<script lang="ts">
  import { tick } from "svelte";
  import type { Snippet } from "svelte";
  import SplitButton from "./SplitButton.svelte";
  import type { Props as SplitButtonProps } from "./SplitButton.svelte";

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
  let inputRef: HTMLInputElement | undefined;
  let buttonRef: HTMLButtonElement | undefined = $state();
  let isEditing = $state(false);
	let snapshot = "";

  async function handlePointerdown(event: PointerEvent) {
    event.preventDefault();
		snapshot = value;
    isEditing = true;
    await tick();
    inputRef?.focus();
    inputRef?.select();
  }

  function commitEdit() {
    if (!value.trim()) value = snapshot;
    isEditing = false;
    editMode = false;
    oncommit?.(value);
    buttonRef?.focus();
  }

  function handleBlur() {
    commitEdit();
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === "Enter") {
      commitEdit();
    }
    if (event.key === "Escape") {
      isEditing = false;
      inputRef?.blur();
      buttonRef?.focus();
    }
  }

  $effect(() => {
    if (editMode) {
      isEditing = true;
      tick().then(() => {
        inputRef?.focus();
        inputRef?.select();
      });
    }
  });
</script>

<span id={descriptionId} class="visually-hidden">click to edit</span>
<SplitButton
  aria-describedby={descriptionId}
  onpointerdown={handlePointerdown}
  menuHidden={isEditing}
  disabled={isEditing || undefined}
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
