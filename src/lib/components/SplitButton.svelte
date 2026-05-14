<script lang="ts">
	import type { Snippet } from "svelte";
	import type { HTMLButtonAttributes } from "svelte/elements";

	import Button from "./Button.svelte";
	import Icon from "./Icon.svelte";
	import Menu from "./Menu.svelte";

	type Variant = "filled" | "outlined" | "ghost" | "link";
	type Color = "primary" | "secondary" | "success" | "danger" | "warning" | "info" | "default" | "neutral";
	type Size = "xs" | "sm" | "md" | "lg" | "xl";

	export type Props = HTMLButtonAttributes & {
    variant?: Variant;
    color?: Color;
    size?: Size;
    type?: "button" | "submit" | "reset";
    label?: string;
    loading?: boolean;
    disabled?: boolean;
    children?: Snippet;
    menuItems?: Snippet;
    menuIcon?: Snippet;
    menuLabel?: string;
    menuDisabled?: boolean;
    menuHidden?: boolean;
    onclick?: (e: MouseEvent) => void;
    onpointerdown?: (e: PointerEvent) => void;
    "aria-label"?: string;
    ref?: HTMLButtonElement | undefined;
  };

	let {
		variant = "filled",
		color = "default",
		size = "md",
		type = "button",
		label,
		disabled,
		loading = false,
		children,
		menuItems,
		menuIcon,
		menuLabel = "Open Menu",
		menuDisabled = false,
		menuHidden = false,
		ref = $bindable(),
		...restProps
	}: Props = $props();

	let buttonRef = $state<HTMLButtonElement>();
</script>

<div class="wcag-ui-splitbutton" data-variant={variant}>
	<Button
		{variant}
		{color}
		{size}
		{type}
		{disabled}
		aria-label={restProps["aria-label"] ?? label}
		attached="right"
		{loading}
		indicatorPosition="overlay"
		{...restProps}
	>
		{@render children?.()}
	</Button>
	<hr class="wcag-ui-splitbutton__divider" />
	<Button
		bind:ref={buttonRef}
		{variant}
		{color}
		{size}
		disabled={disabled || menuDisabled}
		aria-label={menuLabel}
		attached="left"
		style={menuHidden ? "display:none" : undefined}
	>
  	{#if menuIcon}
   		{@render menuIcon?.()}
  	{:else}
  		<Icon>
  			<path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" />
  		</Icon>
  	{/if}
	</Button>
</div>

{#if buttonRef}
  <Menu anchor={buttonRef} placement="bottom-end">
    {@render menuItems?.()}
  </Menu>
{/if}

<style>
	.wcag-ui-splitbutton {
		display: flex;
		flex-direction: row;
		gap: 0;
	}

	.wcag-ui-splitbutton__divider {
	  border: none;
		border-radius: 9999;
	  border-left: 2px solid color-mix(in srgb, currentColor 25%, transparent);
	  align-self: stretch;
	  margin: 0;
	}

	[data-variant="ghost"] .wcag-ui-splitbutton__divider {
		border-color: transparent;
	}
</style>
