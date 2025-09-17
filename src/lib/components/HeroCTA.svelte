<script lang="ts">
  let {
    href,
    variant = "solid",
    size = "medium",
    color = "default",
    disabled = false,
    children,
    ...restProps
  } = $props();
</script>

<a 
  class="uikit-cta"
  class:uikit-cta--outlined={variant === "outlined"}
  class:uikit-cta--ghost={variant === "ghost"}
  class:uikit-cta--link={variant === "link"}
  class:uikit-cta--sizeSM={size === "small" || size === "sm"}
  class:uikit-cta--sizeLG={size === "large" || size === "lg"}
  class:uikit-cta--primary={color === "primary"}
  class:uikit-cta--secondary={color === "secondary"}
  class:uikit-cta--disabled={disabled}
  {href}
  aria-disabled={disabled}
  {...restProps}
>
  {@render children?.()}
</a>

<style>
  @layer variables, base, variants, colors, sizes, states, accessibility;

  @layer variables {
    :root {
      --uikit-cta-font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
			--uikit-cta-bg: #fff;
			--uikit-cta-height: 2rem;
			--uikit-cta-color: #212121;
	    --uikit-cta-padding-inline: .75rem;
			--uikit-cta-border-radius: calc(var(--uikit-cta-height) / 2);
	    --uikit-cta-border-width: 0;
			--uikit-cta-border-color: transparent;
			--uikit-cta-bg-hover: #f2f2f2;
			--uikit-cta-border-color-hover: transparent;
			--uikit-cta-bg-focus: #f2f2f2;
			--uikit-cta-border-color-focus: transparent;
    }
  }

  @layer base {
    .uikit-cta {
			box-sizing: border-box;
			font-family: var(--uikit-cta-font-family);
			font-feature-settings: inherit;
	    font-variation-settings: inherit;
	    display: inline-flex;
	    align-items: center;
	    gap: 1ch;
			padding-inline: var(--uikit-cta-padding-inline);
			background: var(--uikit-cta-bg);
			height: var(--uikit-cta-height);
	    border-radius: var(--uikit-cta-border-radius);
	    text-decoration: none;
			font-size: 0.875rem;
	    font-weight: 500;
	    cursor: pointer;
	    border: var(--uikit-cta-border-width) solid var(--uikit-cta-border-color);
	    white-space: nowrap;
		}

    /* to override global class/tag color */
    .uikit-cta,
    .uikit-cta:visited {
      color: var(--uikit-cta-color);
    }
  }

  @layer variants {
    .uikit-cta--outlined {
	    --uikit-cta-bg: #fff;
			--uikit-cta-border-width: 2px;
	    --uikit-cta-border-color: #66676a;
	    --uikit-cta-color: #38393b;
			--uikit-cta-bg-hover: #c9c9c9;
	    --uikit-cta-border-color-hover: #66676a;
	  }
	
		.uikit-cta--link {
	    background-color: transparent;
	    border-color: transparent;
	    text-decoration: underline;
	    --uikit-cta-color: #38393b;
	    text-decoration: underline;
	    text-underline-offset: 2px;
			--uikit-cta-bg-hover: #eeeeef;
	    --uikit-cta-border-color-hover: #eeeeef;
	  }
	
	  .uikit-cta--ghost {
	    background-color: transparent;
	    border-color: transparent;
	    --uikit-cta-color: #38393b;
			--uikit-cta-bg-hover: #eeeeef;
	    --uikit-cta-border-color-hover: #eeeeef;
	  }
	
		.uikit-cta--primary:is(.uikit-cta--outlined, .uikit-cta--link, .uikit-cta--ghost) {
			--uikit-cta-color: #2a508f;
			--uikit-cta-border-color: #2a508f;
			--uikit-cta-bg-hover: #e9edf3;
		}
	
		.uikit-cta--secondary:is(.uikit-cta--outlined, .uikit-cta--ghost, .uikit-cta--link) {
			--uikit-cta-border-color: #a8a8a8;
			--uikit-cta-bg-hover: #f2f2f2;
		}
  }

  @layer colors {
		.uikit-cta--primary {
	    --uikit-cta-bg: #2a508f;
			--uikit-cta-border-width: 1px;
	    --uikit-cta-border-color: #2a508f;
	    --uikit-cta-color: #fff;
	    --uikit-cta-bg-hover: #3f619a;
	    --uikit-cta-border-color-hover: #3f619a;
	  }
	
	  .uikit-cta--secondary {
	    --uikit-cta-bg: #e5e6e7;
			--uikit-cta-border-width: 1px;
	    --uikit-cta-border-color: #e5e6e7;
	    --uikit-cta-color: #38393b;
	    --uikit-cta-bg-hover: #eeeeef;
	    --uikit-cta-border-color-hover: #66676a;
	  }
	}

  @layer sizes {
		.uikit-cta--sizeSM {
			--uikit-cta-height: 1.5rem;
	  }
	
		.uikit-cta--sizeLG {
			--uikit-cta-height: 2.5rem;
	  }
	}

  @layer states {
		.uikit-cta:hover {
			background: var(--uikit-cta-bg-hover);
			--uikit-cta-border-color: #e5e6e7;
			border-color: var(--uikit-cta-border-color-hover);
		}
	
		.uikit-cta:focus-visible {
			background: var(--uikit-cta-bg-focus);
			border-color: var(--uikit-cta-border-color-focus);
			outline: 2px dotted #333;
			outline-offset: 2px;
		}
	}
</style>