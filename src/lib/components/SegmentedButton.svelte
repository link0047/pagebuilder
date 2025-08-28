<script lang="ts">
	import { type Snippet, onMount, onDestroy, getContext } from "svelte";
	import { getSegmentedControlState } from "./segmentedcontrol-state.svelte";

	type Variant = "default" | "filled" | "outlined" | "ghost" | "tabs" | "flush";
	type Color = "primary" | "secondary" | "success" | "danger" | "warning" | "info" | "default"
	type Size = "xs" | "small" | "sm" | "medium" | "md" | "large" | "lg" | "xl";
	type Shape = "default" | "square" | "pill";
	
	type Props = {
    ref?: HTMLButtonElement
		children?: Snippet,
		variant?: Variant,
		size?: Size,
		color?: Color,
		shape?: Shape,
		value?: string | number,
		onclick?: (event: MouseEvent) => void,
		[key: string]: unknown;
	};

	const controlState = getSegmentedControlState();
	const styleContext = getContext("segmented-style") || {};
	
	let {
		ref = $bindable(),
		children,
		variant,
		size,
		color,
		shape,
		value,
		onclick,
		...restProps
	}: Props = $props();

	const finalVariant = $derived(variant ?? styleContext.variant);
	const finalSize = $derived(size ?? styleContext.size);
	const finalColor = $derived(color ?? styleContext.color);
	const finalShape = $derived(shape ?? styleContext.shape);

	let buttonIndex = $state(-1);

	function handleClick(event: MouseEvent) {
		controlState.selectButton(buttonIndex);
		onclick?.(event);
	}

	onMount(() => {
		const buttonValue = value?.toString() || ref?.textContent?.trim() || "";
		buttonIndex = controlState.registerButton(buttonValue);
	});
	
	onDestroy(() => {
		if (buttonIndex !== -1) {
			controlState.unregisterButton(buttonIndex);
		}
	});
	
	const isSelected = $derived(controlState.selectedIndex === buttonIndex && buttonIndex !== -1);
</script>

<button
	bind:this={ref}
	class="uikit-segmented-button"
	class:uikit-segmented-button--selected={isSelected}
	class:uikit-segmented-button--size-xs={finalSize === "xs"}
	class:uikit-segmented-button--size-sm={finalSize === "sm"}
	class:uikit-segmented-button--size-lg={finalSize === "lg"}
	class:uikit-segmented-button--size-xl={finalSize === "xl"}
	type="button"
	aria-pressed={isSelected}
	onclick={handleClick}
	{...restProps}
>
	{@render children?.()}
</button>

<style>
	@layer variables, base, sizes, shapes, states, accessibility;
	@layer variables {
		:root {
			/* Base dimensions */
	    --uikit-segmented-button-height: 2.5rem;
	    --uikit-segmented-button-gap: 1ch;
	    --uikit-segmented-button-padding-inline: 1rem;
	    
	    /* Typography */
	    --uikit-segmented-button-font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
			--uikit-segmented-button-font-size: .875rem;
	    --uikit-segmented-button-font-weight: 500;
	    --uikit-segmented-button-color: #fff;
	    --uikit-segmented-button-letter-spacing: .04em;

			/* Border styles */
	    --uikit-segmented-button-border-width: 1px;
	    --uikit-segmented-button-border-style: solid;
	    --uikit-segmented-button-border-color: #333335;
	    --uikit-segmented-button-border-radius: .5rem;
	    
	    /* Default colors */
	    --uikit-segmented-button-bg-color: #fff;
	    
	    /* Hover state */
	    --uikit-segmented-button-hover-bg-color: #555659;
	    --uikit-segmented-button-hover-border-color: #555659;
	    
	    /* Focus state */
	    --uikit-segmented-button-outline-color: #007acc;
	    --uikit-segmented-button-outline-style: solid;
	    --uikit-segmented-button-outline-width: 2px;
	    --uikit-segmented-button-outline-offset: 0;
	    
	    /* Disabled state */
	    --uikit-segmented-button-disabled-bg-color: #eeeeef;
	    --uikit-segmented-button-disabled-font-color: #444547;
	    --uikit-segmented-button-disabled-font-weight: 400;
	    --uikit-segmented-button-disabled-border-color: #eeeeef;
	    
	    /* Animation */
	    --uikit-segmented-button-transition-duration: 0.2s;
	    --uikit-segmented-button-transition-timing: cubic-bezier(0.4, 0, 0.2, 1);
	    --uikit-segmented-button-transform-scale: 0.97;
		}
	}

	@layer base {
		.uikit-segmented-button {
			flex: 1;
			min-width: 0;
			display: inline-flex;
			gap: 1ch;
			padding-block: 0;
			align-items: center;
			justify-content: center;
			padding-inline: var(--uikit-segmented-button-padding-inline);
			height: var(--uikit-segmented-button-height);
	    border: none;
	    background: transparent;
	    cursor: pointer;
	    border-radius: 6px;
			font-family: var(--uikit-segmented-button-font-family);
	    font-size: var(--uikit-segmented-button-font-size);
	    font-weight: var(--uikit-segmented-button-font-weight);
			font-feature-settings: inherit;
	    font-variation-settings: inherit;
		}
	}

	@layer shapes {}

	@layer states {
		.uikit-segmented-button--selected {
			background: white;
	    color: #000;
	    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
		}
	}

	@layer sizes {
	.uikit-segmented-button--size-xs {
    --uikit-segmented-button-height: 1.5rem;
    --uikit-segmented-button-font-size: 0.75rem;
    --uikit-segmented-button-padding-inline: 0.5rem;
    --uikit-segmented-button-gap: 0.25rem;
  }
  
  .uikit-segmented-button--size-sm {
    --uikit-segmented-button-height: 2rem;
    --uikit-segmented-button-font-size: 0.8125rem;
    --uikit-segmented-button-padding-inline: 0.75rem;
    --uikit-segmented-button-gap: 0.375rem;
  }
  
  .uikit-segmented-button--size-lg {
    --uikit-segmented-button-height: 3rem;
    --uikit-segmented-button-font-size: 1rem;
    --uikit-segmented-button-padding-inline: 1.5rem;
    --uikit-segmented-button-gap: 0.625rem;
  }
  
  .uikit-segmented-button--size-xl {
    --uikit-segmented-button-height: 3.5rem;
    --uikit-segmented-button-font-size: 1.125rem;
    --uikit-segmented-button-padding-inline: 2rem;
    --uikit-segmented-button-gap: 0.75rem;
  }
}

	@layer accessibility {}
</style>