<script lang="ts">
  type Color = "default" | "light" | "dark";
  type Size = "sm" | "md" | "lg";
  type ActiveShape = "dot" | "pill";

  type Props = {
    count?: number;
    gap?: number;
    activeIndex?: number;
    color?: Color;
    size?: Size;
    activeShape?: ActiveShape;
    dynamic?: boolean;
  };

  let {
    count = 0,
    gap,
    activeIndex = $bindable(0),
    color = "default",
    size = "md",
    activeShape = "dot",
    dynamic = true,
  }: Props = $props();

  // Base geometry per preset. Everything downstream is expressed as a transform
  // off these fixed values so state changes animate rather than snap.
  const SIZE_SCALE = {
    sm: { r: 3, gap: 6, padding: 8, pillW: 14 },
    md: { r: 4, gap: 8, padding: 10, pillW: 18 },
    lg: { r: 5, gap: 10, padding: 12, pillW: 24 },
  } as const;

  const LINEAR_THRESHOLD = 10;
  const VISIBLE_SLOTS = 7;
  const HEIGHT = 32;
  const CENTER_Y = HEIGHT / 2;

  // Relative scale of the shrunken edge dots.
  const MD_SCALE = 0.7;
  const SM_SCALE = 0.45;

  const scale = $derived(SIZE_SCALE[size]);
  const R = $derived(scale.r);
  const GAP = $derived(gap ?? scale.gap);
  const PADDING = $derived(scale.padding);
  const PILL_W = $derived(scale.pillW);

  // A "slot" is one dot's footprint: diameter + gap.
  const DOT_WIDTH = $derived(R * 2);
  const STRIDE = $derived(DOT_WIDTH + GAP);
  // Extra width the pill adds beyond a normal dot; trailing slots shift by this.
  const PILL_EXTRA = $derived(
    activeShape === "pill" ? Math.max(0, PILL_W - DOT_WIDTH) : 0
  );

  const safeCount = $derived(Math.max(0, count));
  const useLinear = $derived(!dynamic || safeCount < LINEAR_THRESHOLD);

  // Windowing: which absolute indices anchor the visible window, and the
  // per-slot display scale (1 = large, MD, SM, or 0 = hidden).
  const layout = $derived.by(() => {
    if (useLinear) {
      return { scales: Array(safeCount).fill(1), startGlobal: 0, startSlot: 0 };
    }

    let scales: number[] = [];
    let startGlobal = 0;
    let startSlot = 0;

    if (activeIndex <= 2) {
      scales = [1, 1, 1, MD_SCALE, SM_SCALE];
      startGlobal = 0;
      startSlot = 2;
    } else if (activeIndex === 3) {
      scales = [MD_SCALE, 1, 1, 1, MD_SCALE, SM_SCALE];
      startGlobal = 0;
      startSlot = 1;
    } else if (activeIndex >= safeCount - 2) {
      scales = [SM_SCALE, MD_SCALE, 1, 1, 1];
      startGlobal = safeCount - 5;
      startSlot = 0;
    } else if (activeIndex === safeCount - 3) {
      scales = [SM_SCALE, MD_SCALE, 1, 1, 1, MD_SCALE];
      startGlobal = safeCount - 6;
      startSlot = 0;
    } else {
      scales = [SM_SCALE, MD_SCALE, 1, 1, 1, MD_SCALE, SM_SCALE];
      startGlobal = activeIndex - 3;
      startSlot = 0;
    }

    return { scales, startGlobal, startSlot };
  });

  // Base x-center of a slot index, before the window's translate offset.
  function slotBaseX(slot: number): number {
    return PADDING + R + slot * STRIDE;
  }

  // The whole group slides so the window's first visible dot lands correctly.
  const groupTranslateX = $derived(
    (layout.startSlot - layout.startGlobal) * STRIDE
  );

  const dotIndices = $derived(Array.from({ length: safeCount }, (_, i) => i));

  // Per-dot display scale (0 when outside the window -> shrinks away).
  function dotScale(i: number): number {
    const { startGlobal, scales } = layout;
    const within = i >= startGlobal && i < startGlobal + scales.length;
    return within ? scales[i - startGlobal] : 0;
  }

  // Per-dot x offset. Trailing dots shift right to make room for the pill.
  function dotX(i: number): number {
    const shift = activeShape === "pill" && i > activeIndex ? PILL_EXTRA : 0;
    return slotBaseX(i) + shift;
  }

  // Rect is authored at full pill size (width PILL_W, rx R) so at rest it is a
  // clean stadium with undistorted caps. Inactive slots collapse it toward the
  // dot's own width (DOT_WIDTH / PILL_W), and fade out so only the circle shows.
  const collapsedScaleX = $derived(PILL_W > 0 ? DOT_WIDTH / PILL_W : 0);

  function rectScaleX(i: number): number {
    return activeShape === "pill" && i === activeIndex ? 1 : collapsedScaleX;
  }

  function rectOpacity(i: number): number {
    return activeShape === "pill" && i === activeIndex ? 1 : 0;
  }

  const trackWidth = $derived(
    (useLinear
      ? safeCount * DOT_WIDTH + Math.max(0, safeCount - 1) * GAP + PADDING * 2
      : VISIBLE_SLOTS * DOT_WIDTH + (VISIBLE_SLOTS - 1) * GAP + PADDING * 2) +
      PILL_EXTRA
  );
</script>

{#if safeCount > 1}
  <div
    class="wcag-ui-dot-indicator"
    class:wcag-ui-dot-indicator--light={color === "light"}
    class:wcag-ui-dot-indicator--dark={color === "dark"}
    style="width: {trackWidth}px;"
    aria-hidden="true"
  >
    <svg width={trackWidth} height={HEIGHT} viewBox="0 0 {trackWidth} {HEIGHT}">
      <g
        class="wcag-ui-dot-indicator__track"
        style="transform: translateX({groupTranslateX}px);"
      >
        {#each dotIndices as i}
          {@const s = dotScale(i)}
          {@const x = dotX(i)}
          {@const isActive = i === activeIndex}
          <g
            class="wcag-ui-dot-indicator__slot"
            class:wcag-ui-dot-indicator__slot--active={isActive}
            style="transform: translateX({x}px);"
          >
            <circle
              class="wcag-ui-dot-indicator__dot"
              cx="0"
              cy={CENTER_Y}
              r={R}
              style="transform: scale({s});"
            />
            <rect
              class="wcag-ui-dot-indicator__pill"
              x={-R}
              y={CENTER_Y - R}
              width={PILL_W}
              height={DOT_WIDTH}
              rx={R}
              style="transform: scaleX({rectScaleX(i)}); opacity: {rectOpacity(i)};"
            />
          </g>
        {/each}
      </g>
    </svg>
  </div>
{/if}

<style>
  .wcag-ui-dot-indicator {
    --wcag-ui-dot-bg: transparent;
    --wcag-ui-dot-height: 2rem;
    --wcag-ui-dot-border-radius: 999px;
    --wcag-ui-dot-fill: rgba(255, 255, 255, 0.5);
    --wcag-ui-dot-fill-active: #fff;
    --wcag-ui-dot-duration: 0.35s;
    --wcag-ui-dot-ease: cubic-bezier(0.4, 0, 0.2, 1);

    background: var(--wcag-ui-dot-bg);
    height: var(--wcag-ui-dot-height);
    border-radius: var(--wcag-ui-dot-border-radius);
    display: flex;
    align-items: center;
  }

  .wcag-ui-dot-indicator--light {
    --wcag-ui-dot-fill: rgba(255, 255, 255, 0.5);
    --wcag-ui-dot-fill-active: #fff;
  }

  .wcag-ui-dot-indicator--dark {
    --wcag-ui-dot-fill: rgba(0, 0, 0, 0.3);
    --wcag-ui-dot-fill-active: #000;
  }

  .wcag-ui-dot-indicator svg {
    display: block;
    overflow: visible;
  }

  .wcag-ui-dot-indicator__track {
    transition: transform var(--wcag-ui-dot-duration) var(--wcag-ui-dot-ease);
    will-change: transform;
  }

  .wcag-ui-dot-indicator__slot {
    transition: transform var(--wcag-ui-dot-duration) var(--wcag-ui-dot-ease);
  }

  /* All state animates via transform, so it works in Safari too. */
  .wcag-ui-dot-indicator__dot {
    fill: var(--wcag-ui-dot-fill);
    mix-blend-mode: difference;
    transform-box: fill-box;
    transform-origin: center;
    transition:
      transform var(--wcag-ui-dot-duration) var(--wcag-ui-dot-ease),
      fill 0.3s ease;
  }

  .wcag-ui-dot-indicator__pill {
    fill: var(--wcag-ui-dot-fill-active);
    mix-blend-mode: difference;
    transform-box: fill-box;
    /* Left edge is the anchor so the pill grows rightward from the dot. */
    transform-origin: left center;
    transition:
      transform var(--wcag-ui-dot-duration) var(--wcag-ui-dot-ease),
      opacity var(--wcag-ui-dot-duration) var(--wcag-ui-dot-ease);
  }

  .wcag-ui-dot-indicator__slot--active .wcag-ui-dot-indicator__dot {
    fill: var(--wcag-ui-dot-fill-active);
  }

  .wcag-ui-dot-indicator--light .wcag-ui-dot-indicator__dot,
  .wcag-ui-dot-indicator--light .wcag-ui-dot-indicator__pill,
  .wcag-ui-dot-indicator--dark .wcag-ui-dot-indicator__dot,
  .wcag-ui-dot-indicator--dark .wcag-ui-dot-indicator__pill {
    mix-blend-mode: normal;
  }

	@media (prefers-reduced-motion: reduce) {
		.wcag-ui-dot-indicator__track,
		.wcag-ui-dot-indicator__slot,
		.wcag-ui-dot-indicator__dot,
		.wcag-ui-dot-indicator__pill {
			transition: none;
		}
	}
</style>
