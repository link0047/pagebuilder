<script lang="ts">
	import { type Snippet, tick } from "svelte";
	import { generateId } from "$lib/utils/unique-id-generator";
	import Portal from "$lib/components/Portal.svelte";

	// Types
	type BasePlacement = "top" | "bottom" | "left" | "right";
	type Alignment = "start" | "end";
	type Placement = BasePlacement | `${BasePlacement}-${Alignment}`;

  type Props = {
    children?: Snippet;
		gap?: number;
		anchor?: HTMLElement | null;
		placement?: Placement;
  };

	// Constants
	const VALID_BASE_PLACEMENTS = ["top", "bottom", "left", "right"] as const;
	const VALID_ALIGNMENTS = ["start", "end"] as const;
  const uid = generateId("tooltip");
  const id = `aria-wcag-ui-tooltip-${uid}`;

	// Props
	let {
		children,
		gap = 4,
		anchor = null,
		placement: rawPlacement = "bottom-start"
	}: Props = $props();

	// State
	let isOpen = $state(false);
	let tooltipElement: HTMLDivElement;
	const placement = $derived(isValidPlacement(rawPlacement) ? rawPlacement : "bottom-start");

	function isValidPlacement(placement: string): placement is Placement {
	  const [base, alignment] = placement.split("-");
	  return VALID_BASE_PLACEMENTS.includes(base as BasePlacement) &&  (!alignment || VALID_ALIGNMENTS.includes(alignment as Alignment));
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

	function handlePointerEnter({ pointerType }: PointerEvent) {
		if (pointerType === "touch") return;
		isOpen = true;
		updatePosition();
	}

	function handlePointerLeave({ pointerType }: PointerEvent) {
	  if (pointerType === "touch") return;
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

	$effect(() => {
    if (!isValidPlacement(rawPlacement)) {
      console.warn(`Invalid tooltip placement: "${rawPlacement}". Falling back to "bottom-start"`);
    }
  });

	// Lifecycle
	$effect(() => {
    if (!(anchor instanceof Element)) return;
    if (!tooltipElement) return;

    const ac = new AbortController();

    anchor.setAttribute("aria-describedby", id);
    anchor.addEventListener("keydown", handleKeyDown, { signal: ac.signal });
    anchor.addEventListener("pointerenter", handlePointerEnter, { signal: ac.signal });
    anchor.addEventListener("pointerleave", handlePointerLeave, { signal: ac.signal });
    anchor.addEventListener("focusin", handleFocus, { signal: ac.signal });
    anchor.addEventListener("blur", handleBlur, { signal: ac.signal });

    return () => ac.abort();
  });
</script>

<svelte:window onresize={handleResize} onscroll={handleResize} />
<Portal>
	<div
		{id}
		class="wcag-ui-tooltip"
		data-open={isOpen}
		role="tooltip"
		bind:this={tooltipElement}
	>
		{@render children?.()}
	</div>
</Portal>

<style>
:root {
	--wcag-ui-tooltip-font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
	--wcag-ui-tooltip-background-color: #3c4043;
	--wcag-ui-tooltip-font-size: .75rem;
	--wcag-ui-tooltip-font-color: #fff;
	--wcag-ui-tooltip-padding: 0 .5rem;
	--wcag-ui-tooltip-border-radius: 0.1875rem;
	--wcag-ui-tooltip-transition-duration: .15s;
	--wcag-ui-tooltip-z-index: 219;
}

.wcag-ui-tooltip {
	position: fixed;
	top: 0;
	left: 0;
	z-index: var(--wcag-ui-tooltip-z-index);
	border-radius: var(--wcag-ui-tooltip-border-radius);
	background-color: var(--wcag-ui-tooltip-background-color);
	min-height: 1.5rem;
	font-family: var(--wcag-ui-tooltip-font-family);
	font-size: var(--wcag-ui-tooltip-font-size);
	color: var(--wcag-ui-tooltip-font-color);
	display: inline-flex;
	align-items: center;
	padding: var(--wcag-ui-tooltip-padding);
	line-height: 1;
	pointer-events: none;
	opacity: 0;
	transition: opacity var(--wcag-ui-tooltip-transition-duration);
	will-change: transform;
}

.wcag-ui-tooltip[data-open="true"] {
  opacity: 1;
  pointer-events: initial;
}
</style>
