<script module>
  let instanceCount = 0;
</script>

<script lang="ts">
  import type { Snippet } from "svelte";

  type SingleValue = number;
  type TupleValue = [number, number];
  type ThumbType = "min" | "max";

  export type SliderValue = SingleValue | TupleValue;

  type Props = {
    value?: SingleValue | TupleValue;
    min?: number;
    max?: number;
    step?: number;
    multiThumb?: boolean;
    label: string;
    showValues?: boolean;
    formatValue?: (val: number) => string;
    disabled?: boolean;
    name?: string;
    trackColor?: string;
    fillColor?: string;
    thumbSize?: number;
    onchange?: (value: SliderValue) => void;
    hint?: Snippet<[SliderValue]>;
    showEndCaps?: boolean;
    startCap?: Snippet<[{ min: number }]>;
    endCap?: Snippet<[{ max: number }]>;
    showSteps?: boolean;
  }

  let {
    value = $bindable(0),
    min = 0,
    max = 100,
    step = 1,
    multiThumb = false,
    label,
    showValues = true,
    formatValue = (v: number) => String(v),
    disabled = false,
    name,
    trackColor = "#e2e8f0",
    fillColor = "#3b5bdb",
    thumbSize = 20,
    onchange,
		hint,
    showEndCaps = false,
    startCap,
    endCap,
    showSteps = false,
  }: Props = $props();

  const id = `wcag-ui-slider-${instanceCount++}`;

  let topInput = $state<ThumbType>("min");
  let activeThumb = $state<ThumbType | null>(null);

  const internalMin = $derived(Array.isArray(value) ? value[0] : (value as number));
  const internalMax = $derived(Array.isArray(value) ? value[1] : max);
  const range = $derived(max - min === 0 ? 1 : max - min);

  let minPct = $derived(((internalMin - min) / range) * 100);
  let maxPct = $derived(((internalMax - min) / range) * 100);
  let fillLeft = $derived(multiThumb ? minPct : 0);
  let fillWidth = $derived(multiThumb ? maxPct - minPct : minPct);

  // Step markers along the track. Capped at 200 to avoid rendering
  // excessive DOM nodes if a caller passes a very small step relative
  // to the min/max range.
  const MAX_STEP_MARKERS = 200;
  let stepMarkers = $derived.by(() => {
    if (!showSteps || step <= 0) return [];
    const count = Math.round(range / step);
    if (count <= 0 || count > MAX_STEP_MARKERS) return [];
    return Array.from({ length: count + 1 }, (_, i) => (i / count) * 100);
  });

  function handleInput(event: Event, type: ThumbType) {
    const input = event.currentTarget as HTMLInputElement;
    const newVal = Number(input.value);
    topInput = type;

    if (multiThumb) {
      let [currentMin, currentMax] = Array.isArray(value) ? value : [min, max];

      if (type === "min") {
        currentMin = Math.min(newVal, currentMax - step);
      } else {
        currentMax = Math.max(newVal, currentMin + step);
      }

      input.value = String(type === "min" ? currentMin : currentMax);
      value = [currentMin, currentMax];
    } else {
      value = newVal;
    }

    onchange?.(value);
  }
</script>

<div
  class="wcag-ui-slider"
  class:wcag-ui-slider--disabled={disabled}
  class:wcag-ui-slider--multi={multiThumb}
  style:--slider-fill={fillColor}
  style:--slider-track={trackColor}
  style:--slider-thumb-size={`${thumbSize}px`}
>
	<div class="wcag-ui-slider__header">
	  <span class="wcag-ui-slider__label" id="{id}-label">
	    {label}
	  </span>
		{#if hint}
			<div class="wcag-ui-slider__hint" id="{id}-hint">
	      {@render hint(value)}
	    </div>
		{/if}
	</div>

  <div class="wcag-ui-slider__control">
    {#if showEndCaps}
      <div class="wcag-ui-slider__cap wcag-ui-slider__cap--start">
        {#if startCap}
          {@render startCap({ min })}
        {:else}
          <span class="wcag-ui-slider__cap-label">{formatValue(internalMin)}</span>
        {/if}
      </div>
    {/if}

    <div
      class="wcag-ui-slider__track-wrapper"
      role="group"
      aria-labelledby="{id}-label"
    >
      <div class="wcag-ui-slider__rail" aria-hidden="true">
        {#if showSteps}
          <div class="wcag-ui-slider__steps" aria-hidden="true">
            {#each stepMarkers as pct}
              <span class="wcag-ui-slider__step" style="left: {pct}%;"></span>
            {/each}
          </div>
        {/if}
        <div
          class="wcag-ui-slider__fill"
          aria-hidden="true"
          style="left: {fillLeft}%; width: {fillWidth}%;"
        ></div>
      </div>

      <input
        type="range"
        class="wcag-ui-slider__input"
        class:wcag-ui-slider__input--top={topInput === "min"}
        {min}
        {max}
        {step}
        {disabled}
        value={internalMin}
        onpointerenter={() => activeThumb = "min"}
        onpointerleave={() => activeThumb = null}
        onfocus={() => activeThumb = "min"}
        onblur={() => activeThumb = null}
        oninput={(event) => handleInput(event, "min")}
        aria-label={multiThumb ? `${label} minimum` : label}
				aria-describedby={hint ? `${id}-hint` : undefined}
        aria-valuetext={formatValue(internalMin)}
      />

      <!-- Max thumb (multi only) -->
      {#if multiThumb}
        <input
          type="range"
          class="wcag-ui-slider__input"
          class:wcag-ui-slider__input--top={topInput === 'max'}
          {min}
          {max}
          {step}
          {disabled}
          value={internalMax}
          onpointerenter={() => activeThumb = "max"}
          onpointerleave={() => activeThumb = null}
          onfocus={() => activeThumb = "max"}
          onblur={() => activeThumb = null}
          oninput={(event) => handleInput(event, "max")}
          aria-label="{label} maximum"
          aria-valuetext={formatValue(internalMax)}
        />
      {/if}

      <!-- Value bubbles -->
      {#if showValues}
        <div class="wcag-ui-slider__values" aria-hidden="true">
          <span
            class="wcag-ui-slider__tooltip"
            data-active={activeThumb === "min"}
            style="--value-pct: {minPct};"
          >
            {formatValue(internalMin)}
          </span>
          {#if multiThumb}
            <span
              class="wcag-ui-slider__tooltip"
              data-active={activeThumb === "max"}
              style="--value-pct: {maxPct};"
            >
              {formatValue(internalMax)}
            </span>
          {/if}
        </div>
      {/if}
    </div>

    {#if showEndCaps}
      <div class="wcag-ui-slider__cap wcag-ui-slider__cap--end">
        {#if endCap}
          {@render endCap({ max })}
        {:else}
          <span class="wcag-ui-slider__cap-label">{formatValue(internalMax)}</span>
        {/if}
      </div>
    {/if}
  </div>

  <!-- Hidden inputs for form submission -->
  {#if name}
    {#if multiThumb}
      <input type="hidden" name="{name}[min]" value={internalMin} />
      <input type="hidden" name="{name}[max]" value={internalMax} />
    {:else}
      <input type="hidden" {name} value={internalMin} />
    {/if}
  {/if}
</div>

<style>
  .wcag-ui-slider {
    --slider-thumb-size: 20px;
    --slider-fill: #3b5bdb;
    --slider-track: #e2e8f0;
    --slider-thumb-border: 2px solid #fff;
    --slider-thumb-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
    --slider-focus-ring: 0 0 0 3px rgba(59, 91, 219, 0.4);

    display: flex;
    flex-direction: column;
    gap: .5rem;
    width: 100%;
  }

	.wcag-ui-slider__header {
		display: flex;
    justify-content: space-between;
    align-items: flex-end;
    gap: 1rem;
    width: 100%;
	}

	.wcag-ui-slider__hint,
  .wcag-ui-slider__label {
    font-size: 0.875rem;
    font-weight: 400;
    color: #1e293b;
    user-select: none;
  }

  .wcag-ui-slider__control {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .wcag-ui-slider__cap {
    display: flex;
    align-items: center;
    justify-content: center;
		font-variant-numeric: tabular-nums;
    flex-shrink: 0;
    color: #475569;
  }

  .wcag-ui-slider__cap-label {
    font-size: 0.8125rem;
    font-weight: 600;
    color: #475569;
    background: #f1f5f9;
    border-radius: 0.5rem;

    padding: 0.375rem 0.625rem;
    user-select: none;
  }

  .wcag-ui-slider__track-wrapper {
    position: relative;
    height: var(--slider-thumb-size);
    display: flex;
    align-items: center;
    container-type: inline-size;
    flex: 1;
  }

  .wcag-ui-slider__rail {
    position: absolute;
    left: 0;
    right: 0;
    height: 6px;
    background: var(--slider-track);
    border-radius: 9999px;
    pointer-events: none;
    overflow: hidden;
  }

  .wcag-ui-slider__steps {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }

  .wcag-ui-slider__step {
    position: absolute;
    top: 50%;
    width: 2px;
    height: 2px;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.2);
    transform: translate(-50%, -50%);
  }

  .wcag-ui-slider__fill {
    position: absolute;
    height: 100%;
    background: var(--slider-fill);
    border-radius: inherit;
  }

  .wcag-ui-slider__input {
    position: absolute;
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    background: transparent;
    appearance: none;
    pointer-events: none;
    outline: none;
  }

  .wcag-ui-slider__input--top {
    z-index: 10;
  }

  /* Thumb — WebKit */
  .wcag-ui-slider__input::-webkit-slider-thumb {
    appearance: none;
    pointer-events: all;
    width: var(--slider-thumb-size);
    height: var(--slider-thumb-size);
    border-radius: 50%;
    background: var(--slider-fill);
    border: var(--slider-thumb-border);
    box-shadow: var(--slider-thumb-shadow);
    cursor: pointer;
    transition: transform 0.1s ease;
  }

  .wcag-ui-slider__input::-webkit-slider-thumb:hover {
    transform: scale(1.15);
  }

  /* Thumb — Firefox */
  .wcag-ui-slider__input::-moz-range-thumb {
    pointer-events: all;
    width: var(--slider-thumb-size);
    height: var(--slider-thumb-size);
    border-radius: 50%;
    background: var(--slider-fill);
    border: var(--slider-thumb-border);
    box-shadow: var(--slider-thumb-shadow);
    cursor: pointer;
    transition: transform 0.1s ease;
  }

  .wcag-ui-slider__input::-moz-range-thumb:hover {
    transform: scale(1.15);
  }

  /* Focus ring — WebKit */
  .wcag-ui-slider__input:focus-visible::-webkit-slider-thumb {
    box-shadow: var(--slider-thumb-shadow), var(--slider-focus-ring);
  }

  /* Focus ring — Firefox */
  .wcag-ui-slider__input:focus-visible::-moz-range-thumb {
    box-shadow: var(--slider-thumb-shadow), var(--slider-focus-ring);
  }

  .wcag-ui-slider__values {
    position: absolute;
    top: calc(var(--slider-thumb-size) * -1 - .5rem);
    left: 0;
    right: 0;
    pointer-events: none;
    container-type: inline-size;
  }

  .wcag-ui-slider__tooltip {
    position: absolute;
    left: 0;
    --thumb-half: calc(var(--slider-thumb-size) / 2);
    --thumb-correction: calc(
      var(--thumb-half) - (var(--value-pct) / 100) * var(--slider-thumb-size)
    );
    transform: translate3d(
      calc((var(--value-pct) / 100) * 100cqw - 50% + var(--thumb-correction)),
      0, 0
    );
    opacity: 0;
    pointer-events: none;
    background-color: rgba(0, 0 , 0, .75);
    font-size: 0.75rem;
    font-weight: 600;
    padding-block: .25rem;
    padding-inline: .5rem;
    border-radius: .25rem;
    color: #fff;
    white-space: nowrap;
    will-change: transform;
  }

  .wcag-ui-slider__tooltip[data-active="true"] {
    opacity: 1;
    pointer-events: unset;
  }

  .wcag-ui-slider--disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (prefers-reduced-motion: reduce) {
    .wcag-ui-slider__input::-webkit-slider-thumb,
    .wcag-ui-slider__input::-moz-range-thumb {
      transition: none;
    }
  }
</style>
