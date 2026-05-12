<script lang="ts">
  import type { Snippet } from "svelte";

  type DeviceProps = {
    columns?: number;
    spacing?: string;
    padding?: string;
    bgColor?: string;
  };

  type CTAGroupConfig = {
    mobile?: DeviceProps;
    tablet?: DeviceProps;
    desktop?: DeviceProps;
  };

  type Props = {
    children?: Snippet;
    config?: CTAGroupConfig;
    [key: string]: unknown;
  };

  let { children, config = {}, ...restProps }: Props = $props();

  const DEFAULT_DEVICE: Required<DeviceProps> = {
    columns: 2,
    spacing: "0.5rem",
    padding: "0",
    bgColor: "transparent",
  };

  const resolved = $derived.by(() => {
    const mobile = { ...DEFAULT_DEVICE, ...config.mobile };
    const tablet = { ...mobile, ...config.tablet };
    const desktop = { ...tablet, ...config.desktop };
    return { mobile, tablet, desktop };
  });
</script>

<div
  class="spn-ui-cta-group"
  style:--spn-ui-cta-group-columns={resolved.mobile.columns}
  style:--spn-ui-cta-group-spacing={resolved.mobile.spacing}
  style:--spn-ui-cta-group-padding={resolved.mobile.padding}
  style:--spn-ui-cta-group-bg-color={resolved.mobile.bgColor}
  style:--spn-ui-cta-group-tablet-columns={resolved.tablet.columns}
  style:--spn-ui-cta-group-tablet-spacing={resolved.tablet.spacing}
  style:--spn-ui-cta-group-tablet-padding={resolved.tablet.padding}
  style:--spn-ui-cta-group-tablet-bg-color={resolved.tablet.bgColor}
  style:--spn-ui-cta-group-desktop-columns={resolved.desktop.columns}
  style:--spn-ui-cta-group-desktop-spacing={resolved.desktop.spacing}
  style:--spn-ui-cta-group-desktop-padding={resolved.desktop.padding}
  style:--spn-ui-cta-group-desktop-bg-color={resolved.desktop.bgColor}
  {...restProps}
>
  {@render children?.()}
</div>

<style>
  .spn-ui-cta-group {
    --spn-ui-cta-group-columns: 2;
    --spn-ui-cta-group-spacing: 0.5rem;
    --spn-ui-cta-group-padding: 0;
    --spn-ui-cta-group-bg-color: transparent;
    --spn-ui-cta-group-tablet-columns: var(--spn-ui-cta-group-columns);
    --spn-ui-cta-group-tablet-spacing: var(--spn-ui-cta-group-spacing);
    --spn-ui-cta-group-tablet-padding: var(--spn-ui-cta-group-padding);
    --spn-ui-cta-group-tablet-bg-color: var(--spn-ui-cta-group-bg-color);
    --spn-ui-cta-group-desktop-columns: var(--spn-ui-cta-group-tablet-columns);
    --spn-ui-cta-group-desktop-spacing: var(--spn-ui-cta-group-tablet-spacing);
    --spn-ui-cta-group-desktop-padding: var(--spn-ui-cta-group-tablet-padding);
    --spn-ui-cta-group-desktop-bg-color: var(--spn-ui-cta-group-tablet-bg-color);

    display: grid;
    width: fit-content;
    grid-template-columns: repeat(var(--spn-ui-cta-group-columns), minmax(0, 1fr));
    gap: var(--spn-ui-cta-group-spacing);
    padding: var(--spn-ui-cta-group-padding);
    background-color: var(--spn-ui-cta-group-bg-color);
  }

  /* Tablet — 668px+ */
  @media (min-width: 668px) {
    .spn-ui-cta-group {
      grid-template-columns: repeat(var(--spn-ui-cta-group-tablet-columns), minmax(0, 1fr));
      gap: var(--spn-ui-cta-group-tablet-spacing);
      padding: var(--spn-ui-cta-group-tablet-padding);
      background-color: var(--spn-ui-cta-group-tablet-bg-color);
    }
  }

  /* Desktop — 1025px+ */
  @media (min-width: 1025px) {
    .spn-ui-cta-group {
      grid-template-columns: repeat(var(--spn-ui-cta-group-desktop-columns), minmax(0, 1fr));
      gap: var(--spn-ui-cta-group-desktop-spacing);
      padding: var(--spn-ui-cta-group-desktop-padding);
      background-color: var(--spn-ui-cta-group-desktop-bg-color);
    }
  }
</style>
