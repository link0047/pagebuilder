<script lang="ts">
  import { type Snippet } from "svelte";

  type Variant = "default" | "underline" | "button";
  type Color = "default" | "primary" | "secondary"

  type Props = {
    href: string;
    variant?: Variant;
    color?: Color;
    children?: Snippet;
    [key: string]: unknown;
  };

  let {
    href = "",
    variant = "default",
    color = "primary",
    children,
    ...restProps
  }: Props = $props();
</script>

<a class="link" {href} {...restProps}>
  {@render children?.()}
</a>

<style>
  .link {
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
    font-size: 1rem;
    font-weight: 400;
    color: #1957b4;
  }

  .link--underline,
  .link:hover {
    text-decoration: underline;
  }

  .link:hover {
    color: #1957b4;
  }

  .link:focus-visible {
    border-radius: 4px;
    outline: 2px solid #174ea6;
    outline-offset: 2px;
    color: #174eab;
  }

  .link--color-secondary {
    color: #212121;
  }
</style>