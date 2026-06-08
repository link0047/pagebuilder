<script lang="ts">
  import type { Snippet } from "svelte";
  import Button from "./Button.svelte";
  import Icon from "./Icon.svelte";

  type Props = {
    label: string;
    onclick: () => void;
    canMoveUp?: boolean;
    canMoveDown?: boolean;
    onMoveUp?: (event: MouseEvent) => void;
    onMoveDown?: (event: MouseEvent) => void;
    onDelete?: () => void;
    actions?: Snippet;
  };

  let {
    label,
    onclick,
    canMoveUp = false,
    canMoveDown = false,
    onMoveUp,
    onMoveDown,
    onDelete,
    actions,
  }: Props = $props();
</script>

<span class="page-structure-item">
  <button
    class="page-structure-item__label"
    type="button"
    {onclick}
  >
    {label}
  </button>

  {#if canMoveUp && onMoveUp}
    <Button
      onclick={onMoveUp}
      variant="ghost"
      size="sm"
      shape="rounded-square"
      aria-label="Move up"
    >
      <Icon size="16">
        <path d="M7.03 9.97H11.03V18.89L13.04 18.92V9.97H17.03L12.03 4.97Z" />
      </Icon>
    </Button>
  {/if}

  {#if canMoveDown && onMoveDown}
    <Button
      onclick={onMoveDown}
      variant="ghost"
      size="sm"
      shape="rounded-square"
      aria-label="Move down"
    >
      <Icon size="16">
        <path d="M7.03 13.92H11.03V5L13.04 4.97V13.92H17.03L12.03 18.92Z" />
      </Icon>
    </Button>
  {/if}

  {#if actions}
    {@render actions()}
  {/if}

  {#if onDelete}
    <Button
      onclick={onDelete}
      variant="ghost"
      size="sm"
      shape="rounded-square"
      aria-label="Delete"
    >
      <Icon size="16">
        <use href="#delete" />
      </Icon>
    </Button>
  {/if}
</span>

<style>
  .page-structure-item {
    display: flex;
    height: 100%;
    width: 100%;
    flex-direction: row;
    align-items: center;
    gap: 0.25rem;
    padding-block: 0.25rem;
    padding-inline-end: 0.5rem;
  }

  .page-structure-item__label {
    flex-grow: 1;
    background-color: transparent;
    border: none;
    text-align: start;
    padding: 0;
    margin: 0;
    cursor: pointer;
    font-size: inherit;
    font-family: inherit;
    color: inherit;
  }
</style>
