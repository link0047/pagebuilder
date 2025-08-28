<script lang="ts">
	import { onMount, onDestroy, type Snippet } from "svelte";
	import { generateId } from "$lib/utils/unique-id-generator";
	import Portal from "$lib/components/Portal.svelte";

	// Types
	type BasePlacement = "top" | "bottom" | "left" | "right";
	type Alignment = "start" | "center" | "end";
	type Placement = BasePlacement | `${BasePlacement}-${Alignment}`;
	type Elevation = 0 | 1 | 2 | 3 | 4 | 6 | 8;
	
	type Position = {
	  top: number;
	  left: number;
	  placement: Placement;
	}
	
	type Rect = {
	  top: number;
	  left: number;
	  bottom: number;
	  right: number;
	  width: number;
	  height: number;
	}
	
	type PositionConfig = {
	  anchor: Rect;
	  popover: Rect;
	  viewport: Rect;
	  gap: number;
	  preferredPlacement: Placement;
	}
	
  type Props = {
    children?: Snippet,
		elevation?: Elevation,
		gap?: number,
		anchor?: HTMLElement | null,
		placement?: Placement,
		open?: boolean
  }
	
	// Constants
	const VALID_BASE_PLACEMENTS = ["top", "bottom", "left", "right"] as const;
	const VALID_ALIGNMENTS = ["start", "center", "end"] as const;
	const VALID_ELEVATIONS = [0, 1, 2, 3, 4, 6, 8] as const; 
  const uid = generateId("popover");
  const id = `aria-uikit-popover-${uid}`;
	const controller = new AbortController();

	// Props
	let {
		children,
		elevation = 8,
		gap = 4,
		anchor = null,
		placement: rawPlacement = "bottom-start",
		open = $bindable(false)
	}: Props = $props();

	// State
	let popoverElement: HTMLDivElement;
	let placement = validatePlacement(rawPlacement);
	const safeElevation = validateElevation(elevation);
	
	function validatePlacement(rawPlacement: string): Placement {
	  const [base, alignment] = rawPlacement.split("-");
	  const isValid = VALID_BASE_PLACEMENTS.includes(base as BasePlacement) && 
	         (!alignment || VALID_ALIGNMENTS.includes(alignment as Alignment));
		
		if (!isValid) {
		  console.warn(`Invalid popover placement: "${rawPlacement}". Falling back to "bottom-start"`);
		}

		return isValid ? (rawPlacement as Placement) : "bottom-start";
	}

	function validateElevation(elevation: Elevation): Elevation {
		const isValid = VALID_ELEVATIONS.includes(elevation);
		
		if (!isValid) {
		  console.warn(`Invalid popover elevation: "${elevation}". Falling back to 8`);
		}

		return isValid ? elevation : 8;
	}

	// Calculate position for a specific placement without collision detection
	function calculatePlacementPosition(
	  anchor: Rect,
	  popover: Rect,
	  placement: Placement,
	  gap: number
	): { top: number; left: number } {
	  const [basePlacement, alignment = "center"] = placement.split("-") as [BasePlacement, Alignment?];
	  
	  let top = 0;
	  let left = 0;
	  
	  // Calculate base position
	  switch (basePlacement) {
	    case "top":
	      top = anchor.top - popover.height - gap;
	      left = anchor.left + (anchor.width - popover.width) / 2; // center by default
	      break;
	    case "bottom":
	      top = anchor.bottom + gap;
	      left = anchor.left + (anchor.width - popover.width) / 2; // center by default
	      break;
	    case "left":
	      left = anchor.left - popover.width - gap;
	      top = anchor.top + (anchor.height - popover.height) / 2; // center by default
	      break;
	    case "right":
	      left = anchor.right + gap;
	      top = anchor.top + (anchor.height - popover.height) / 2; // center by default
	      break;
	  }
	  
	  // Apply alignment adjustments
	  switch (basePlacement) {
	    case "top":
	    case "bottom":
	      if (alignment === "start") {
	        left = anchor.left;
	      } else if (alignment === "end") {
	        left = anchor.right - popover.width;
	      }
	      break;
	    case "left":
	    case "right":
	      if (alignment === "start") {
	        top = anchor.top;
	      } else if (alignment === "end") {
	        top = anchor.bottom - popover.height;
	      }
	      break;
	  }
	  
	  return { top, left };
	}
	
	// Check if a position fits within the viewport
	function isPositionValid(
	  position: { top: number; left: number },
	  popover: Rect,
	  viewport: Rect,
	  gap: number
	): boolean {
	  return (
	    position.left >= gap &&
	    position.top >= gap &&
	    position.left + popover.width <= viewport.width - gap &&
	    position.top + popover.height <= viewport.height - gap
	  );
	}
	
	// Calculate available space for a given placement
	function calculateAvailableSpace(
	  anchor: Rect,
	  viewport: Rect,
	  basePlacement: BasePlacement,
	  gap: number
	): number {
	  switch (basePlacement) {
	    case "top":
	      return anchor.top - gap;
	    case "bottom":
	      return viewport.height - anchor.bottom - gap;
	    case "left":
	      return anchor.left - gap;
	    case "right":
	      return viewport.width - anchor.right - gap;
	  }
	}
	
	// Generate all possible placements in priority order
	function getPlacementCandidates(preferredPlacement: Placement): Placement[] {
	  const [preferredBase, preferredAlignment = "center"] = preferredPlacement.split("-") as [BasePlacement, Alignment?];
	  
	  const basePlacements: BasePlacement[] = ["top", "bottom", "left", "right"];
	  const alignments: Alignment[] = ["center", "start", "end"];
	  
	  // Reorder base placements to prioritize preferred
	  const baseMap: Record<BasePlacement, BasePlacement[]> = {
	    top: ["top", "bottom", "left", "right"],
	    bottom: ["bottom", "top", "left", "right"], 
	    left: ["left", "right", "top", "bottom"],
	    right: ["right", "left", "top", "bottom"]
	  };
	  const orderedBases = baseMap[preferredBase];
	  
	  const candidates: Placement[] = [];
	  
	  // First, try preferred base with all alignments (preferred alignment first)
	  const alignmentMap: Record<Alignment, Alignment[]> = {
	    center: ["center", "start", "end"],
	    start: ["start", "center", "end"],
	    end: ["end", "center", "start"]
	  };
	  const alignmentOrder = alignmentMap[preferredAlignment];
	  
	  for (const alignment of alignmentOrder) {
	    candidates.push(alignment === "center" ? preferredBase : `${preferredBase}-${alignment}` as Placement);
	  }
	  
	  // Then try other bases with all alignments
	  for (const base of orderedBases.slice(1)) {
	    for (const alignment of alignmentOrder) {
	      candidates.push(alignment === "center" ? base : `${base}-${alignment}` as Placement);
	    }
	  }
	  
	  return candidates;
	}
	
	// Main positioning function with smart collision detection
	function calculateOptimalPosition(config: PositionConfig): Position {
	  const { anchor, popover, viewport, gap, preferredPlacement } = config;
	  
	  // Get all placement candidates in priority order
	  const candidates = getPlacementCandidates(preferredPlacement);
	  
	  let bestPosition: Position | null = null;
	  let bestScore = -1;
	  
	  for (const placement of candidates) {
	    const position = calculatePlacementPosition(anchor, popover, placement, gap);
	    
	    // Check if this position is completely valid
	    if (isPositionValid(position, popover, viewport, gap)) {
	      return { ...position, placement };
	    }
	    
	    // If no perfect fit, calculate a score for this position choice
	    const overflowX = Math.max(0, 
	      Math.max(gap - position.left, position.left + popover.width - (viewport.width - gap))
	    );
	    const overflowY = Math.max(0,
	      Math.max(gap - position.top, position.top + popover.height - (viewport.height - gap))
	    );
	    
	    const totalOverflow = overflowX + overflowY;
	    const score = -totalOverflow; // Higher score is better (less overflow)
	    
	    if (score > bestScore) {
	      bestScore = score;
	      bestPosition = { ...position, placement };
	    }
	  }
	  
	  // If we get here, no placement was perfect, so use the best one we found
	  // and clamp it to viewport bounds
	  if (bestPosition) {
	    bestPosition.left = Math.max(gap, Math.min(bestPosition.left, viewport.width - popover.width - gap));
	    bestPosition.top = Math.max(gap, Math.min(bestPosition.top, viewport.height - popover.height - gap));
	  }
	  
	  return bestPosition || { 
	    top: gap, 
	    left: gap, 
	    placement: preferredPlacement 
	  };
	}
	
	// Updated main function for the Svelte component
	function updatePosition() {
	  if (!anchor || !popoverElement) return;
	  
	  requestAnimationFrame(() => {
	    const anchorRect = anchor.getBoundingClientRect();
	    const popoverRect = popoverElement.getBoundingClientRect();
	    const viewport = {
	      top: 0,
	      left: 0,
	      bottom: window.innerHeight,
	      right: window.innerWidth,
	      width: window.innerWidth,
	      height: window.innerHeight
	    };
	    
	    const config: PositionConfig = {
	      anchor: anchorRect,
	      popover: popoverRect,
	      viewport,
	      gap,
	      preferredPlacement: placement
	    };
	    
	    const { left, top} = calculateOptimalPosition(config);	    
	    popoverElement.style.transform = `translate(${left}px, ${top}px)`;
	  });
	}

	function handleKeydown({ key }: KeyboardEvent) {
		if (key === "Escape") {
			open = false;
		}
	}

	function handleAnchorClick() {
		updatePosition();
		open = !open;
	}

	function handleDocumentClick({ target }: MouseEvent) {
		if (!open) return;
		if (!popoverElement.contains(target as Node) && popoverElement !== target && !anchor?.contains(target as Node)) {
			open = false;
		}
	}

	function handleResize() {
		if (open) {
			updatePosition();
		}
	}

	// Lifecycle
	onMount(() => {
		if (anchor instanceof Element) {
			const { signal } = controller;
			document.addEventListener("keydown", handleKeydown, { signal });
			document.addEventListener("click", handleDocumentClick, { signal });
			anchor.addEventListener("click", handleAnchorClick, { signal });
		}
	});
	
	onDestroy(() => {
		controller.abort();
	});
</script>

<svelte:window onresize={handleResize} />
<Portal>
	<div
		{id}
		class="popover"
		class:popover--elevation-0={safeElevation === 0}
		class:popover--elevation-1={safeElevation === 1}
		class:popover--elevation-2={safeElevation === 2}
		class:popover--elevation-3={safeElevation === 3}
		class:popover--elevation-4={safeElevation === 4}
		class:popover--elevation-6={safeElevation === 6}
		class:popover--elevation-8={safeElevation === 8}
		class:popover--open={open}
		bind:this={popoverElement}
	>
		{@render children?.()}
	</div>
</Portal>

<style>
	:root {
		--uikit-popover-z-index: 98;
		--uikit-popover-border: none;
		--uikit-popover-border-radius: .25rem;
		--uikit-popover-background-color: #fff;
		--uikit-popover-transition-duration: .15s;
		--uikit-popover-box-shadow: 0px 5px 5px -3px rgba(0,0,0,0.2), 0px 8px 10px 1px rgba(0,0,0,0.14), 0px 3px 14px 2px rgba(0,0,0,0.12);
		--uikit-popover-font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
	}
	
	.popover {
		position: fixed;
		top: 0;
		left: 0;
		opacity: 0;
		pointer-events: none;
		padding-block: .5rem;
		box-sizing: border-box;
		z-index: var(--uikit-popover-z-index);
		border: var(--uikit-popover-border);
		border-radius: var(--uikit-popover-border-radius);
		background-color: var(--uikit-popover-background-color);
		min-height: 1.5rem;
		font-family: var(--uikit-popover-font-family);
		font-size: var(--uikit-popover-font-size);
		color: var(--uikit-popover-font-color);
		transform-origin: top left;
		transition: opacity var(--uikit-popover-transition-duration);
		will-change: transform;
		box-shadow: var(--uikit-popover-box-shadow);
	}

	.popover--open {
		opacity: 1;
		pointer-events: initial;
	}

	.popover--elevation-0 {
		--uikit-popover-border: 1px solid rgba(0,0,0,.15);
		--uikit-popover-box-shadow: none;
	}
	
	.popover--elevation-1 {
		--uikit-popover-border: 1px solid rgba(0,0,0,.08);
		--uikit-popover-box-shadow: 0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12);
	}

	.popover--elevation-2 {
		--uikit-popover-border: 1px solid rgba(0,0,0,.04);
		--uikit-popover-box-shadow: 0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12);
	}

	.popover--elevation-3 {
		--uikit-popover-box-shadow: 0px 3px 3px -2px rgba(0,0,0,0.2), 0px 3px 4px 0px rgba(0,0,0,0.14), 0px 1px 8px 0px rgba(0,0,0,0.12);
	}

	.popover--elevation-4 {
		--uikit-popover-box-shadow: 0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12);
	}

	.popover--elevation-6 {
		--uikit-popover-box-shadow: 0px 3px 5px -1px rgba(0,0,0,0.2), 0px 6px 10px 0px rgba(0,0,0,0.14), 0px 1px 18px 0px rgba(0,0,0,0.12);
	}
	
	.popover--elevation-8 {
		--uikit-popover-box-shadow: 0px 5px 5px -3px rgba(0,0,0,0.2), 0px 8px 10px 1px rgba(0,0,0,0.14), 0px 3px 14px 2px rgba(0,0,0,0.12);
	}
</style>
