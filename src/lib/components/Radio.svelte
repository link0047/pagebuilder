<script lang="ts">
	import { type Snippet } from "svelte";
	import { generateId } from "$lib/utils/unique-id-generator";
	
  type Color = "default" | "primary";

  type Props = {
		children?: Snippet,
    color?: Color,
    [key: string]: unknown;
	};
	
	const uid = generateId("radio");
	const id = `uikit-radio-${uid}`;
	const labelId = `${id}-label`;
	const maskId = `${id}-mask`;
	
	let {
		children,
		color,
		...restProps
	}: Props = $props();
</script>

<div 
	class="uikit-radio"
	class:uikit-radio--primary={color === "primary"}
>
	<input 
		{id} 
		class="uikit-radio__native-control"
		type="radio"
		{...restProps}
	/>
	<label id={labelId} class="uikit-radio__label" for={id}>
		<svg class="uikit-radio__icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" aria-hidden="true">
			<mask id={maskId}>
				<rect width="100%" height="100%" fill="#fff" />
				<circle cx="10" cy="10" r="8" fill="#000" />
			</mask>
			<circle
				class="uikit-radio__outer-circle"
				cx="10"
				cy="10"
				r="10"
				mask="url(#{maskId})" />
			<circle class="uikit-radio__inner-circle" cx="10" cy="10" r="5" />
		</svg>
		{@render children?.()}
	</label>
</div>

<style>
	:root {
		--uikit-radio-size: 1.25rem;
		--uikit-radio-gap: 0.5rem;
		--uikit-radio-font-size: 0.875rem;
		--uikit-radio-font-weight: 400;
		
		--uikit-radio-outer-color: #94919a;
		--uikit-radio-inner-color: #323234;
		--uikit-radio-disabled-outer-color: #eeeeef;
		--uikit-radio-disabled-text-color: #444547;
		--uikit-radio-focus-color: #015fcc;
		
		--uikit-radio-focus-width: 2px;
		--uikit-radio-focus-offset: -2px;
	}
	
	.uikit-radio {
		position: relative;
		display: inline-flex;
	}
	
	.uikit-radio__native-control {
		position: absolute;
		top: 0;
		left: 0;
		width: var(--uikit-radio-size);
		height: var(--uikit-radio-size);
		margin: 0;
		padding: 0;
		appearance: none;
		border-radius: 50%;
		z-index: -1;
	}
	
	.uikit-radio__native-control:disabled {
		cursor: not-allowed;
	}
	
	.uikit-radio__native-control:focus-visible {
		outline: var(--uikit-radio-focus-width) solid var(--uikit-radio-focus-color);
		outline-offset: var(--uikit-radio-focus-offset);
	}
	
	.uikit-radio__label {
		display: inline-flex;
		align-items: center;
		gap: var(--uikit-radio-gap);
		font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
		font-size: var(--uikit-radio-font-size);
		font-weight: var(--uikit-radio-font-weight);
		cursor: pointer;
		user-select: none;
	}
	
	.uikit-radio__icon {
		width: var(--uikit-radio-size);
		height: var(--uikit-radio-size);
	}
	
	.uikit-radio__outer-circle {
		transition: fill .25s cubic-bezier(0.4, 0, 0.2, 1);
		fill: var(--uikit-radio-outer-color);
	}
	
	.uikit-radio__inner-circle {
		fill: transparent;
	}
	
	:has(.uikit-radio__native-control:checked) .uikit-radio__inner-circle {
		fill: var(--uikit-radio-inner-color);
	}

	:has(.uikit-radio__native-control:checked) .uikit-radio__outer-circle {
		fill: var(--uikit-radio-inner-color);
	}

	:has(.uikit-radio__native-control:hover) .uikit-radio__outer-circle {
		fill: var(--uikit-radio-inner-color);
	}
	
	/* .uikit-radio--primary:has(.uikit-radio__native-control:checked) .uikit-radio__inner-circle {
		
	} */
	
	:has(.uikit-radio__native-control:disabled) .uikit-radio__outer-circle {
		fill: var(--uikit-radio-disabled-outer-color);
	}
	
	:has(.uikit-radio__native-control:disabled) .uikit-radio__label {
		color: var(--uikit-radio-disabled-text-color);
	}
</style>