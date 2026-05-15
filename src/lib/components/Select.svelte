<script lang="ts">
	import { type Snippet } from "svelte";
	import { generateId } from "$lib/utils/unique-id-generator";

	type Variant = "flat" | "outlined" | "filled";
	type LabelPosition = "above" | "left" | "inside" | "notched";
  type Size = "xs" | "small" | "sm" | "medium" | "md" | "large" | "lg" | "xl";

	type Props = {
		children?: Snippet;
		label?: string;
		labelPosition?: LabelPosition;
		description?: string;
		size?: Size;
		error?: boolean;
		errorMessage?: string;
		variant?: Variant;
		value?: string | number;
		ref?: HTMLSelectElement,
    [key: string]: unknown;
	};

	const uid = generateId("select");
	const selectId = `wcag-ui-select-${uid}`;
	const labelId = `${selectId}-label`;
  const messageId = `${selectId}-message`;

	let {
		children,
		label,
		labelPosition = "above",
		description,
		error,
		errorMessage,
		variant,
		size = "md",
		value = $bindable(),
		ref = $bindable(),
		...restProps
	}: Props = $props();
</script>

<div
	class="wcag-ui-select"
	class:wcag-ui-select--error={error}
>
	{#if label}
		<label id={labelId} for={selectId} class="wcag-ui-select__label">
			{label}
		</label>
	{/if}
	<select
		id={selectId}
		bind:this={ref}
		bind:value
		aria-labelledby={label ? labelId : null}
		aria-describedby={error && errorMessage ? messageId : null}
		aria-invalid={error ? "true" : "false"}
		class="wcag-ui-select__native-control"
		class:wcag-ui-select--size-xs={size === "xs"}
		class:wcag-ui-select--size-sm={size === "sm"}
		class:wcag-ui-select--size-lg={size === "lg"}
		class:wcag-ui-select--size-xl={size === "xl"}
		{...restProps}
	>
		{@render children?.()}
	</select>
	{#if description || error}
		<div id={messageId} class="wcag-ui-select__message">
			{#if description}
				<div class="wcag-ui-select__message--description">
					{description}
				</div>
			{/if}
			{#if error && errorMessage}
				<div class="wcag-ui-select__message--error" aria-live="assertive" role="alert">
					{errorMessage}
				</div>
			{/if}
		</div>
	{/if}
</div>

<style>
	@layer variables, base, size, states, accessibility;

	@layer variables {
		:root {
			/* Typography */
			--wcag-ui-select-font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
			--wcag-ui-select-font-size: 1rem;
			--wcag-ui-select-font-weight: 400;
			--wcag-ui-select-letter-spacing: 0.04em;
			--wcag-ui-select-line-height: 1;

			/* Label */
			--wcag-ui-select-label-font-size: 0.875rem;
			--wcag-ui-select-label-color: inherit;

			/* Colors */
			--wcag-ui-select-text-color: #212121;
			--wcag-ui-select-background-color: #fff;
			--wcag-ui-select-border-color: #989898;
			--wcag-ui-select-border-color-hover: #000;
			--wcag-ui-select-border-color-focus: #2451b2;
			--wcag-ui-select-border-color-error: #dc2626;
			--wcag-ui-select-icon-color: #212121;

			/* Layout */
			--wcag-ui-select-gap: 0.5rem;
			--wcag-ui-select-border-width: 1px;
			--wcag-ui-select-border-radius: 0.25rem;
			--wcag-ui-select-height: 2.5rem;
			--wcag-ui-select-min-width: 5.5rem;
			--wcag-ui-select-padding: 0.5rem;
			--wcag-ui-select-outline-width: 2px;
			--wcag-ui-select-outline-offset: -2px;

			/* Message */
			--wcag-ui-select-message-font-size: 0.875rem;
			--wcag-ui-select-description-font-size: 0.75rem;
			--wcag-ui-select-description-color: #6d6d6d;
			--wcag-ui-select-error-color: #dc2626;

			/* Transitions */
			--wcag-ui-select-transition-duration: 0.15s;
			--wcag-ui-select-transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);

			/* Icon */
			--wcag-ui-select-icon-svg: url('data:image/svg+xml, <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="%23212121" viewBox="0 0 24 24"><path d="M12 18.17L8.83 15l-1.41 1.41L12 21l4.59-4.59L15.17 15M12 5.83L15.17 9l1.41-1.41L12 3 7.41 7.59 8.83 9 12 5.83z"/></svg>');
		}
	}

	@layer base {
		.wcag-ui-select {
		  box-sizing: border-box;
			position: relative;
			display: grid;
			gap: var(--wcag-ui-select-gap);
			font-family: var(--wcag-ui-select-font-family);
		}

		.wcag-ui-select__label {
			font-size: var(--wcag-ui-select-label-font-size);
			line-height: var(--wcag-ui-select-line-height);
			color: var(--wcag-ui-select-label-color);
		}

		.wcag-ui-select__native-control {
			appearance: none;
	    color: var(--wcag-ui-select-text-color);
	    font-size: var(--wcag-ui-select-font-size);
	    font-weight: var(--wcag-ui-select-font-weight);
	    letter-spacing: var(--wcag-ui-select-letter-spacing);
					outline: var(--wcag-ui-select-outline-width) solid transparent;
					outline-offset: var(--wcag-ui-select-outline-offset);
					border: var(--wcag-ui-select-border-width) solid var(--wcag-ui-select-border-color);
	    border-radius: var(--wcag-ui-select-border-radius);
	    background-color: var(--wcag-ui-select-background-color);
	    height: var(--wcag-ui-select-height);
	    width: 100%;
	    min-width: var(--wcag-ui-select-min-width);
	    padding: var(--wcag-ui-select-padding);
	    background-image: var(--wcag-ui-select-icon-svg);
	    background-repeat: no-repeat;
	    background-position: right;
			transition: outline-color var(--wcag-ui-select-transition-duration) var(--wcag-ui-select-transition-timing-function);
		}

		.wcag-ui-select__message {
			font-size: var(--wcag-ui-select-message-font-size);
			line-height: var(--wcag-ui-select-line-height);
		}

		.wcag-ui-select__message--description {
			color: var(--wcag-ui-select-description-color);
			font-size: var(--wcag-ui-select-description-font-size);
		}
	}

	@layer size {
		.wcag-ui-select--size-xs {
		--wcag-ui-select-height: 2rem;
		--wcag-ui-select-font-size: 0.75rem;
		--wcag-ui-select-padding: 0.375rem;
		}

		.wcag-ui-select--size-sm {
			--wcag-ui-select-height: 2.25rem;
			--wcag-ui-select-font-size: 0.875rem;
			--wcag-ui-select-padding: 0.4375rem;
		}

		.wcag-ui-select--size-lg {
			--wcag-ui-select-height: 2.75rem;
			--wcag-ui-select-font-size: 1.125rem;
			--wcag-ui-select-padding: 0.625rem;
		}

		.wcag-ui-select--size-xl {
			--wcag-ui-select-height: 3rem;
			--wcag-ui-select-font-size: 1.25rem;
			--wcag-ui-select-padding: 0.75rem;
		}
	}

	@layer states {
		:is(.wcag-ui-select__label, .wcag-ui-select__message):empty {
			display: none;
		}

		.wcag-ui-select__native-control:hover {
			outline-color: var(--wcag-ui-select-border-color-hover);
		}

		.wcag-ui-select__native-control:focus-visible {
			outline-color: var(--wcag-ui-select-border-color-focus);
		}

		.wcag-ui-select--error .wcag-ui-select__native-control {
			border-color: var(--wcag-ui-select-border-color-error);
		}

		.wcag-ui-select__message--error {
			color: var(--wcag-ui-select-error-color);
		}
	}

	@layer accessibility {
		@media (prefers-reduced-motion: reduce) {
			.wcag-ui-select__native-control {
				transition: none;
			}
		}
	}
</style>
