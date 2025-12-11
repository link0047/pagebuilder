<script lang="ts">
  type Props = {
    open: boolean;
    onclick?: (e: MouseEvent) => void;
    [key: string]: unknown;
  }

  let {
    open = false,
    ...restProps
  }: Props = $props();
</script>

<div
  aria-hidden="true"
  class="uikit-backdrop"
  class:uikit-backdrop--open={open}
  {...restProps}
></div>

<style>
  :root {
    --uikit-backdrop-z-index: 518;
  }

  .uikit-backdrop {
    position: fixed;
    z-index: var(--uikit-backdrop-z-index, 1);
    inset: 0;
    display: block;
    background-color: rgba(0, 0, 0, 0.7);
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
    will-change: opacity;
    transform: translate3d(0,0,0);
    transition: opacity .25s ease-in-out, visibility 0s linear .25s;
  }

  .uikit-backdrop--open {
    opacity: 1;
    visibility: visible;
    pointer-events: initial;
    transition: opacity .25s ease-in-out, visibility 0s linear 0s;
  }
</style>