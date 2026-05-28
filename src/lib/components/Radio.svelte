<script lang="ts">
	import type { Snippet } from "svelte";
	import { generateId } from "$lib/utils/unique-id-generator";

  type Color = "default" | "primary";

  type Props = {
		children?: Snippet,
    color?: Color,
    [key: string]: unknown;
	};

	const uid = generateId("radio");
	const id = `wcag-ui-radio-${uid}`;
	const labelId = `${id}-label`;
	const maskId = `${id}-mask`;

	let {
		children,
		color,
		...restProps
	}: Props = $props();
</script>

<div
	class="wcag-ui-radio"
	class:wcag-ui-radio--primary={color === "primary"}
>
	<input
		{id}
		class="wcag-ui-radio__input"
		type="radio"
		{...restProps}
	/>
	<label id={labelId} class="wcag-ui-radio__label" for={id}>
		<svg class="wcag-ui-radio__icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" aria-hidden="true">
			<mask id={maskId}>
				<rect width="100%" height="100%" fill="#fff" />
				<circle cx="10" cy="10" r="8" fill="#000" />
			</mask>
			<circle
				class="wcag-ui-radio__outer-circle"
				cx="10"
				cy="10"
				r="10"
				mask="url(#{maskId})" />
			<circle class="wcag-ui-radio__inner-circle" cx="10" cy="10" r="5" />
		</svg>
		{@render children?.()}
	</label>
</div>

<style>
	:root {
		--wcag-ui-radio-size: 1.25rem;
		--wcag-ui-radio-gap: 0.5rem;
		--wcag-ui-radio-font-size: 0.875rem;
		--wcag-ui-radio-font-weight: 400;

		--wcag-ui-radio-outer-color: #94919a;
		--wcag-ui-radio-inner-color: #323234;
		--wcag-ui-radio-disabled-outer-color: #eeeeef;
		--wcag-ui-radio-disabled-text-color: #444547;
		--wcag-ui-radio-focus-color: #015fcc;

		--wcag-ui-radio-focus-width: 2px;
		--wcag-ui-radio-focus-offset: -2px;
	}

	.wcag-ui-radio {
		position: relative;
		display: inline-flex;
	}

	.wcag-ui-radio__input {
		position: absolute;
		top: 0;
		left: 0;
		width: var(--wcag-ui-radio-size);
		height: var(--wcag-ui-radio-size);
		margin: 0;
		padding: 0;
		appearance: none;
		border-radius: 50%;
		z-index: -1;
	}

	.wcag-ui-radio__input:disabled {
		cursor: not-allowed;
	}

	.wcag-ui-radio__input:focus-visible {
		outline: var(--wcag-ui-radio-focus-width) solid var(--wcag-ui-radio-focus-color);
		outline-offset: var(--wcag-ui-radio-focus-offset);
	}

	.wcag-ui-radio__label {
		display: inline-flex;
		align-items: center;
		gap: var(--wcag-ui-radio-gap);
		font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
		font-size: var(--wcag-ui-radio-font-size);
		font-weight: var(--wcag-ui-radio-font-weight);
		cursor: pointer;
		user-select: none;
	}

	.wcag-ui-radio__icon {
		width: var(--wcag-ui-radio-size);
		height: var(--wcag-ui-radio-size);
	}

	.wcag-ui-radio__outer-circle {
		transition: fill .25s cubic-bezier(0.4, 0, 0.2, 1);
		fill: var(--wcag-ui-radio-outer-color);
	}

	.wcag-ui-radio__inner-circle {
		fill: transparent;
	}

	:has(.wcag-ui-radio__input:checked) .wcag-ui-radio__inner-circle {
		fill: var(--wcag-ui-radio-inner-color);
	}

	:has(.wcag-ui-radio__input:checked) .wcag-ui-radio__outer-circle {
		fill: var(--wcag-ui-radio-inner-color);
	}

	:has(.wcag-ui-radio__input:hover) .wcag-ui-radio__outer-circle {
		fill: var(--wcag-ui-radio-inner-color);
	}

	:has(.wcag-ui-radio__input:disabled) .wcag-ui-radio__outer-circle {
		fill: var(--wcag-ui-radio-disabled-outer-color);
	}

	:has(.wcag-ui-radio__input:disabled) .wcag-ui-radio__label {
		color: var(--wcag-ui-radio-disabled-text-color);
	}
</style>
