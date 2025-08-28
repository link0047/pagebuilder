<script lang="ts">
	import { createColorPickerState } from "./color-picker-state.svelte";

	type Props = {
		value?: string,
		label?: string,
		[key: string]: unknown;
	}
	
	let {
		label = "Color",
		value = $bindable("#000"),
		...restProps
	}: Props = $props();
	
	let colorState = createColorPickerState(value);

	$effect(() => {
		value = colorState.value;
	});
	
	const uid = colorState.id;
	const colorInputId = `${uid}-color`;
	const textInputId = `${uid}-text`;
</script>

<fieldset class="uikit-color-picker">
	<legend class="uikit-color-picker__legend">{label}</legend>
	<input 
		id={colorInputId}
		class="uikit-color-picker__input-color"
		type="color"
		bind:value={colorState.value}
	/>
	<input
		id={textInputId}
		class="uikit-color-picker__input-text"
		type="text"
		bind:value={colorState.value} 
		{...restProps} 
	/>
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
	}

	@layer states {
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
</style>