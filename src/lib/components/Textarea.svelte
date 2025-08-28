<script lang="ts">
  import { generateId }	from "$lib/utils/unique-id-generator";

	type Resize = "none" | "vertical" | "horizontal" | "both";
  type Variant = "flat" | "outlined" | "filled";

  type Props = {
    label?: string;
    variant?: Variant;
    error?: boolean;
    errorMessage?: string;
		resize?: Resize;
    ref?: HTMLTextAreaElement;
    value?: string;
    [key: string]: unknown;
  };

  const uid = generateId("textarea");
	const textareaId = `uikit-textarea-${uid}`;
	const labelId = `${textareaId}-label`;
  const messageId = `${textareaId}-message`;

  let {
    label,
    variant = "outlined",
    error = $bindable(false),
    errorMessage,
		resize = "none",
    ref = $bindable(),
    value = $bindable(), 
		...restProps
  }: Props = $props();
</script>

<div 
	class="uikit-textarea"
	class:uikit-textarea--error={error}
>
  {#if label}
    <label id={labelId} class="uikit-textarea__label" for={textareaId}>{label}</label>
  {/if}
  <textarea 
    bind:this={ref}
    id={textareaId}
    class="uikit-textarea__native-control"
    {value}
    data-resize={resize}
    {...restProps}
  ></textarea>
  <div id={messageId} class="uikit-textarea__message" aria-live="assertive" role="alert">
    {#if error && errorMessage}
      <div class="uikit-textarea__message--error">{errorMessage}</div>
    {/if}
  </div>
</div>

<style>
	@layer variables, base, states, accessibility;
	
	@layer variables {
		:root {
			/* Layout */
			--uikit-textarea-gap: .5rem;
			--uikit-textarea-width: calc(100% - 1rem);
			--uikit-textarea-margin: .5rem;
			--uikit-textarea-padding-inline: .25rem;
			--uikit-textarea-padding-block: .25rem;
			--uikit-textarea-border-radius: .25rem;
			
			/* Typography */
			--uikit-textarea-font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
			--uikit-textarea-label-font-size: .875rem;
			--uikit-textarea-label-line-height: 1;
			--uikit-textarea-message-font-size: .875rem;
			--uikit-textarea-message-line-height: 1.6;
			
			/* Colors */
			--uikit-textarea-text-color: #212121;
			--uikit-textarea-outline-color: #989898;
			--uikit-textarea-outline-color-hover: #000;
			--uikit-textarea-outline-color-focus: #2451b2;
			--uikit-textarea-error-color: #dc2626;
			
			/* Border/Outline */
			--uikit-textarea-outline-width: 2px;
			--uikit-textarea-outline-offset: .5rem;
			--uikit-textarea-outline-style: solid;
			
			/* Animation */
			--uikit-textarea-transition-duration: .15s;
			--uikit-textarea-transition-timing: cubic-bezier(0.4, 0, 0.2, 1);
		}	
	}
	
	@layer base {
		.uikit-textarea {
			position: relative;
			display: grid;
			gap: var(--uikit-textarea-gap);
			font-family: var(--uikit-textarea-font-family);
		}
	
		.uikit-textarea__label {
			line-height: var(--uikit-textarea-label-line-height);
			font-size: var(--uikit-textarea-label-font-size);
		}
		
		.uikit-textarea__native-control {
			box-sizing: border-box;
			width: var(--uikit-textarea-width);
			border: none;
			outline: var(--uikit-textarea-outline-width) var(--uikit-textarea-outline-style) var(--uikit-textarea-outline-color);
			outline-offset: var(--uikit-textarea-outline-offset);
			border-radius: var(--uikit-textarea-border-radius);
			padding-inline: var(--uikit-textarea-padding-inline);
			padding-block: var(--uikit-textarea-padding-block);
			margin: var(--uikit-textarea-margin);
			resize: none;
			color: var(--uikit-textarea-text-color);
			transition: outline-color var(--uikit-textarea-transition-duration) var(--uikit-textarea-transition-timing);
		}
		
		.uikit-textarea__message {
			font-size: var(--uikit-textarea-message-font-size);
			line-height: var(--uikit-textarea-message-line-height);
		}
		
		.uikit-textarea__message--error {
			color: var(--uikit-textarea-error-color);
		}

		.uikit-textarea__native-control[data-resize="vertical"] {
			resize: vertical;
		}
		
		.uikit-textarea__native-control[data-resize="horizontal"] {
			resize: horizontal;
		}
		
		.uikit-textarea__native-control[data-resize="both"] {
			resize: both;
		}
	}
	
	@layer states {		
		.uikit-textarea__native-control:hover {
			outline-color: var(--uikit-textarea-outline-color-hover);
		}
		
		.uikit-textarea__native-control:focus-visible {
			outline-color: var(--uikit-textarea-outline-color-focus);
		}

		.uikit-textarea--error :is(.uikit-textarea__native-control, .uikit-textarea__label) {
			outline-color: var(--uikit-textarea-error-color);
			color: var(--uikit-textarea-error-color);
		}
	}
	
	@layer accessibility {
		@media (prefers-reduced-motion: reduce) {
			.uikit-textarea__native-control { 
				transition: none; 
			}
		}
	}
</style>