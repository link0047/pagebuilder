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
	@layer variables, base, states, accessibility;

	@layer variables {
		:root {
			
		}
	}
		
	@layer base {
		.uikit-select {
			position: relative;
			display: grid;
			gap: .5rem;
			font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
		}
		
		.uikit-select__label {
			font-size: .875rem;
			line-height: 1;
		}
		
		.uikit-select__native-control {
			appearance: none;
	    color: #212121;
	    font-size: 1rem;
	    font-weight: 400;
	    letter-spacing: 0.04em;
	    border: none;
			outline: 1px solid transparent;
			outline-offset: 0;
			border: 1px solid #989898;
	    border-radius: .25rem;
	    background-color: #fff;
	    height: 2.5rem;
	    width: 100%;
	    min-width: 5.5rem;
	    padding: .5rem;
	    background-image: url('data:image/svg+xml, <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="%23212121" viewBox="0 0 24 24"><path d="M12 18.17L8.83 15l-1.41 1.41L12 21l4.59-4.59L15.17 15M12 5.83L15.17 9l1.41-1.41L12 3 7.41 7.59 8.83 9 12 5.83z"/></svg>');
	    background-repeat: no-repeat;
	    background-position: right;
			transition: outline-color .15s cubic-bezier(0.4, 0, 0.2, 1);
		}

		.uikit-select__message {
			font-size: .875rem;
			line-height: 1;
		}

		.uikit-select__message--description {
			color: #6d6d6d;
			font-size: .75rem;
		}
	}
	
	@layer states {
		:is(.uikit-select__label, .uikit-select__message):empty {
			display: none;
		}

		.uikit-select__native-control:hover {
			outline-color: #000;
		}
		
		.uikit-select__native-control:focus-visible {
			outline-color: #2451b2;
		}

		.uikit-select--error .uikit-select__native-control {
			border-color: #dc2626;
		}
		
		.uikit-select__message--error {
			color: #dc2626;
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