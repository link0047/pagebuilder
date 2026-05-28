<script lang="ts">
  import { onMount, type Snippet } from "svelte";
  import Portal from "./Portal.svelte";
  import Backdrop from "./Backdrop.svelte";
  import Button from "./Button.svelte";
  import Icon from "./Icon.svelte";
  import { setDialogState } from "./dialog-state.svelte";

  type Props =  {
    header?: Snippet;
		footer?: Snippet;
    controls?: Snippet;
    children?: Snippet;
    title?: string;
    disclosure: HTMLElement | undefined;
    trigger?: boolean;
    open?: boolean;
    hasBackdrop?: boolean;
    hasCloseButton?: boolean;
    closeOnEsc?: boolean;
    closeOnOutsideClick?: boolean;
    ref?: HTMLElement,
    [key: string]: unknown;
  }

  let {
    header,
    footer,
    controls,
    children,
    title,
    disclosure,
    trigger = true,
    open = $bindable(false),
    hasBackdrop = true,
    hasCloseButton = true,
    closeOnEsc = true,
    closeOnOutsideClick = true,
    ref = $bindable(),
    ...restProps
  }: Props = $props();

  const dialogState = setDialogState(
    () => open,
    (value) => open = value,
    () => ({ closeOnEsc, closeOnOutsideClick }),
    () => trigger
  );
  const id = dialogState.id;

  onMount(() => {
    return () => {
      dialogState.destroy();
    };
  });

  $effect(() => {
    if (ref) {
      dialogState.dialogElement = ref;
    }
  })

  $effect(() => {
    dialogState.disclosure = disclosure;

    return () => {
      dialogState.disclosure = undefined;
    };
  });
</script>

<Portal>
  <Backdrop {open} />
  <div
    class="wcag-ui-bottom-sheet-wrapper"
    class:wcag-ui-bottom-sheet-wrapper--open={open}
  >
    <div
      bind:this={ref}
      {id}
      aria-modal="true"
      aria-labelledby={title || header ? dialogState.titleId : undefined}
      aria-describedby={dialogState.contentId}
      role="dialog"
      class="wcag-ui-bottom-sheet"
      class:wcag-ui-bottom-sheet--open={open}
      tabindex="-1"
      {...restProps}
    >
      {#if controls || hasCloseButton}
        <div class="wcag-ui-bottom-sheet__controls">
          {@render controls?.()}
          {#if hasCloseButton}
            <Button shape="circle" variant="ghost" onclick={() => dialogState.close()}>
              <Icon>
                <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
              </Icon>
            </Button>
          {/if}
        </div>
      {/if}
      {#if header || title}
        <header class="wcag-ui-bottom-sheet__header">
          {@render header?.()}
          {#if title}
            <span class="wcag-ui-bottom-sheet__title" id={dialogState.titleId}>{title}</span>
          {/if}
        </header>
      {/if}
      <div class="wcag-ui-bottom-sheet__content" id={dialogState.contentId}>
        {@render children?.()}
      </div>
			{#if footer}
				<footer class="wcag-ui-bottom-sheet__footer">
					{@render footer()}
				</footer>
			{/if}
    </div>
  </div>
</Portal>

<style>
  .wcag-ui-bottom-sheet-wrapper {
		position: fixed;
		inset: 0;
		z-index: 519;
		display: flex;
		align-items: end;
		justify-content: center;
		overflow-y: auto;
    visibility: hidden;
    pointer-events: none;
    transition: visibility 0s linear .25s;
	}

  .wcag-ui-bottom-sheet-wrapper--open {
    visibility: visible;
    pointer-events: initial;
    transition: visibility 0s linear 0s;
  }

	.wcag-ui-bottom-sheet {
    position: relative;
    box-sizing: border-box;
		font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
		background-color: #fff;
    box-shadow: 0 6px 12px -2px rgba(50,50,93,0.25),0 3px 7px -3px rgba(0,0,0,0.3);
		border-top-left-radius: .75rem;
		border-top-right-radius: .75rem;
    contain: content;
		height: fit-content;
	  min-height: 0;
		width: 100%;
		max-width: 560px;
    /*opacity: 0;*/
    transform: translate3d(0, 100%, 0);
    will-change: opacity, transform;
    transition: transform .3s cubic-bezier(0.2, 0, 0.2, 1), opacity .2s ease-in-out;
    display: grid;
    grid-template-columns: minmax(0, auto) 1fr minmax(0, auto);
    grid-template-areas:
      "header header header"
      "content content content"
      "footer footer footer";
	}

  .wcag-ui-bottom-sheet__controls {
    display: flex;
    flex-flow: row nowrap;
    gap: .5rem;
    grid-area: header;
    z-index: 10;
		padding-block: .5rem;
    padding-inline-end: .75rem;
    align-self: center;
    justify-self: end;
  }

  .wcag-ui-bottom-sheet__header {
		box-sizing: border-box;
    grid-area: header;
    height: 3.5rem;
		display: flex;
		padding-block: .5rem;
		padding-inline: 1.5rem;
		align-items: center;
  }

  .wcag-ui-bottom-sheet__title {
    font-size: 1.25rem;
    font-weight: 500;
		color: #212121;
		margin: 0;
		line-height: 1;
	}

  .wcag-ui-bottom-sheet__content {
    grid-area: content;
		padding-inline: 1.5rem;
		padding-block: 0;
  }

	.wcag-ui-bottom-sheet__footer {
    grid-area: footer;
    border-top: 1px solid #d1d1d1;
  }

  .wcag-ui-bottom-sheet--open {
    /*opacity: 1;*/
    transform: translate3d(0, 0, 0);
  }
</style>
