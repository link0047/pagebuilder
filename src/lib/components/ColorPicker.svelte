<script lang="ts">
  import { createColorPickerState, ColorPickerState } from "./color-picker-state.svelte";

  export type ColorPickerProps = {
    value?: string;
    label?: string;
    onchange?: (value: string) => void;
    [key: string]: unknown;
  }

  type ValidationState =
    | "pristine"
    | "focused"
    | "editing"
    | "validating";

  let {
    value = $bindable(""),
    label = "Color",
    onchange,
    ...restProps
  }: ColorPickerProps = $props();

  let colorState = createColorPickerState(
    () => value,
    (newValue) => value = newValue
  );

  let isValid = $state(true);
  let validationState = $state<ValidationState>("pristine");

  function handleColorInput(event: Event & { currentTarget: HTMLInputElement }) {
    const newValue = event.currentTarget.value;
    colorState.value = newValue;
    isValid = true;
    onchange?.(newValue);
  }

  function handleTextInput(event: Event & { currentTarget: HTMLInputElement }) {
    const inputValue = event.currentTarget.value;

    if (validationState === "focused") {
      validationState = "editing";
    }

    switch (validationState) {
      case "editing":
        colorState.value = inputValue;

        if (inputValue === "") {
          isValid = true;
          onchange?.("");
        } else if (colorState.isValidColor(inputValue)) {
          onchange?.(colorState.value);
        }
        break;

      case "validating":
        if (inputValue === "") {
          isValid = true;
          colorState.value = "";
          onchange?.("");
        } else {
          isValid = colorState.isValidColor(inputValue);
          colorState.value = inputValue;

          if (isValid) {
            onchange?.(colorState.value);
          }
        }
        break;
    }
  }

  function handleTextFocus() {
    if (validationState === "pristine") {
      validationState = "focused";
    }
  }

  function handleTextBlur() {
    if (validationState === "editing") {
      validationState = "validating";

      const inputValue = colorState.value;

      if (inputValue === "") {
        isValid = true;
      } else {
        isValid = colorState.isValidColor(inputValue);
      }
    }
  }
</script>

<fieldset
  class="wcag-ui-color-picker"
  class:wcag-ui-color-picker--invalid={!isValid && validationState === "validating"}
>
  <legend class="wcag-ui-color-picker__legend">{label}</legend>

  <div class="visually-hidden" role="status" aria-live="polite" aria-atomic="true">
    Selected color: {colorState.value}
  </div>

  <!--
    Swatch and text share one bordered box rather than sitting side by side as
    two grid items. The pair then costs roughly one control's width, which is
    what lets this fit in a narrow panel column.
  -->
  <div class="wcag-ui-color-picker__field">
    <label for={colorState.colorId} class="visually-hidden">Color swatch</label>
    <input
      data-testid="color-picker-swatch"
      id={colorState.colorId}
      class="wcag-ui-color-picker__input-color"
      type="color"
      value={colorState.normalizedHex}
      oninput={handleColorInput}
    />

    <label for={colorState.textId} class="visually-hidden">Color value</label>
    <input
      data-testid="color-picker-text-input"
      id={colorState.textId}
      class="wcag-ui-color-picker__input-text"
      type="text"
      value={colorState.value}
      onfocus={handleTextFocus}
      oninput={handleTextInput}
      onblur={handleTextBlur}
      pattern=".*"
      aria-invalid={!isValid}
      aria-describedby={isValid ? undefined : colorState.errorId}
      spellcheck="false"
      autocomplete="off"
      placeholder="#000000"
      {...restProps}
    />
  </div>

  {#if !isValid && validationState === "validating"}
    <span id={colorState.errorId} class="wcag-ui-color-picker__message-error" role="alert">
      Please enter a valid CSS color (e.g., #000, #000000, rgb(0,0,0), transparent)
    </span>
  {/if}
</fieldset>

<style>
  @layer variables, base, states, accessibility;

  @layer variables {
    :root {
      --wcag-ui-color-picker-border-color: transparent;
      --wcag-ui-color-picker-border-width: 0;
      --wcag-ui-color-picker-border-radius: .5rem;
      --wcag-ui-color-picker-padding: 0;
      --wcag-ui-color-picker-gap: .5rem;
      --wcag-ui-color-picker-font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";

      --wcag-ui-color-picker-legend-font-size: .875rem;
      --wcag-ui-color-picker-legend-line-height: 1;
      --wcag-ui-color-picker-legend-color: inherit;

      --wcag-ui-color-picker-input-border-color: #989898;
      --wcag-ui-color-picker-input-border-width: 1px;
      --wcag-ui-color-picker-input-border-radius: .25rem;
      --wcag-ui-color-picker-input-outline-width: 2px;
      --wcag-ui-color-picker-input-outline-offset: -2px;
      --wcag-ui-color-picker-input-transition-duration: 0.2s;
      --wcag-ui-color-picker-input-transition-timing: cubic-bezier(0.4, 0, 0.2, 1);

      /* Inset in the field, so smaller than the old standalone 2.5rem. */
      --wcag-ui-color-picker-input-color-size: 1.5rem;
      --wcag-ui-color-picker-input-color-background: transparent;
      /*
        The swatch needs its own outline: the field behind it is white, so a
        white or near-white value is otherwise invisible. Sized in px, not the
        field's border width — it has to read against the colour it contains,
        not match the box around it.
      */
      --wcag-ui-color-picker-input-color-border-width: 2px;
      --wcag-ui-color-picker-input-color-border-color: #989898;

      --wcag-ui-color-picker-field-gap: .375rem;
      --wcag-ui-color-picker-field-padding: .25rem;
      --wcag-ui-color-picker-field-height: 2.25rem;

      --wcag-ui-color-picker-input-text-font-size: 1rem;
      --wcag-ui-color-picker-input-text-font-weight: 400;
      --wcag-ui-color-picker-input-text-line-height: 1;
      --wcag-ui-color-picker-input-text-padding-inline: .25rem;
      --wcag-ui-color-picker-input-text-color: #212121;

      --wcag-ui-color-picker-focus-outline-color: #2451b2;
      --wcag-ui-color-picker-hover-outline-color: #000;

      --wcag-ui-color-picker-error-color: #d32f2f;
    }
  }

  @layer base {
    .wcag-ui-color-picker {
      box-sizing: border-box;
      border: var(--wcag-ui-color-picker-border-width) solid var(--wcag-ui-color-picker-border-color);
      border-radius: var(--wcag-ui-color-picker-border-radius);
      padding: var(--wcag-ui-color-picker-padding);
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: var(--wcag-ui-color-picker-gap);
      font-family: var(--wcag-ui-color-picker-font-family);
      /*
        A <fieldset> defaults to `min-inline-size: min-content`, which is why
        this control refused to shrink and overflowed its container regardless
        of what the parent did. It's a UA style on fieldset specifically, not
        the usual flex/grid min-size rule.
      */
      min-inline-size: 0;
    }

    .wcag-ui-color-picker__legend {
      line-height: var(--wcag-ui-color-picker-legend-line-height);
      float: left;
      padding: 0;
      font-size: var(--wcag-ui-color-picker-legend-font-size);
      color: var(--wcag-ui-color-picker-legend-color);
    }

    /*
      The bordered box. The border/outline lives here rather than on the two
      inputs, so the swatch reads as sitting inside the field.
    */
    .wcag-ui-color-picker__field {
      box-sizing: border-box;
      display: flex;
      align-items: center;
      gap: var(--wcag-ui-color-picker-field-gap);
      /* Without this the text input's intrinsic width sets a floor. */
      min-width: 0;
      height: var(--wcag-ui-color-picker-field-height);
      padding-inline-start: var(--wcag-ui-color-picker-field-padding);
      background: #fff;
      border: var(--wcag-ui-color-picker-input-border-width) solid var(--wcag-ui-color-picker-input-border-color);
      border-radius: var(--wcag-ui-color-picker-input-border-radius);
      outline: var(--wcag-ui-color-picker-input-outline-width) solid transparent;
      outline-offset: var(--wcag-ui-color-picker-input-outline-offset);
      transition: outline-color var(--wcag-ui-color-picker-input-transition-duration) var(--wcag-ui-color-picker-input-transition-timing);
    }

    .wcag-ui-color-picker__input-color {
      box-sizing: border-box;
      appearance: none;
      flex-shrink: 0;
      padding: 0;
      width: var(--wcag-ui-color-picker-input-color-size);
      height: var(--wcag-ui-color-picker-input-color-size);
      aspect-ratio: 1 / 1;
      cursor: pointer;
      border: var(--wcag-ui-color-picker-input-color-border-width) solid var(--wcag-ui-color-picker-input-color-border-color);
      /* Slightly tighter than the field so it nests cleanly in the corner. */
      border-radius: calc(var(--wcag-ui-color-picker-input-border-radius) - 1px);
      background-color: var(--wcag-ui-color-picker-input-color-background);
      outline-offset: 1px;
    }

    /*
      The fill itself. Sized to 100% of the input's content box rather than the
      token, since the input's own border now takes up part of that box —
      hard-coding the token here would push the fill past the border.
    */
    .wcag-ui-color-picker__input-color::-webkit-color-swatch {
      width: 100%;
      height: 100%;
      border: none;
      border-radius: calc(var(--wcag-ui-color-picker-input-border-radius) - 2px);
    }

    .wcag-ui-color-picker__input-color::-webkit-color-swatch-wrapper {
      padding: 0;
      border: none;
      background: none;
    }

    /* Firefox */
    .wcag-ui-color-picker__input-color::-moz-color-swatch {
      width: 100%;
      height: 100%;
      border: none;
      border-radius: calc(var(--wcag-ui-color-picker-input-border-radius) - 2px);
    }

    .wcag-ui-color-picker__input-color::-moz-focus-inner {
      padding: 0;
      border: none;
      background: none;
    }

    .wcag-ui-color-picker__input-text {
      box-sizing: border-box;
      appearance: none;
      flex: 1;
      /*
        Text inputs carry an implicit `size="20"` — roughly 180px of intrinsic
        width they will not shrink below. In a flex row that becomes the floor
        for the whole control, and the overflow lands on whatever contains it.
      */
      min-width: 0;
      width: 100%;
      height: 100%;
      border: none;
      outline: none;
      background: none;
      line-height: var(--wcag-ui-color-picker-input-text-line-height);
      font-size: var(--wcag-ui-color-picker-input-text-font-size);
      font-weight: var(--wcag-ui-color-picker-input-text-font-weight);
      padding-inline: var(--wcag-ui-color-picker-input-text-padding-inline);
      color: var(--wcag-ui-color-picker-input-text-color);
      /* Long values (rgb(...), color names) truncate rather than push. */
      text-overflow: ellipsis;
    }

    .wcag-ui-color-picker__message-error {
      font-size: 0.875rem;
      color: var(--wcag-ui-color-picker-error-color);
      line-height: 1.3;
    }
  }

  @layer states {
    .wcag-ui-color-picker--invalid .wcag-ui-color-picker__field {
      --wcag-ui-color-picker-input-border-color: var(--wcag-ui-color-picker-error-color);
    }

    /*
      Focus and hover move to the wrapper: the inputs no longer have borders of
      their own, so a ring on them would sit inside the field and read as a
      second box.
    */
    .wcag-ui-color-picker__field:has(:focus-visible) {
      outline-color: var(--wcag-ui-color-picker-focus-outline-color);
    }

    .wcag-ui-color-picker__field:hover {
      outline-color: var(--wcag-ui-color-picker-hover-outline-color);
    }

    /*
      The swatch is separately focusable, and a ring on the wrapper alone can't
      show which of the two has focus. This gives the swatch its own.
    */
    .wcag-ui-color-picker__input-color:focus-visible {
      outline: 2px solid var(--wcag-ui-color-picker-focus-outline-color);
    }
  }

  @layer accessibility {
    @media (prefers-reduced-motion: reduce) {
      .wcag-ui-color-picker__field {
        transition: none;
      }
    }

    @media (prefers-contrast: high) {
      .wcag-ui-color-picker__field {
        border-width: 2px;
      }

      .wcag-ui-color-picker {
        --wcag-ui-color-picker-input-color-border-color: #000;
        --wcag-ui-color-picker-input-color-border-width: 3px;
      }
    }
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
    border-width: 0;
  }
</style>
