<script lang="ts">
	import { type Snippet } from "svelte";
	
	type Variant = "filled" | "outlined" | "elevated";
	type Shape = "squared" | "rounded" | "curved";
	type Layout = "default" | "media" | "horizontal";
	type Elevation = 0 | 1 | 2 | 3 | 4 | 5;
	
	type Props = {
		children?: Snippet,
		shape?: Shape,
		variant?: Variant,
		layout?: Layout,
		elevation?: Elevation,
		[key: string]: unknown;
	}

	let {
		children,
		variant = "outlined",
		shape = "rounded",
		elevation,
		layout = "default",
		...restProps
	}: Props = $props();

	function getValidElevation(elevation: Elevation | undefined, variant: Variant): Elevation {
		const validElevations = [0, 1, 2, 3, 4, 5] as const;
		const defaultElevation = variant === "elevated" ? 1 : 0;
		
		if (elevation === undefined) {
			return defaultElevation;
		}
		
		if (validElevations.includes(elevation)) {
			return elevation;
		}
		
		if (typeof window !== 'undefined') {
			console.warn(`Invalid elevation "${elevation}". Using default "${defaultElevation}".`);
		}
		return defaultElevation;
	}
	
	const computedElevation = getValidElevation(elevation, variant);
</script>

<div 
	class="uikit-card"
	class:uikit-card--filled={variant === "filled"}
	class:uikit-card--elevated={variant === "elevated"}
	class:uikit-card--elevation-1={computedElevation === 1}
	class:uikit-card--elevation-2={computedElevation === 2}
	class:uikit-card--elevation-3={computedElevation === 3}
	class:uikit-card--elevation-4={computedElevation === 4}
	class:uikit-card--elevation-5={computedElevation === 5}
	class:uikit-card--shape-squared={shape === "squared"}
	class:uikit-card--shape-curved={shape === "curved"}
	{...restProps}
>
	{@render children?.()}
</div>

<style>
	@layer variables, base, variants, shapes, states, accessibility;

	@layer variables {
		:root {
			/* base dimensions */
			--uikit-card-padding-block: .5rem;
			--uikit-card-padding-inline: .5rem;
			--uikit-card-box-shadow: none;
			--uikit-card-background-color: #fff;

			/* typography */
			--uikit-card-font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
			--uikit-card-font-size: 1rem;
			--uikit-card-font-weight: 500;
			--uikit-card-color: #333;

			/* border styles */
			--uikit-card-border-width: 1px;
			--uikit-card-border-style: solid;
			--uikit-card-border-color: #cac4cf;
			--uikit-card-border-radius: .5rem;

			/* layout styles */
			--uikit-card-grid-template-areas: "content";
	    --uikit-card-grid-template-rows: 1fr;
	    --uikit-card-grid-template-columns: 1fr;
		}
	}
	
	@layer base {
		.uikit-card {
			position: relative;
			box-sizing: border-box;
			display: grid;
			grid-template-areas: var(--uikit-card-grid-template-areas);
	    grid-template-rows: var(--uikit-card-grid-template-rows);
	    grid-template-columns: var(--uikit-card-grid-template-columns);
			font-family: var(--uikit-card-font-family);
			font-size: var(--uikit-card-font-size);
	    font-weight: var(--uikit-card-font-weight);
	    color: var(--uikit-card-color);
			background-color: var(--uikit-card-background-color);
			padding-block: var(--uikit-card-padding-block);
			padding-inline: var(--uikit-card-padding-inline);
			border: var(--uikit-card-border-width) var(--uikit-card-border-style) var(--uikit-card-border-color);
	    border-radius: var(--uikit-card-border-radius);
			box-shadow: var(--uikit-card-box-shadow);
		}
	}

	@layer variants {
		.uikit-card--filled {
	    --uikit-card-background-color: #f5f5f5;
	    border-color: transparent;
	  }
		
		.uikit-card--elevated {
	    border-color: transparent;
	  }
		
    .uikit-card--elevation-1 { 
	    --uikit-card-box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.3), 0px 1px 3px 1px rgba(0, 0, 0, 0.15);
		}
    
		.uikit-card--elevation-2 { 
	    --uikit-card-box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.3), 0px 2px 6px 2px rgba(0, 0, 0, 0.15);
		}
    
		.uikit-card--elevation-3 { 
	    --uikit-card-box-shadow: 0px 4px 8px 3px rgba(0, 0, 0, 0.15), 0px 1px 3px 0px rgba(0, 0, 0, 0.30);
		}
    
		.uikit-card--elevation-4 { 
      --uikit-card-box-shadow: 0px 6px 10px 4px rgba(0, 0, 0, 0.15), 0px 2px 3px 0px rgba(0, 0, 0, 0.30);
		}
    
		.uikit-card--elevation-5 { 
      --uikit-card-box-shadow: 0px 8px 12px 6px rgba(0, 0, 0, 0.15), 0px 4px 4px 0px rgba(0, 0, 0, 0.30);
		}
	}
	
	@layer shapes {
	  .uikit-card--shape-squared {
	    --uikit-card-border-radius: 0;
	  }
	  
	  .uikit-card--shape-curved {
	    --uikit-card-border-radius: 1rem;
			--uikit-card-padding-inline: .75rem;
	  }
	}
	
	@layer states {}
	
	@layer accessibility {}
</style>