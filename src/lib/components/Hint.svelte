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
      <Icon>
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