<script lang="ts">
	import { type Snippet, onMount, onDestroy, getContext } from "svelte";
	import { getSegmentedControlState } from "./segmentedcontrol-state.svelte";

	type Variant = "default" | "filled" | "outlined" | "ghost" | "tabs" | "flush";
	type Color = "primary" | "secondary" | "success" | "danger" | "warning" | "info" | "default"
	type Size = "xs" | "sm" |  "md" | "lg" | "xl";
	type Shape = "default" | "square" | "pill";

	type Props = {
    ref?: HTMLButtonElement
		children?: Snippet,
		variant?: Variant,
		size?: Size,
		color?: Color,
		shape?: Shape,
		value?: string,
		onclick?: (event: MouseEvent) => void,
		[key: string]: unknown;
	};

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

	const controlState = getSegmentedControlState();
	const ctxVariant = getContext<() => Variant>("segmented-variant");
  const ctxSize = getContext<() => Size>("segmented-size");
  const ctxColor = getContext<() => Color>("segmented-color");
  const ctxShape = getContext<() => Shape>("segmented-shape");
  const ctxOnChange = getContext<((value: string) => void) | undefined>("segmented-onchange");

  const finalVariant = $derived(variant ?? ctxVariant?.());
  const finalSize = $derived(size ?? ctxSize?.());
  const finalColor = $derived(color ?? ctxColor?.());
  const finalShape = $derived(shape ?? ctxShape?.());

  let registrationId = $state<number | null>(null);

  function handleClick(event: MouseEvent) {
    if (registrationId !== null) {
      controlState.selectById(registrationId);
    }
    onclick?.(event);
    ctxOnChange?.(value ?? "");
  }

  onMount(() => {
    if (import.meta.env.DEV && !value) {
      console.warn("[SegmentedButton] `value` prop is required. Falling back to empty string.");
    }
    registrationId = controlState.registerButton(value ?? "");
  });

  onDestroy(() => {
    if (registrationId !== null) {
      controlState.unregisterButton(registrationId);
    }
  });

	const isSelected = $derived(registrationId !== null && controlState.isSelected(registrationId));
</script>

<button
	bind:this={ref}
	class="wcag-ui-segmented-button"
	class:wcag-ui-segmented-button--selected={isSelected}
	class:wcag-ui-segmented-button--size-xs={finalSize === "xs"}
	class:wcag-ui-segmented-button--size-sm={finalSize === "sm"}
	class:wcag-ui-segmented-button--size-lg={finalSize === "lg"}
	class:wcag-ui-segmented-button--size-xl={finalSize === "xl"}
	type="button"
  role="radio"
  aria-checked={isSelected}
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
	    --wcag-ui-segmented-button-height: 2.5rem;
	    --wcag-ui-segmented-button-gap: 1ch;
	    --wcag-ui-segmented-button-padding-inline: 1rem;

	    /* Typography */
	    --wcag-ui-segmented-button-font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
			--wcag-ui-segmented-button-font-size: .875rem;
			--wcag-ui-segmented-button-font-weight: 500;
			--wcag-ui-segmented-button-color: #fff;
			--wcag-ui-segmented-button-letter-spacing: .04em;

			/* Border styles */
	    --wcag-ui-segmented-button-border-width: 1px;
	    --wcag-ui-segmented-button-border-style: solid;
	    --wcag-ui-segmented-button-border-color: #333335;
	    --wcag-ui-segmented-button-border-radius: .5rem;

	    /* Default colors */
	    --wcag-ui-segmented-button-bg-color: #fff;

	    /* Hover state */
	    --wcag-ui-segmented-button-hover-bg-color: #555659;
	    --wcag-ui-segmented-button-hover-border-color: #555659;

	    /* Focus state */
	    --wcag-ui-segmented-button-outline-color: #007acc;
	    --wcag-ui-segmented-button-outline-style: solid;
	    --wcag-ui-segmented-button-outline-width: 2px;
	    --wcag-ui-segmented-button-outline-offset: 0;

	    /* Disabled state */
	    --wcag-ui-segmented-button-disabled-bg-color: #eeeeef;
	    --wcag-ui-segmented-button-disabled-font-color: #444547;
	    --wcag-ui-segmented-button-disabled-font-weight: 400;
	    --wcag-ui-segmented-button-disabled-border-color: #eeeeef;

	    /* Animation */
	    --wcag-ui-segmented-button-transition-duration: 0.2s;
	    --wcag-ui-segmented-button-transition-timing: cubic-bezier(0.4, 0, 0.2, 1);
	    --wcag-ui-segmented-button-transform-scale: 0.97;
		}
	}

	@layer base {
		.wcag-ui-segmented-button {
			flex: 1;
			min-width: 0;
			display: inline-flex;
			gap: 1ch;
			padding-block: 0;
			align-items: center;
			justify-content: center;
			padding-inline: var(--wcag-ui-segmented-button-padding-inline);
			height: var(--wcag-ui-segmented-button-height);
	    border: none;
	    background: transparent;
	    cursor: pointer;
	    border-radius: 6px;
			font-family: var(--wcag-ui-segmented-button-font-family);
			font-size: var(--wcag-ui-segmented-button-font-size);
			font-weight: var(--wcag-ui-segmented-button-font-weight);
			font-feature-settings: inherit;
	    font-variation-settings: inherit;
		}
	}

	@layer shapes {}

	@layer states {
		.wcag-ui-segmented-button--selected {
			background: #fff;
	    color: #000;
	    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
		}

		.wcag-ui-segmented-button:not(.wcag-ui-segmented-button--selected):hover {
			background: #e6e6e6;
		}
	}

	@layer sizes {
	.wcag-ui-segmented-button--size-xs {
    --wcag-ui-segmented-button-height: 1.5rem;
    --wcag-ui-segmented-button-font-size: 0.75rem;
    --wcag-ui-segmented-button-padding-inline: 0.5rem;
    --wcag-ui-segmented-button-gap: 0.25rem;
  }

  .wcag-ui-segmented-button--size-sm {
    --wcag-ui-segmented-button-height: 2rem;
    --wcag-ui-segmented-button-font-size: 0.8125rem;
    --wcag-ui-segmented-button-padding-inline: 0.75rem;
    --wcag-ui-segmented-button-gap: 0.375rem;
  }

  .wcag-ui-segmented-button--size-lg {
    --wcag-ui-segmented-button-height: 3rem;
    --wcag-ui-segmented-button-font-size: 1rem;
    --wcag-ui-segmented-button-padding-inline: 1.5rem;
    --wcag-ui-segmented-button-gap: 0.625rem;
  }

  .wcag-ui-segmented-button--size-xl {
    --wcag-ui-segmented-button-height: 3.5rem;
    --wcag-ui-segmented-button-font-size: 1.125rem;
    --wcag-ui-segmented-button-padding-inline: 2rem;
    --wcag-ui-segmented-button-gap: 0.75rem;
  }
}

	@layer accessibility {}
</style>
