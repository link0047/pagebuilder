<script lang="ts">
  import { type Snippet, onMount, onDestroy, tick } from "svelte";
  import debounce from "$lib/utils/debounced";
  import { generateId } from "$lib/utils/unique-id-generator.js";
  import Icon from "./Icon.svelte";

  type Size = "sm" | "md" | "lg" | "xl";
  type IconPosition = "start" | "end";
  type Variant = "underlined" | "outlined" | "filled";

  type AnimationState =
    | { type: "closed" }
    | { type: "opening" }
    | { type: "open" }
    | { type: "closing" }
    | { type: "recalculating" };

  type Props = {
    children?: Snippet;
    title: string | Snippet;
    variant?: Variant;
    size?: Size;
    locked?: boolean;
    disabled?: boolean;
    open?: boolean;
    expandIconPosition?: IconPosition;
    [key: string]: unknown;
  };

  const ANIMATION_DURATION = 300;
  const ANIMATION_EASING = "cubic-bezier(0.4, 0, 0.2, 1)";
  const RESIZE_DEBOUNCE_MS = 16;
  const HEIGHT_THRESHOLD = 2;

  const uid = generateId("collapse");
  const contentID = `wcag-ui-collapse-${uid}`;

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
    variant = "underlined",
    size = "md",
    locked = false,
    disabled = false,
    open = $bindable(false),
    expandIconPosition = "start",
    ...restProps
  }: Props = $props();

  let contentStyling: string | null = $state(null);
  let shouldHideContent: boolean = $state(false);
  let animationState = $state<AnimationState>({ type: open ? "open" : "closed" });

  async function handleToggle(event: Event) {
    event.preventDefault();
    if (locked) return;
    open = !open;

    if (open) {
      detailsRef.open = true;
      contentStyling = "height: 0px; opacity: 0";
      shouldHideContent = false;

      if (shouldRecalculateContentHeight) await recalculateContentHeight();

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
      animationState = { type: "recalculating" };
      contentHeight = newContentHeight;
      animation = createAnimation(`${newContentHeight}px`);
      animation.pause();
      animation.currentTime = 0;
    }
  }

  const handleResize = debounce((entries: ResizeObserverEntry[]) => {
    for (const entry of entries) {
      const { width } = entry.contentRect;
      if (lastDetailsWidth === null) { lastDetailsWidth = width; return; }
      if (Math.abs(width - lastDetailsWidth) >= 5 && !shouldRecalculateContentHeight) {
        lastDetailsWidth = width;
        shouldRecalculateContentHeight = true;
      }
    }
  }, RESIZE_DEBOUNCE_MS);

  $effect(() => {
    if (disabled) {
      detailsRef.inert = true;
    } else {
      detailsRef.inert = false;
    }
  });

  onMount(() => {
    contentHeight = contentRef.offsetHeight;
    shouldHideContent = !open;
    resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(detailsRef);
    animation = createAnimation(`${contentHeight}px`);
    if (open) detailsRef.open = open;
    animation.pause();
    const duration = animation.effect?.getComputedTiming().duration;
    animation.currentTime = open ? (typeof duration === "number" ? duration : ANIMATION_DURATION) : 0;
  });

  onDestroy(() => {
    handleResize.cancel();
    if (resizeObserver) resizeObserver.disconnect();
    if (animation) animation.cancel();
  });
</script>

<details
  bind:this={detailsRef}
  class="wcag-ui-collapse"
  class:wcag-ui-collapse--underlined={variant === "underlined"}
  class:wcag-ui-collapse--outlined={variant === "outlined"}
  class:wcag-ui-collapse--filled={variant === "filled"}
  class:wcag-ui-collapse--size-sm={size === "sm"}
  class:wcag-ui-collapse--size-lg={size === "lg"}
  class:wcag-ui-collapse--size-xl={size === "xl"}
  class:wcag-ui-collapse--locked={locked}
  class:wcag-ui-collapse--disabled={disabled}
  data-open={open}
  {...restProps}
>
  <summary
    class="wcag-ui-collapse__header"
    class:wcag-ui-collapse__header--icon-end={expandIconPosition === "end"}
    onclick={handleToggle}
    aria-expanded={open}
    aria-controls={contentID}
    tabindex={locked ? -1 : undefined}
    aria-disabled={locked ?? undefined}
  >
    {#if !locked}
      <div class="wcag-ui-collapse__icon" class:wcag-ui-collapse__icon--rotate={open}>
        <Icon>
          <path d="M7.41 8.58 12 13.17l4.59-4.59L18 10l-6 6-6-6 1.41-1.42Z" />
        </Icon>
      </div>
    {/if}
    <span class="wcag-ui-collapse__title">
      {#if typeof title === "string"}
        {title}
      {:else}
        {@render title()}
      {/if}
    </span>
  </summary>
  <div bind:this={contentRef} class="wcag-ui-collapse__content" id={contentID} hidden={shouldHideContent} style={contentStyling}>
    <div class="wcag-ui-collapse__inner">
      {@render children?.()}
    </div>
  </div>
</details>

<style>
@layer variables, base, variants, sizes, states, accessibility;

@layer variables {
  .wcag-ui-collapse {
    /* Dimensions */
    --wcag-ui-collapse-header-height: 2.5rem;
    --wcag-ui-collapse-radius: .5rem;
    --wcag-ui-collapse-padding-inline: 0.75rem;

    /* Colors */
    --wcag-ui-collapse-border-color: #ccc;
    --wcag-ui-collapse-bg-color: transparent;
    --wcag-ui-collapse-text-color: inherit;
    --wcag-ui-collapse-accent-color: #1e40af;
    --wcag-ui-collapse-bg-filled: #fcfcfb;
    --wcag-ui-collapse-bg-active: #dbeafe;

    /* Typography */
    --wcag-ui-collapse-font-family: system-ui, -apple-system, sans-serif;
    --wcag-ui-collapse-font-size: .875rem;
    --wcag-ui-collapse-font-weight: 500;
  }
}

@layer base {
  .wcag-ui-collapse {
    font-family: var(--wcag-ui-collapse-font-family);
    font-size: var(--wcag-ui-collapse-font-size);
    background-color: var(--wcag-ui-collapse-bg-color);
    transition: background-color 0.2s ease, border-color 0.2s ease;
  }

  .wcag-ui-collapse--locked {
    border: none;
  }

  .wcag-ui-collapse--disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .wcag-ui-collapse__header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding-inline: var(--wcag-ui-collapse-padding-inline);
    height: var(--wcag-ui-collapse-header-height);
    cursor: pointer;
    user-select: none;
    list-style: none;
		outline: 2px solid transparent;
		outline-offset: -2px;
		border-radius: var(--wcag-ui-collapse-radius);
  }

  .wcag-ui-collapse__header::-webkit-details-marker {
    display: none;
  }

  .wcag-ui-collapse__title {
    flex: 1;
    font-weight: var(--wcag-ui-collapse-font-weight);
    color: var(--wcag-ui-collapse-text-color);
    transition: color 0.2s ease;
  }

  .wcag-ui-collapse__icon {
    display: flex;
    transition: transform .25s cubic-bezier(0.4, 0, 0.2, 1);
    opacity: 0.7;
  }

  .wcag-ui-collapse__icon--rotate {
    transform: rotate(180deg);
  }

  .wcag-ui-collapse__header--icon-end {
    flex-direction: row-reverse;
  }

  .wcag-ui-collapse__content {
    overflow: hidden;
    box-sizing: border-box;
  }

  .wcag-ui-collapse__inner {
    padding: 0;
    overflow: hidden;
    border-bottom-left-radius: var(--wcag-ui-collapse-radius);
    border-bottom-right-radius: var(--wcag-ui-collapse-radius);
    box-sizing: border-box;
  }
}

@layer variants {
  .wcag-ui-collapse--underlined {
    border-bottom: 1px solid var(--wcag-ui-collapse-border-color);
  }

  .wcag-ui-collapse--outlined {
    border: 1px solid var(--wcag-ui-collapse-border-color);
    border-radius: var(--wcag-ui-collapse-radius);
    margin-bottom: 0.5rem;
  }

  .wcag-ui-collapse--filled {
    --wcag-ui-collapse-bg-color: var(--wcag-ui-collapse-bg-filled);
    border: 1px solid var(--wcag-ui-collapse-border-color);
    border-radius: var(--wcag-ui-collapse-radius);
    margin-bottom: 0.5rem;
  }

  /* Inside white cards for filled/outlined */
  .wcag-ui-collapse--filled .wcag-ui-collapse__inner,
  .wcag-ui-collapse--outlined .wcag-ui-collapse__inner {
    background-color: #fff;
    border-top: 1px solid hsl(from #0b0b0b h s l / 20%);
  }
}

@layer states {
	:is(.wcag-ui-collapse[data-open="true"], .wcag-ui-collapse--underlined) .wcag-ui-collapse__header:focus-visible {
		border-bottom-left-radius: 0;
		border-bottom-right-radius: 0;
	}

	.wcag-ui-collapse__header:focus-visible {
		outline-color: #007acc;
	}

  /* Focus within logic for Filled variant - Only if OPEN */
  .wcag-ui-collapse--filled[data-open="true"]:focus-within {
    --wcag-ui-collapse-bg-color: var(--wcag-ui-collapse-bg-active);
  }

  .wcag-ui-collapse--filled[data-open="true"]:focus-within .wcag-ui-collapse__title {
    color: var(--wcag-ui-collapse-accent-color);
    font-weight: 700;
  }

  .wcag-ui-collapse--outlined:focus-within {
    border-color: hsl(from #0b0b0b h s l / 20%);
  }
}

@layer sizes {
  .wcag-ui-collapse--size-sm {
    --wcag-ui-collapse-header-height: 2rem;
    --wcag-ui-collapse-font-size: 0.8125rem;
  }

  .wcag-ui-collapse--size-lg {
    --wcag-ui-collapse-height: 3rem;
  }

  .wcag-ui-collapse--size-xl {
    --wcag-ui-collapse-header-height: 3.5rem;
    --wcag-ui-collapse-font-size: 1rem;
  }
}

@layer accessibility {
  @media (prefers-reduced-motion: reduce) {
    .wcag-ui-collapse, .wcag-ui-collapse__icon {
      transition: none;
    }
  }
}
</style>
