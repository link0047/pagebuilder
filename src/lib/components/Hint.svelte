<script lang="ts">
  import { type Snippet } from "svelte";
  import Icon from "./Icon.svelte";

  type Variant = "neutral" | "info";
  type Size = "small" | "sm" | "medium" | "md" | "large" | "lg";

  type Props = {
    variant?: Variant;
    size?: Size;
    icon?: boolean;
    children?: Snippet;
  };

  let {
    children,
    variant = "neutral",
    size = "md",
    icon = false
  }: Props = $props();
</script>

<div
  class="uikit-hint"
  class:uikit-hint--info={variant === "info"}
  class:uikit-hint--size-sm={size === "sm"}
	class:uikit-hint--size-lg={size === "lg"}
  role="note"
>
  {#if icon}
    <div class="uikit-hint__icon">
      <Icon size="1rem">
        <path d="M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,17H13V11H11V17Z"/>
      </Icon>
    </div>
  {/if}
  <div class="uikit-hint__message">
    {#if children}
      {@render children()}
    {/if}
  </div>
</div>

<style>
  :root {
    --uikit-hint-bg-color: ##f6f6f6;
		--uikit-hint-border-color: #989898;
    --uikit-hint-color: #111;
  }

  .uikit-hint {
    display: grid;
    grid-template-columns: auto 1fr;
    grid-template-areas: "icon message";
    gap: .5rem;
    padding: .5rem;
    color: var(--uikit-hint-color);
    box-sizing: border-box;
    background-color: var(--uikit-hint-bg-color);
    border: 1px solid var(--uikit-hint-border-color);
    border-radius: .5rem;
  }

  .uikit-hint__icon {
    grid-area: icon;
  }

  .uikit-hint__message {
    grid-area: message;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
    font-size: 0.8125rem;
    line-height: 1.2;
  }

  .uikit-hint--info {
    --uikit-hint-bg-color: #ecfaff;
		--uikit-hint-border-color: #0062d1;
    --uikit-hint-color: #0853a0;
  }
</style>