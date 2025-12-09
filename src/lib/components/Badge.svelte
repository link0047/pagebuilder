<script lang="ts">
	import { type Snippet } from "svelte";
	
	type Variant = "filled" | "outlined";
	type Color = "primary" | "secondary" | "success" | "danger" | "warning" | "info" | "default";
	type Size = "sm" | "md" | "lg";
	type Shape = "default" | "square" | "pill";

	type Props = {
		children?: Snippet;
		variant?: Variant;
		color?: Color;
		size?: Size;
		shape?: Shape;
	}
	
	let { 
		children,
		variant = "filled",
		color = "default",
		size = "md",
		shape = "default"
	}: Props = $props();
</script>

<span 
	class="uikit-badge"
	class:uikit-badge--outlined={variant === "outlined"}
	class:uikit-badge--primary={color === "primary"}
	class:uikit-badge--secondary={color === "secondary"}
	class:uikit-badge--success={color === "success"}
	class:uikit-badge--warning={color === "warning"}
	class:uikit-badge--danger={color === "danger"}
	class:uikit-badge--info={color === "info"}
	class:uikit-badge--size-sm={size === "sm"}
	class:uikit-badge--size-lg={size === "lg"}
	class:uikit-badge--shape-square={shape === "square"}
	class:uikit-badge--shape-pill={shape === "pill"}
>
	{@render children?.()}
</span>

<style>
	@layer variables, base, colors, variants, sizes, shapes;

	@layer variables {
		:root {
			--uikit-badge-color: #e6e6e7;
			--uikit-badge-bg-color: #333335;
			--uikit-badge-height: 1.5rem;
			--uikit-badge-padding-inline: .5rem;
			
			--uikit-badge-border-width: 0;
			--uikit-badge-border-style: solid;
			--uikit-badge-border-color: #333335;
			--uikit-badge-border-radius: .25rem;
			
			--uikit-badge-font-size: .75rem;
			--uikit-badge-font-weight: 500;
	    --uikit-badge-letter-spacing: .04em;
	    --uikit-badge-font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
		}
	}

	@layer base {
		.uikit-badge {
			display: inline-flex;
			align-items: center;
			justify-content: center;
			border-radius: var(--uikit-badge-border-radius);
			border: var(--uikit-badge-border-width) var(--uikit-badge-border-style) var(--uikit-badge-border-color);
			padding-inline: var(--uikit-badge-padding-inline);
			height: var(--uikit-badge-height);
			color: var(--uikit-badge-color);
			background-color: var(--uikit-badge-bg-color);
			box-sizing: border-box;
			font-family: var(--uikit-badge-font-family);
			font-size: var(--uikit-badge-font-size);
			font-weight: var(--uikit-badge-font-weight);
			letter-spacing: var(--uikit-badge-letter-spacing);
			text-transform: uppercase;
		}
	}

	@layer colors {
		.uikit-badge--primary {
	    --uikit-badge-color: #fff;
			--uikit-badge-bg-color: #2a508f;
			--uikit-badge-border-color: #1c2d4f;
		}
		
		.uikit-badge--secondary {
			--uikit-badge-bg-color: #e5e6e7;
			--uikit-badge-border-color: #95999c;
		}
		
		.uikit-badge--success {
			--uikit-badge-color: #fff;
			--uikit-badge-bg-color: #008a00;
			--uikit-badge-border-color: #0b5c0d;
		}
		
		.uikit-badge--warning {
			--uikit-badge-color: #4c2100;
			--uikit-badge-bg-color: #ffb224;
			--uikit-badge-border-color: #dd6702;
		}
		
		.uikit-badge--danger {
			--uikit-badge-color: #fff;
			--uikit-badge-bg-color: #cb2a2f;
			--uikit-badge-border-color: #932125;
		}
		
		.uikit-badge--info {
			--uikit-badge-bg-color: #0062d1;
			--uikit-badge-border-color: #0a3261;
		}
	}

	@layer variants {
		.uikit-badge--outlined {
			--uikit-badge-border-width: 2px;
		}
	}

	@layer sizes {
		.uikit-badge--size-sm {
			--uikit-badge-height: 1rem;
		}
		
		.uikit-badge--size-lg {
			--uikit-badge-height: 2rem;
		}
	}

	@layer shapes {
		.uikit-badge--shape-pill {
			--uikit-badge-padding-inline: .75rem;
			--uikit-badge-border-radius: calc(var(--uikit-badge-height) / 2);
		}

		.uikit-badge--shape-square {
			--uikit-badge-border-radius: 0;
		}
	}
</style>