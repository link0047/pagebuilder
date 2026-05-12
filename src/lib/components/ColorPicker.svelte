<script lang="ts">
	import { createColorPickerState, ColorPickerState } from "./color-picker-state.svelte";

	export type ColorPickerProps = {
		value?: string;
		label?: string;
		onchange?: (value: string) => void;
		[key: string]: unknown;
	}

	type ValidationState =
		| "pristine"           // Never touched
		| "focused"            // Focused but no changes yet
		| "editing"            // Actively typing
		| "validating";        // Blurred after changes, now validating on input

	const MAX_HEX_LENGTH = 7;
	const DEFAULT_HEX_VALUE = "#000000";

	let {
		value = $bindable(DEFAULT_HEX_VALUE),
		label = "Color",
		onchange,
		...restProps
	}: ColorPickerProps = $props();

	let colorState = createColorPickerState(
		() => value,
		(newValue) => value = newValue
	);

	let isValid = $state(true);
	let validationState = $state<ValidationState>("pristine");

	function handleColorInput(event: Event & { currentTarget: HTMLInputElement }) {
		const newValue = event.currentTarget.value;
		colorState.value = newValue;
		isValid = true;
		onchange?.(newValue);
	}

	function handleTextInput(event: Event & { currentTarget: HTMLInputElement }) {
		const inputValue = event.currentTarget.value;

		if (validationState === "focused") {
			validationState = "editing";
		}

		switch (validationState) {
			case "editing":
				colorState.value = inputValue;

				if (inputValue && colorState.isValidHex(inputValue)) {
					onchange?.(colorState.value);
				}
				break;

			case "validating":
				if (inputValue === "") {
					isValid = true;
					colorState.value = inputValue;
				} else {
					isValid = colorState.isValidHex(inputValue);
					colorState.value = inputValue;

					if (isValid) {
						onchange?.(colorState.value);
					}
				}
				break;
		}
	}

	function handleTextFocus() {
		if (validationState === "pristine") {
			validationState = "focused";
		}
	}

	function handleTextBlur() {
		if (validationState === "editing") {
			validationState = "validating";

			const inputValue = colorState.value;

			if (inputValue === "") {
				isValid = true;
			} else {
				isValid = colorState.isValidHex(inputValue);
			}
		}
	}
</script>

<fieldset
  class="uikit-color-picker"
  class:uikit-color-picker--invalid={!isValid && validationState === "validating"}
>
	<legend class="uikit-color-picker__legend">{label}</legend>
	<div class="visually-hidden" role="status" aria-live="polite" aria-atomic="true">
		Selected color: {colorState.value}
	</div>
	<label for={colorState.colorId} class="visually-hidden">Color swatch</label>
	<input
		data-testid="color-picker-swatch"
		id={colorState.colorId}
		class="uikit-color-picker__input-color"
		type="color"
		value={colorState.normalizedHex}
		oninput={handleColorInput}
	/>
	<label for={colorState.textId} class="visually-hidden">Hex value</label>
	<input
		data-testid="color-picker-text-input"
		id={colorState.textId}
		class="uikit-color-picker__input-text"
		type="text"
		value={colorState.value}
		onfocus={handleTextFocus}
		oninput={handleTextInput}
		onblur={handleTextBlur}
		maxlength={MAX_HEX_LENGTH}
		pattern={ColorPickerState.HEX_PATTERN.source}
		aria-invalid={!isValid}
		aria-describedby={isValid ? undefined : colorState.errorId}
		spellcheck="false"
		autocomplete="off"
		placeholder={DEFAULT_HEX_VALUE}
		{...restProps}
	/>
	{#if !isValid && validationState === "validating"}
		<span id={colorState.errorId} class="uikit-color-picker__message-error" role="alert">
			Please enter a valid hex color (e.g., #000 or #000000)
		</span>
	{/if}
</fieldset>

<style>
	@layer variables, base, states, accessibility;

	@layer variables {
		:root {
			--uikit-color-picker-border-color: transparent;
			--uikit-color-picker-border-width: 0;
			--uikit-color-picker-border-radius: .5rem;
			--uikit-color-picker-padding: 0;
			--uikit-color-picker-gap: .5rem;
			--uikit-color-picker-font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";

			--uikit-color-picker-legend-font-size: .875rem;
			--uikit-color-picker-legend-line-height: 1;
			--uikit-color-picker-legend-color: inherit;

			--uikit-color-picker-input-border-color: #989898;
			--uikit-color-picker-input-border-width: 1px;
			--uikit-color-picker-input-border-radius: .25rem;
			--uikit-color-picker-input-outline-width: 2px;
			--uikit-color-picker-input-outline-offset: -2px;
			--uikit-color-picker-input-transition-duration: 0.2s;
	    --uikit-color-picker-input-transition-timing: cubic-bezier(0.4, 0, 0.2, 1);

			--uikit-color-picker-input-color-size: 2.5rem;
			--uikit-color-picker-input-color-background: transparent;

			--uikit-color-picker-input-text-font-size: 1rem;
			--uikit-color-picker-input-text-font-weight: 400;
			--uikit-color-picker-input-text-line-height: 1;
			--uikit-color-picker-input-text-padding-inline: .5rem;
			--uikit-color-picker-input-text-color: #212121;

			--uikit-color-picker-focus-outline-color: #2451b2;
			--uikit-color-picker-hover-outline-color: #000;

			--uikit-color-picker-error-color: #d32f2f;
		}
	}

	@layer base {
		.uikit-color-picker {
			box-sizing: border-box;
			border: var(--uikit-color-picker-border-width) solid var(--uikit-color-picker-border-color);
			border-radius: var(--uikit-color-picker-border-radius);
			padding: var(--uikit-color-picker-padding);
			margin: 0;
			display: grid;
			grid-template-areas:
				"legend legend"
				"color text";
			grid-template-columns: auto 1fr;
			row-gap: var(--uikit-color-picker-gap);
			column-gap: var(--uikit-color-picker-gap);
			font-family: var(--uikit-color-picker-font-family);
		}

		.uikit-color-picker__legend {
			grid-area: legend;
			line-height: 1;
			float: left;
			font-size: var(--uikit-color-picker-legend-font-size);
			color: var(--uikit-color-picker-legend-color);
		}

		:is(.uikit-color-picker__input-color, .uikit-color-picker__input-text) {
			box-sizing: border-box;
			appearance: none;
			line-height: 1;
			border: var(--uikit-color-picker-input-border-width) solid var(--uikit-color-picker-input-border-color);
			border-radius: var(--uikit-color-picker-input-border-radius);
			outline: var(--uikit-color-picker-input-outline-width) solid transparent;
			outline-offset: var(--uikit-color-picker-input-outline-offset);
			transition: outline-color var(--uikit-color-picker-input-transition-duration) var(--uikit-color-picker-input-transition-timing);
		}

		.uikit-color-picker__input-color {
			grid-area: color;
			padding: 0;
			width: var(--uikit-color-picker-input-color-size);
			height: var(--uikit-color-picker-input-color-size);
			aspect-ratio: 1 / 1;
			cursor: pointer;
			background-color: var(--uikit-color-picker-input-color-background);
		}

		.uikit-color-picker__input-color::-webkit-color-swatch {
		  width: var(--uikit-color-picker-input-color-size);
		  height: var(--uikit-color-picker-input-color-size);
		  border: none;
		}

		.uikit-color-picker__input-color::-webkit-color-swatch-wrapper {
		  padding: 0;
		  border: none;
		  background: none;
		}

		/* Firefox */
		.uikit-color-picker__input-color::-moz-color-swatch {
		  width: var(--uikit-color-picker-input-color-size);
		  height: var(--uikit-color-picker-input-color-size);
		  border: none;
		}

		.uikit-color-picker__input-color::-moz-focus-inner {
		  padding: 0;
		  border: none;
			background: none;
		}

		.uikit-color-picker__input-text {
			grid-area: text;
			font-size: var(--uikit-color-picker-input-text-font-size);
			font-weight: var(--uikit-color-picker-input-text-font-weight);
			padding-inline: var(--uikit-color-picker-input-text-padding-inline);
			color: var(--uikit-color-picker-input-text-color);
		}

		.uikit-color-picker__message-error {
			grid-area: error;
			font-size: 0.875rem;
			color: var(--uikit-color-picker-error-color);
			line-height: 1;
		}
	}

	@layer states {
		.uikit-color-picker--invalid {
		grid-template-areas:
			"legend legend"
			"color text"
			"error error";
		}

		:is(.uikit-color-picker__input-color, .uikit-color-picker__input-text):focus-visible {
			outline-color: var(--uikit-color-picker-focus-outline-color);
		}

		:is(.uikit-color-picker__input-color, .uikit-color-picker__input-text):hover {
			outline-color: var(--uikit-color-picker-hover-outline-color);
		}
	}

	@layer accessibility {
		@media (prefers-reduced-motion: reduce) {
			.uikit-color-picker__input-color, .uikit-color-picker__input-text {
				transition: none;
			}
		}

		@media (prefers-contrast: high) {
			.uikit-color-picker__input-color, .uikit-color-picker__input-text {
				border-width: 2px;
			}
		}
	}

	.visually-hidden {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border-width: 0;
	}
</style>
