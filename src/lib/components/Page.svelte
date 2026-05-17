<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";

  type Tag = "div" | "main";

  type FontProps = {
    family?: string;
    size?: string;
    weight?: string | number;
    lineHeight?: string | number;
  };

  type PaddingProps = {
    block?: string;
    inline?: string;
  };

  type Props = HTMLAttributes<HTMLElement> & {
    children: Snippet;
    tag?: Tag;
    maxWidth?: string;
    background?: string;
    padding?: PaddingProps;
    margin?: string;
    spacing?: string;
    font?: FontProps;
  };

  let {
    children,
    tag = "main",
    maxWidth,
    background,
    padding,
    margin,
    spacing,
    font,
    ...restProps
  }: Props = $props();
</script>

<svelte:element
  this={tag}
  class="page"
  style:--page-max-width={maxWidth}
  style:--page-bg={background}
  style:--page-padding-block={padding?.block}
  style:--page-padding-inline={padding?.inline}
  style:--page-margin={margin}
  style:--page-spacing={spacing}
  style:--page-font-family={font?.family}
  style:--page-font-size={font?.size}
  style:--page-font-weight={font?.weight}
  style:--page-line-height={font?.lineHeight}
  {...restProps}
>
  {@render children?.()}
</svelte:element>

<style>
  .page {
    --page-bg: transparent;
    --page-font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
    --page-font-size: 1rem;
    --page-font-weight: 400;
    --page-line-height: 1.5;
    --page-max-width: 87.5rem;
    --page-padding-block: .5rem;
    --page-padding-inline: .5rem;
    --page-spacing: 0;
    --page-margin: 0 auto;

    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;
    -webkit-tap-highlight-color: transparent;
    line-height: var(--page-line-height);
    font-weight: var(--page-font-weight);
    font-synthesis: none;
    font-feature-settings: "liga" 1;
    font-kerning: normal;
    font-size: var(--page-font-size);
    font-family: var(--page-font-family);
    background: var(--page-bg);
    display: flex;
    flex-flow: column nowrap;
    width: 100%;
    max-width: var(--page-max-width);
    flex: 1;
    gap: var(--page-spacing);
    margin: var(--page-margin);
    padding-block: var(--page-padding-block);
    padding-inline: var(--page-padding-inline);
    direction: ltr;
    text-rendering: optimizeLegibility;
    unicode-bidi: embed;
  }

  @media (min-width: 768px) {
    .page {
      --page-padding-block: 1rem;
      --page-padding-inline: 1rem;
    }
  }
</style>
