<script lang="ts">
  import type { Snippet } from "svelte";
  import Button from "./Button.svelte";
  import Icon from "./Icon.svelte";

  type Variant = "filled" | "outlined";
  type Size = "sm" | "md" | "lg";
  type Severity = "info" | "success" | "warning" | "error";
  type Title = string | Snippet;

  type Props = {
    variant?: Variant;
    size?: Size;
    severity?: Severity;
    title?: Title;
    dismissible?: boolean;
    dismissAfter?: number;
    onDismiss?: () => void;
    showIcon?: boolean;
    icon?: Snippet;
    children?: Snippet;
    actions?: Snippet<[{ dismiss: () => void }]>;
  };

  let {
    severity = "info",
    variant,
    title,
    size = "md",
    dismissible = false,
    dismissAfter,
    onDismiss,
    showIcon = true,
    icon,
    children,
    actions,
  }: Props = $props();

  let dismissed = $state(false);
  let paused = $state(false);
  let remaining = $state(dismissAfter ? dismissAfter * 1000 : 0);
  let startTime: number | null = null;
  let autoDismissTimer: ReturnType<typeof setTimeout> | null = null;

  const icons = {
    info: "M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M11,6.5V9.5H13V6.5H11M11,11V17H13V11H11Z",
    success: "M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M11,16.5L18,9.5L16.59,8.09L11,13.67L7.91,10.59L6.5,12L11,16.5Z",
    warning: "M12,2L1,21H23M12,6L19.53,19H4.47M11,10V14H13V10M11,16V18H13V16",
    error: "M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,7A1,1 0 0,0 11,8V13A1,1 0 0,0 12,14A1,1 0 0,0 13,13V8A1,1 0 0,0 12,7M12,17.5A1.5,1.5 0 0,0 10.5,16A1.5,1.5 0 0,0 12,14.5A1.5,1.5 0 0,0 13.5,16A1.5,1.5 0 0,0 12,17.5Z"
  };
  const iconPath = $derived(icons[severity]);
  const ariaRole = $derived(severity === "error" || severity === "warning" ? "alert" : "status");

  function handleDismiss() {
    dismissed = true;

    if (autoDismissTimer) {
      clearTimeout(autoDismissTimer);
    }

    onDismiss?.();
  }

  function handlePause() {
    if (startTime !== null) {
      remaining = remaining - (Date.now() - startTime);
      startTime = null;
    }
    paused = true;
  }

  function handlePointerLeave({ currentTarget }: PointerEvent) {
    if (!(currentTarget instanceof HTMLElement)) return;
    if (!currentTarget.contains(document.activeElement)) {
      paused = false;
    }
  }

  function handleFocusOut({ currentTarget }: FocusEvent) {
    if (!(currentTarget instanceof HTMLElement)) return;
    if (!currentTarget.matches(":hover")) {
      paused = false;
    }
  }

  $effect(() => {
    if (dismissAfter && !dismissed && !paused) {
      startTime = Date.now();
      autoDismissTimer = setTimeout(handleDismiss, remaining);
    }
    return () => {
      if (autoDismissTimer) clearTimeout(autoDismissTimer);
    };
  });
</script>

{#if !dismissed}
  <div
    class="wcag-alert"
    class:wcag-alert--severity-info={severity === "info"}
    class:wcag-alert--severity-success={severity === "success"}
    class:wcag-alert--severity-warning={severity === "warning"}
    class:wcag-alert--severity-error={severity === "error"}
    class:wcag-alert--variant-outlined={variant === "outlined"}
    class:wcag-alert--size-sm={size === "sm"}
    class:wcag-alert--size-lg={size === "lg"}
    role={ariaRole}
    aria-atomic="true"
    onpointerenter={dismissAfter ? handlePause : undefined}
    onpointerleave={dismissAfter ? handlePointerLeave : undefined}
    onfocusin={dismissAfter ? handlePause : undefined}
    onfocusout={dismissAfter ? handleFocusOut : undefined}
  >
    {#if showIcon}
      <div class="wcag-alert__icon" aria-hidden="true">
        {#if icon}
          {@render icon()}
        {:else}
          <Icon>
            <path d={iconPath} />
          </Icon>
        {/if}
      </div>
    {/if}
    <div class="wcag-alert__content">
      {#if title}
        <strong class="wcag-alert__title">
          {#if typeof title === "string"}
            {title}
          {:else}
            {@render title()}
          {/if}
        </strong>
      {/if}
      {#if children}
        <div class="wcag-alert__description">
          {@render children()}
        </div>
      {/if}
    </div>
    {#if actions || dismissible}
      <div class="wcag-alert__controls">
        {@render actions?.({ dismiss: handleDismiss })}
        {#if dismissible}
          <Button
            variant="ghost"
            shape="circle"
            onclick={handleDismiss}
            aria-label="Dismiss alert"
          >
            <Icon>
              <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
            </Icon>
          </Button>
        {/if}
      </div>
    {/if}
  </div>
{/if}

<style>
  .wcag-alert {
    /* base = filled variant, md size */
    position: relative;
    display: flex;
    align-items: center;
    gap: .75rem;
    padding-block: .75rem;
    padding-inline: 1rem;
    background-color: #fffbeb;
    border: .5px solid #f0c040;
    border-radius: .5rem;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
  }

  .wcag-alert__content {
    display: flex;
    flex-direction: column;
    gap: .5rem;
    flex: 1;
    font-size: .875rem;
    color: #92600a;
  }

  .wcag-alert__icon,
  .wcag-alert__actions {
    flex-shrink: 0;
  }

  .wcag-alert__actions {
    display: flex;
    gap: .5rem;
    align-items: center;
  }
</style>
