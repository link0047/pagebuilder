<script lang="ts">
  import type { Snippet } from "svelte";
  import { generateId }	from "$lib/utils/unique-id-generator.js";

  type InputType = "text" | "password" | "email" | "tel" | "url" | "search" | "number";
  type Variant = "flat" | "outlined" | "underlined" | "filled";
  type LabelPosition = "above" | "left" | "inside" | "notched";
  type Size = "sm" | "md" | "lg" | "xl";
  type Shape = "default" | "square" | "pill" | "rounded";
	type SideOption = "both" | "leading" | "trailing";

  export type Props = {
    label: string;
    hideLabel?: boolean;
    type?: InputType,
    variant?: Variant,
    labelPosition?: LabelPosition,
    size?: Size,
    shape?: Shape;
    required?: boolean | null,
    value?: string | number | undefined;
    error?: boolean,
    description?: string | Snippet,
    errorMessage?: string,
    ref?: HTMLInputElement,
    leading?: Snippet,
    trailing?: Snippet,
		passThroughSides?: SideOption;
    [key: string]: unknown;
  };

  const uid = generateId("textfield");
	const inputId = `wcag-ui-textfield-${uid}`;
	const labelId = `${inputId}-label`;
	const messageId = `${inputId}-message`;

	let {
		label,
		hideLabel = false,
		type = "text",
		variant = "outlined",
    description,
    errorMessage,
    labelPosition = "above",
		size = "md",
		shape = "default",
		required = null,
    value = $bindable(),
		error = $bindable(false),
		ref = $bindable(),
		leading,
    trailing,
		passThroughSides,
		...restProps
	}: Props = $props();

  let isLabelFloating = $state(false);
  const effectiveLabelPosition = $derived(hideLabel ? "above" : labelPosition);
  const hasLeading = $derived(!!leading);
  const hasTrailing = $derived(!!trailing);
	const passLeading = $derived(passThroughSides === "both" || passThroughSides === "leading");
  const passTrailing = $derived(passThroughSides === "both" || passThroughSides === "trailing");

	function handleBlur({ target }: FocusEvent): void {
    if (effectiveLabelPosition === "notched" && !(target as HTMLInputElement).value.length) {
      isLabelFloating = false;
    }
  }

  function handleFocus({ target }: FocusEvent): void {
    if (effectiveLabelPosition === "notched" && !(target as HTMLInputElement).value.length) {
      isLabelFloating = true;
    }
  }

  function handleKeyup(): void {
    if (effectiveLabelPosition === "notched" && !isLabelFloating) {
      isLabelFloating = true;
    }
  }

  function handleInput({ target }: Event): void {
    if ((target as HTMLInputElement).value.length) {
      isLabelFloating = true;
    }
  }

	function handleAnimation({ target, animationName }: AnimationEvent): void {
		if (animationName.toLowerCase().includes("start")) {
			isLabelFloating = true;
		}

		if (animationName.toLowerCase().includes("cancel") && !(target as HTMLInputElement).value.length) {
			isLabelFloating = false;
		}
	}
</script>

<div
  class="wcag-ui-textfield"
  class:wcag-ui-textfield--outlined={variant === "outlined"}
  class:wcag-ui-textfield--underlined={variant === "underlined"}
  class:wcag-ui-textfield--flat={variant === "flat"}
  class:wcag-ui-textfield--filled={variant === "filled"}
  class:wcag-ui-textfield--size-sm={size === "sm"}
  class:wcag-ui-textfield--size-lg={size === "lg"}
  class:wcag-ui-textfield--size-xl={size === "xl"}
  class:wcag-ui-textfield--shape-square={shape === "square"}
  class:wcag-ui-textfield--shape-pill={shape === "pill"}
  class:wcag-ui-textfield--shape-rounded={shape === "rounded"}
  data-label-position={effectiveLabelPosition}
>
  {#if effectiveLabelPosition !== "notched"}
    <label
      id={labelId}
      class="wcag-ui-textfield__label"
      for={inputId}
      class:wcag-ui-visually-hidden={hideLabel}
    >
      {label}
    </label>
  {/if}
  <div class="wcag-ui-textfield__field">
    {#if leading}
      <span
	      class="wcag-ui-textfield__leading"
	      class:wcag-ui-textfield__side--pass-through={passLeading}
	    >
        {@render leading()}
      </span>
    {/if}
    <input
  		class="wcag-ui-textfield__input"
			class:wcag-ui-textfield__input--has-leading={hasLeading}
		  class:wcag-ui-textfield__input--has-trailing={hasTrailing}
  		id={inputId}
  		{type}
      {value}
  		aria-describedby={messageId}
  		aria-required={ required ? "true" : "false"}
  		aria-invalid={error}
  		oninput={handleInput}
  		onkeyup={handleKeyup}
  		onblur={handleBlur}
  		onfocus={handleFocus}
  		onanimationstart={handleAnimation}
  		{...restProps}
  	/>
    {#if effectiveLabelPosition === "notched"}
      <div class="wcag-ui-textfield__notched-outline">
        <div class="wcag-ui-textfield__notched-outline-leading"></div>
        <div class="wcag-ui-textfield__notched-outline-notch">
          <label
            class="wcag-ui-textfield__label"
            class:wcag-ui-textfield__label--float={isLabelFloating}
            for={inputId}
            id={labelId}
          >
            {label}
          </label>
        </div>
        <div class="wcag-ui-textfield__notched-outline-trailing"></div>
      </div>
  	{/if}
    {#if trailing}
      <span
	      class="wcag-ui-textfield__trailing"
	      class:wcag-ui-textfield__side--pass-through={passTrailing}
	    >
        {@render trailing()}
      </span>
    {/if}
  </div>
  {#if description || error}
  	<div id={messageId} class="wcag-ui-textfield__support-text">
      {#if description}
        <div class="wcag-ui-textfield__description">
					{#if typeof description === "string"}
            {description}
          {:else}
            {@render description()}
          {/if}
				</div>
      {/if}
      {#if error && errorMessage}
        <div class="wcag-ui-textfield__error-message" aria-live="assertive" role="alert">
          {errorMessage}
        </div>
      {/if}
    </div>
  {/if}
</div>

<style>
  @layer variables, base, variants, sizes, shapes, states, accessibility;

  @layer variables {
    :root {
      --wcag-ui-textfield-gap: .25rem;
      --wcag-ui-textfield-font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
      --wcag-ui-textfield-color: #212121;

      --wcag-ui-textfield-label-color: #212121;
      --wcag-ui-textfield-label-font-size: .875rem;
      --wcag-ui-textfield-label-transition-duration: 0.15s;
      --wcag-ui-textfield-label-transition-timing: cubic-bezier(0.4, 0, 0.2, 1);

      --wcag-ui-textfield-input-padding-inline: .5rem;
      --wcag-ui-textfield-input-padding-block: 0;
      --wcag-ui-textfield-input-color: #212121;
      --wcag-ui-textfield-input-font-size: 1rem;
      --wcag-ui-textfield-input-font-weight: 400;
      --wcag-ui-textfield-input-letter-spacing: .04em;
      --wcag-ui-textfield-input-height: 2.5rem;
      --wcag-ui-textfield-input-border-width: 1px;
      --wcag-ui-textfield-input-border-style: solid;
      --wcag-ui-textfield-input-border-color: #989898;
      --wcag-ui-textfield-input-border-radius: .25rem;
      --wcag-ui-textfield-input-background: #fff;
      --wcag-ui-textfield-input-outline-color: #000;
      --wcag-ui-textfield-input-outline-focus-color: #2451b2;
      --wcag-ui-textfield-input-outline-style: solid;
      --wcag-ui-textfield-input-outline-width: 2px;
      --wcag-ui-textfield-input-outline-offset: -2px;

      --wcag-ui-textfield-icon-size: 1.25rem;
      --wcag-ui-textfield-icon-gap: .5rem;

      --wcag-ui-textfield-message-font-size: .75rem;
      --wcag-ui-textfield-description-color: #5d5d5d;
      --wcag-ui-textfield-error-color: #b00020;
    }
  }

  @layer base {
    .wcag-ui-textfield {
      position: relative;
      display: grid;
      gap: var(--wcag-ui-textfield-gap);
      font-family: var(--wcag-ui-textfield-font-family);
      color: var(--wcag-ui-textfield-color);
    }

    .wcag-ui-textfield__label {
      color: var(--wcag-ui-textfield-label-color);
      width: fit-content;
      font-size: var(--wcag-ui-textfield-label-font-size);
      pointer-events: none;
      transition: transform var(--wcag-ui-textfield-label-transition-duration) var(--wcag-ui-textfield-label-transition-timing);
    }

    .wcag-ui-textfield__field {
      position: relative;
      display: flex;
      align-items: center;
      flex: 1;
    }

    .wcag-ui-textfield__input {
      box-sizing: border-box;
      outline: none;
      color: var(--wcag-ui-textfield-input-color);
      font-size: var(--wcag-ui-textfield-input-font-size);
      font-weight: var(--wcag-ui-textfield-input-font-weight);
      line-height: 1;
      letter-spacing: var(--wcag-ui-textfield-input-letter-spacing);
      width: 100%;
      height: var(--wcag-ui-textfield-input-height);
      padding-inline: var(--wcag-ui-textfield-input-padding-inline);
      border: var(--wcag-ui-textfield-input-border-width) var(--wcag-ui-textfield-input-border-style);
      border-color: var(--wcag-ui-textfield-input-border-color);
      border-radius: var(--wcag-ui-textfield-input-border-radius);
      background-color: var(--wcag-ui-textfield-input-background);
      -webkit-appearance: none;
      appearance: none;
    }

    /* ── Leading/trailing actions ───────────────────────────────────────── */
    .wcag-ui-textfield__leading,
    .wcag-ui-textfield__trailing {
      position: absolute;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--wcag-ui-textfield-label-color);
      flex-shrink: 0;
    }

    .wcag-ui-textfield__leading {
      left: var(--wcag-ui-textfield-input-padding-inline);
    }

    .wcag-ui-textfield__trailing {
      right: var(--wcag-ui-textfield-input-padding-inline);
    }

    .wcag-ui-textfield__input--has-leading {
      padding-left: calc(var(--wcag-ui-textfield-icon-size) + (var(--wcag-ui-textfield-input-padding-inline) * 2));
    }

    .wcag-ui-textfield__input--has-trailing {
      padding-right: calc(var(--wcag-ui-textfield-icon-size) + (var(--wcag-ui-textfield-input-padding-inline) * 2));
    }

		.wcag-ui-textfield__side--pass-through {
	    pointer-events: none;
	    user-select: none;
	  }

    /* ── Support text ────────────────────────────────── */
    .wcag-ui-textfield__support-text {
      font-size: var(--wcag-ui-textfield-message-font-size);
      line-height: 1.6;
    }

    .wcag-ui-textfield__description {
      color: var(--wcag-ui-textfield-description-color);
    }

    .wcag-ui-textfield__error-message {
      color: var(--wcag-ui-textfield-error-color);
    }

    /* ── Notched outline ─────────────────────────────── */
    .wcag-ui-textfield__notched-outline {
      pointer-events: none;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: var(--wcag-ui-textfield-input-height);
      display: grid;
      grid-template-columns: var(--wcag-ui-textfield-input-padding-inline) minmax(auto, max-content) 1fr;
    }

    .wcag-ui-textfield__notched-outline-leading {
      border: var(--wcag-ui-textfield-input-border-width) var(--wcag-ui-textfield-input-border-style);
      border-right: none;
      border-color: var(--wcag-ui-textfield-input-border-color);
      border-bottom-left-radius: var(--wcag-ui-textfield-input-border-radius);
      border-top-left-radius: var(--wcag-ui-textfield-input-border-radius);
    }

    .wcag-ui-textfield__notched-outline-notch {
      border-top: var(--wcag-ui-textfield-input-border-width) var(--wcag-ui-textfield-input-border-style);
      border-bottom: var(--wcag-ui-textfield-input-border-width) var(--wcag-ui-textfield-input-border-style);
      border-color: var(--wcag-ui-textfield-input-border-color);
      display: flex;
      align-items: center;
    }

    .wcag-ui-textfield__notched-outline-trailing {
      border: var(--wcag-ui-textfield-input-border-width) var(--wcag-ui-textfield-input-border-style);
      border-left: none;
      border-color: var(--wcag-ui-textfield-input-border-color);
      border-bottom-right-radius: var(--wcag-ui-textfield-input-border-radius);
      border-top-right-radius: var(--wcag-ui-textfield-input-border-radius);
    }
  }

  @layer variants {
    .wcag-ui-textfield--underlined .wcag-ui-textfield__input {
      --wcag-ui-textfield-input-border-width: 2px;
      --wcag-ui-textfield-input-border-radius: 0;
      --wcag-ui-textfield-input-padding-inline: .25rem;
      border-top-width: 0;
      border-left-width: 0;
      border-right-width: 0;
    }

    .wcag-ui-textfield--flat .wcag-ui-textfield__input {
      --wcag-ui-textfield-input-background: #f5f5f5;
      --wcag-ui-textfield-input-border-color: #f5f5f5
    }

    .wcag-ui-textfield--filled .wcag-ui-textfield__input {
      --wcag-ui-textfield-input-background: #f5f5f5;
      --wcag-ui-textfield-input-border-color: #dcdcdc;
    }

    .wcag-ui-textfield__label--float {
      transform: translateY(-80%) scale(.9);
      padding-inline: .25rem;
    }

    .wcag-ui-textfield[data-label-position="notched"] .wcag-ui-textfield__input {
      border: none!important;
      outline: none!important;
      transition: none!important;
    }
  }

  @layer sizes {
    .wcag-ui-textfield--size-sm {
      --wcag-ui-textfield-input-height: 2rem;
      --wcag-ui-textfield-input-font-size: .875rem;
      --wcag-ui-textfield-input-padding-inline: .375rem;
      --wcag-ui-textfield-label-font-size: .8125rem;
      --wcag-ui-textfield-inside-label-font-size: .6875rem;
    }

    .wcag-ui-textfield--size-lg {
      --wcag-ui-textfield-input-height: 3rem;
      --wcag-ui-textfield-input-font-size: 1rem;
      --wcag-ui-textfield-input-padding-inline: .75rem;
    }

    .wcag-ui-textfield--size-xl {
      --wcag-ui-textfield-input-height: 3.5rem;
      --wcag-ui-textfield-input-font-size: 1.125rem;
      --wcag-ui-textfield-input-padding-inline: 1rem;
    }
  }

  @layer shapes {
    .wcag-ui-textfield--shape-square {
      --wcag-ui-textfield-input-border-radius: 0;
    }

    .wcag-ui-textfield--shape-rounded {
      --wcag-ui-textfield-input-border-radius: .5rem;
    }

    .wcag-ui-textfield--shape-pill {
      --wcag-ui-textfield-input-border-radius: 9999px;
      --wcag-ui-textfield-input-padding-inline: 1rem;
    }
  }

  @layer states {
    .wcag-ui-textfield:not(.wcag-ui-textfield--underlined) .wcag-ui-textfield__input:hover {
      outline: var(--wcag-ui-textfield-input-outline-width) var(--wcag-ui-textfield-input-outline-style) var(--wcag-ui-textfield-input-outline-color);
      outline-offset: var(--wcag-ui-textfield-input-outline-offset);
    }

    .wcag-ui-textfield:not(.wcag-ui-textfield--underlined) .wcag-ui-textfield__input:focus-within {
      outline: var(--wcag-ui-textfield-input-outline-width) var(--wcag-ui-textfield-input-outline-style) var(--wcag-ui-textfield-input-outline-focus-color);
      outline-offset: var(--wcag-ui-textfield-input-outline-offset);
    }

    .wcag-ui-textfield--underlined .wcag-ui-textfield__input:hover {
      border-bottom-color: var(--wcag-ui-textfield-input-outline-color);
    }

    .wcag-ui-textfield--underlined .wcag-ui-textfield__input:focus-within {
      border-bottom-color: var(--wcag-ui-textfield-input-outline-focus-color);
    }

    .wcag-ui-textfield__input:hover + .wcag-ui-textfield__notched-outline :is(.wcag-ui-textfield__notched-outline-notch, .wcag-ui-textfield__notched-outline-leading, .wcag-ui-textfield__notched-outline-trailing) {
      --wcag-ui-textfield-input-border-color: #000;
      --wcag-ui-textfield-input-border-width: 2px;
    }

    .wcag-ui-textfield__input:focus-within + .wcag-ui-textfield__notched-outline :is(.wcag-ui-textfield__notched-outline-notch, .wcag-ui-textfield__notched-outline-leading, .wcag-ui-textfield__notched-outline-trailing) {
      --wcag-ui-textfield-input-border-color: #3367d6 #285bc7 #2451b2;
      --wcag-ui-textfield-input-border-width: 2px;
    }

    .wcag-ui-textfield__notched-outline-notch:has(> .wcag-ui-textfield__label--float) {
      border-top: none!important;
    }

    .wcag-ui-textfield__support-text:empty {
      display: none;
    }

    @keyframes onAutoFillStart {
      from {}
      to {}
    }

    @keyframes onAutoFillCancel {
      from {}
      to {}
    }
  }

  @layer accessibility {
    .wcag-ui-visually-hidden {
      position: absolute !important;
      width: 1px !important;
      height: 1px !important;
      padding: 0 !important;
      margin: -1px !important;
      overflow: hidden !important;
      clip: rect(0, 0, 0, 0) !important;
      white-space: nowrap !important;
      border: 0 !important;
    }

    @media (prefers-reduced-motion: reduce) {
      .wcag-ui-textfield__input {
        transition: none;
      }
    }

    @media (forced-colors: active) {
      .wcag-ui-textfield__input {
        border: 2px solid ButtonBorder;
        background-color: Field;
        color: FieldText;
      }

      .wcag-ui-textfield__input:focus {
        outline: 3px solid Highlight;
      }

      .wcag-ui-textfield__notched-outline-leading,
      .wcag-ui-textfield__notched-outline-notch,
      .wcag-ui-textfield__notched-outline-trailing {
        border-color: ButtonBorder;
      }

      .wcag-ui-textfield__label {
        color: FieldText;
      }

      .wcag-ui-textfield__icon {
        forced-color-adjust: auto;
      }
    }
  }
</style>
