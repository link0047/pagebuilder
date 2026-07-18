<script lang="ts">
  import type { Snippet } from "svelte";
  import type { ControlSchema } from "./component-schema";

  import Icon from "./Icon.svelte";
  import Button from "./Button.svelte";
  import ArrayFieldItem from "./ArrayFieldItem.svelte";

  type Props = {
    label?: string;
    addLabel?: string;
    /**
     * Header for each row. `${key}` interpolates from the item, so
     * "${text}" shows the heading's own text. Falls back to `itemFallback`
     * when the referenced value is empty.
     */
    itemLabel?: string;
    /**
     * Row header when the item has no text yet. Index 0 uses the first entry,
     * every later row uses the second — a heading array's first item is the
     * real heading and the rest are subheadings.
     */
    itemFallback?: [string, string] | string;
    /** The array of item objects (already resolved from AppState). */
    items: Record<string, any>[];
    /** Controls describing one item's sub-form. */
    itemControls: ControlSchema[];
    /**
     * Controls shown only on the first row. Heading level lives here: it
     * belongs to the heading that actually renders as a heading element, and
     * would be meaningless on the spans below it.
     */
    firstItemControls?: ControlSchema[];
    max?: number;
    min?: number;
    onAdd?: () => void;
    onRemove?: (index: number) => void;
    onMove?: (index: number, direction: "up" | "down") => void;
    /**
     * Renders a single control for a given item index. The parent supplies this
     * so ArrayField can reuse the panel's existing control renderer with
     * property paths rebased onto `${property}.${index}.${childProperty}`.
     */
    renderItemControl: Snippet<[{ control: ControlSchema; index: number }]>;
  };

  let {
    label,
    addLabel = "Add item",
    itemLabel,
    itemFallback = "Item",
    items = [],
    itemControls,
    firstItemControls = [],
    max,
    min = 0,
    onAdd,
    onRemove,
    onMove,
    renderItemControl,
  }: Props = $props();

  /**
   * Index of the expanded row, or null when all are closed. One number rather
   * than a boolean per row: only one can be open, and a single value can't
   * drift out of sync with `items.length` the way a parallel array does.
   *
   * Critically, this is NOT derived from `items` via an $effect. Effects run
   * after the DOM updates, and Collapse reads `open` once in onMount — it
   * snapshots the value into `shouldHideContent`, `detailsRef.open`, and the
   * animation's currentTime, none of which re-run when the prop later changes.
   * A row that mounts with open=false is therefore stuck shut even after the
   * effect flips the flag, and the next click flips it back to false (no
   * visible change) so it takes two clicks to open. Setting this in `add()`,
   * before the new row renders, means it mounts with the right value.
   */
  // Starts at 0 rather than null: arriving at a panel where every row is shut
  // hides the content behind a click that isn't obviously there. Set as the
  // initial value, not in an $effect — Collapse reads `open` once at mount and
  // snapshots it, so a later flip leaves the row visually shut while `open` is
  // true, and the next click just closes it again.
  let openIndex = $state<number | null>(0);

  const canAdd = $derived(max == null || items.length < max);

  function add() {
    // Set first, so the row about to be created mounts already open.
    openIndex = items.length;
    onAdd?.();
  }

  function remove(index: number) {
    // Keep the same row expanded where possible; the one below shifts up into
    // this index, so staying put is the least surprising behaviour.
    if (openIndex === index) openIndex = null;
    else if (openIndex !== null && openIndex > index) openIndex -= 1;
    onRemove?.(index);
  }

  function move(index: number, direction: "up" | "down") {
    const to = direction === "up" ? index - 1 : index + 1;
    // Follow the row the user is moving rather than the position.
    if (openIndex === index) openIndex = to;
    else if (openIndex === to) openIndex = index;
    onMove?.(index, direction);
  }

  function fallbackFor(index: number): string {
    if (typeof itemFallback === "string") return itemFallback;
    return index === 0 ? itemFallback[0] : itemFallback[1];
  }

  function rowLabel(item: Record<string, any>, index: number): string {
    const fallback = fallbackFor(index);
    if (!itemLabel) return fallback;

    return itemLabel.replace(/\$\{(\w+)\}/g, (_, key) => {
      const value = item?.[key];
      return value ? String(value) : fallback;
    });
  }

  /** Row 0 gets the extra controls appended; every other row doesn't. */
  function controlsFor(index: number): ControlSchema[] {
    return index === 0 ? [...itemControls, ...firstItemControls] : itemControls;
  }
</script>

<div class="array-field">
  {#if label}
    <span class="array-field__label">{label}</span>
  {/if}

  {#each items as item, index (index)}
    <ArrayFieldItem
      label={rowLabel(item, index)}
      bind:open={
        () => openIndex === index,
        (v) => { openIndex = v ? index : null; }
      }
      canMoveUp={index > 0}
      canMoveDown={index < items.length - 1}
      canRemove={items.length > min}
      onMoveUp={() => move(index, "up")}
      onMoveDown={() => move(index, "down")}
      onRemove={() => remove(index)}
    >
      {#each controlsFor(index) as control}
        {@render renderItemControl({ control, index })}
      {/each}
    </ArrayFieldItem>
  {/each}

  <Button
    variant="ghost"
    onclick={add}
    fullWidth
    disabled={!canAdd}
  >
    <Icon size="0.875rem"><use href="#plus" /></Icon>
    {addLabel}
  </Button>
</div>

<style>
  .array-field {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .array-field__label {
    font-size: 0.8125rem;
    color: var(--wcag-ui-textfield-label-color, #4d4d4d);
  }
</style>
