<script lang="ts">
	import { type Snippet, onMount } from "svelte";
	import { getTabState } from "./tabs-state.svelte";

	type Props = {
		children?: Snippet;
		value?: string;
    [key: string]: unknown;
	};

	let {
		children,
		value,
    ...restProps
	}: Props = $props();

	let ref: HTMLElement;
	const tabState = getTabState();

	const id = tabState.addTab();
	const panelId = $derived(tabState.getPanelIdForTab(id));
	const { variant, size, color, shape, fullWidth } = tabState.config;

	function handleClick() {
		tabState.setSelectedTab(id);
	}

	function handleKeydown(event: KeyboardEvent) {
		if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) {
    	return;
  	}

		event.stopPropagation();
		event.preventDefault();
		
		switch(event.key) {
			case "ArrowLeft":
				tabState.selectPreviousTab();
				break;
			case "ArrowRight":
				tabState.selectNextTab();
				break;
			case "Home":
				tabState.selectFirstTab();
				break;
			case "End":
				tabState.selectLastTab();
				break;
		}
	}

	onMount(() => {
		tabState.registerTabElement(id, ref);
	});
</script>

<button
	bind:this={ref}
	{id}
	type="button"
	role="tab"
	class="uikit-tabs__tab"
	class:uikit-tabs__tab--size-sm={size === "sm"}
	class:uikit-tabs__tab--size-lg={size === "lg"}
	class:uikit-tabs__tab--underline={variant === "underline"}
	class:uikit-tabs__tab--enclosed={variant === "enclosed"}
	class:uikit-tabs__tab--outlined={variant === "outlined"}
	class:uikit-tabs__tab--filled={variant === "filled"}
	class:uikit-tabs__tab--fullWidth={fullWidth}
	tabindex={tabState.isTabSelected(id) ? 0 : -1}
	aria-selected={tabState.isTabSelected(id)}
	aria-controls={panelId}
	onclick={handleClick}
	onkeydown={handleKeydown}
  {...restProps}
>
	{@render children?.()}
</button>

<style>
	@layer variables, base, variants, sizes, shapes, states, accessibility;

	@layer variables {
		
	}

	@layer base {
		.uikit-tabs__tab {
			position: relative;
			display: inline-flex;
			box-sizing: border-box;
			margin: 0;
			padding-inline: .75rem;
			align-items: center;
			justify-content: center;
			font-size: .875rem;
			font-weight: 400;
			font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, Oxygen, Ubuntu, Cantarell, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
			height: 2.5rem;
			color: #52525b;
			border: 1px solid transparent;
			border-radius: .25rem;
			background-color: transparent;
			cursor: pointer;
		}
	}

	@layer variants {
		.uikit-tabs__tab[aria-selected="true"] {
			color: #212121;
			font-weight: 500;
			background-color: #fff;
		}

		.uikit-tabs__tab--underline[aria-selected="true"]:before {
			content: "";
	    position: absolute;
			bottom: -1px;
			z-index: 10;
			height: 2px;
			width: 100%;
			background-color: #18181b;
		}

		:is(.uikit-tabs__tab--filled,.uikit-tabs__tab--enclosed)[aria-selected="true"] {
			box-shadow: 0px 1px 2px color-mix(in srgb, #18181b 10%, transparent),0px 0px 1px color-mix(in srgb, #18181b 20%, transparent);
		}
		
		.uikit-tabs__tab--outlined[aria-selected="true"] {
			border: 1px solid #c5c5cb;
			border-bottom: none;
			border-bottom-left-radius: 0;
			border-bottom-right-radius: 0;
		}

		.uikit-tabs__tab--filled[aria-selected="true"] {
			background-color: #f4f4f5;
		}
	}
	
	@layer sizes {
		.uikit-tabs__tab--size-sm {
			height: 2rem;
		}

		.uikit-tabs__tab--size-lg {
			height: 3rem;
		}
	}
	
	@layer shapes {
		
	}

	@layer states {
		.uikit-tabs__tab--fullWidth {
			flex: 1;
		}

		.uikit-tabs__tab:disabled {

		}
	}

	@layer accessibility {
		
	}
</style>