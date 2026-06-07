<script lang="ts">
  type CalloutType = "text" | "free" | "percent" | "money" | "money-cents";
  type CalloutValue = `${number}%` | `${number}% off` | `$${number}` | `$${number}.${number}` | "free" | string;
  type Size = "sm" | "md" | "lg";

  type ParsedCalloutValue = {
    type: CalloutType;
    value: string;
    cents?: string;
    symbol?: string;
    suffix?: string;
  }

  type Props = {
    heading?: string;
    prefix?: string;
    value: CalloutValue;
    legalText?: string;
    ariaLabel?: string;
    color?: string;
    size?: Size;
    [key: string]: unknown;
  }

  let {
    heading,
    prefix,
    value,
    legalText,
    ariaLabel,
    color = "#212121",
    size = "md",
    ...restProps
  }: Props = $props();

  // Sizing Map
  const sizeValues = {
    sm: "2.5rem",
    md: "4rem",
    lg: "6rem"
  };

  function parseCalloutValue(val: CalloutValue): ParsedCalloutValue {
    const trimmed = val?.trim();
    if (!trimmed) return { type: "text", value: "" };
    if (trimmed.toLowerCase() === "free") return { type: "free", value: "Free" };

    const percentOffMatch = trimmed.match(/^(\d+)%\s*off$/i);
    if (percentOffMatch) return { type: "percent", value: percentOffMatch[1], symbol: "%", suffix: "off" };

    const percentMatch = trimmed.match(/^(\d+)%$/i);
    if (percentMatch) return { type: "percent", value: percentMatch[1], symbol: "%" };

    const dollarCentsMatch = trimmed.match(/^\$(\d{1,3}(?:,\d{3})*)\.(\d{2})$/);
    if (dollarCentsMatch) return { type: "money-cents", value: dollarCentsMatch[1], cents: dollarCentsMatch[2], symbol: "$" };

    const dollarMatch = trimmed.match(/^\$(\d+)$/);
    if (dollarMatch) return { type: "money", value: dollarMatch[1], symbol: "$" };

    return { type: "text", value: trimmed };
  }

  const parsed = $derived(parseCalloutValue(value));
  const displaySize = $derived(sizeValues[size]);
</script>

<div
  class="wcag-ui-offer-callout"
  style:--wcag-ui-callout-color={color}
  style:--wcag-ui-callout-display-size={displaySize}
  aria-label={ariaLabel}
  {...restProps}
>
  {#if heading}
    <div class="wcag-ui-offer-callout__heading">{heading}</div>
  {/if}

  <div class="wcag-ui-offer-callout__display">
    {#if prefix}
      <span class="wcag-ui-offer-callout__prefix">{prefix}</span>
    {/if}

    {#if parsed.type === "money" || parsed.type === "money-cents"}
      <span class="wcag-ui-offer-callout__symbol">{parsed.symbol}</span>
      <span class="wcag-ui-offer-callout__value">{parsed.value}</span>
      {#if parsed.cents}
        <span class="wcag-ui-offer-callout__cents">{parsed.cents}</span>
      {/if}
    {:else if parsed.type === "percent"}
      <span class="wcag-ui-offer-callout__value">{parsed.value}</span>
      <div class="wcag-ui-offer-callout__suffix-stack">
      <span class="wcag-ui-offer-callout__symbol">{parsed.symbol}</span>
        {#if parsed.suffix}
          <span class="wcag-ui-offer-callout__suffix">{parsed.suffix}</span>
        {/if}
      </div>
    {:else}
      <span class="wcag-ui-offer-callout__value" class:wcag-ui-offer-callout__value--free={parsed.type === "free"}>
        {parsed.value}
      </span>
    {/if}
  </div>

  {#if legalText}
    <div class="wcag-ui-offer-callout__legal">{legalText}</div>
  {/if}
</div>

<style>
  .wcag-ui-offer-callout {
    /* Internal scaling ratios */
    --wcag-ui-callout-secondary-scale: 0.4;
    --wcag-ui-callout-color: ;
    --wcag-ui-callout-display-size: ;

    color: var(--wcag-ui-callout-color);
    font-family: inherit;
    line-height: 1;
    display: flex;
    flex-direction: column;
    width: fit-content;
    gap: 0.1rem;
  }

  .wcag-ui-offer-callout__heading {
    /* Scales slightly with the main size */
    font-size: calc(var(--wcag-ui-callout-display-size) * 0.28);
    font-weight: 700;
    margin-bottom: 0.1em;
  }

  .wcag-ui-offer-callout__display {
    display: flex;
    align-items: flex-start;
    line-height: 0.85;
  }

  .wcag-ui-offer-callout__value {
    font-size: var(--wcag-ui-callout-display-size);
    font-weight: 700;
    letter-spacing: -0.04em;
  }

  .wcag-ui-offer-callout__prefix {
    font-size: calc(var(--wcag-ui-callout-display-size) * var(--wcag-ui-callout-secondary-scale) * 0.7);
    margin-right: 0.2em;
    margin-top: 0.15em;
    font-weight: 700;
  }

  .wcag-ui-offer-callout__symbol,
  .wcag-ui-offer-callout__cents {
    font-size: calc(var(--wcag-ui-callout-display-size) * var(--wcag-ui-callout-secondary-scale));
    font-weight: 700;
    margin-top: 0.1em;
  }

  .wcag-ui-offer-callout__suffix-stack {
    display: flex;
    flex-direction: column;
    margin-left: 0.1em;
    margin-top: 0.15em;
  }

  .wcag-ui-offer-callout__suffix {
    font-size: calc(var(--wcag-ui-callout-display-size) * var(--wcag-ui-callout-secondary-scale) * 0.8);
    font-weight: 700;
    text-transform: lowercase;
    line-height: 1;
  }

  .wcag-ui-offer-callout__legal {
    font-size: calc(var(--wcag-ui-callout-display-size) * 0.18);
    line-height: 1.2;
    margin-top: 0.3em;
    font-weight: 400;
    max-width: 25ch;
  }

  /* Specific overrides for 'Free' text to keep it from getting too massive */
  .wcag-ui-offer-callout__value--free {
    font-size: calc(var(--wcag-ui-callout-display-size) * 0.75);
  }
</style>
