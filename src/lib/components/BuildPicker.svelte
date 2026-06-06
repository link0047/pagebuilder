<script lang="ts" generics="T">
  import type { Snippet } from "svelte";
  import { rovingTabIndex, type RovingOrientation } from "$lib/attachments/rovingTabIndex";
  import { doubleTap } from "$lib/attachments/doubleTap";

  type Props = {
    items: T[];
    getId: (item: T) => string;
    selectedId: string | null;
    option: Snippet<[T, { selected: boolean }]>;
    ariaLabel: string;
    orientation?: RovingOrientation;
    striped?: boolean;
    onSelect: (id: string, item: T) => void;
    onActivate: (id: string, item: T) => void;
    ref?: HTMLElement;
  };

  let {
    items,
    getId,
    selectedId,
    option,
    ariaLabel,
    orientation = "vertical",
    striped = false,
    onSelect,
    onActivate,
    ref = $bindable()
  }: Props = $props();
</script>

<div
  bind:this={ref}
  class="build-picker"
  class:build-picker--striped={striped}
  data-orientation={orientation}
  role="listbox"
  aria-label={ariaLabel}
  aria-orientation={orientation}
  {@attach rovingTabIndex({ orientation, initialIndex: undefined })}
>
  {#each items as item (getId(item))}
    {@const id = getId(item)}
    {@const selected = id === selectedId}
    <button
      type="button"
      role="option"
      class="build-picker__option"
      aria-selected={selected}
      onclick={() => onSelect(id, item)}
      onkeydown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(id, item);
          onActivate(id, item);
        }
      }}
      {@attach doubleTap({ onDoubleTap: () => {
        onSelect(id, item);
        onActivate(id, item);
      } })}
    >
      {@render option(item, { selected })}
    </button>
  {/each}
</div>

<style>
  .build-picker {
    display: flex;
    outline: 0;
  }

  .build-picker[data-orientation="vertical"] {
    flex-direction: column;
    gap: 0;
  }

  .build-picker[data-orientation="horizontal"] {
    flex-direction: row;
    gap: 2rem;
  }

  .build-picker__option {
    appearance: none;
    border: 0;
    background: transparent;
    padding: 0;
    margin: 0;
    font: inherit;
    text-align: inherit;
    color: inherit;
    cursor: pointer;
    outline: 0;
    touch-action: manipulation;
    user-select: none;
  }

  /* Striping: set the inherited --row-bg on alternate options.
     The option's child (e.g. RecentRow) consumes var(--row-bg).
     A value set directly on the row (e.g. selected) beats this inherited one. */
  .build-picker--striped .build-picker__option:nth-child(even) {
    --row-bg: #f2f2f2;
  }
</style>
