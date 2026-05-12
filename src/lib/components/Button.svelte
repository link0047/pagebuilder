<script lang="ts">
	import type { Snippet } from "svelte";

	type Variant = "filled" | "outlined" | "ghost" | "link";
	type Color = "primary" | "secondary" | "success" | "danger" | "warning" | "info" | "default" | "neutral";
	type Size = "xs" | "sm" | "md" | "lg" | "xl";
	type Shape = "default" | "square" | "rounded-square" | "pill" | "circle";
	type Attached = "none" | "left" | "right" | "both";
	type IndicatorPosition = "left" | "right" | "overlay";

	type Props = {
		children?: Snippet,
		variant?: Variant,
		size?: Size,
		color?: Color,
		shape?: Shape,
		type?: "button" | "submit" | "reset",
    fullWidth?: boolean,
    ref?: HTMLButtonElement | null,
    attached?: Attached;
		truncate?: boolean;
		loading?: boolean;
		loadingIndicator?: Snippet;
		indicatorPosition?: IndicatorPosition;
		onclick?: (event: MouseEvent) => void;
		"aria-disabled"?: boolean;
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
		attached = "none",
		truncate = true,
		loading = false,
		loadingIndicator,
		indicatorPosition = "left",
		onclick,
		"aria-disabled": ariaDisabled,
		...restProps
	}: Props = $props();

	let effectiveIndicatorPosition = $derived(shape === "circle" || shape === "square" || shape === "rounded-square"
    ? "overlay"
    : indicatorPosition
	);

	function guardedClick(event: MouseEvent) {
		if (loading) {
			event.preventDefault();
			return;
		}

		onclick?.(event);
	}
</script>

{#snippet defaultSpinner()}
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="wcag-ui-button__indicator-icon">
    <path d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z" />
  </svg>
{/snippet}

{#snippet indicator(hasOverlay = false)}
	<span
		class="wcag-ui-button__indicator"
		class:wcag-ui-button__indicator--overlay={hasOverlay}
		aria-hidden="true"
	>
		{#if loadingIndicator}
			{@render loadingIndicator()}
		{:else}
			{@render defaultSpinner()}
		{/if}
	</span>
{/snippet}

<button
	bind:this={ref}
	class="wcag-ui-button"
  class:wcag-ui-button--full-width={fullWidth}
  class:wcag-ui-button--shape-square={shape === "square"}
  class:wcag-ui-button--shape-rounded-square={shape === "rounded-square"}
  class:wcag-ui-button--shape-pill={shape === "pill"}
  class:wcag-ui-button--shape-circle={shape === "circle"}
  class:wcag-ui-button--attached-left={attached === "left" || attached === "both"}
  class:wcag-ui-button--attached-right={attached === "right" || attached === "both"}
  class:wcag-ui-button--size-xs={size === "xs"}
  class:wcag-ui-button--size-sm={size === "sm"}
  class:wcag-ui-button--size-lg={size === "lg"}
  class:wcag-ui-button--size-xl={size === "xl"}
  class:wcag-ui-button--outlined={variant === "outlined"}
  class:wcag-ui-button--ghost={variant === "ghost"}
  class:wcag-ui-button--link={variant === "link"}
  class:wcag-ui-button--primary={color === "primary"}
  class:wcag-ui-button--secondary={color === "secondary"}
  class:wcag-ui-button--success={color === "success"}
  class:wcag-ui-button--warning={color === "warning"}
  class:wcag-ui-button--danger={color === "danger"}
  class:wcag-ui-button--neutral={color === "neutral"}
  class:wcag-ui-button--info={color === "info"}
	{type}
	aria-busy={loading || undefined}
	aria-disabled={loading || ariaDisabled || undefined}
	data-loading={loading || undefined}
	onclick={guardedClick}
	{...restProps}
>
	{#if loading && effectiveIndicatorPosition === "left"}
    {@render indicator()}
  {/if}

	<span
		class="wcag-ui-button__content"
		class:wcag-ui-button__content--truncate={truncate}
		class:wcag-ui-button__content--hidden={loading && effectiveIndicatorPosition === "overlay"}
	>
		{@render children?.()}
	</span>

	{#if loading && effectiveIndicatorPosition === "right"}
    {@render indicator()}
  {/if}

  {#if loading && effectiveIndicatorPosition === "overlay"}
    {@render indicator(true)}
  {/if}
</button>

<style>
@layer variables, base, variants, colors, sizes, shapes, states, accessibility;

@layer variables {
  :root {
    /* Base dimensions */
    --wcag-ui-button-height: 2.5rem;
    --wcag-ui-button-width: fit-content;
    --wcag-ui-button-gap: .25ch;
    --wcag-ui-button-padding-inline: .5rem;

    /* Typography */
    --wcag-ui-button-font-size: .875rem;
    --wcag-ui-button-font-weight: 500;
    --wcag-ui-button-color: #fff;
    --wcag-ui-button-letter-spacing: .04em;
    --wcag-ui-button-font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";

    /* Border styles */
    --wcag-ui-button-border-width: 1px;
    --wcag-ui-button-border-style: solid;
    --wcag-ui-button-border-color: #333335;
    --wcag-ui-button-border-radius: .5rem;

    /* Default colors */
    --wcag-ui-button-bg-color: #333335;
		--wcag-ui-button-outline-shadow-color: rgba(0, 122, 204, 0.25);

    /* Hover state */
    --wcag-ui-button-hover-bg-color: #555659;
    --wcag-ui-button-hover-border-color: #555659;

    /* Focus state */
    --wcag-ui-button-outline-color: #007acc;
    --wcag-ui-button-outline-style: solid;
    --wcag-ui-button-outline-width: 2px;
    --wcag-ui-button-outline-offset: 0;

    /* Disabled state */
    --wcag-ui-button-disabled-bg-color: #eeeeef;
    --wcag-ui-button-disabled-font-color: #444547;
    --wcag-ui-button-disabled-font-weight: 400;
    --wcag-ui-button-disabled-border-color: #eeeeef;
		--wcag-ui-button-aria-disabled-opacity: .85;

    /* Animation */
    --wcag-ui-button-transition-duration: 0.2s;
    --wcag-ui-button-transition-timing: cubic-bezier(0.4, 0, 0.2, 1);
    --wcag-ui-button-transform-scale: 0.97;
  }
}

@layer base {
  .wcag-ui-button {
    box-sizing: border-box;
    align-items: center;
    justify-content: center;
    gap: var(--wcag-ui-button-gap);
    appearance: none;
    width: var(--wcag-ui-button-width);
    background-color: var(--wcag-ui-button-bg-color);
    border: var(--wcag-ui-button-border-width) var(--wcag-ui-button-border-style) var(--wcag-ui-button-border-color);
    border-radius: var(--wcag-ui-button-border-radius);
    color: var(--wcag-ui-button-color);
    display: inline-flex;
    font-family: var(--wcag-ui-button-font-family);
    font-size: var(--wcag-ui-button-font-size);
    font-weight: var(--wcag-ui-button-font-weight);
    font-feature-settings: inherit;
    font-variation-settings: inherit;
    height: var(--wcag-ui-button-height);
    letter-spacing: var(--wcag-ui-button-letter-spacing);
    white-space: nowrap;
    padding-inline: var(--wcag-ui-button-padding-inline);
    position: relative;
    touch-action: manipulation;
    user-select: none;
    transition: background-color var(--wcag-ui-button-transition-duration) var(--wcag-ui-button-transition-timing),border-color var(--wcag-ui-button-transition-duration) var(--wcag-ui-button-transition-timing),transform var(--wcag-ui-button-transition-duration) var(--wcag-ui-button-transition-timing);
	}

	.wcag-ui-button__content {
		display: inline-flex;
		align-items: center;
    justify-content: center;
		gap: var(--wcag-ui-button-gap);
	}

	.wcag-ui-button__content--truncate {
		overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
	}

	.wcag-ui-button__content--hidden {
	  opacity: 0;
		pointer-events: none;
	  user-select: none;
	}

	.wcag-ui-button__indicator-icon {
	  width: 1em;
	  height: 1em;
	  fill: currentcolor;
	  animation: wcag-ui-spin 0.6s linear infinite;
	}

	.wcag-ui-button__indicator--overlay {
	  position: absolute;
	  inset: 0;
	  display: flex;
	  align-items: center;
	  justify-content: center;
	}
}

@layer variants {
	/* Variant styles */
	.wcag-ui-button--outlined {
    background-color: transparent;
    --wcag-ui-button-color: #38393b;
		--wcag-ui-button-border-width: 2px;
		--wcag-ui-button-outline-offset: -2px;
		--wcag-ui-button-border-color: #66676a;
		--wcag-ui-button-hover-bg-color: #eeeeef;
  }

  .wcag-ui-button--ghost {
    background-color: transparent;
    border-color: transparent;
	  --wcag-ui-button-color: #38393b;
			--wcag-ui-button-hover-bg-color: #eeeeef;
			--wcag-ui-button-hover-border-color: #eeeeef;
  }

  .wcag-ui-button--link {
    background-color: transparent;
    border-color: transparent;
    text-decoration: underline;
		--wcag-ui-button-color: #38393b;
		--wcag-ui-button-hover-bg-color: #eeeeef;
		--wcag-ui-button-hover-border-color: #eeeeef;
  }

  .wcag-ui-button--full-width {
    width: 100%;
  }
}

@layer colors {
	/* Color variants */
	.wcag-ui-button--primary {
		--wcag-ui-button-bg-color: #2a508f;
		--wcag-ui-button-border-color: #2a508f;
		--wcag-ui-button-color: #fff;
		--wcag-ui-button-hover-bg-color: #3f619a;
		--wcag-ui-button-hover-border-color: #3f619a;
		--wcag-ui-button-outline-color: #5077b5; /* Added custom focus color for primary */
	}

	.wcag-ui-button--primary:is(.wcag-ui-button--outlined, .wcag-ui-button--ghost, .wcag-ui-button--link) {
	  --wcag-ui-button-bg-color: transparent;
	  --wcag-ui-button-color: #2a508f;
			--wcag-ui-button-hover-bg-color: #e9edf3;
	}

	.wcag-ui-button--primary:is(.wcag-ui-button--ghost, .wcag-ui-button--link) {
    --wcag-ui-button-border-color: transparent;
    --wcag-ui-button-hover-border-color: #e9edf3;
	}

	.wcag-ui-button--secondary {
		--wcag-ui-button-bg-color: #e5e6e7;
		--wcag-ui-button-border-color: #e5e6e7;
		--wcag-ui-button-color: #38393b;
		--wcag-ui-button-hover-bg-color: #c9c9c9;
		--wcag-ui-button-hover-border-color: #c9c9c9;
		--wcag-ui-button-outline-color: #777779;
	}

	.wcag-ui-button--secondary:is(.wcag-ui-button--outlined, .wcag-ui-button--ghost, .wcag-ui-button--link) {
		--wcag-ui-button-border-color: #a8a8a8;
		--wcag-ui-button-hover-bg-color: #f2f2f2;
	}

	.wcag-ui-button--secondary:is(.wcag-ui-button--ghost, .wcag-ui-button--link) {
		--wcag-ui-button-hover-border-color: #f2f2f2;
	}

	.wcag-ui-button--success {
		--wcag-ui-button-bg-color: #008a00;
		--wcag-ui-button-border-color: #008a00;
		--wcag-ui-button-color: #fff;
		--wcag-ui-button-hover-bg-color: #076d08;
		--wcag-ui-button-hover-border-color: #076d08;
		--wcag-ui-button-outline-color: #00a700;
	}

	.wcag-ui-button--success:is(.wcag-ui-button--outlined, .wcag-ui-button--ghost, .wcag-ui-button--link) {
	  --wcag-ui-button-color: #076d08;
			--wcag-ui-button-border-color: #008a00;
			--wcag-ui-button-hover-bg-color: #f4f9f4;
	}

	.wcag-ui-button--success:is(.wcag-ui-button--ghost, .wcag-ui-button--link) {
		--wcag-ui-button-hover-border-color: #f4f9f4;
	}

	.wcag-ui-button--warning {
		--wcag-ui-button-color: #4c2100;
		--wcag-ui-button-bg-color: #ffb224;
		--wcag-ui-button-border-color: #ffb224;
		--wcag-ui-button-hover-bg-color: #ffc96b;
		--wcag-ui-button-hover-border-color: #ffc96b;
		--wcag-ui-button-outline-color: #d98c00;
	}

	.wcag-ui-button--warning:is(.wcag-ui-button--outlined, .wcag-ui-button--ghost, .wcag-ui-button--link) {
		--wcag-ui-button-hover-bg-color: #fff4d6;
		--wcag-ui-button-color: #a35200;
		--wcag-ui-button-border-color: #ffb224;
	}

	.wcag-ui-button--warning:is(.wcag-ui-button--ghost, .wcag-ui-button--link) {
		--wcag-ui-button-hover-border-color: #fff4d6;
	}

	.wcag-ui-button--danger {
		--wcag-ui-button-bg-color: #cb2a2f;
		--wcag-ui-button-border-color: #cb2a2f;
		--wcag-ui-button-hover-bg-color: #e5484d;
		--wcag-ui-button-hover-border-color: #e5484d;
		--wcag-ui-button-outline-color: #f76469;
	}

	.wcag-ui-button--danger:is(.wcag-ui-button--outlined, .wcag-ui-button--ghost, .wcag-ui-button--link) {
		--wcag-ui-button-color: #b22327;
		--wcag-ui-button-border-color: #cb2a2f;
		--wcag-ui-button-hover-bg-color: #fff0f0;
	}

	.wcag-ui-button--danger:is(.wcag-ui-button--ghost, .wcag-ui-button--link) {
		--wcag-ui-button-hover-border-color: #fff0f0;
	}

	.wcag-ui-button--info {
		--wcag-ui-button-bg-color: #0062d1;
		--wcag-ui-button-border-color: #0062d1;
		--wcag-ui-button-hover-bg-color: #0072f5;
		--wcag-ui-button-hover-border-color: #0072f5;
		--wcag-ui-button-outline-color: #4a98ff;
	}

	.wcag-ui-button--info:is(.wcag-ui-button--outlined, .wcag-ui-button--ghost, .wcag-ui-button--link) {
		--wcag-ui-button-hover-bg-color: #e0f0ff;
		--wcag-ui-button-color: #0068d6;
		--wcag-ui-button-border-color: #0062d1;
	}

	.wcag-ui-button--info:is(.wcag-ui-button--ghost, .wcag-ui-button--link) {
		--wcag-ui-button-hover-border-color: #e0f0ff;
	}

  .wcag-ui-button--neutral {
    --wcag-ui-button-bg-color: #fafafa;
    --wcag-ui-button-border-color: #e5e6e7;
    --wcag-ui-button-color: #38393b;
    --wcag-ui-button-hover-bg-color: #f0f0f0;
    --wcag-ui-button-hover-border-color: #d1d2d3;
    --wcag-ui-button-outline-color: #a8a8a8;
  }
}

@layer states {
  .wcag-ui-button:disabled {
    cursor: not-allowed;
    color: var(--wcag-ui-button-disabled-font-color);
    font-weight: var(--wcag-ui-button-disabled-font-weight);
    background-color: var(--wcag-ui-button-disabled-bg-color);
    border: var(--wcag-ui-button-border-width) var(--wcag-ui-button-border-style) var(--wcag-ui-button-disabled-border-color);
    box-shadow: none;
  }

  .wcag-ui-button:not(:disabled):hover {
    background-color: var(--wcag-ui-button-hover-bg-color);
    border-color: var(--wcag-ui-button-hover-border-color);
    cursor: pointer;
  }

  .wcag-ui-button:not(:disabled):active {
    transform: scale(var(--wcag-ui-button-transform-scale));
  }

  .wcag-ui-button:focus-visible {
    outline-offset: var(--wcag-ui-button-outline-offset);
    outline: var(--wcag-ui-button-outline-width) var(--wcag-ui-button-outline-style) var(--wcag-ui-button-outline-color);
    box-shadow: 0 0 0 2px var(--wcag-ui-button-outline-shadow-color);
  }

	.wcag-ui-button[aria-disabled="true"] {
	opacity: var(--wcag-ui-button-aria-disabled-opacity, 0.5);
	}

	.wcag-ui-button[aria-disabled="true"]:not([data-loading]) {
	  cursor: not-allowed;
	}

	.wcag-ui-button[data-loading]:hover {
	  cursor: wait;
	}
}

@layer sizes {
	.wcag-ui-button--size-xs {
	--wcag-ui-button-height: 1.5rem;
	--wcag-ui-button-font-size: 0.75rem;
	--wcag-ui-button-padding-inline: 0.5rem;
	--wcag-ui-button-gap: 0.25rem;
  }

	.wcag-ui-button--size-xs::before {
	  content: '';
	  position: absolute;
	  top: 50%;
	  left: 50%;
	  min-width: 44px;
	  min-height: 44px;
	  transform: translate(-50%, -50%);
	}

  .wcag-ui-button--size-sm {
    --wcag-ui-button-height: 2rem;
    --wcag-ui-button-font-size: 0.8125rem;
    --wcag-ui-button-padding-inline: 0.75rem;
    --wcag-ui-button-gap: 0.375rem;
  }

  .wcag-ui-button--size-lg {
    --wcag-ui-button-height: 3rem;
    --wcag-ui-button-font-size: 1rem;
    --wcag-ui-button-padding-inline: 1.5rem;
    --wcag-ui-button-gap: 0.625rem;
  }

  .wcag-ui-button--size-xl {
    --wcag-ui-button-height: 3.5rem;
    --wcag-ui-button-font-size: 1.125rem;
    --wcag-ui-button-padding-inline: 2rem;
    --wcag-ui-button-gap: 0.75rem;
  }
}

@layer shapes {
  .wcag-ui-button--shape-rounded-square,
  .wcag-ui-button--shape-square {
    --wcag-ui-button-border-radius: 0;
		aspect-ratio: 1/1;
		justify-content: center;
    align-items: center;
    width: var(--wcag-ui-button-height);
    padding: 0;
  }

  .wcag-ui-button--shape-rounded-square {
    --wcag-ui-button-border-radius: .5rem;
  }

  .wcag-ui-button--shape-pill {
    --wcag-ui-button-border-radius: 9999px;
    padding-inline: calc(var(--wcag-ui-button-padding-inline) * 1.5);
  }

  .wcag-ui-button--shape-circle {
    --wcag-ui-button-border-radius: 50%;
    aspect-ratio: 1/1;
    padding: 0;
    justify-content: center;
    align-items: center;
    width: var(--wcag-ui-button-height);
  }

  .wcag-ui-button--attached-left {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    border-left-width: 0;
  }

  .wcag-ui-button--attached-right {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    border-right-width: 0;
  }
}

@layer accessibility {
  @media (prefers-reduced-motion: reduce) {
    .wcag-ui-button {
      transition: none;
    }
    .wcag-ui-button:active {
      transform: none;
    }

		.wcag-ui-button__indicator-icon {
	    animation: none;
	  }
  }

  @media (forced-colors: active) {
    .wcag-ui-button {
      border: 2px solid;
    }
    .wcag-ui-button:focus-visible {
      outline: 3px solid;
    }
  }
}

@keyframes wcag-ui-spin {
	to { transform: rotate(360deg); }
}
</style>
