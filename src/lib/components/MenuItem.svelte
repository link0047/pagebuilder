<script lang="ts">
	import type { Snippet } from "svelte";
	import { getMenuState } from "./menu-state.svelte";

	type MenuKind = "menuitem" | "menuitemcheckbox" | "menuitemradio";
	type Size = "xs" | "sm" | "md" | "lg" | "xl";
	type ElementType = "button" | "a";
	type ButtonType = "button" | "submit" | "reset";

	type Props = {
		children?: Snippet;
		onclick?: (event: MouseEvent) => void;
		checked?: boolean;
		disabled?: boolean;
		type?: ButtonType;
		kind?: MenuKind;
		size?: Size;
		as?: ElementType;
		shortcut?: string;
		leading?: Snippet;
		trailing?: Snippet
	}

	let {
    as = "button",
		size = "md",
		kind = "menuitem",
		type = "button",
		checked = $bindable(false),
		disabled = false,
		children,
		onclick,
		shortcut,
		leading,
		trailing,
		...restProps
	}: Props = $props();

	const menuState = getMenuState();

	function handleClick(event: MouseEvent) {
		if (disabled) {
			event.preventDefault();
			event.stopPropagation();
			return;
		}

		if (kind === "menuitemcheckbox") {
      checked = !checked;
    } else if (kind === "menuitemradio") {
      checked = true;
    }

		onclick?.(event);
		menuState.close();
	}
</script>

<svelte:element
	this={as}
	role={kind}
	type={as === "button" ? type : undefined}
	aria-checked={kind !== "menuitem" ? checked : undefined}
	aria-disabled={disabled}
	class="wcag-ui-menuitem"
	class:wcag-ui-menuitem--radio={kind === "menuitemradio"}
	class:wcag-ui-menuitem--checkbox={kind === "menuitemcheckbox"}
	class:wcag-ui-menuitem--size-xs={size === "xs"}
	class:wcag-ui-menuitem--size-sm={size === "sm"}
	class:wcag-ui-menuitem--size-lg={size === "lg"}
	class:wcag-ui-menuitem--size-xl={size === "xl"}
	tabindex={disabled ? undefined : -1}
	disabled={as === "button" ? disabled : undefined}
	onclick={handleClick}
	{...restProps}
>
	{#if leading}
		<span class="wcag-ui-menu-item__leading">
			{@render leading()}
		</span>
	{/if}

	<span class="wcag-ui-menu-item__content">
		{@render children?.()}
	</span>

	{#if shortcut}
		<span class="wcag-ui-menu-item__shortcut">
			{shortcut}
		</span>
	{/if}

	{#if trailing}
		<span class="wcag-ui-menu-item__trailing">
			{@render trailing()}
		</span>
	{/if}
</svelte:element>

<style>
	@layer variables, base, sizes, states, accessibility;

	@layer {
		:root {
			--wcag-ui-menuitem-disabled-opacity: 0.5;
			--wcag-ui-menuitem-disabled-cursor: not-allowed;
			--wcag-ui-menuitem-height: 2rem;
			--wcag-ui-menuitem-padding-inline: 1rem;
			--wcag-ui-menuitem-font-size: 1rem;
		}
	}

	@layer base {
		.wcag-ui-menuitem {
			width: 100%;
			white-space: normal;
			word-break: break-word;
			display: flex;
			font-size: var(--wcag-ui-menuitem-font-size);
			height: var(--wcag-ui-menuitem-height);
			align-items: center;
			appearance: none;
			border: none;
			padding-inline: var(--wcag-ui-menuitem-padding-inline);
			background-color: #fff;
			user-select: none;
			cursor: pointer;
			gap: 1ch;
		}

		.wcag-ui-menuitem:hover {
			background-color: #f2f2f2;
		}
	}

	@layer sizes {
		.wcag-ui-menuitem--size-xs {
		--wcag-ui-menuitem-height: 1.5rem;
		--wcag-ui-menuitem-padding-inline: .5rem;
		--wcag-ui-menuitem-font-size: .75rem;
		}

		.wcag-ui-menuitem--size-sm {
			--wcag-ui-menuitem-height: 1.75rem;
			--wcag-ui-menuitem-padding-inline: .75rem;
			--wcag-ui-menuitem-font-size: .875rem;
		}

		.wcag-ui-menuitem--size-lg {
			--wcag-ui-menuitem-height: 2.5rem;
			--wcag-ui-menuitem-padding-inline: 1.25rem;
			--wcag-ui-menuitem-font-size: 1.125rem;
		}

		.wcag-ui-menuitem--size-xl {
			--wcag-ui-menuitem-height: 3rem;
			--wcag-ui-menuitem-padding-inline: 1.5rem;
			--wcag-ui-menuitem-font-size: 1.25rem;
		}
	}

	@layer states {
		.wcag-ui-menuitem:disabled {
		opacity: var(--wcag-ui-menuitem-disabled-opacity);
		cursor: var(--wcag-ui-menuitem-disabled-cursor);
		}
	}

	@layer accessibility {}
</style>
