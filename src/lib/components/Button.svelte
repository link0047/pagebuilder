<script lang="ts">
	import { type Snippet } from "svelte";
	
	type Variant = "filled" | "outlined" | "ghost" | "link";
	type Color = "primary" | "secondary" | "success" | "danger" | "warning" | "info" | "default";
	type Size = "xs" | "small" | "sm" | "medium" | "md" | "large" | "lg" | "xl";
	type Shape = "default" | "square" | "pill" | "circle";
	
	type Props = {
		children?: Snippet,
		variant?: Variant,
		size?: Size,
		color?: Color,
		shape?: Shape,
		type?: "button" | "submit" | "reset",
    fullWidth?: boolean,
    ref?: HTMLButtonElement,
    [key: string]: unknown;
	}
	
	let { 
		children,
		variant = "filled",
		color = "default",
		size = "md",
		shape = "default",
		type = "button",
    fullWidth = false,
		ref = $bindable(),
		...restProps
	}: Props = $props();
</script>

<button 
	bind:this={ref}
	class="uikit-button"
  class:uikit-button--full-width={fullWidth}
	class:uikit-button--shape-square={shape === "square"}
	class:uikit-button--shape-pill={shape === "pill"}
	class:uikit-button--shape-circle={shape === "circle"}
	class:uikit-button--size-xs={size === "xs"}
	class:uikit-button--size-sm={size === "sm"}
	class:uikit-button--size-lg={size === "lg"}
	class:uikit-button--size-xl={size === "xl"}
	class:uikit-button--outlined={variant === "outlined"}
	class:uikit-button--ghost={variant === "ghost"}
	class:uikit-button--link={variant === "link"}
	class:uikit-button--primary={color === "primary"}
	class:uikit-button--secondary={color === "secondary"}
	class:uikit-button--success={color === "success"}
	class:uikit-button--warning={color === "warning"}
	class:uikit-button--danger={color === "danger"}
	class:uikit-button--info={color === "info"}
	{type}
	{...restProps}
>
	{@render children?.()}
</button>

<style>
@layer variables, base, variants, sizes, shapes, states, accessibility;

@layer variables {
  :root {
    /* Base dimensions */
    --uikit-button-height: 2.5rem;
    --uikit-button-width: fit-content;
    --uikit-button-gap: .25ch;
    --uikit-button-padding-inline: .5rem;
    
    /* Typography */
    --uikit-button-font-size: .875rem;
    --uikit-button-font-weight: 500;
    --uikit-button-color: #fff;
    --uikit-button-letter-spacing: .04em;
    --uikit-button-font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
    
    /* Border styles */
    --uikit-button-border-width: 1px;
    --uikit-button-border-style: solid;
    --uikit-button-border-color: #333335;
    --uikit-button-border-radius: .5rem;
    
    /* Default colors */
    --uikit-button-bg-color: #333335;
    
    /* Hover state */
    --uikit-button-hover-bg-color: #555659;
    --uikit-button-hover-border-color: #555659;
    
    /* Focus state */
    --uikit-button-outline-color: #007acc;
    --uikit-button-outline-style: solid;
    --uikit-button-outline-width: 2px;
    --uikit-button-outline-offset: 0;
    
    /* Disabled state */
    --uikit-button-disabled-bg-color: #eeeeef;
    --uikit-button-disabled-font-color: #444547;
    --uikit-button-disabled-font-weight: 400;
    --uikit-button-disabled-border-color: #eeeeef;
    
    /* Animation */
    --uikit-button-transition-duration: 0.2s;
    --uikit-button-transition-timing: cubic-bezier(0.4, 0, 0.2, 1);
    --uikit-button-transform-scale: 0.97;
  }
}

@layer base {
  .uikit-button {
    box-sizing: border-box;
    align-items: center;
    justify-content: center;
    gap: var(--uikit-button-gap);
    appearance: none;
    width: var(--uikit-button-width);
    background-color: var(--uikit-button-bg-color);
    border: var(--uikit-button-border-width) var(--uikit-button-border-style) var(--uikit-button-border-color);
    border-radius: var(--uikit-button-border-radius);
    color: var(--uikit-button-color);
    display: inline-flex;
    font-family: var(--uikit-button-font-family);
    font-size: var(--uikit-button-font-size);
    font-weight: var(--uikit-button-font-weight);
    font-feature-settings: inherit;
    font-variation-settings: inherit;
    height: var(--uikit-button-height);
    letter-spacing: var(--uikit-button-letter-spacing);
    white-space: nowrap;
    padding-inline: var(--uikit-button-padding-inline);
    position: relative;
    touch-action: manipulation;
    user-select: none;
    transition: background-color var(--uikit-button-transition-duration) var(--uikit-button-transition-timing),border-color var(--uikit-button-transition-duration) var(--uikit-button-transition-timing),transform var(--uikit-button-transition-duration) var(--uikit-button-transition-timing);
  }
}

@layer variants {
	/* Variant styles */
	.uikit-button--outlined {
    background-color: transparent;
    --uikit-button-color: #38393b;
		--uikit-button-border-width: 2px;
		--uikit-button-outline-offset: -2px;
    --uikit-button-border-color: #66676a;
		--uikit-button-hover-bg-color: #eeeeef;
  }
  
  .uikit-button--ghost {
    background-color: transparent;
    border-color: transparent;
	  --uikit-button-color: #38393b;
    --uikit-button-hover-bg-color: #eeeeef;
		--uikit-button-hover-border-color: #eeeeef;
  }
  
  .uikit-button--link {
    background-color: transparent;
    border-color: transparent;
    text-decoration: underline;
		--uikit-button-color: #38393b;
		--uikit-button-hover-bg-color: #eeeeef;
		--uikit-button-hover-border-color: #eeeeef;
  }

	/* Color variants */
	.uikit-button--primary {
		--uikit-button-bg-color: #2a508f;
		--uikit-button-border-color: #2a508f;
    --uikit-button-color: #fff;
		--uikit-button-hover-bg-color: #3f619a;
    --uikit-button-hover-border-color: #3f619a;
    --uikit-button-outline-color: #5077b5; /* Added custom focus color for primary */
	}

	.uikit-button--primary:is(.uikit-button--outlined, .uikit-button--ghost, .uikit-button--link) {
	  --uikit-button-color: #2a508f;
		--uikit-button-hover-bg-color: #e9edf3;
	}

	.uikit-button--primary:is(.uikit-button--ghost, .uikit-button--link) {
		--uikit-button-hover-border-color: #e9edf3;
	}
	
	.uikit-button--secondary {
		--uikit-button-bg-color: #e5e6e7;
		--uikit-button-border-color: #e5e6e7;
		--uikit-button-color: #38393b;
		--uikit-button-hover-bg-color: #c9c9c9;
    --uikit-button-hover-border-color: #c9c9c9;
    --uikit-button-outline-color: #777779;
	}

	.uikit-button--secondary:is(.uikit-button--outlined, .uikit-button--ghost, .uikit-button--link) {
		--uikit-button-border-color: #a8a8a8;
		--uikit-button-hover-bg-color: #f2f2f2;
	}

	.uikit-button--secondary:is(.uikit-button--ghost, .uikit-button--link) {
		--uikit-button-hover-border-color: #f2f2f2;
	}
	
	.uikit-button--success {
		--uikit-button-bg-color: #008a00;
		--uikit-button-border-color: #008a00;
		--uikit-button-color: #fff;
		--uikit-button-hover-bg-color: #076d08;
    --uikit-button-hover-border-color: #076d08;
    --uikit-button-outline-color: #00a700;
	}

	.uikit-button--success:is(.uikit-button--outlined, .uikit-button--ghost, .uikit-button--link) {
	  --uikit-button-color: #076d08;
		--uikit-button-border-color: #008a00;
		--uikit-button-hover-bg-color: #f4f9f4;
	}

	.uikit-button--success:is(.uikit-button--ghost, .uikit-button--link) {
		--uikit-button-hover-border-color: #f4f9f4;
	}
	
	.uikit-button--warning {
		--uikit-button-color: #4c2100;
		--uikit-button-bg-color: #ffb224;
		--uikit-button-border-color: #ffb224;
		--uikit-button-hover-bg-color: #ffc96b;
		--uikit-button-hover-border-color: #ffc96b;
    --uikit-button-outline-color: #d98c00;
	}

	.uikit-button--warning:is(.uikit-button--outlined, .uikit-button--ghost, .uikit-button--link) {
		--uikit-button-hover-bg-color: #fff4d6;
		--uikit-button-color: #a35200;
    --uikit-button-border-color: #ffb224;
	}

	.uikit-button--warning:is(.uikit-button--ghost, .uikit-button--link) {
		--uikit-button-hover-border-color: #fff4d6;
	}
	
	.uikit-button--danger {
		--uikit-button-bg-color: #cb2a2f;
		--uikit-button-border-color: #cb2a2f; 
		--uikit-button-hover-bg-color: #e5484d;
		--uikit-button-hover-border-color: #e5484d;
    --uikit-button-outline-color: #f76469;
	}

	.uikit-button--danger:is(.uikit-button--outlined, .uikit-button--ghost, .uikit-button--link) {
		--uikit-button-color: #b22327;
    --uikit-button-border-color: #cb2a2f;
		--uikit-button-hover-bg-color: #fff0f0;
	}

	.uikit-button--danger:is(.uikit-button--ghost, .uikit-button--link) {
		--uikit-button-hover-border-color: #fff0f0;
	}
	
	.uikit-button--info {
		--uikit-button-bg-color: #0062d1;
		--uikit-button-border-color: #0062d1;
		--uikit-button-hover-bg-color: #0072f5;
		--uikit-button-hover-border-color: #0072f5;
    --uikit-button-outline-color: #4a98ff;
	}

	.uikit-button--info:is(.uikit-button--outlined, .uikit-button--ghost, .uikit-button--link) {
		--uikit-button-hover-bg-color: #e0f0ff;
		--uikit-button-color: #0068d6;
    --uikit-button-border-color: #0062d1;
	}

	.uikit-button--info:is(.uikit-button--ghost, .uikit-button--link) {
		--uikit-button-hover-border-color: #e0f0ff;
	}

  .uikit-button--full-width {
    width: 100%;
  }
}
	
@layer states {
  .uikit-button:disabled {
    cursor: not-allowed;
    color: var(--uikit-button-disabled-font-color);
    font-weight: var(--uikit-button-disabled-font-weight);
    background-color: var(--uikit-button-disabled-bg-color);
    border: var(--uikit-button-border-width) var(--uikit-button-border-style) var(--uikit-button-disabled-border-color);
    box-shadow: none;
  }
  
  .uikit-button:not(:disabled):hover {
    background-color: var(--uikit-button-hover-bg-color);
    border-color: var(--uikit-button-hover-border-color);
    cursor: pointer;
  }
  
  .uikit-button:active {
    transform: scale(var(--uikit-button-transform-scale));
  }

  .uikit-button:focus-visible {
    outline-offset: var(--uikit-button-outline-offset);
    outline: var(--uikit-button-outline-width) var(--uikit-button-outline-style) var(--uikit-button-outline-color);
    box-shadow: 0 0 0 2px rgba(0, 122, 204, 0.25);
  }
}

@layer sizes {
	.uikit-button--size-xs {
    --uikit-button-height: 1.5rem;
    --uikit-button-font-size: 0.75rem;
    --uikit-button-padding-inline: 0.5rem;
    --uikit-button-gap: 0.25rem;
  }
  
  .uikit-button--size-sm {
    --uikit-button-height: 2rem;
    --uikit-button-font-size: 0.8125rem;
    --uikit-button-padding-inline: 0.75rem;
    --uikit-button-gap: 0.375rem;
  }
  
  .uikit-button--size-lg {
    --uikit-button-height: 3rem;
    --uikit-button-font-size: 1rem;
    --uikit-button-padding-inline: 1.5rem;
    --uikit-button-gap: 0.625rem;
  }
  
  .uikit-button--size-xl {
    --uikit-button-height: 3.5rem;
    --uikit-button-font-size: 1.125rem;
    --uikit-button-padding-inline: 2rem;
    --uikit-button-gap: 0.75rem;
  }
}
	
@layer shapes {  
  .uikit-button--shape-square {
    --uikit-button-border-radius: 0;
		aspect-ratio: 1/1;
		justify-content: center;
    align-items: center;
    width: var(--uikit-button-height);
    padding: 0; 
  }
  
  .uikit-button--shape-pill {
    --uikit-button-border-radius: 9999px;
    padding-inline: calc(var(--uikit-button-padding-inline) * 1.5);
  }
  
  .uikit-button--shape-circle {
    --uikit-button-border-radius: 50%;
    aspect-ratio: 1/1;
    padding: 0;
    justify-content: center;
    align-items: center;
    width: var(--uikit-button-height);
  }
}

@layer accessibility {
  @media (prefers-reduced-motion: reduce) {
    .uikit-button {
      transition: none;
    }
    .uikit-button:active {
      transform: none;
    }
  }

  @media (forced-colors: active) {
    .uikit-button {
      border: 2px solid;
    }
    .uikit-button:focus-visible {
      outline: 3px solid;
    }
  }
}
</style>