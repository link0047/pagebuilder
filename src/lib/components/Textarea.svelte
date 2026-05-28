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
	const textareaId = `wcag-ui-textarea-${uid}`;
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
	class="wcag-ui-textarea"
	class:wcag-ui-textarea--error={error}
>
  {#if label}
    <label id={labelId} class="wcag-ui-textarea__label" for={textareaId}>{label}</label>
  {/if}
  <textarea
    bind:this={ref}
    id={textareaId}
    class="wcag-ui-textarea__native-control"
    {value}
    data-resize={resize}
    {...restProps}
  ></textarea>
  <div id={messageId} class="wcag-ui-textarea__message" aria-live="assertive" role="alert">
    {#if error && errorMessage}
      <div class="wcag-ui-textarea__message--error">{errorMessage}</div>
    {/if}
  </div>
</div>

<style>
	@layer variables, base, states, accessibility;

	@layer variables {
		:root {
			/* Layout */
			--wcag-ui-textarea-gap: .5rem;
			--wcag-ui-textarea-width: calc(100% - var(--wcag-ui-textarea-margin) * 2 - var(--wcag-ui-textarea-padding-inline) * 2);
			--wcag-ui-textarea-margin: .5rem;
			--wcag-ui-textarea-padding-inline: .25rem;
			--wcag-ui-textarea-padding-block: .25rem;
			--wcag-ui-textarea-border-radius: .25rem;

			/* Typography */
			--wcag-ui-textarea-font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
			--wcag-ui-textarea-label-font-size: .875rem;
			--wcag-ui-textarea-label-line-height: 1;
			--wcag-ui-textarea-message-font-size: .875rem;
			--wcag-ui-textarea-message-line-height: 1.6;

			/* Colors */
			--wcag-ui-textarea-text-color: #212121;
			--wcag-ui-textarea-outline-color: #989898;
			--wcag-ui-textarea-outline-color-hover: #000;
			--wcag-ui-textarea-outline-color-focus: #2451b2;
			--wcag-ui-textarea-error-color: #dc2626;

			/* Border/Outline */
			--wcag-ui-textarea-outline-width: 2px;
			--wcag-ui-textarea-outline-offset: .25rem;
			--wcag-ui-textarea-outline-style: solid;

			/* Animation */
			--wcag-ui-textarea-transition-duration: .15s;
			--wcag-ui-textarea-transition-timing: cubic-bezier(0.4, 0, 0.2, 1);
		}
	}

	@layer base {
		.wcag-ui-textarea {
			position: relative;
			display: grid;
			gap: var(--wcag-ui-textarea-gap);
			font-family: var(--wcag-ui-textarea-font-family);
		}

		.wcag-ui-textarea__label {
			line-height: var(--wcag-ui-textarea-label-line-height);
			font-size: var(--wcag-ui-textarea-label-font-size);
		}

		.wcag-ui-textarea__native-control {
			box-sizing: border-box;
			width: var(--wcag-ui-textarea-width);
			border: none;
			outline: var(--wcag-ui-textarea-outline-width) var(--wcag-ui-textarea-outline-style) var(--wcag-ui-textarea-outline-color);
			outline-offset: var(--wcag-ui-textarea-outline-offset);
			border-radius: var(--wcag-ui-textarea-border-radius);
			padding-inline: var(--wcag-ui-textarea-padding-inline);
			padding-block: var(--wcag-ui-textarea-padding-block);
			margin: var(--wcag-ui-textarea-margin);
			resize: none;
			color: var(--wcag-ui-textarea-text-color);
			transition: outline-color var(--wcag-ui-textarea-transition-duration) var(--wcag-ui-textarea-transition-timing);
		}

		.wcag-ui-textarea__message {
			font-size: var(--wcag-ui-textarea-message-font-size);
			line-height: var(--wcag-ui-textarea-message-line-height);
		}

		.wcag-ui-textarea__message--error {
			color: var(--wcag-ui-textarea-error-color);
		}

		.wcag-ui-textarea__native-control[data-resize="vertical"] {
			resize: vertical;
		}

		.wcag-ui-textarea__native-control[data-resize="horizontal"] {
			resize: horizontal;
		}

		.wcag-ui-textarea__native-control[data-resize="both"] {
			resize: both;
		}
	}

	@layer states {
		.wcag-ui-textarea__native-control:hover {
		outline-color: var(--wcag-ui-textarea-outline-color-hover);
		}

		.wcag-ui-textarea__native-control:focus-visible {
			outline-color: var(--wcag-ui-textarea-outline-color-focus);
		}

		.wcag-ui-textarea--error :is(.wcag-ui-textarea__native-control, .wcag-ui-textarea__label) {
			outline-color: var(--wcag-ui-textarea-error-color);
			color: var(--wcag-ui-textarea-error-color);
		}
	}

	@layer accessibility {
		@media (prefers-reduced-motion: reduce) {
			.wcag-ui-textarea__native-control {
				transition: none;
			}
		}
	}
</style>
