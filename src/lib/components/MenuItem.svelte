<script lang="ts">
	import { type Snippet } from "svelte";

	type MenuItemType = "menuitem" | "menuitemcheckbox" | "menuitemradio";
	type Size = "xs" | "small" | "sm" | "medium" | "md" | "large" | "lg" | "xl";
	type ElementType = "button" | "a" | "div";
	
	type Props = {
		children?: Snippet,
		onclick?: (event: MouseEvent) => void,
		checked?: boolean,
		type?: MenuItemType,
		size?: Size,
		as?: ElementType,
		shortcut?: string,
		leading?: Snippet,
		trailing?: Snippet
	}

	let {
    as,
		size = "md",
		type = "menuitem",
		checked = $bindable(false),
		children,
		onclick,
		shortcut,
		leading,
		trailing,
		...restProps
	}: Props = $props();

	function handleClick(event: MouseEvent) {
		if (type === "menuitemcheckbox") {
      checked = !checked;
    } else if (type === "menuitemradio") {
      checked = true;
    }

		onclick?.(event);
	}
</script>

<svelte:element 
	this={as}
	role={type} 
	type="button"
	aria-checked={type !== "menuitem" ? checked : undefined}
	class="uikit-menuitem"
	class:uikit-menuitem--radio={type === "menuitemradio"}
	class:uikit-menuitem--checkbox={type === "menuitemcheckbox"}
	class:uikit-menuitem--size-xs={size === "xs"}
	class:uikit-menuitem--size-sm={size === "sm"}
	class:uikit-menuitem--size-lg={size === "lg"}
	class:uikit-menuitem--size-xl={size === "xl"}
	onclick={handleClick}
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
			
		}
	}
	
	@layer base {
		.uikit-menuitem {
			
		}
	}

	@layer sizes {}

	@layer states {}

	@layer accessibility {}
</style>