<script lang="ts">
  import { type Snippet } from "svelte";

  type Variant = "default" | "underline" | "outlined" | "button";
  type Color = "default" | "primary";

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

<a 
  class="link"
  class:link--color-primary={color === "primary"}
  class:link--underline={variant === "underline"}
  class:link--outlined={variant === "outlined"}
  class:link--button={variant === "button"}
  {href} 
  {...restProps}>
  {@render children?.()}
</a>

<style>
  @layer variables, base, layout, variants, colors, states;

  @layer variables {
    :root {
      --uikit-link-height: 2.5rem;
      --uikit-link-padding-inline: .5rem;
      
      /* Typography */
      --uikit-link-font-size: 1rem;
      --uikit-link-font-weight: 400;
      --uikit-link-color: #212121;
      --uikit-link-decoration: none;
      --uikit-link-letter-spacing: .04em;
      --uikit-link-font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
      
      /* Border styles */
      --uikit-link-border-width: 0;
      --uikit-link-border-style: solid;
      --uikit-link-border-color: transparent;
      --uikit-link-border-radius: .25rem;

      /* Outline styles */
      --uikit-link-outline-color: #007acc;
      --uikit-link-outline-style: solid;
      --uikit-link-outline-width: 2px;
      --uikit-link-outline-offset: 2px;
      
      /* Default colors */
      --uikit-link-bg-color: initial;
      
      /* Hover state */
      --uikit-link-hover-bg-color: initial;
      --uikit-link-hover-color: #616161;
      --uikit-link-hover-decoration: underline;

      /* Focus state */
      --uikit-link-focus-color: #616161;
      --uikit-link-focus-bg-color: initial;
    }
  }

  @layer base {
    .link {
      box-sizing: border-box;
      font-family: var(--uikit-link-font-family);
      font-size: var(--uikit-link-font-size);
      font-weight: var(--uikit-link-font-weight);
      color: var(--uikit-link-color);
      background-color: var(--uikit-link-bg-color);
      text-decoration: var(--uikit-link-decoration);
      border: var(--uikit-link-border-width) var(--uikit-link-border-style) var(--uikit-link-border-color);
      border-radius: var(--uikit-link-border-radius);
      transition: background-color 0.2s, color 0.2s, border-color 0.2s;
      cursor: pointer;
    }
  }

  @layer layout {
    .link {
      display: inline;
      padding: 0;
    }

    .link--button,
    .link--outlined {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      text-decoration: none;
      height: var(--uikit-link-height);
      padding-inline: var(--uikit-link-padding-inline);
      --uikit-link-border-radius: .5rem;
    }

    .link--button {
      letter-spacing: var(--uikit-link-letter-spacing);
    }
  }

  @layer variants {
    .link--underline {
      --uikit-link-decoration: underline;
    }
    
    .link--outlined {
      --uikit-link-border-width: 2px;
      --uikit-link-border-color: #333335;
      --uikit-link-hover-decoration: none;
      --uikit-link-hover-bg-color: rgba(0,0,0, 0.05);
    }

    .link--button {
      --uikit-link-color: #fff;
      --uikit-link-bg-color: #333335;
      --uikit-link-hover-bg-color: #555659;
      --uikit-link-hover-color: #fff;
      --uikit-link-hover-decoration: none;
    }
  }

  @layer colors {
    .link--color-primary {
      --uikit-link-color: #174eab;
      --uikit-link-hover-color: #2a62c4;
    }

    .link--button.link--color-primary {
      --uikit-link-bg-color: #174eab;
      --uikit-link-color: #fff;
      --uikit-link-hover-bg-color: #2a62c4;
      --uikit-link-hover-color: #fff;
    }
  }

  @layer states {
    .link:hover {
      background-color: var(--uikit-link-hover-bg-color);
      color: var(--uikit-link-hover-color);
      text-decoration: var(--uikit-link-hover-decoration);
    }

    .link:focus-visible {
      outline: var(--uikit-link-outline-width) var(--uikit-link-outline-style) var(--uikit-link-outline-color);
      outline-offset: var(--uikit-link-outline-offset);
    }
  }
</style>