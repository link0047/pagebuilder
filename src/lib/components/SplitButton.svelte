<script lang="ts">
	import Button from "./Button.svelte";
	import Icon from "./Icon.svelte";
	import Menu from "./Menu.svelte";
	import { type Snippet } from "svelte";

	type Variant = "filled" | "outlined" | "ghost" | "link";
	type Color = "primary" | "secondary" | "success" | "danger" | "warning" | "info" | "default" | "neutral";
	type Size = "xs" | "small" | "sm" | "medium" | "md" | "large" | "lg" | "xl";

	type Props = {
		variant?: Variant;
		color?: Color;
		size?: Size;
		type?: "button" | "submit" | "reset",
		children: Snippet;
		menuItems: Snippet;
		[key: string]: unknown;
	};

	let {
		variant = "filled",
		color = "default",
		size = "medium",
		type = "button",
		children,
		menuItems,
		...restProps
	}: Props = $props();

	let buttonRef = $state<HTMLButtonElement>();
</script>

<div class="uikit-splitbutton">
	<Button {variant} {color} {size} {type} attached="right" {...restProps}>
		{@render children?.()}
	</Button>
	<div class="divider" role="presentation"></div>
	<Button bind:ref={buttonRef} {variant} {color} {size} {type} attached="left" disabled={restProps.disabled}>
		<Icon>
			<path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" />
		</Icon>
	</Button>
</div>

{#if buttonRef}
  <Menu anchor={buttonRef} placement="bottom-end">
    {@render menuItems?.()}
  </Menu>
{/if}

<style>
	.uikit-splitbutton {
		display: flex;
		flex-direction: row;
		gap: 0;
	}

	.divider {
		width: 2px;
		height: 100%;
		background-color: #ccc;
	}
</style>
