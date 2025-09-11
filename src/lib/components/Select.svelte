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
	const selectId = `uikit-select-${uid}`;
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
	class="uikit-select"
	class:uikit-select--error={error}
>
	{#if label}
		<label id={labelId} for={selectId} class="uikit-select__label">
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
		class="uikit-select__native-control"
		class:uikit-select--size-xs={size === "xs"}
		class:uikit-select--size-sm={size === "sm"}
		class:uikit-select--size-lg={size === "lg"}
		class:uikit-select--size-xl={size === "xl"}
		{...restProps}
	>
		{@render children?.()}
	</select>
	{#if description || error}
		<div id={messageId} class="uikit-select__message">
			{#if description}
				<div class="uikit-select__message--description">
					{description}
				</div>
			{/if}
			{#if error && errorMessage}
				<div class="uikit-select__message--error" aria-live="assertive" role="alert">
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
			--uikit-select-font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
			--uikit-select-font-size: 1rem;
			--uikit-select-font-weight: 400;
			--uikit-select-letter-spacing: 0.04em;
			--uikit-select-line-height: 1;
			
			/* Label */
			--uikit-select-label-font-size: 0.875rem;
			--uikit-select-label-color: inherit;
			
			/* Colors */
			--uikit-select-text-color: #212121;
			--uikit-select-background-color: #fff;
			--uikit-select-border-color: #989898;
			--uikit-select-border-color-hover: #000;
			--uikit-select-border-color-focus: #2451b2;
			--uikit-select-border-color-error: #dc2626;
			--uikit-select-icon-color: #212121;
			
			/* Layout */
			--uikit-select-gap: 0.5rem;
			--uikit-select-border-width: 1px;
			--uikit-select-border-radius: 0.25rem;
			--uikit-select-height: 2.5rem;
			--uikit-select-min-width: 5.5rem;
			--uikit-select-padding: 0.5rem;
			--uikit-select-outline-width: 1px;
			--uikit-select-outline-offset: 0;
			
			/* Message */
			--uikit-select-message-font-size: 0.875rem;
			--uikit-select-description-font-size: 0.75rem;
			--uikit-select-description-color: #6d6d6d;
			--uikit-select-error-color: #dc2626;
			
			/* Transitions */
			--uikit-select-transition-duration: 0.15s;
			--uikit-select-transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
			
			/* Icon */
			--uikit-select-icon-svg: url('data:image/svg+xml, <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="%23212121" viewBox="0 0 24 24"><path d="M12 18.17L8.83 15l-1.41 1.41L12 21l4.59-4.59L15.17 15M12 5.83L15.17 9l1.41-1.41L12 3 7.41 7.59 8.83 9 12 5.83z"/></svg>');
		}
	}
		
	@layer base {
		.uikit-select {
			position: relative;
			display: grid;
			gap: var(--uikit-select-gap);
			font-family: var(--uikit-select-font-family);
		}
		
		.uikit-select__label {
			font-size: var(--uikit-select-label-font-size);
			line-height: var(--uikit-select-line-height);
			color: var(--uikit-select-label-color);
		}
		
		.uikit-select__native-control {
			appearance: none;
	    color: var(--uikit-select-text-color);
	    font-size: var(--uikit-select-font-size);
	    font-weight: var(--uikit-select-font-weight);
	    letter-spacing: var(--uikit-select-letter-spacing);
			outline: var(--uikit-select-outline-width) solid transparent;
			outline-offset: var(--uikit-select-outline-offset);
			border: var(--uikit-select-border-width) solid var(--uikit-select-border-color);
	    border-radius: var(--uikit-select-border-radius);
	    background-color: var(--uikit-select-background-color);
	    height: var(--uikit-select-height);
	    width: 100%;
	    min-width: var(--uikit-select-min-width);
	    padding: var(--uikit-select-padding);
	    background-image: var(--uikit-select-icon-svg);
	    background-repeat: no-repeat;
	    background-position: right;
			transition: outline-color var(--uikit-select-transition-duration) var(--uikit-select-transition-timing-function);
		}

		.uikit-select__message {
			font-size: var(--uikit-select-message-font-size);
			line-height: var(--uikit-select-line-height);
		}

		.uikit-select__message--description {
			color: var(--uikit-select-description-color);
			font-size: var(--uikit-select-description-font-size);
		}
	}

	@layer size {
		.uikit-select--size-xs {
			--uikit-select-height: 2rem;
			--uikit-select-font-size: 0.75rem;
			--uikit-select-padding: 0.375rem;
		}
		
		.uikit-select--size-sm {
			--uikit-select-height: 2.25rem;
			--uikit-select-font-size: 0.875rem;
			--uikit-select-padding: 0.4375rem;
		}
		
		.uikit-select--size-lg {
			--uikit-select-height: 2.75rem;
			--uikit-select-font-size: 1.125rem;
			--uikit-select-padding: 0.625rem;
		}
		
		.uikit-select--size-xl {
			--uikit-select-height: 3rem;
			--uikit-select-font-size: 1.25rem;
			--uikit-select-padding: 0.75rem;
		}
	}
	
	@layer states {
		:is(.uikit-select__label, .uikit-select__message):empty {
			display: none;
		}

		.uikit-select__native-control:hover {
			outline-color: var(--uikit-select-border-color-hover);
		}
		
		.uikit-select__native-control:focus-visible {
			outline-color: var(--uikit-select-border-color-focus);
		}

		.uikit-select--error .uikit-select__native-control {
			border-color: var(--uikit-select-border-color-error);
		}
		
		.uikit-select__message--error {
			color: var(--uikit-select-error-color);
		}
	}
	
	@layer accessibility {
		@media (prefers-reduced-motion: reduce) {
			.uikit-select__native-control { 
				transition: none; 
			}
		}
	}
</style>