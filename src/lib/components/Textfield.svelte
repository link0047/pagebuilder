<script lang="ts">
  import { type Snippet } from "svelte";
  import { generateId }	from "$lib/utils/unique-id-generator.js";

  type InputType = "text" | "password" | "email" | "tel" | "url" | "search" | "number";
  type Variant = "flat" | "outlined" | "underlined" | "filled";
  type LabelPosition = "above" | "left" | "inside" | "notched";
  type Size = "xs" | "small" | "sm" | "medium" | "md" | "large" | "lg" | "xl";

  type Props = {
    label: string;
    type?: InputType,
    variant?: Variant,
    labelPosition?: LabelPosition,
    size?: Size,
    required?: boolean | null,
    value?: string,
    error?: boolean,
    description?: string,
    errorMessage?: string,
    ref?: HTMLInputElement,
    [key: string]: unknown;
  };

  const uid = generateId("textfield");
	const inputId = `uikit-textfield-${uid}`;
	const labelId = `${inputId}-label`;
	const messageId = `${inputId}-message`;

	let {
		label,
		type = "text",
		variant = "outlined",
    description,
    errorMessage,
    labelPosition = "above",
		size = "md",
		required = null,
    value = $bindable(),
		error = $bindable(false),
		ref = $bindable(),
		...restProps
	}: Props = $props();

  let shouldLabelFloat = $state(false);

	function handleBlur({ target }: FocusEvent): void {
    if (labelPosition === "notched" && !(target as HTMLInputElement).value.length) {
      shouldLabelFloat = false;
    }
  }

  function handleFocus({ target }: FocusEvent): void {
    if (labelPosition === "notched" && !(target as HTMLInputElement).value.length) {
      shouldLabelFloat = true;
    }
  }

  function handleKeyup(event: KeyboardEvent): void {
    if (labelPosition === "notched" && !shouldLabelFloat) {
      shouldLabelFloat = true;
    }
  }

  function handleInput({ target }: Event): void {
    if ((target as HTMLInputElement).value.length) {
      shouldLabelFloat = true;
    }
  }

	function handleAnimation({ target, animationName }: AnimationEvent): void {
		if (animationName.toLowerCase().includes("start")) {
			shouldLabelFloat = true;
		}

		if (animationName.toLowerCase().includes("cancel") && !(target as HTMLInputElement).value.length) {
			shouldLabelFloat = false;
		}
	}
</script>

<div 
  class="uikit-textfield"
  class:uikit-textfield--outlined={variant === "outlined"}
  class:uikit-textfield--underlined={variant === "underlined"}
  class:uikit-textfield--flat={variant === "flat"}
  class:uikit-textfield--filled={variant === "filled"}
  data-label-position={labelPosition}
>
  {#if labelPosition !== "notched"}
    <label id={labelId} class="uikit-textfield__label" for={inputId}>
      {label}
    </label>
  {/if}
  <input 
		class="uikit-textfield__native-control" 
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
  {#if labelPosition === "notched"}
    <div class="uikit-textfield__notched-outline">
      <div class="uikit-textfield__notched-outline-leading"></div>
      <div class="uikit-textfield__notched-outline-notch">
        <label 
          class="uikit-textfield__label"
          class:uikit-textfield__label--float={shouldLabelFloat}
          for={inputId} 
          id={labelId}
        >
          {label}
        </label>
      </div>
      <div class="uikit-textfield__notched-outline-trailing"></div>
    </div>
	{/if}
	<div id={messageId} class="uikit-textfield__message">
    {#if description}
      <div class="uikit-textfield__message--description">
        {description}
      </div>
    {/if}
    {#if error && errorMessage}
      <div class="uikit-textfield__message--error" aria-live="assertive" role="alert">
        {errorMessage}
      </div>
    {/if}
  </div>
</div>

<style>
  @layer variables, base, variants, sizes, shapes, states, accessibility;

  @layer variables {
    :root {
      --uikit-textfield-gap: .25rem;
      --uikit-textfield-font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";

      --uikit-textfield-label-color: #212121;
      --uikit-textfield-label-font-size: .875rem;
      --uikit-textfield-label-transition-duration: 0.15s;
      --uikit-textfield-label-transition-timing: cubic-bezier(0.4, 0, 0.2, 1);

      --uikit-textfield-input-padding-inline: .5rem;
      --uikit-textfield-input-padding-block: 0;
      --uikit-textfield-input-color: #212121;
      --uikit-textfield-input-font-size: 1rem;
      --uikit-textfield-input-font-weight: 400;
      --uikit-textfield-input-letter-spacing: .04em;
      --uikit-textfield-input-height: 2.5rem;
      --uikit-textfield-input-border-width: 1px;
      --uikit-textfield-input-border-style: solid;
      --uikit-textfield-input-border-color: #989898;
      --uikit-textfield-input-border-radius: .25rem;
      --uikit-textfield-input-background: #fff;
      --uikit-textfield-input-outline-color: #000;
      --uikit-textfield-input-outline-focus-color: #2451b2;
      --uikit-textfield-input-outline-style: solid;
      --uikit-textfield-input-outline-width: 2px;
      --uikit-textfield-input-outline-offset: -2px;

      --uikit-textfield-message-color: #212121;
      --uikit-textfield-message-font-size: .75rem;
    }
  }

  @layer base {
    .uikit-textfield {
      position: relative;
      display: grid;
      gap: var(--uikit-textfield-gap);
      font-family: var(--uikit-textfield-font-family);
    }

    .uikit-textfield__label {
      color: var(--uikit-textfield-label-color);
      width: fit-content;
      font-size: var(--uikit-textfield-label-font-size);
      pointer-events: none;
      transition: transform var(--uikit-textfield-label-transition-duration) var(--uikit-textfield-label-transition-timing);
    }

    .uikit-textfield__native-control {
      box-sizing: border-box; 
      outline: none;
      color: var(--uikit-textfield-input-color);
      font-size: var(--uikit-textfield-input-font-size);
      font-weight: var(--uikit-textfield-input-font-weight);
      line-height: 1;
      letter-spacing: var(--uikit-textfield-input-letter-spacing);
      width: 100%;
      height: var(--uikit-textfield-input-height);
      padding-inline: var(--uikit-textfield-input-padding-inline);
      border: var(--uikit-textfield-input-border-width) var(--uikit-textfield-input-border-style);
      border-color: var(--uikit-textfield-input-border-color);
      border-radius: var(--uikit-textfield-input-border-radius);
      background-color: var(--uikit-textfield-input-background);
      -webkit-appearance: none;
      appearance: none;
    }

    .uikit-textfield__message {
      font-size: var(--uikit-textfield-message-font-size);
      color: var(--uikit-textfield-message-color);
      line-height: 1.6;
    }

    .uikit-textfield__notched-outline {
      pointer-events: none;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: var(--uikit-textfield-input-height);
      display: grid;
      grid-template-columns: var(--uikit-textfield-input-padding-inline) minmax(auto, max-content) 1fr;
    }

    .uikit-textfield__notched-outline-leading {
      border: var(--uikit-textfield-input-border-width) var(--uikit-textfield-input-border-style);
      border-right: none;
      border-color: var(--uikit-textfield-input-border-color);
      border-bottom-left-radius: var(--uikit-textfield-input-border-radius);
      border-top-left-radius: var(--uikit-textfield-input-border-radius);
    }

    .uikit-textfield__notched-outline-notch {
      border-top: var(--uikit-textfield-input-border-width) var(--uikit-textfield-input-border-style);
      border-bottom: var(--uikit-textfield-input-border-width) var(--uikit-textfield-input-border-style);
      border-color: var(--uikit-textfield-input-border-color);
      display: flex;
      align-items: center;
    }

    .uikit-textfield__notched-outline-trailing {
      border: var(--uikit-textfield-input-border-width) var(--uikit-textfield-input-border-style);
      border-left: none;
      border-color: var(--uikit-textfield-input-border-color);
      border-bottom-right-radius: var(--uikit-textfield-input-border-radius);
      border-top-right-radius: var(--uikit-textfield-input-border-radius);
    }
  }

  @layer variants {
    .uikit-textfield--underlined .uikit-textfield__native-control {
      --uikit-textfield-input-border-width: 2px;
      --uikit-textfield-input-border-radius: 0;
      --uikit-textfield-input-padding-inline: .25rem;
      border-top-width: 0;
      border-left-width: 0;
      border-right-width: 0;
    }

    .uikit-textfield--flat .uikit-textfield__native-control {
      --uikit-textfield-input-background: #f5f5f5;
      --uikit-textfield-input-border-color: #f5f5f5
    }
    
    .uikit-textfield--filled .uikit-textfield__native-control {
      --uikit-textfield-input-background: #f5f5f5;
      --uikit-textfield-input-border-color: #dcdcdc;
    }

    .uikit-textfield__label--float {
      transform: translateY(-80%) scale(.9);
      padding-inline: .25rem;
    }
  }

  @layer sizes {}
  
  @layer shapes {}
  
  @layer states {
    .uikit-textfield:not(.uikit-textfield--underlined) .uikit-textfield__native-control:hover {
      outline: var(--uikit-textfield-input-outline-width) var(--uikit-textfield-input-outline-style) var(--uikit-textfield-input-outline-color);
      outline-offset: var(--uikit-textfield-input-outline-offset);
    }
    
    .uikit-textfield:not(.uikit-textfield--underlined) .uikit-textfield__native-control:focus-within {
      outline: var(--uikit-textfield-input-outline-width) var(--uikit-textfield-input-outline-style) var(--uikit-textfield-input-outline-focus-color);
      outline-offset: var(--uikit-textfield-input-outline-offset);
    }

    .uikit-textfield--underlined .uikit-textfield__native-control:hover {
      border-bottom-color: var(--uikit-textfield-input-outline-color);
    }

    .uikit-textfield--underlined .uikit-textfield__native-control:focus-within {
      border-bottom-color: var(--uikit-textfield-input-outline-focus-color);
    }

    .uikit-textfield__native-control:hover + .uikit-textfield__notched-outline :is(.uikit-textfield__notched-outline-notch, .uikit-textfield__notched-outline-leading, .uikit-textfield__notched-outline-trailing) {
      --uikit-textfield-input-border-color: #000;
      --uikit-textfield-input-border-width: 2px;
    }
    
    .uikit-textfield__native-control:focus-within + .uikit-textfield__notched-outline :is(.uikit-textfield__notched-outline-notch, .uikit-textfield__notched-outline-leading, .uikit-textfield__notched-outline-trailing) {
      --uikit-textfield-input-border-color: #3367d6 #285bc7 #2451b2;
      --uikit-textfield-input-border-width: 2px;
    }

    .uikit-textfield__notched-outline-notch:has(> .uikit-textfield__label--float) {
      border-top: none!important;
    }

    .uikit-textfield__message:empty {
      display: none;
    }

    .uikit-textfield[data-label-position="notched"] > .uikit-textfield__native-control {
      border: none!important;
      outline: none!important;
      transition: none!important;
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

  @layer accessibility {}
</style>