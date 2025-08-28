<script lang="ts">
	import { onMount, onDestroy, type Snippet } from "svelte";
	import { generateId } from "$lib/utils/unique-id-generator";
	import Portal from "$lib/components/Portal.svelte";

	// Types
	type BasePlacement = "top" | "bottom" | "left" | "right";
	type Alignment = "start" | "end";
	type Placement = BasePlacement | `${BasePlacement}-${Alignment}`;

  interface TooltipProps {
    children?: Snippet,
		gap?: number,
		anchor?: HTMLElement | null,
		placement?: Placement
  }
	
	// Constants
	const VALID_BASE_PLACEMENTS = ["top", "bottom", "left", "right"] as const;
	const VALID_ALIGNMENTS = ["start", "end"] as const;
  const uid = generateId("tooltip");
  const id = `aria-uikit-tooltip-${uid}`;
	const controller = new AbortController();

	// Props
	let {
		children,
		gap = 4,
		anchor = null,
		placement: rawPlacement = "bottom-start"
	}: TooltipProps = $props();

	// State
	let isOpen = $state(false);
	let tooltipElement: HTMLDivElement;
	let placement = isValidPlacement(rawPlacement) ? rawPlacement : "bottom-start";

	if (!isValidPlacement(rawPlacement)) {
	  console.warn(`Invalid tooltip placement: "${rawPlacement}". Falling back to "bottom-start"`);
	}
	
	function isValidPlacement(placement: string): placement is Placement {
	  const [base, alignment] = placement.split("-");
	  return VALID_BASE_PLACEMENTS.includes(base as BasePlacement) && 
	         (!alignment || VALID_ALIGNMENTS.includes(alignment as Alignment));
	}
	
	function updatePosition() {
		if (!anchor || !tooltipElement) return;
		
		requestAnimationFrame(() => {
			const anchorRect = anchor.getBoundingClientRect();
			const tooltipRect = tooltipElement.getBoundingClientRect();
			
			let left = 0;
			let top = 0;
			
			// Split placement into base and alignment
			const [basePlacement, alignment] = placement.split("-") as [BasePlacement, Alignment?];
			
			// Calculate base position
			switch (basePlacement) {
				case "top":
					left = anchorRect.left + (anchorRect.width - tooltipRect.width) / 2;
					top = anchorRect.top - tooltipRect.height - gap;
					break;
				case "bottom":
					left = anchorRect.left + (anchorRect.width - tooltipRect.width) / 2;
					top = anchorRect.bottom + gap;
					break;
				case "left":
					left = anchorRect.left - tooltipRect.width - gap;
					top = anchorRect.top + (anchorRect.height - tooltipRect.height) / 2;
					break;
				case "right":
					left = anchorRect.right + gap;
					top = anchorRect.top + (anchorRect.height - tooltipRect.height) / 2;
					break;
			}
			
			// Apply alignment adjustments
			if (alignment) {
				switch (basePlacement) {
					case "top":
					case "bottom":
						if (alignment === "start") {
							left = anchorRect.left;
						} else if (alignment === "end") {
							left = anchorRect.right - tooltipRect.width;
						}
						break;
					case "left":
					case "right":
						if (alignment === "start") {
							top = anchorRect.top;
						} else if (alignment === "end") {
							top = anchorRect.bottom - tooltipRect.height;
						}
						break;
				}
			}
			
			// Prevent tooltip from going outside viewport
			const viewport = {
				width: window.innerWidth,
				height: window.innerHeight
			};
			
			left = Math.max(gap, Math.min(left, viewport.width - tooltipRect.width - gap));
			top = Math.max(gap, Math.min(top, viewport.height - tooltipRect.height - gap));
			
			tooltipElement.style.transform = `translate(${left}px, ${top}px)`;
		});
	}
	
	function handleMouseEnter() {
		updatePosition();
		isOpen = true;
	}
	
	function handleMouseLeave() {
		isOpen = false;
	}

	function handleFocus({ target }: FocusEvent) {
		updatePosition();
		if (target instanceof Element && target.matches(":focus-visible")) {
			isOpen = true;
		}
	}
	
	function handleBlur() {
		isOpen = false;
	}

	function handleKeyDown({ key }: KeyboardEvent) {
		if (key === "Escape") {
			isOpen = false;
		}
	}
	
	function handleResize() {
		if (isOpen) {
			updatePosition();
		}
	}

	// Lifecycle
	onMount(() => {
		if (anchor instanceof Element) {
			anchor.setAttribute("aria-describedby", id);
			anchor.addEventListener("keydown", handleKeyDown, { signal: controller.signal });
			anchor.addEventListener("mouseenter", handleMouseEnter, { signal: controller.signal });
			anchor.addEventListener("mouseleave", handleMouseLeave, { signal: controller.signal });
			anchor.addEventListener("focusin", handleFocus, { signal: controller.signal });
			anchor.addEventListener("blur", handleBlur, { signal: controller.signal });
		}
	});
	
	onDestroy(() => {
		controller.abort();
	});
</script>

<svelte:window onresize={handleResize} onscroll={handleResize} />
<Portal>
	<div
		{id}
		class="tooltip"
		class:tooltip--open={isOpen}
		role="tooltip"
		bind:this={tooltipElement}
	>
		{@render children?.()}
	</div>
</Portal>

<style>
:root {
	--uikit-tooltip-font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
	--uikit-tooltip-background-color: #3c4043;
	--uikit-tooltip-font-size: .75rem;
	--uikit-tooltip-font-color: #fff;
	--uikit-tooltip-padding: 0 .5rem;
	--uikit-tooltip-border-radius: 0.1875rem;
	--uikit-tooltip-transition-duration: .15s;
	--uikit-tooltip-z-index: 99;
}

.tooltip {
	position: fixed;
	top: 0;
	left: 0;
	z-index: var(--uikit-tooltip-z-index);
	border-radius: var(--uikit-tooltip-border-radius);
	background-color: var(--uikit-tooltip-background-color);
	min-height: 1.5rem;
	font-family: var(--uikit-tooltip-font-family);
	font-size: var(--uikit-tooltip-font-size);
	color: var(--uikit-tooltip-font-color);
	display: inline-flex;
	align-items: center;
	padding: var(--uikit-tooltip-padding);
	line-height: 1;
	pointer-events: none;
	opacity: 0;
	transition: opacity var(--uikit-tooltip-transition-duration);
	will-change: transform;
}

.tooltip--open {
	opacity: 1;
	pointer-events: initial;
}
</style>