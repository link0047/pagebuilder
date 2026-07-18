<script lang="ts">
  import Textfield from "./Textfield.svelte";
  import Button from "./Button.svelte";
  import Icon from "./Icon.svelte";

  type Side = "top" | "right" | "bottom" | "left";

  type Props = {
    label?: string;
    sides?: Side[];
    value?: Partial<Record<Side, string | number>>;
    defaultValue?: string | number;
    /** Permit negative values. Defaults true. Set false for padding, where
        negative values are invalid CSS and the browser silently drops them. */
    allowNegative?: boolean;
    /** Show the "link all sides" toggle. Off by default — only worth it when
        setting every side to one value is a common move. */
    linkable?: boolean;
    onUpdate?: (side: Side, val: string) => void;
  };

  const PATHS: Record<Side, string> = {
    top: "M12 4l0 10 M12 4l4 4 M12 4l-4 4 M4 20l16 0",
    bottom: "M12 20l0 -10 M12 20l4 -4 M12 20l-4 -4 M4 4l16 0",
    left: "M10 12l10 0 M10 12l4 4 M10 12l4 -4 M4 4l0 16",
    right: "M14 12l-10 0 M14 12l-4 4 M14 12l-4 -4 M20 4l0 16"
  };

  const LABELS: Record<Side, string> = {
    top: "Top",
    right: "Right",
    bottom: "Bottom",
    left: "Left",
  };

  let {
    label = "Spacing",
    sides = ["top", "bottom", "left", "right"] as Side[],
    // $bindable so the field also works standalone, without a parent wiring
    // `onUpdate` back into `value`.
    value = $bindable({}),
    defaultValue = "",
    allowNegative = true,
    linkable = false,
    onUpdate
  }: Props = $props();

  let linkedState = $state(false);

  // Never linked when the toggle isn't offered.
  const linked = $derived(linkable && linkedState);

  /**
   * Keep only a number: optional leading minus, digits, at most one decimal
   * point. Sanitizing rather than rejecting means a pasted "24px" becomes "24"
   * instead of silently doing nothing.
   */
  function sanitize(raw: string): string {
    const cleaned = raw
      .replace(/[^0-9.-]/g, "")     // Strip everything except 0-9, . and -
      .replace(/(?!^)-/g, "")       // Remove minus signs if not at the start
      .replace(/(\..*)\./g, "$1");  // Allow only the first decimal point

    return allowNegative ? cleaned : cleaned.replace(/-/g, "");
  }

  function updateValue(side: Side, raw: string, el: HTMLInputElement) {
    const cleaned = sanitize(raw);

    // If sanitizing changed the text, write it back to the DOM immediately so
    // the rejected character never appears, and keep the caret sensible.
    if (cleaned !== raw) {
      const removed = raw.length - cleaned.length;
      const pos = Math.max(0, (el.selectionStart ?? cleaned.length) - removed);
      el.value = cleaned;
      el.setSelectionRange(pos, pos);
    }

    const targets = linked ? sides : [side];
    for (const s of targets) {
      value[s] = cleaned;
      onUpdate?.(s, cleaned);
    }
  }

  /** Turning "link" on levels every side to the first side's value. */
  function toggleLinked() {
    linkedState = !linkedState;
    if (!linkedState) return;

    const first = sides[0];
    const raw = String(value?.[first] ?? defaultValue ?? "");
    for (const s of sides) {
      if (s === first) continue;
      value[s] = raw;
      onUpdate?.(s, raw);
    }
  }
</script>

{#snippet LinkIcon(isActive: boolean)}
  {#if isActive}
    <Icon>
      <path d="M15.707 8.293a1 1 0 0 1 0 1.414l-6 6a1 1 0 1 1-1.414-1.414l6-6a1 1 0 0 1 1.414 0 M19.242 4.757c2.343 2.344 2.342 6.143-.052 8.534l-.534.464a1 1 0 1 1-1.312-1.51l.483-.416a4 4 0 0 0 0-5.657c-1.562-1.563-4.095-1.563-5.607-.054l-.463.536a1 1 0 1 1-1.514-1.308l.513-.59a6 6 0 0 1 8.486.001M6.75 10.338a1 1 0 0 1-.088 1.411l-.483.425a3.97 3.97 0 0 0 0 5.649 4.064 4.064 0 0 0 5.678.038l.34-.458a1 1 0 1 1 1.606 1.194l-.397.534-.1.114a6.07 6.07 0 0 1-8.533 0A5.97 5.97 0 0 1 3 14.998c0-1.595.638-3.124 1.814-4.284l.524-.463a1 1 0 0 1 1.411.087"/>
    </Icon>
  {:else}
    <Icon stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
      <path stroke="none" d="M0 0h24v24H0z"/>
      <path d="m9 15 3-3m2-2 1-1M11 6l.463-.536a5 5 0 0 1 7.071 7.072L18 13M3 3l18 18M13 18l-.397.534a5.068 5.068 0 0 1-7.127 0 4.972 4.972 0 0 1 0-7.071L6 11"/>
    </Icon>
  {/if}
{/snippet}

{#snippet Arrow(side: Side)}
  <Icon
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <path d={PATHS[side]} stroke="currentColor" />
  </Icon>
{/snippet}

<section class="spacing-field" data-linked={linked}>
  <header class="spacing-field__header">
    <span class="spacing-field__label">
      {label}
    </span>
    {#if linkable}
      <Button
        variant="ghost"
        size="sm"
        shape="rounded-square"
        aria-label="Link all sides"
        aria-pressed={linked}
        onclick={toggleLinked}
      >
        {@render LinkIcon(linked)}
      </Button>
    {/if}
  </header>
  <div class="spacing-field__grid">
    {#each sides as side}
      <Textfield
        label={LABELS[side]}
        hideLabel
        value={value?.[side] ?? defaultValue}
        inputmode="numeric"
				passThroughSides="leading"
        oninput={(event: Event) =>
          updateValue(side, (event.target as HTMLInputElement).value, event.target as HTMLInputElement)}
      >
        {#snippet leading()}
          {@render Arrow(side)}
        {/snippet}
      </Textfield>
    {/each}
  </div>
</section>

<style>
  .spacing-field {
    display: flex;
    flex-flow: column nowrap;
    gap: .25rem;
  }

  .spacing-field[data-linked="false"] {
    --wcag-ui-icon-fill: none;
    --wcag-ui-icon-stroke: currentcolor;
  }

	.spacing-field[data-linked="true"] {
		--wcag-ui-icon-fill: #2680eb;
	}

  .spacing-field__header {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    justify-content: space-between;
    gap: .5rem;
  }

  .spacing-field__label {
    font-size: 0.8125rem;
    color: var(--wcag-ui-textfield-label-color, #4d4d4d);
  }

  .spacing-field__grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.5rem;

    --wcag-ui-textfield-input-background: #f7f7f7;
    --wcag-ui-textfield-input-border-color: #ebebeb;
    --wcag-ui-textfield-label-color: #8a8a8a;
  }
</style>
