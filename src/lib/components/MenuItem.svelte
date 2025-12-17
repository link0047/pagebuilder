<script lang="ts">
	import { type Snippet } from "svelte";
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
	role={type} 
	type={as === "button" ? type : undefined}
	aria-checked={kind !== "menuitem" ? checked : undefined}
	aria-disabled={disabled}
	class="uikit-menuitem"
	class:uikit-menuitem--radio={kind === "menuitemradio"}
	class:uikit-menuitem--checkbox={kind === "menuitemcheckbox"}
	class:uikit-menuitem--size-xs={size === "xs"}
	class:uikit-menuitem--size-sm={size === "sm"}
	class:uikit-menuitem--size-lg={size === "lg"}
	class:uikit-menuitem--size-xl={size === "xl"}
	tabindex={disabled ? undefined : -1}
	disabled={as === "button" ? disabled : undefined}
	onclick={handleClick}
	{...restProps}
>
	{#if leading}
		<span class="uikit-menu-item__leading">
			{@render leading()}
		</span>
	{/if}
	
	<span class="uikit-menu-item__content">
		{@render children?.()}
	</span>
	
	{#if shortcut}
		<span class="uikit-menu-item__shortcut">
			{shortcut}
		</span>
	{/if}
	
	{#if trailing}
		<span class="uikit-menu-item__trailing">
			{@render trailing()}
		</span>
	{/if}
</svelte:element>

<style>
	@layer variables, base, sizes, states, accessibility;

	@layer {
		:root {
			--uikit-menuitem-disabled-opacity: 0.5;
			--uikit-menuitem-disabled-cursor: not-allowed;
			--uikit-menuitem-height: 2rem;
			--uikit-menuitem-padding-inline: 1rem;
			--uikit-menuitem-font-size: 1rem;
		}
	}
	
	@layer base {
		.uikit-menuitem {
			width: 100%;
			white-space: normal;
			word-break: break-word;
			display: flex;
			font-size: var(--uikit-menuitem-font-size);
			height: var(--uikit-menuitem-height);
			align-items: center;
			appearance: none;
			border: none;
			padding-inline: var(--uikit-menuitem-padding-inline);
			background-color: #fff;
			user-select: none;
			cursor: pointer;
			gap: 1ch;
		}

		.uikit-menuitem:hover {
			background-color: #f2f2f2;
		}
	}

	@layer sizes {
		.uikit-menuitem--size-xs {
			--uikit-menuitem-height: 1.5rem;
			--uikit-menuitem-padding-inline: .5rem;
			--uikit-menuitem-font-size: .75rem;
		}

		.uikit-menuitem--size-sm {
			--uikit-menuitem-height: 1.75rem;
			--uikit-menuitem-padding-inline: .75rem;
			--uikit-menuitem-font-size: .875rem;
		}

		.uikit-menuitem--size-lg {
			--uikit-menuitem-height: 2.5rem;
			--uikit-menuitem-padding-inline: 1.25rem;
			--uikit-menuitem-font-size: 1.125rem;
		}

		.uikit-menuitem--size-xl {
			--uikit-menuitem-height: 3rem;
			--uikit-menuitem-padding-inline: 1.5rem;
			--uikit-menuitem-font-size: 1.25rem;
		}
	}

	@layer states {
		.uikit-menuitem:disabled {
			opacity: var(--uikit-menuitem-disabled-opacity);
			cursor: var(--uikit-menuitem-disabled-cursor);
		}
	}

	@layer accessibility {}
</style>