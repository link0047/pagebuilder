<script lang="ts">
  import type { Snippet } from "svelte";
  import Collapse from "./Collapse.svelte";
  import Button from "./Button.svelte";
  import Icon from "./Icon.svelte";

  type Props = {
    /** Row header label, already resolved by the parent. */
    label: string;
    /**
     * Whether the body is expanded. Bound both ways: Collapse flips it when
     * the header is clicked, and ArrayField writes it to close other rows.
     */
    open?: boolean;
    canMoveUp?: boolean;
    canMoveDown?: boolean;
    canRemove?: boolean;
    onMoveUp?: () => void;
    onMoveDown?: () => void;
    onRemove?: () => void;
    /** The item's sub-form. */
    children?: Snippet;
  };

  let {
    label,
    open = $bindable(false),
    canMoveUp = true,
    canMoveDown = true,
    canRemove = true,
    onMoveUp,
    onMoveDown,
    onRemove,
    children,
  }: Props = $props();
</script>

<div class="array-field-item">
  <div class="array-field-item__body">
    <Collapse
      variant="filled"
      size="lg"
      expandIconPosition="start"
      title={label}
      bind:open
    >
      <div class="array-field-item__controls">
        {@render children?.()}
      </div>

      <!-- Delete lives with the controls it destroys, and only exists once the
           row is open. Labelled rather than a bare icon: it's the one
           destructive action here and there's room for the word. -->
      {#if canRemove}
        <div class="array-field-item__footer">
          <Button size="sm" variant="ghost" color="danger" onclick={() => onRemove?.()}>
            <Icon size="0.875rem">
              <path d="M4 7l16 0 M10 11l0 6 M14 11l0 6 M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12 M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
            </Icon>
            Delete
          </Button>
        </div>
      {/if}
    </Collapse>
  </div>

  <!--
    Reorder sits outside Collapse, not in its summary: the summary is one big
    click target, so nested buttons would fight it. Out here they're also
    reachable while the row is collapsed, which is when you'd actually reorder.

    Buttons are dimmed rather than hidden — unlike PageStructureItem's
    horizontal header, hiding one here would shift the other vertically and
    make the gutter jump between rows.
  -->
  <div class="array-field-item__gutter">
    <Button
      size="xs"
      variant="ghost"
      shape="rounded-square"
      aria-label="Move up"
      disabled={!canMoveUp}
      onclick={() => onMoveUp?.()}
    >
      <Icon size="0.875rem">
        <path d="M7.03 9.97H11.03V18.89L13.04 18.92V9.97H17.03L12.03 4.97Z" />
      </Icon>
    </Button>
    <Button
      size="xs"
      variant="ghost"
      shape="rounded-square"
      aria-label="Move down"
      disabled={!canMoveDown}
      onclick={() => onMoveDown?.()}
    >
      <Icon size="0.875rem">
        <path d="M7.03 13.92H11.03V5L13.04 4.97V13.92H17.03L12.03 18.92Z" />
      </Icon>
    </Button>
  </div>
</div>

<style>
  .array-field-item {
    display: flex;
    align-items: flex-start;
    gap: 0.25rem;
  }

  .array-field-item__body {
    flex: 1;
    min-width: 0;
  }

  .array-field-item__controls {
    display: flex;
		flex-flow: column;
		gap: .75rem;
		padding-inline: .5rem;
		padding-block: .5rem 1rem;
  }

  .array-field-item__gutter {
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
    flex-shrink: 0;
    /* Nudge down so the first button sits level with the collapsed header. */
    padding-block-start: 0.125rem;
  }

  .array-field-item__gutter :global(.wcag-ui-button:disabled) {
    --wcag-ui-button-disabled-bg-color: transparent;
    --wcag-ui-button-disabled-border-color: transparent;
    opacity: 0.35;
  }

  .array-field-item__gutter :global(.wcag-ui-button--size-xs::before) {
    min-height: 100%;
    height: 100%;
  }

  .array-field-item__footer {
    display: flex;
    justify-content: flex-end;
    padding-block: 0.75rem;
    padding-inline: 0.5rem;
    border-block-start: 1px solid hsl(from #0b0b0b h s l / 10%);
  }
</style>
