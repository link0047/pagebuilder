<script lang="ts">
  import type { Snippet } from "svelte";

  type Props = {
    children?: Snippet,
    ref?: HTMLButtonElement
  }

  const NBSP = "\u00A0";

  let originalText = "";
  let isEditing = $state(false);

  let {
		children,
    ref = $bindable(),
	}: Props = $props();

  function makeEditable() {
    if (!ref) return;

		console.log("edit mode");
    originalText = ref.textContent || "";

    if (ref.textContent === NBSP) {
      ref.textContent = "";
    }

    ref.contentEditable = "true";
    ref.focus();
    isEditing = true;

    // Select all text so user can immediately start typing to replace it
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(ref);
    selection?.removeAllRanges();
    selection?.addRange(range);
  }

  function checkAndHandleEmptyState() {
    if (!ref) return;
    
    const content = ref.textContent || "";
    const isEmpty = content.trim() === "" || content === NBSP;
    
    if (isEmpty && content !== NBSP) {
      ref.textContent = NBSP;
    }
  }

  function handleBlur() {
    if (!ref) return;
    
    const currentText = ref.textContent || "";
    const trimmedText = currentText.trim();
    
    if (trimmedText === "" || currentText === NBSP) {
      ref.textContent = originalText;
    } else {
      ref.textContent = trimmedText; // Clean up whitespace
    }
    
    ref.contentEditable = "false";
    isEditing = false;
  }

  function handleInput() {
    checkAndHandleEmptyState();
	}

  function handleKeyDown(event: KeyboardEvent) {
    const { key } = event;

		if ((key === "Enter" || key === " ") && !isEditing) {
	    makeEditable();
	  } else if (key === "Enter" && isEditing) {
	    event.preventDefault();
	    ref?.blur();
	  } else if (key === "Escape" && isEditing) {
	    ref?.blur();
	  } else if (key === " " && isEditing) {
	    // Prevent space from triggering button click when editing
			event.preventDefault();

			if (originalText === ref?.textContent) return;
			
			const selection = window.getSelection();
	    if (selection && selection.rangeCount > 0) {
	      const range = selection.getRangeAt(0);
	      range.deleteContents();
	      range.insertNode(document.createTextNode(" "));
	      range.collapse(false); // Move cursor after the space

        checkAndHandleEmptyState();
	    }
	  }
  }
</script>

<button
  bind:this={ref}
	class="uikit-editable-heading"
  class:uikit-editable-heading--editing={isEditing}
	onclick={makeEditable}
	onkeydown={handleKeyDown}
  onblur={handleBlur}
  oninput={handleInput}
	aria-label="Panel title, press Enter or Space to edit"
>
	{@render children?.()}
</button>

<style>
  @layer variables, base, sizes, states;

  @layer variables {
    :root {
			--uikit-editable-heading-width: 100%;
			--uikit-editable-heading-height: 2.5rem;
			--uikit-editable-heading-padding-inline: .5rem;
			
      --uikit-editable-heading-font-size: 1rem;
      --uikit-editable-heading-font-weight: 500;
      --uikit-editable-heading-color: #212121;
      --uikit-editable-heading-letter-spacing: 0;
      --uikit-editable-heading-font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";

			--uikit-editable-heading-border-radius: .5rem;
			--uikit-editable-heading-border-width: 1px;
			--uikit-editable-heading-border-style: solid;
			--uikit-editable-heading-border-color: transparent;

			--uikit-editable-heading-bg-color: transparent;
			--uikit-editable-heading-hover-bg-color: transparent;
	    --uikit-editable-heading-hover-border-color: #adadad;

			--uikit-editable-heading-outline-color: #007acc;
	    --uikit-editable-heading-outline-style: solid;
	    --uikit-editable-heading-outline-width: 2px;
	    --uikit-editable-heading-outline-offset: 0;

			--uikit-editable-heading-transition-duration: 0.2s;
	    --uikit-editable-heading-transition-timing: cubic-bezier(0.4, 0, 0.2, 1);
    }
  }

  @layer base {
    .uikit-editable-heading {
			box-sizing: border-box;
			position: relative;
      display: inline-flex;
			align-items: center;
			justify-content: baseline;
			padding-inline: var(--uikit-editable-heading-padding-inline);
			appearance: none;
			line-height: 1;
			background-color: var(--uikit-editable-heading-bg-color);
	    touch-action: manipulation;
			width: var(--uikit-editable-heading-width);
			height: var(--uikit-editable-heading-height);
			font-family: var(--uikit-editable-heading-font-family);
			font-size: var(--uikit-editable-heading-font-size);
			font-weight: var(--uikit-editable-heading-font-weight);
			font-feature-settings: inherit;
	    font-variation-settings: inherit;
			letter-spacing: var(--uikit-editable-heading-letter-spacing);
			white-space: nowrap;
			color: var(--uikit-editable-heading-color);
			border: var(--uikit-editable-heading-border-width) var(--uikit-editable-heading-border-style) var(--uikit-editable-heading-border-color);
			border-radius: var(--uikit-editable-heading-border-radius);
			transition: background-color var(--uikit-editable-heading-transition-duration) var(--uikit-editable-heading-transition-timing), border-color var(--uikit-editable-heading-transition-duration) var(--uikit-editable-heading-transition-timing);
    }
  }

  @layer sizes {

  }

  @layer states {
    .uikit-editable-heading:disabled {
      cursor: not-allowed;
    }

    .uikit-editable-heading:not(:disabled):hover {
			background-color: var(--uikit-editable-heading-hover-bg-color);
			border-color: var(--uikit-editable-heading-hover-border-color);
			cursor: pointer;
    }

    .uikit-editable-heading:focus-visible {
      outline-offset: var(--uikit-editable-heading-outline-offset);
	    outline: var(--uikit-editable-heading-outline-width) var(--uikit-editable-heading-outline-style) var(--uikit-editable-heading-outline-color);
    }

    .uikit-editable-heading--editing {
      white-space: pre;
      cursor: text;
    }
  }
</style>