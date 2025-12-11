<script lang="ts">
	import { type Snippet, onMount, onDestroy, tick } from "svelte";
	import debounce from "$lib/utils/debounced"; 
	import Icon from "./Icon.svelte";

	type Size = "sm" | "md" | "lg";
	type IconPosition = "start" | "end";

	type AnimationState = 
		| { type: "closed" }
		| { type: "opening" }
		| { type: "open" }
		| { type: "closing" }
		| { type: "recalculating" };
	
	type Props = {
		children?: Snippet;
		title: string;
		variant?: string;
		size?: Size;
		open?: boolean;
		expandIconPosition?: IconPosition;
		[key: string]: unknown;
	};

	const ANIMATION_DURATION = 300;
  const ANIMATION_EASING = "cubic-bezier(0.4, 0, 0.2, 1)";
  const RESIZE_DEBOUNCE_MS = 16;
  const HEIGHT_THRESHOLD = 2;
	const contentID = "uikit-collapse-0";
	
	let detailsRef: HTMLDetailsElement;
	let lastDetailsWidth: number | null = null;
	let contentRef: HTMLDivElement;
	let contentHeight: number;
	let shouldRecalculateContentHeight: boolean = false;
	let animation: Animation;
	let resizeObserver: ResizeObserver;
	
	let {
		children,
		title,
		variant,
		size = "md",
		open = false,
		expandIconPosition = "end",
		...restProps
	}: Props = $props();

	let contentStyling: string | null = $state(null);
	let shouldHideContent: boolean = $state(false);
	let animationState = $state<AnimationState>({ type: open ? "open" : "closed" });
	
	async function handleToggle(event: Event) {
		event.preventDefault();
		
		open = !open;
		
		if (open) {
			detailsRef.open = true;

			// Start from known state
			contentStyling = "height: 0px; opacity: 0";
			shouldHideContent = false;
			
			if (shouldRecalculateContentHeight) {
				await recalculateContentHeight();
			}
			
			animationState = { type: "opening" };
			animation.playbackRate = 1;
			animation.play();
		} else {
			animationState = { type: "closing" };
			animation.playbackRate = -1;
			animation.play();
		}
	}

	function createAnimation(targetHeight: string) {
		const newAnimation = contentRef.animate([
			{ height: 0, opacity: 0 },
			{ height: targetHeight, opacity: 1 }
		], {
			duration: ANIMATION_DURATION,
			easing: ANIMATION_EASING,
			direction: "normal"
		});
		
		newAnimation.onfinish = () => {
			if (animationState.type === "opening" || animationState.type === "recalculating") {
				animationState = { type: "open" };
				contentStyling = "height:auto";
				if (detailsRef) detailsRef.open = true;
			} else if (animationState.type === "closing") {
				animationState = { type: "closed" };
				contentStyling = null;
				if (detailsRef) detailsRef.open = false;
				shouldHideContent = true;
			}
		};

		newAnimation.oncancel = () => {
			console.log("cancel");
		};

		return newAnimation;
	}

	async function recalculateContentHeight(): Promise<void> {
		shouldRecalculateContentHeight = false;
		animation.cancel();
		contentStyling = "visibility:hidden;height:auto";

		await tick();
		
		const newContentHeight = contentRef.offsetHeight;
		contentStyling = null;
		
		if (Math.abs(newContentHeight - contentHeight) >= HEIGHT_THRESHOLD) {
			animationState = { type: "recalculating" }
			contentHeight = newContentHeight;
			// Setup new animation with updated height
			animation = createAnimation(`${newContentHeight}px`);
			// Restore animation state
			animation.pause();
			animation.currentTime = 0;
		}
	}
	
	const handleResize = debounce((entries: ResizeObserverEntry[]) => {
		for (const entry of entries) {
			const { width } = entry.contentRect;
			if (lastDetailsWidth === null) {
				lastDetailsWidth = width;
				return;
			}
			
			if (Math.abs(width - lastDetailsWidth) >= 5 && !shouldRecalculateContentHeight) {
				lastDetailsWidth = width;
				shouldRecalculateContentHeight = true;
			}
		}
	}, RESIZE_DEBOUNCE_MS);

	onMount(() => {
		contentHeight = contentRef.offsetHeight;
		shouldHideContent = !open;
		resizeObserver = new ResizeObserver(handleResize);
		resizeObserver.observe(detailsRef);
		animation = createAnimation(`${contentHeight}px`);

		if (open) detailsRef.open = open;
		
		animation.pause();
		const duration = animation.effect?.getComputedTiming().duration;
		animation.currentTime = open ? (typeof duration === 'number' ? duration : ANIMATION_DURATION) : 0;
	});

	onDestroy(() => {
		handleResize.cancel();
		
		if (resizeObserver) {
	    resizeObserver.disconnect();
	  }
		
	  if (animation) {
	    animation.cancel();
	  }
	});
</script>

<details 
	class="uikit-collapse" 
	bind:this={detailsRef} 
	{...restProps}
>
	<summary 
		class="uikit-collapse__header"
		class:uikit-collapse__header--icon-position-start={expandIconPosition === "start"}
		onclick={handleToggle}
		aria-expanded={open}
		aria-controls={contentID}
	>
		<span class="uikit-collapse__title">{title}</span>
		<div class="uikit-collapse__icon" class:uikit-collapse__icon--rotate={open}>
			<Icon>
				<path d="M7.41 8.58 12 13.17l4.59-4.59L18 10l-6 6-6-6 1.41-1.42Z" />
			</Icon>
		</div>
	</summary>
	<div bind:this={contentRef} class="uikit-collapse__content" id={contentID} hidden={shouldHideContent} style={contentStyling}>
		{@render children?.()}
	</div>
</details>

<style>
	.uikit-collapse {
		font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
		font-size: .875rem;
	}

	.uikit-collapse__header {
		display: grid;
		grid-template-areas: "title icon";
		grid-template-columns: 1fr minmax(auto, max-content);
		align-items: center;
		padding-inline: .5rem;
		height: 2.5rem;
		cursor: pointer;
		user-select: none;
	}

	.uikit-collapse__header--icon-position-start {
		grid-template-areas: "icon title";
		grid-template-columns: minmax(auto, max-content) 1fr;
		gap: 0.5rem;
		padding-inline: 0;
	}

	.uikit-collapse__header::marker {
		content: "";
	}

	.uikit-collapse__title {
		grid-area: title;
	}

	.uikit-collapse__icon {
		grid-area: icon;
		display: flex;
		width: fit-content;
		height: fit-content;
		transition: transform .25s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.uikit-collapse__icon--rotate {
		transform: rotate(180deg);
	}

	.uikit-collapse__content {
		overflow: hidden;
	}
</style>