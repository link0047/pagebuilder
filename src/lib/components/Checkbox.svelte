<script lang="ts">
	import { type Snippet } from "svelte";
	import { generateId } from "$lib/utils/unique-id-generator";

	type Size = "xs" | "sm" | "md" | "lg" | "xl";
  type Color = "default" | "primary" | "secondary" | "success" | "warning" | "danger" | "info";
	type Shape = "square" | "rounded" | "curved";
	
	type Props = {
		children?: Snippet,
		size?: Size,
		shape?: Shape,
    color?: Color,
		indeterminate?: boolean,
		required?: boolean,
    error?: boolean,
    [key: string]: unknown;
	};
	
	const uid = generateId("checkbox");
	const id = `uikit-checkbox-${uid}`;
	const labelId = `${id}-label`;
	
	let {
		children,
		size = "sm",
		shape = "rounded",
		color = "default",
		indeterminate = false,
		required = false,
		error = false,
		...restProps
	}: Props = $props();
  
	let ref: HTMLInputElement;

	$effect(() => {
		if (ref) {
			ref.indeterminate = indeterminate;
		}
	});
</script>

<div 
	class="uikit-checkbox"
	class:uikit-checkbox--primary={color === "primary"}
	class:uikit-checkbox--secondary={color === "secondary"}
	class:uikit-checkbox--success={color === "success"}
	class:uikit-checkbox--warning={color === "warning"}
	class:uikit-checkbox--danger={color === "danger"}
	class:uikit-checkbox--info={color === "info"}
	class:uikit-checkbox--size-xs={size === "xs"}
	class:uikit-checkbox--size-md={size === "md"}
	class:uikit-checkbox--size-lg={size === "lg"}
	class:uikit-checkbox--size-xl={size === "xl"}
	class:uikit-checkbox--shape-square={shape === "square"}
	class:uikit-checkbox--shape-rounded={shape === "rounded"}
	class:uikit-checkbox--shape-curved={shape === "curved"}
>
	<input 
		bind:this={ref}
		{id}
		class="uikit-checkbox__native-control"
		type="checkbox"
		aria-invalid={error}
		{...restProps}
	/>
	<label id={labelId} class="uikit-checkbox__label" for={id}>
		<svg class="uikit-checkbox__icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
			<path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z" />
		</svg>
		{@render children?.()}
	</label>
</div>

<style>
@layer variables, base, colors, sizes, shapes, states, accessibility;

@layer variables {
  :root {
    --uikit-checkbox-border-color: #94919a;
    --uikit-checkbox-hover-border-color: #323234;
    --uikit-checkbox-checked-color: #1967d2;
    --uikit-checkbox-outline-color: #1967d2;
    --uikit-checkbox-icon-fill: #fff;
    
    --uikit-checkbox-size: 1.25rem;
    --uikit-checkbox-border-width: 2.25px;
    --uikit-checkbox-border-radius: .25rem;
    --uikit-checkbox-font-size: 0.875rem;
    --uikit-checkbox-font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
    --uikit-checkbox-gap: 0.5rem;
    
    --uikit-checkbox-outline-width: 2px;
    --uikit-checkbox-outline-offset: 2px;
    
    --uikit-checkbox-transition-duration: 0.25s;
    --uikit-checkbox-transition-timing: cubic-bezier(0.4, 0, 0.2, 1);
  }
}

@layer base {
  .uikit-checkbox {
    position: relative;
    display: inline-flex;
  }
  
  .uikit-checkbox__native-control {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    opacity: 0;
    z-index: -1;
    cursor: inherit;
  }
  
  .uikit-checkbox__label {
    display: inline-flex;
    align-items: center;
    font-size: var(--uikit-checkbox-font-size);
    line-height: 1;
    gap: var(--uikit-checkbox-gap);
    cursor: pointer;
    user-select: none;
    font-family: var(--uikit-checkbox-font-family);
  }
  
  .uikit-checkbox__icon {
    box-sizing: border-box;
    width: var(--uikit-checkbox-size);
    height: var(--uikit-checkbox-size);
    border: var(--uikit-checkbox-border-width) solid var(--uikit-checkbox-border-color);
    border-radius: var(--uikit-checkbox-border-radius);
    fill: var(--uikit-checkbox-icon-fill);
    transition: border-color var(--uikit-checkbox-transition-duration) var(--uikit-checkbox-transition-timing);
  }
  
  .uikit-checkbox__icon path {
    opacity: 0;
    transition: opacity var(--uikit-checkbox-transition-duration) var(--uikit-checkbox-transition-timing);
  }
}

@layer colors {
  .uikit-checkbox--primary {
		--uikit-checkbox-border-color: #5079bd;
    --uikit-checkbox-hover-border-color: #2a508f;
    --uikit-checkbox-checked-color: #2a508f;
	}
	
	.uikit-checkbox--secondary {
		--uikit-checkbox-border-color: #e5e6e7;
    --uikit-checkbox-hover-border-color: #c9c9c9;
    --uikit-checkbox-checked-color: #c9c9c9;
	}
	
	.uikit-checkbox--success {
		--uikit-checkbox-border-color: #94919a;
    --uikit-checkbox-hover-border-color: #323234;
    --uikit-checkbox-checked-color: #1967d2;
	}
	
	.uikit-checkbox--warning {
		--uikit-checkbox-border-color: #94919a;
    --uikit-checkbox-hover-border-color: #323234;
    --uikit-checkbox-checked-color: #1967d2;
	}
	
	.uikit-checkbox--danger {
		--uikit-checkbox-border-color: #94919a;
    --uikit-checkbox-hover-border-color: #323234;
    --uikit-checkbox-checked-color: #1967d2;
	}
	
	.uikit-checkbox--info {
		--uikit-checkbox-border-color: #94919a;
    --uikit-checkbox-hover-border-color: #323234;
    --uikit-checkbox-checked-color: #1967d2;
	}
}

@layer sizes {
  .uikit-checkbox--size-xs {
		--uikit-checkbox-size: 1rem;
	}
	
	.uikit-checkbox--size-md {
		--uikit-checkbox-size: 1.5rem;
	}
	
	.uikit-checkbox--size-lg {
		--uikit-checkbox-size: 1.75rem;
	}
	
	.uikit-checkbox--size-xl {
		--uikit-checkbox-size: 2rem;
	}
}

@layer shapes {
  .uikit-checkbox--shape-square {
		--uikit-checkbox-border-radius: 0;
	}
	
	.uikit-checkbox--shape-curved {
		--uikit-checkbox-border-radius: .5rem;
	}
}

@layer states {
  :has(.uikit-checkbox__native-control:not(:disabled):not(:checked):hover) .uikit-checkbox__icon {
    border-color: var(--uikit-checkbox-hover-border-color);
  }
  
  :has(.uikit-checkbox__native-control:focus-visible) .uikit-checkbox__icon {
    outline: var(--uikit-checkbox-outline-width) solid var(--uikit-checkbox-outline-color);
    outline-offset: var(--uikit-checkbox-outline-offset);
  }
  
  :has(.uikit-checkbox__native-control:checked) .uikit-checkbox__icon {
    background-color: var(--uikit-checkbox-checked-color);
    border-color: var(--uikit-checkbox-checked-color);
  }
  
  :has(.uikit-checkbox__native-control:checked) path {
    opacity: 1;
  }
  
  /* Error state */
  :has(.uikit-checkbox__native-control[aria-invalid="true"]) .uikit-checkbox__icon {
    border-color: var(--uikit-checkbox-error-color, #d93025);
  }
  
  /* Disabled state */
  :has(.uikit-checkbox__native-control:disabled) .uikit-checkbox__icon {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  :has(.uikit-checkbox__native-control:disabled) .uikit-checkbox__label {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

@layer accessibility {
  @media (prefers-reduced-motion: reduce) {
    .uikit-checkbox__icon,
    .uikit-checkbox__icon path {
      transition: none;
    }
  }
  
  @media (forced-colors: active) {
    .uikit-checkbox__icon {
      border-color: ButtonBorder;
    }
    
    :has(.uikit-checkbox__native-control:checked) .uikit-checkbox__icon {
      background-color: Highlight;
      border-color: Highlight;
    }
    
    :has(.uikit-checkbox__native-control:focus-visible) .uikit-checkbox__icon {
      outline-color: ButtonText;
    }
  }
}
</style>