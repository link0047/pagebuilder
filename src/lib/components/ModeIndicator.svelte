<script lang="ts">
  type Mode = "edit" | "preview" | "component-select" | "settings";

  type Props =  {
    mode?: Mode;
  };

  let {
    mode = "preview"
  }: Props = $props();

  const modeConfig = {
    "edit": { label: "Editing", color: "#3b82f6" },
    "preview": { label: "Preview", color: "#10b981" },
    "component-select": { label: "Adding Component", color: "#8b5cf6" },
    "settings": { label: "Settings", color: "#6b7280" }
  };

  const config = $derived(modeConfig[mode]);
</script>

<span
  class="wcag-ui-mode-indicator"
  role="status"
  aria-live="polite"
  aria-label="Current mode: {config.label}"
  style="--wcag-ui-mode-indicator-color:{config.color}"
>
  <span class="visually-hidden">{config.label}</span>
</span>

<style>
  .wcag-ui-mode-indicator {
    width: .5rem;
    height: .5rem;
    border-radius: 50%;
    background-color: var(--wcag-ui-mode-indicator-color);
    animation: pulse 2s infinite;
  }


  .visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
</style>
