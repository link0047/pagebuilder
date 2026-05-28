<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLInputAttributes } from "svelte/elements";
  import { generateId } from "$lib/utils/unique-id-generator";

  type Size = "xs" | "sm" | "md" | "lg" | "xl";
  type Color = "default" | "primary" | "secondary" | "success" | "warning" | "danger" | "info";
  type Shape = "square" | "rounded" | "curved";

  type Props = Omit<HTMLInputAttributes, "size"> & {
    children?: Snippet;
    size?: Size;
    shape?: Shape;
    color?: Color;
    indeterminate?: boolean;
    checked?: boolean;
    error?: boolean;
    labelId?: string;
  };

  const uid = generateId("checkbox");
  const id = `wcag-ui-checkbox-${uid}`;

  let {
    children,
    size = "sm",
    shape = "rounded",
    color = "default",
    indeterminate = $bindable(false),
    checked = $bindable(false),
    error = false,
    labelId = $bindable(`${id}-label`),
    ...restProps
  }: Props = $props();

  let ref: HTMLInputElement;

  $effect(() => {
    if (ref) {
      ref.indeterminate = indeterminate;
    }
  });

  function handleChange(event: Event) {
    indeterminate = false;
    restProps.onchange?.(event as Event & { currentTarget: HTMLInputElement });
  }
</script>

<div
  class="wcag-ui-checkbox"
  class:wcag-ui-checkbox--primary={color === "primary"}
  class:wcag-ui-checkbox--secondary={color === "secondary"}
  class:wcag-ui-checkbox--success={color === "success"}
  class:wcag-ui-checkbox--warning={color === "warning"}
  class:wcag-ui-checkbox--danger={color === "danger"}
  class:wcag-ui-checkbox--info={color === "info"}
  class:wcag-ui-checkbox--size-xs={size === "xs"}
  class:wcag-ui-checkbox--size-md={size === "md"}
  class:wcag-ui-checkbox--size-lg={size === "lg"}
  class:wcag-ui-checkbox--size-xl={size === "xl"}
  class:wcag-ui-checkbox--shape-square={shape === "square"}
  class:wcag-ui-checkbox--shape-rounded={shape === "rounded"}
  class:wcag-ui-checkbox--shape-curved={shape === "curved"}
>
  <input
    bind:this={ref}
    bind:checked
    {id}
    class="wcag-ui-checkbox__native-control"
    type="checkbox"
    aria-invalid={error}
    {...restProps}
    onchange={handleChange}
  />
  <label id={labelId} class="wcag-ui-checkbox__label" for={id}>
    <svg class="wcag-ui-checkbox__icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
      <!-- Checkmark -->
      <path class="wcag-ui-checkbox__icon-check" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z" />
      <!-- Indeterminate dash -->
      <path class="wcag-ui-checkbox__icon-indeterminate" d="M19,13H5V11H19V13Z" />
    </svg>
    {@render children?.()}
  </label>
</div>

<style>
@layer variables, base, colors, sizes, shapes, states, accessibility;

@layer variables {
  :root {
    --wcag-ui-checkbox-border-color: #94919a;
    --wcag-ui-checkbox-hover-border-color: #323234;
    --wcag-ui-checkbox-checked-color: #1967d2;
    --wcag-ui-checkbox-outline-color: #1967d2;
    --wcag-ui-checkbox-icon-fill: #fff;
    --wcag-ui-checkbox-error-color: #d93025;
    --wcag-ui-checkbox-error-label-color: #b3261e;

    --wcag-ui-checkbox-size: 1.25rem;
    --wcag-ui-checkbox-border-width: 2.25px;
    --wcag-ui-checkbox-border-radius: .25rem;
    --wcag-ui-checkbox-font-size: 0.875rem;
    --wcag-ui-checkbox-font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
    --wcag-ui-checkbox-gap: 0.5rem;

    --wcag-ui-checkbox-outline-width: 2px;
    --wcag-ui-checkbox-outline-offset: 2px;

    --wcag-ui-checkbox-transition-duration: 0.25s;
    --wcag-ui-checkbox-transition-timing: cubic-bezier(0.4, 0, 0.2, 1);
  }
}

@layer base {
  .wcag-ui-checkbox {
    position: relative;
    display: inline-flex;
  }

  .wcag-ui-checkbox__native-control {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    opacity: 0;
    clip-path: inset(50%);
    white-space: nowrap;
    cursor: inherit;
  }

  .wcag-ui-checkbox__label {
    display: inline-flex;
    align-items: center;
    font-size: var(--wcag-ui-checkbox-font-size);
    line-height: 1;
    gap: var(--wcag-ui-checkbox-gap);
    cursor: pointer;
    user-select: none;
    font-family: var(--wcag-ui-checkbox-font-family);
  }

  .wcag-ui-checkbox__icon {
    flex-shrink: 0;
    box-sizing: border-box;
    width: var(--wcag-ui-checkbox-size);
    height: var(--wcag-ui-checkbox-size);
    border: var(--wcag-ui-checkbox-border-width) solid var(--wcag-ui-checkbox-border-color);
    border-radius: var(--wcag-ui-checkbox-border-radius);
    fill: var(--wcag-ui-checkbox-icon-fill);
    transition: border-color var(--wcag-ui-checkbox-transition-duration) var(--wcag-ui-checkbox-transition-timing);
  }

  .wcag-ui-checkbox__icon-check,
  .wcag-ui-checkbox__icon-indeterminate {
    opacity: 0;
    transition: opacity var(--wcag-ui-checkbox-transition-duration) var(--wcag-ui-checkbox-transition-timing);
  }
}

@layer colors {
  .wcag-ui-checkbox--primary {
    --wcag-ui-checkbox-border-color: #5079bd;
    --wcag-ui-checkbox-hover-border-color: #2a508f;
    --wcag-ui-checkbox-checked-color: #2a508f;
    --wcag-ui-checkbox-outline-color: #5077b5;
  }

  .wcag-ui-checkbox--secondary {
    --wcag-ui-checkbox-border-color: #a8a8a8;
    --wcag-ui-checkbox-hover-border-color: #777779;
    --wcag-ui-checkbox-checked-color: #e5e6e7;
    --wcag-ui-checkbox-outline-color: #777779;
    --wcag-ui-checkbox-icon-fill: #38393b;
  }

  .wcag-ui-checkbox--success {
    --wcag-ui-checkbox-border-color: #008a00;
    --wcag-ui-checkbox-hover-border-color: #076d08;
    --wcag-ui-checkbox-checked-color: #008a00;
    --wcag-ui-checkbox-outline-color: #00a700;
  }

  .wcag-ui-checkbox--warning {
    --wcag-ui-checkbox-border-color: #ffb224;
    --wcag-ui-checkbox-hover-border-color: #d98c00;
    --wcag-ui-checkbox-checked-color: #ffb224;
    --wcag-ui-checkbox-outline-color: #d98c00;
    --wcag-ui-checkbox-icon-fill: #4c2100;
  }

  .wcag-ui-checkbox--danger {
    --wcag-ui-checkbox-border-color: #cb2a2f;
    --wcag-ui-checkbox-hover-border-color: #b22327;
    --wcag-ui-checkbox-checked-color: #cb2a2f;
    --wcag-ui-checkbox-outline-color: #f76469;
  }

  .wcag-ui-checkbox--info {
    --wcag-ui-checkbox-border-color: #0062d1;
    --wcag-ui-checkbox-hover-border-color: #185fa5;
    --wcag-ui-checkbox-checked-color: #0062d1;
    --wcag-ui-checkbox-outline-color: #4a98ff;
  }
}

@layer sizes {
  .wcag-ui-checkbox--size-xs {
    --wcag-ui-checkbox-size: 1rem;
  }

  .wcag-ui-checkbox--size-md {
    --wcag-ui-checkbox-size: 1.5rem;
  }

  .wcag-ui-checkbox--size-lg {
    --wcag-ui-checkbox-size: 1.75rem;
  }

  .wcag-ui-checkbox--size-xl {
    --wcag-ui-checkbox-size: 2rem;
  }
}

@layer shapes {
  .wcag-ui-checkbox--shape-square {
    --wcag-ui-checkbox-border-radius: 0;
  }

  .wcag-ui-checkbox--shape-curved {
    --wcag-ui-checkbox-border-radius: .5rem;
  }
}

@layer states {
  /* Hover */
  :has(.wcag-ui-checkbox__native-control:not(:disabled):not(:checked):hover) .wcag-ui-checkbox__icon {
    border-color: var(--wcag-ui-checkbox-hover-border-color);
  }

  /* Focus */
  :has(.wcag-ui-checkbox__native-control:focus-visible) .wcag-ui-checkbox__icon {
    outline: var(--wcag-ui-checkbox-outline-width) solid var(--wcag-ui-checkbox-outline-color);
    outline-offset: var(--wcag-ui-checkbox-outline-offset);
  }

  /* Indeterminate — declared before :checked so checked wins the cascade when both are transiently true */
  :has(.wcag-ui-checkbox__native-control:indeterminate) .wcag-ui-checkbox__icon {
    background-color: var(--wcag-ui-checkbox-checked-color);
    border-color: var(--wcag-ui-checkbox-checked-color);
  }

  :has(.wcag-ui-checkbox__native-control:indeterminate) .wcag-ui-checkbox__icon-indeterminate {
    opacity: 1;
  }

  :has(.wcag-ui-checkbox__native-control:indeterminate) .wcag-ui-checkbox__icon-check {
    opacity: 0;
  }

  /* Checked — declared after indeterminate so it wins the cascade */
  :has(.wcag-ui-checkbox__native-control:checked) .wcag-ui-checkbox__icon {
    background-color: var(--wcag-ui-checkbox-checked-color);
    border-color: var(--wcag-ui-checkbox-checked-color);
  }

  :has(.wcag-ui-checkbox__native-control:checked) .wcag-ui-checkbox__icon-check {
    opacity: 1;
  }

  :has(.wcag-ui-checkbox__native-control:checked) .wcag-ui-checkbox__icon-indeterminate {
    opacity: 0;
  }

  /* Error */
  :has(.wcag-ui-checkbox__native-control[aria-invalid="true"]) .wcag-ui-checkbox__icon {
    border-color: var(--wcag-ui-checkbox-error-color);
  }

  :has(.wcag-ui-checkbox__native-control[aria-invalid="true"]) .wcag-ui-checkbox__label {
    color: var(--wcag-ui-checkbox-error-label-color);
  }

  /* Disabled */
  :has(.wcag-ui-checkbox__native-control:disabled) .wcag-ui-checkbox__icon {
    opacity: 0.5;
    cursor: not-allowed;
  }

  :has(.wcag-ui-checkbox__native-control:disabled) .wcag-ui-checkbox__label {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

@layer accessibility {
  @media (prefers-reduced-motion: reduce) {
    .wcag-ui-checkbox__icon,
    .wcag-ui-checkbox__icon-check,
    .wcag-ui-checkbox__icon-indeterminate {
      transition: none;
    }
  }

  @media (forced-colors: active) {
    .wcag-ui-checkbox__icon {
      border-color: ButtonBorder;
    }

    :has(.wcag-ui-checkbox__native-control:checked) .wcag-ui-checkbox__icon,
    :has(.wcag-ui-checkbox__native-control:indeterminate) .wcag-ui-checkbox__icon {
      background-color: Highlight;
      border-color: Highlight;
    }

    :has(.wcag-ui-checkbox__native-control:focus-visible) .wcag-ui-checkbox__icon {
      outline-color: ButtonText;
    }
  }
}
</style>
