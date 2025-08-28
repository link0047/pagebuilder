<script lang="ts">
	import { type Snippet, setContext } from "svelte";
	import { setSegmentedControlState } from "./segmentedcontrol-state.svelte";

	type Variant = "default" | "filled" | "outlined" | "ghost" | "tabs" | "flush";
	type Color = "primary" | "secondary" | "success" | "danger" | "warning" | "info" | "default";
	type Size = "xs" | "small" | "sm" | "medium" | "md" | "large" | "lg" | "xl";
	type Shape = "default" | "square" | "pill";
	
	type Props = {
		value?: string | number | undefined,
		label?: string,
		headingLabel?: string,
		headingTag?: string,
		variant?: Variant,
		size?: Size,
		color?: Color,
		shape?: Shape,
		children: Snippet,
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
		...restProps
	}: Props = $props();

	const controlState = setSegmentedControlState(value);
	const headingId = controlState.headingId;
	setContext("segmented-style", { variant, size, color, shape });
	
	// Sync internal state changes to external value
	$effect(() => {
		const selectedValue = controlState.selectedValue;
		if (selectedValue !== undefined && selectedValue !== value) {
			value = selectedValue;
		}
	});
</script>

{#if headingLabel}
	<svelte:element this={headingTag} id={headingId ?? ""} class="uikit-segmented-control-heading">
		{headingLabel}
	</svelte:element>
{/if}
<div class="uikit-segmented-control" role="group" aria-label={label} {...restProps}>
	{@render children?.()}
</div>

<style>
	.uikit-segmented-control-heading {
		line-height: 1;
		font-size: .875rem;
	}

	.uikit-segmented-control {
		display: inline-flex;
		background: #f5f5f5;
		border-radius: .5rem;
		padding: 0.125rem;
		gap: 0.0625rem
	}
</style>