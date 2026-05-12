<script lang="ts">
  import type { Snippet } from "svelte";

  type ResponsiveDirection = { mobile: Direction, tablet: Direction, desktop: Direction };
  type ResponsiveSpacing = { mobile: Spacing, tablet: Spacing, desktop: Spacing };
  type Direction = "column" | "row";
  type Spacing = "sm" | "md" | "lg" | number | string;

  type Props = {
    direction?: Direction | ResponsiveDirection;
    spacing?: Spacing | ResponsiveSpacing;
    separator?: Snippet;
    children?: Snippet;
  };


  let {
    direction = "column",
    spacing = "md",
    separator,
    children,
  }: Props = $props();

  const spacingMap: Record<string, string> = {
    sm: "0.5rem",
    md: "1rem",
    lg: "2rem",
  };

  function resolveSpacing(s: Spacing): string {
    if (typeof s === "number") return `${s}px`;
    if (s in spacingMap) return spacingMap[s];
    return s; // pass through any valid CSS value e.g. "1.5rem", "clamp(1rem, 2vw, 2rem)"
  }

  const isResponsiveDir = (d: typeof direction): d is ResponsiveDirection =>
    typeof d === "object";
  const isResponsiveSpacing = (s: typeof spacing): s is ResponsiveSpacing =>
    typeof s === "object";

  const mobileDir  = $derived(isResponsiveDir(direction) ? direction.mobile  : direction);
  const tabletDir  = $derived(isResponsiveDir(direction) ? direction.tablet  : direction);
  const desktopDir = $derived(isResponsiveDir(direction) ? direction.desktop : direction);

  const mobileSp  = $derived(isResponsiveSpacing(spacing) ? resolveSpacing(spacing.mobile)  : resolveSpacing(spacing));
  const tabletSp  = $derived(isResponsiveSpacing(spacing) ? resolveSpacing(spacing.tablet)  : resolveSpacing(spacing));
  const desktopSp = $derived(isResponsiveSpacing(spacing) ? resolveSpacing(spacing.desktop) : resolveSpacing(spacing));
</script>

<div
  class="wcag-ui-stack"
  style="--dir-mobile:{mobileDir};--dir-tablet:{tabletDir};--dir-desktop:{desktopDir};--gap-mobile:{mobileSp};--gap-tablet:{tabletSp};--gap-desktop:{desktopSp}"
>
  {#if separator}
    {#each /* children array workaround */ [1] as _}
      {@render children?.()}
    {/each}
  {:else}
    {@render children?.()}
  {/if}
  {@render separator?.()}
</div>

<style>
  .wcag-ui-stack {
    display: flex;
    flex-direction: var(--dir-mobile);
    gap: var(--gap-mobile);
    box-sizing: border-box;
    width: 100%;
  }

  .wcag-ui-stack :global([data-separator]) {
    flex-shrink: 0;
  }

  /* Tablet: 640px+ */
  @media (min-width: 640px) {
    .wcag-ui-stack {
      flex-direction: var(--dir-tablet);
      gap: var(--gap-tablet);
    }
  }

  /* Desktop: 1024px+ */
  @media (min-width: 1024px) {
    .wcag-ui-stack {
      flex-direction: var(--dir-desktop);
      gap: var(--gap-desktop);
    }
  }
</style>
