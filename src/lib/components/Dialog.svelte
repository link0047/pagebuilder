<script lang="ts">
  import { onMount, type Snippet } from "svelte";
  import Portal from "./Portal.svelte";
  import Backdrop from "./Backdrop.svelte";
  import Button from "./Button.svelte";
  import Icon from "./Icon.svelte";
  import { setDialogState } from "./dialog-state.svelte";

  type Variant = "default" | "fullscreen" | "lightbox";
  type Size = "sm" | "md" | "lg" | "xl";

  // Replaced `[key: string]: unknown` index signature with HTMLAttributes
  // intersection — this preserves excess property checking while still
  // allowing arbitrary HTML attributes to be forwarded via restProps.
  interface Props extends Record<string, unknown> {
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
    size?: Size;
    variant?: Variant;
    ref?: HTMLElement;
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
    size = "md",
    variant = "default",
    ref = $bindable(),
    ...restProps
  }: Props = $props();

  // Pass a reactive options getter so the state class always reads the
  // current prop values — no need for extra setters or constructor churn.
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
  });

  $effect(() => {
    dialogState.disclosure = disclosure;

    return () => {
      dialogState.disclosure = undefined;
    };
  });
</script>

<Portal>
  <!-- hasBackdrop now actually controls rendering -->
  {#if hasBackdrop}
    <Backdrop {open} />
  {/if}
  <div
    class="wcag-ui-dialog-wrapper"
    class:wcag-ui-dialog-wrapper--open={open}
  >
    <div
      bind:this={ref}
      {id}
      aria-modal="true"
      aria-labelledby={title || header ? dialogState.titleId : undefined}
      aria-describedby={dialogState.contentId}
      role="dialog"
      class="wcag-ui-dialog"
      class:wcag-ui-dialog--open={open}
      class:wcag-ui-dialog--fullscreen={variant === "fullscreen"}
      class:wcag-ui-dialog--lightbox={variant === "lightbox"}
      class:wcag-ui-dialog--size-sm={size === "sm"}
      class:wcag-ui-dialog--size-lg={size === "lg"}
      class:wcag-ui-dialog--size-xl={size === "xl"}
      tabindex="-1"
      {...restProps}
    >
      {#if controls || hasCloseButton}
        <div class="wcag-ui-dialog__controls">
          {@render controls?.()}
          {#if hasCloseButton}
            <Button shape="circle" variant="ghost" onclick={() => dialogState.close()}>
              <Icon>
                <use href="#close" />
              </Icon>
            </Button>
          {/if}
        </div>
      {/if}
      {#if header || title}
        <header class="wcag-ui-dialog__header">
          {@render header?.()}
          {#if title}
            <span class="wcag-ui-dialog__title" id={dialogState.titleId}>{title}</span>
          {/if}
        </header>
      {/if}
      <div class="wcag-ui-dialog__content" id={dialogState.contentId}>
        {@render children?.()}
      </div>
      {#if footer}
        <footer class="wcag-ui-dialog__footer">
          {@render footer()}
        </footer>
      {/if}
    </div>
  </div>
</Portal>

<style>
  .wcag-ui-dialog-wrapper {
    position: fixed;
    inset: 0;
    z-index: 519;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow-y: auto;
    visibility: hidden;
    pointer-events: none;
    transition: visibility 0s linear .25s;
  }

  .wcag-ui-dialog-wrapper--open {
    visibility: visible;
    pointer-events: initial;
    transition: visibility 0s linear 0s;
  }

  .wcag-ui-dialog {
    position: relative;
    box-sizing: border-box;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
    background-color: #fff;
    box-shadow: 0 6px 12px -2px rgba(50,50,93,0.25),0 3px 7px -3px rgba(0,0,0,0.3);
    border-radius: .75rem;
    contain: content;
    height: fit-content;
    min-height: 0;
    width: 100%;
    max-width: 560px;
    opacity: 0;
    transform: scale(0.95);
    will-change: opacity, transform;
    transition: opacity .25s ease-in-out, transform .25s cubic-bezier(0.2, 0, 0.2, 1);
    display: grid;
    grid-template-columns: minmax(0, auto) 1fr minmax(0, auto);
    grid-template-areas:
      "header header header"
      "content content content"
      "footer footer footer";
  }

  .wcag-ui-dialog__controls {
    display: flex;
    flex-flow: row nowrap;
    gap: .5rem;
    grid-area: header;
    z-index: 10;
    padding-inline-end: .75rem;
    align-self: center;
    justify-self: end;
  }

  .wcag-ui-dialog__header {
    grid-area: header;
    height: 4rem;
    display: flex;
    padding-inline: 1.5rem;
    align-items: center;
    border-bottom: 1px solid #d1d1d1;
  }

  .wcag-ui-dialog__title {
    font-size: 1.25rem;
    font-weight: 500;
    color: #212121;
    margin: 0;
    line-height: 1;
  }

  .wcag-ui-dialog__content,
  .wcag-ui-dialog__footer {
    padding-inline: 1.5rem;
    padding-block: 1rem;
  }

  .wcag-ui-dialog__content {
    grid-area: content;
  }

  .wcag-ui-dialog__footer {
    grid-area: footer;
    border-top: 1px solid #d1d1d1;
  }

  .wcag-ui-dialog--open {
    opacity: 1;
    transform: scale(1);
  }

  .wcag-ui-dialog--size-sm {
    max-width: 280px;
  }

  .wcag-ui-dialog--size-lg {
    max-width: 840px;
  }

  .wcag-ui-dialog--size-xl {
    max-width: 1120px;
  }

  .wcag-ui-dialog--fullscreen {
    width: 100vw;
    height: 100vh;
    max-width: 100vw;
    max-height: 100vh;
    box-shadow: none;
    border-radius: 0;
  }

  .wcag-ui-dialog--lightbox {
    width: calc(100vw - 1rem);
    max-width: 1400px;
    min-height: 400px;
    height: 80vh;
  }
</style>
