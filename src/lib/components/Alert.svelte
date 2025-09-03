<script lang="ts">
  import { type Snippet } from "svelte";
  import Button from "./Button.svelte";
  import Icon from "./Icon.svelte";

  type Variant = "filled" | "outlined";
  type Size = "small" | "sm" | "medium" | "md" | "large" | "lg";
  type Severity = "info" | "success" | "warning" | "error";

  type Props = {
    variant?: Variant;
    size?: Size;
    severity?: Severity;
    title?: string;
    dismissible?: boolean;
    autoDismissDuration?: number;
    onDismiss?: () => void;
    icon?: boolean;
    children?: Snippet;
    actions?: Snippet;
  };

  let dismissed = $state(false);
  let autoDismissTimer: number | null = null;

  let {
    severity = "info",
    variant,
    title,
    size = "md",
    dismissible,
    autoDismissDuration,
    onDismiss,
    icon = true,
    children,
    actions,
  }: Props = $props();

  $effect(() => {
    if (autoDismissDuration && !dismissed) {
      autoDismissTimer = setTimeout(() => {
        handleDismiss();
      }, autoDismissDuration * 1000);
    }

    return () => {
      if (autoDismissTimer) {
        clearTimeout(autoDismissTimer);
      }
    }
  });

  function handleDismiss() {
    dismissed = true;
    
    if (autoDismissTimer) {
      clearTimeout(autoDismissTimer);
    }

    onDismiss?.();
  }
  
  const icons = {
    info: "M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M11,6.5V9.5H13V6.5H11M11,11V17H13V11H11Z",
    success: "M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M11,16.5L18,9.5L16.59,8.09L11,13.67L7.91,10.59L6.5,12L11,16.5Z",
    warning: "M12,2L1,21H23M12,6L19.53,19H4.47M11,10V14H13V10M11,16V18H13V16",
    error: "M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,7A1,1 0 0,0 11,8V13A1,1 0 0,0 12,14A1,1 0 0,0 13,13V8A1,1 0 0,0 12,7M12,17.5A1.5,1.5 0 0,0 10.5,16A1.5,1.5 0 0,0 12,14.5A1.5,1.5 0 0,0 13.5,16A1.5,1.5 0 0,0 12,17.5Z"
  };

  const iconPath = $derived(icons[severity]);
  const ariaRole = $derived(severity === "error" ? "alert" : "status");
  const ariaLive = $derived(severity === "error" ? "assertive" : "polite");
</script>

{#if !dismissed}
  <div
    class="uikit-alert"
    class:uikit-alert--info={severity === "info"}
    class:uikit-alert--success={severity === "success"}
    class:uikit-alert--warning={severity === "warning"}
    class:uikit-alert--error={severity === "error"}
    class:uikit-alert--outlined={variant === "outlined"}
    class:uikit-alert--size-sm={size === "sm" || size === "small"}
    class:uikit-alert--size-lg={size === "lg" || size === "large"}
    role={ariaRole}
    aria-live={ariaLive}
  >
    {#if icon}
      <div class="uikit-alert__icon">
        <Icon>
          <path d={iconPath} />
        </Icon>
      </div>
    {/if}
    <div class="uikit-alert__message">
      {#if title}
        <div class="uikit-alert__title">{title}</div>
      {/if}
      {#if children}
        <div class="uikit-alert__description">
          {@render children?.()}
        </div>
      {/if}
    </div>
    <div class="uikit-alert__actions">
      <div class="">
        {@render actions?.()}
      </div>
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
  </div>
{/if}