<script lang="ts">
	import { type Snippet, onMount } from "svelte";
	import Portal from "$lib/components/Portal.svelte";
	import { setMenuState } from "./menu-state.svelte";
	
	type Placement = "top" | "bottom" | "left" | "right" | "top-start" | "top-end" | "bottom-start" | "bottom-end" | "left-start" | "left-end" | "right-start" | "right-end";
	type Props = {
		children?: Snippet;
		anchor: HTMLElement | undefined;
		gap?: number;
		open?: boolean;
		placement?: Placement;
	}

	let {
		children,
		anchor,
		gap = 8,
		open = $bindable(false),
		placement = "bottom-start"
	}: Props = $props();

	const menuState = setMenuState(
		() => open, 
		(value) => open = value
	);
	const id = menuState.id;
	const viewport = {
		width: 0,
		height: 0
	};

	let ref: HTMLElement;
	let anchorRect: DOMRect;
	
	let menuWidth = 0;
	let menuHeight = 0;
	
	let justOpened = false;
	let rafId: number | null = null;
	let lockedPlacement: Placement = placement;
	let style = $state("");
	
	function getAdjustedPlacement(currentPlacement: Placement): Placement {
		let main = currentPlacement.split("-")[0] as "top" | "bottom" | "left" | "right";
		let align = currentPlacement.includes("-") ? currentPlacement.split("-")[1] as "start" | "end" : undefined;
		
		// 1. Vertical Flip
		if (main === "top" || main === "bottom") {
			const fitsTop = anchorRect.top - gap - menuHeight >= 0;
			const fitsBottom = anchorRect.bottom + gap + menuHeight <= viewport.height;

			if (main === "top" && !fitsTop && fitsBottom) main = "bottom";
			else if (main === "bottom" && !fitsBottom && fitsTop) main = "top";

			const centerX = anchorRect.left + anchorRect.width / 2;
			const halfWidth = menuWidth / 2;

			if (align === "start") {
				if (anchorRect.left + menuWidth > viewport.width) align = "end";
			} else if (align === "end") {
				if (anchorRect.right - menuWidth < 0) align = "start";
			} else {
				if (centerX - halfWidth < 0) align = "start";
				else if (centerX + halfWidth > viewport.width) align = "end";
			}
		}
		
		// 2. Horizontal Flip
		if (main === "left" || main === "right") {
			const fitsLeft = anchorRect.left - gap - menuWidth >= 0;
			const fitsRight = anchorRect.right + gap + menuWidth <= viewport.width;

			if (main === "left" && !fitsLeft && fitsRight) main = "right";
			else if (main === "right" && !fitsRight && fitsLeft) main = "left";

			const centerY = anchorRect.top + anchorRect.height / 2;
			const halfHeight = menuHeight / 2;

			if (align === "start") {
				if (anchorRect.top + menuHeight > viewport.height) align = "end";
			} else if (align === "end") {
				if (anchorRect.bottom - menuHeight < 0) align = "start";
			} else {
				if (centerY - halfHeight < 0) align = "start";
				else if (centerY + halfHeight > viewport.height) align = "end";
			}
		}
		
		return (align ? `${main}-${align}` : main) as Placement;
	}

	function setPlacementPosition(targetPlacement: Placement): void {
		if (!ref || !anchor) return;

		let x = 0;
		let y = 0;
	
		switch (targetPlacement) {
			case "top":
				x = anchorRect.left + (anchorRect.width - menuWidth) / 2;
				y = anchorRect.top - gap - menuHeight;
				break;
			case "top-start":
				x = anchorRect.left;
				y = anchorRect.top - gap - menuHeight;
				break;
			case "top-end":
				x = anchorRect.right - menuWidth;
				y = anchorRect.top - gap - menuHeight;
				break;
			case "bottom":
				x = anchorRect.left + (anchorRect.width - menuWidth) / 2;
				y = anchorRect.bottom + gap;
				break;
			case "bottom-start":
				x = anchorRect.left;
				y = anchorRect.bottom + gap;
				break;
			case "bottom-end":
				x = anchorRect.right - menuWidth;
				y = anchorRect.bottom + gap;
				break;
			case "left":
				x = anchorRect.left - gap - menuWidth;
				y = anchorRect.top + (anchorRect.height - menuHeight) / 2;
				break;
			case "left-start":
				x = anchorRect.left - gap - menuWidth;
				y = anchorRect.top;
				break;
			case "left-end":
				x = anchorRect.left - gap - menuWidth;
				y = anchorRect.bottom - menuHeight;
				break;
			case "right":
				x = anchorRect.right + gap;
				y = anchorRect.top + (anchorRect.height - menuHeight) / 2;
				break;
			case "right-start":
				x = anchorRect.right + gap;
				y = anchorRect.top;
				break;
			case "right-end":
				x = anchorRect.right + gap;
				y = anchorRect.bottom - menuHeight;
				break;
		}
		
		style = `transform:translate3d(${x}px,${y}px,0)`;
	}

	function updatePosition(recalculatePlacement = true) {
		if (!anchor || !(anchor instanceof HTMLElement)) return;

	  viewport.width = window.innerWidth;
	  viewport.height = window.innerHeight;
	  
	  // ALWAYS get fresh rects
	  anchorRect = anchor?.getBoundingClientRect();
		menuWidth = ref.offsetWidth;
		menuHeight = ref.offsetHeight;
	  
	  // Only recalculate placement when requested
	  if (recalculatePlacement) {
	    lockedPlacement = getAdjustedPlacement(placement);
	  }
	  
	  // Use locked placement with fresh dimensions
	  setPlacementPosition(lockedPlacement);
	}

	function schedulePositionUpdate(recalculatePlacement = true) {
	  // Skip if update already scheduled
		if (rafId !== null) return;
	  
	  rafId = requestAnimationFrame(() => {
	    updatePosition(recalculatePlacement);
	    rafId = null;
	  });
	}
	
	onMount(() => {
		menuState.menu = ref;
		menuState.anchor = anchor;
		updatePosition(false);

		return () => {
			if (rafId !== null) cancelAnimationFrame(rafId);
			menuState.destroy();
		};
	});

	$effect(() => {
	  if (open && !justOpened) {
	    justOpened = true;
	    schedulePositionUpdate(true);
	  } else if (!open) {
	    justOpened = false;
	  }
	});
</script>

<svelte:window onresize={async () => {
	if (open) {
		updatePosition(false);
	}
}} />
<Portal>
	<div
		bind:this={ref}
		class="uikit-menu"
		class:uikit-menu--open={open}
		role="menu"
		tabindex="-1"
		aria-labelledby={menuState.disclosureId}
		{id}
		{style}
	>
		{@render children?.()}
	</div>
</Portal>


<style>
	.uikit-menu {
		position: fixed;
		top: 0;
		left: 0;
		padding-block: .25rem;
		min-width: 8rem;
		width: max-content;
		max-width: 37.5rem;
		border-radius: .25rem;
		overflow: hidden;
		pointer-events: none;
		opacity: 0;
		background-color: #fff;
		z-index: 999;
		box-shadow: 0px 8px 10px 1px rgba(0,0,0,0.14),0px 3px 14px 2px rgba(0,0,0,0.12),0px 5px 5px -3px rgba(0,0,0,0.2);
		will-change: transform;
		overflow-wrap: break-word;
	  word-break: keep-all;
	}

	.uikit-menu--open {
		opacity: 1;
		pointer-events: initial;
	}
</style>