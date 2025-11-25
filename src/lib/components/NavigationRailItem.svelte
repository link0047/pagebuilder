<script lang="ts">
	import { type Snippet } from "svelte";

	type Props = {
		children: Snippet;
		icon?: Snippet;
		href: string;
		active?: boolean;
		disabled?: boolean;
		[key: string]: unknown;
	};

	let {
		children,
		icon,
		href = "",
		active = false,
		disabled = false,
		...restProps
	}: Props = $props();
</script>

<a
	{href}
	class="uikit-navigation-rail__item"
	class:uikit-navigation-rail__item--active={active}
	aria-current={active ? "page" : undefined}
	aria-disabled={disabled ? "true" : undefined}
	tabindex={disabled ? -1 : undefined}
	{...restProps}
>
	{#if icon}
		<span class="uikit-navigation-rail__icon">
			{@render icon()}
		</span>
	{/if}
	<span class="uikit-navigation-rail__label">
		{@render children?.()}
	</span>
</a>

<style>
	@layer variables, base, states, accessibility;

	@layer variables {
		:root {
			--uikit-rail-item-font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
			--uikit-rail-item-text: 0, 0%, 13%; 
	    --uikit-rail-item-inactive: 0, 0%, 38%;
	    --uikit-rail-item-primary: 218, 75%, 38%;
			--uikit-rail-item-hover-bg: 48, 25%, 92.2%;
			--uikit-rail-item-hover-bg-transparency: 1;
		}
	}

	@layer base {
		.uikit-navigation-rail__item, .uikit-navigation-rail__item:visited {
			box-sizing: border-box;
			aspect-ratio: 1 / 1;
			width: 100%;
			font-family: var(--uikit-rail-item-font-family);
			display: flex;
			flex-direction: column;
			gap: .25rem;
			align-items: center;
			justify-content: center;
			border-radius: .5rem;
			text-decoration: none;
			padding-block: .25rem;
			cursor: pointer;
		}
	
		.uikit-navigation-rail__icon {
			display: flex;
	    align-items: center;
	    justify-content: center;
			padding: .5rem;
			border-radius: .5rem;
			transition: background-color 0.2s ease;
		}
		
		.uikit-navigation-rail__label {
			font-size: 0.75rem;
	    font-weight: 500;
	    line-height: 1;
		}
	}

	@layer states {
		.uikit-navigation-rail__item:hover .uikit-navigation-rail__icon {
			background-color: hsla(var(--uikit-rail-item-hover-bg), var(--uikit-rail-item-hover-bg-transparency));
		}
		
		.uikit-navigation-rail__item:focus-visible {
			outline: 2px solid hsl(204, 100%, 40%);
	    outline-offset: -2px;
		}

		.uikit-navigation-rail__item--active .uikit-navigation-rail__icon {
			background-color: hsla(var(--uikit-rail-item-primary), 0.1);
		}

		.uikit-navigation-rail__item[aria-disabled="true"] {
			opacity: .5;
			pointer-events: none;
			cursor: not-allowed;
		}		
	}

	@layer accessibility {
		@media (prefers-reduced-motion: reduce) {
			.uikit-navigation-rail__icon {
				transition: none;
			}
		}

		@media (forced-colors: active) {
			.uikit-navigation-rail__item--active {
				border-color: Highlight;
			}

			.uikit-navigation-rail__item[aria-disabled="true"] {
				opacity: 1;
				color: GrayText;
			}
		}
	}

	.uikit-navigation-rail__item {
    color: hsl(var(--uikit-rail-item-text));
  }
  
  .uikit-navigation-rail__item--active {
		--uikit-rail-item-hover-bg: 218, 75%, 38%;
		--uikit-rail-item-hover-bg-transparency: .2;
    color: hsl(var(--uikit-rail-item-primary));
  }
</style>