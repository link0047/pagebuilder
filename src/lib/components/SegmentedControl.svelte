<script lang="ts">
	import { type Snippet, setContext } from "svelte";
	import { setSegmentedControlState } from "./segmentedcontrol-state.svelte";

	type Variant = "default" | "filled" | "outlined" | "ghost" | "tabs" | "flush";
	type Color = "primary" | "secondary" | "success" | "danger" | "warning" | "info" | "default";
	type Size = "xs" | "sm" | "md" | "lg" | "xl";
	type Shape = "default" | "square" | "pill";
	type HeadingTag = "div" | "p" | "span" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

	type Props = {
		value?: string | undefined;
		/** Accessible label for the group when no visible heading is shown. */
		label?: string;
		/** Renders a visible label element above the control and links it via aria-labelledby. */
		headingLabel?: string;
		/** HTML tag for the heading element. Constrained to safe/semantic tags. */
		headingTag?: HeadingTag;
		variant?: Variant;
		size?: Size;
		color?: Color;
		shape?: Shape;
		children: Snippet;
		onchange?: (value: string) => void;
		[key: string]: unknown;
	};

	let {
		value = $bindable(),
		label,
		headingLabel,
		headingTag = "div",
		variant = "default",
		size = "md",
		color = "default",
		shape = "default",
		children,
		onchange,
		...restProps
	}: Props = $props();

	const controlState = setSegmentedControlState(value);
	const headingId = controlState.headingId;

	// Context is a reactive $state object so child buttons react to prop changes.
	setContext("segmented-variant", () => variant);
  setContext("segmented-size", () => size);
  setContext("segmented-color", () => color);
  setContext("segmented-shape", () => shape);
  setContext("segmented-onchange", (value: string) => onchange?.(value));

  // ── ARIA labelling ──────────────────────────────────────────────────────────
	// Prefer aria-labelledby when a visible heading is present; fall back to
	// aria-label for an invisible label string. Never set both simultaneously.
	const ariaLabelledBy = $derived(headingLabel ? headingId : undefined);
	const ariaLabel = $derived(!headingLabel ? label : undefined);

	// Sync external value changes into internal state only
	$effect(() => {
    if (value !== undefined && value !== controlState.selectedValue) {
      controlState.selectByValue(value);
    }
  });

	// Sync internal selection back to the bindable `value` prop.
	$effect(() => {
		const selected = controlState.selectedValue;
		if (selected !== undefined && selected !== value) {
			value = selected;
		}
	});

	// ── Arrow-key handler lives here so the DOM structure (role=radiogroup) ─────
	// owns the keyboard contract, not each individual button.
	function handleKeydown(event: KeyboardEvent) {
		if (event.key === "ArrowRight" || event.key === "ArrowDown") {
			event.preventDefault();
			controlState.selectNext();
		} else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
			event.preventDefault();
			controlState.selectPrevious();
		}
	}
</script>

<div class="wcag-ui-segmented">
  {#if headingLabel}
  	<svelte:element this={headingTag} id={headingId} class="wcag-ui-segmented-control-heading">
  		{headingLabel}
  	</svelte:element>
  {/if}
  <div
  	class="wcag-ui-segmented-control"
  	role="radiogroup"
  	aria-labelledby={ariaLabelledBy}
  	aria-label={ariaLabel}
  	onkeydown={handleKeydown}
  	{...restProps}
  >
  	{@render children?.()}
  </div>
</div>
<style>
  .wcag-ui-segmented {
	  display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.wcag-ui-segmented-control-heading {
		line-height: 1;
		font-size: 0.875rem;
	}

	.wcag-ui-segmented-control {
		display: inline-flex;
		background: #f5f5f5;
		border-radius: 0.5rem;
		padding: 0.125rem;
		gap: 0.0625rem;
	}
</style>
