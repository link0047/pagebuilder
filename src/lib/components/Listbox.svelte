<script lang="ts">
	import { type Snippet, getContext, setContext } from "svelte";
	import { generateId } from "$lib/utils/unique-id-generator";

	type Props = {
		label?: string;
		hideLabel?: boolean;
		children?: Snippet;
		[key: string]: unknown;
	};

	let {
		label,
		hideLabel = false,
		children,
		ref = $bindable(),
		...restProps
	}: Props = $props();

	const comboboxCtx = getContext("combobox");
	const uid = generateId("listbox");
	const id = `wcag-ui-listbox-${uid}`;
	const labelId = `${id}-label`;
	const isOverlay = $derived(restProps.popover !== undefined);

	let optionCounter = 0;
	let headingCounter = -1;
	let registeredOptions: string[] = $state([]);
	let activeIndex = $state(-1);

	setContext("listbox-id", id);
	setContext("option-counter", () => optionCounter++);
	setContext("heading-counter", {
		get count() { return headingCounter; },
	  increment: () => ++headingCounter
	});

	setContext("register-option", (optionId: string) => {
		registeredOptions.push(optionId);
		return () => {
      // cleanup on destroy
      registeredOptions = registeredOptions.filter(id => id !== optionId);
    };
	});

	setContext("active-option-id", {
    get current() { return registeredOptions[activeIndex] ?? null; }
  });

	setContext("set-active-id", (id: string) => {
    const index = registeredOptions.indexOf(id);

    if (index !== -1) {
      activeIndex = index;
    }
	});

	function focusNext() {
		activeIndex = activeIndex < registeredOptions.length - 1
			? activeIndex + 1
			: 0;
	}

	function focusPrev() {
		activeIndex = activeIndex > 0
      ? activeIndex - 1
      : registeredOptions.length - 1;
	}

	function focusFirst() {
		activeIndex = 0;
	}

	function focusLast() {
		activeIndex = registeredOptions.length - 1;
	}

	function reset() {
		activeIndex = -1;
	}

	function listboxAction(listbox: HTMLElement) {
		const controller = new AbortController();

		listbox.addEventListener("keyup", (event: KeyboardEvent) => {
		  event.preventDefault();
      switch (event.key) {
        case "ArrowDown": focusNext();  break;
        case "ArrowUp":   focusPrev();  break;
        case "Home":      focusFirst(); break;
        case "End":       focusLast();  break;
        case "Escape":    reset();      break;
      }
		}, { signal: controller.signal });

	  return () => {
		  controller.abort();
		}
	}

	if (comboboxCtx) {
    $effect(() => {
      const key = comboboxCtx.activeKey;
      if (!key) return;

      switch (key) {
        case "ArrowDown": focusNext();  break;
        case "ArrowUp":   focusPrev();  break;
        case "Home":      focusFirst(); break;
        case "End":       focusLast();  break;
        case "Escape":    reset();      break;
      }

      // Write active id back up to combobox
      comboboxCtx.activeDescendant = registeredOptions[activeIndex] ?? null;
      comboboxCtx.activeKey = null; // consume the key
    });
  }
</script>

{#if label}
	<span
		id={labelId}
		class="wcag-ui-listbox-label"
		class:visually-hidden={hideLabel}
	>
		{label}
	</span>
{/if}

<div
	bind:this={ref}
	class="wcag-ui-listbox"
	class:wcag-ui-listbox--overlay={isOverlay}
	role="listbox"
	tabindex={comboboxCtx ? null : 0}
	aria-labelledby={label ? labelId : null}
	aria-activedescendant={comboboxCtx ? null : registeredOptions[activeIndex]}
	{@attach comboboxCtx ? null : listboxAction}
	{...restProps}
>
	{@render children?.()}
</div>

<style>
	.wcag-ui-listbox {
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
	}

	.wcag-ui-listbox--overlay {
		background: #fff;
	  border-radius: .75rem;
	  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
		max-height: 60vh;
	  overflow-y: auto;
		will-change: transform;
	}

	.visually-hidden {
	  border: 0;
	  clip-path: inset(50%);
	  height: 1px;
	  margin: 0;
	  overflow: hidden;
	  position: absolute;
	  white-space: nowrap;
	  width: 1px;
	}

	.wcag-ui-listbox--overlay[popover] {
		opacity: 0;
		pointer-events: none;
		visibility: hidden;
		transition:
			opacity 0.25s ease-out,
			pointer-events 0s,
			display 0.25s ease-out allow-discrete,
			overlay 0.25s ease-out allow-discrete;
	}

	.wcag-ui-listbox--overlay[popover]:popover-open {
		opacity: 1;
		pointer-events: auto;
		visibility: visible;
	}

	@starting-style {
		.wcag-ui-listbox--overlay[popover]:popover-open {
			opacity: 0;
			visibility: hidden;
		}
	}
</style>
