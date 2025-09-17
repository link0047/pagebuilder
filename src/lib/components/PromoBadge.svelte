<script lang="ts">
	type PromoType = "text" | "free" | "percent" | "money" | "money-cents";
	type PromoValue = `${number}%` | `${number}% off` | `$${number}` | `$${number}.${number}` | "free" | string;
	
	type ParsedPromoValue = {
		type: PromoType;
		value: string;
		cents?: string;
		symbol?: string;
		suffix?: string;
	}

	type Props = {
		heading?: string;
		value: string;
		legalText?: string;
		ariaLabel?: string;
	}
	
	let {
		heading,
		value,
		legalText,
		ariaLabel
	}: Props = $props();

	function parsePromoValue(promoValue: PromoValue): ParsedPromoValue {
		const trimmed = promoValue?.trim();
		if (!trimmed) return { type: "text", value: "" };
		
		// Handle "Free" case
		if (trimmed.toLowerCase() === "free") {
			return {
				type: "free",
				value: "Free"
			};
		}
		
		// Handle percentage with "off" (e.g., "40% off")
		const percentOffMatch = trimmed.match(/^(\d+)%\s*off$/i);
		if (percentOffMatch) {
			return {
				type: "percent",
				value: percentOffMatch[1],
				symbol: "%",
				suffix: "off"
			};
		}
		
		// Handle simple percentage (e.g., "40%")
		const percentMatch = trimmed.match(/^(\d+)%$/i);
		if (percentMatch) {
			return {
				type: "percent",
				value: percentMatch[1],
				symbol: "%"
			};
		}
		
		// Handle dollar amount with cents (e.g., "$19.99")
		const dollarCentsMatch = trimmed.match(/^\$(\d{1,3}(?:,\d{3})*)\.(\d{2})$/);
		if (dollarCentsMatch) {
			return {
				type: "money-cents",
				value: dollarCentsMatch[1],
				cents: dollarCentsMatch[2],
				symbol: "$"
			};
		}
		
		// Handle whole dollar amount (e.g., "$100")
		const dollarMatch = trimmed.match(/^\$(\d+)$/);
		if (dollarMatch) {
			return {
				type: "money",
				value: dollarMatch[1],
				symbol: "$"
			};
		}
		
		// Fallback to plain text
		return {
			type: "text",
			value: trimmed
		};
	}
	
	const parsed = $derived(parsePromoValue(value));
</script>

<div class="promo-badge" aria-label={ariaLabel}>
	{#if heading}
		<div class="promo-badge__heading">{heading}</div>
	{/if}
	
	<div class="promo-badge__display">
		{#if parsed.type === "money" || parsed.type === "money-cents"}
			<span class="promo-badge__symbol">{parsed.symbol}</span>
			<span class="promo-badge__value">{parsed.value}</span>
			{#if parsed.cents}
				<span class="promo-badge__cents">{parsed.cents}</span>
			{/if}
		{:else if parsed.type === "percent"}
			<span class="promo-badge__value">{parsed.value}</span>
			<div class="promo-badge__percent-suffix">
				<span class="promo-badge__symbol">{parsed.symbol}</span>
				{#if parsed.suffix}
					<span class="promo-badge__suffix">{parsed.suffix}</span>
				{/if}
			</div>
		{:else if parsed.type === "free"}
			<span class="promo-badge__value promo-badge__value--free">{parsed.value}</span>
		{:else}
			<span class="promo-badge__value">{parsed.value}</span>
		{/if}
	</div>
	
	{#if legalText}
		<div class="promo-badge__legal">{legalText}</div>
	{/if}
</div>

<style>
	@layer variables, base, variants;
	
	@layer variables {
		:root {
			--uikit-promo-badge-heading-size: 1.2rem;
			--uikit-promo-badge-value-size: 2.5rem;
			--uikit-promo-badge-scale: 1.6;
			--uikit-promo-badge-legal-size: 0.9rem;
			--uikit-promo-badge-color: #212121;
			--uikit-promo-badge-spacing: 0.25rem;

			--uikit-promo-badge-heading-color: var(--uikit-promo-badge-color);
			--uikit-promo-badge-value-color: var(--uikit-promo-badge-color);
			--uikit-promo-badge-symbol-color: var(--uikit-promo-badge-color);
			--uikit-promo-badge-legal-color: var(--uikit-promo-badge-color);
			
			/* Proportional sizing ratios - based on value size */
			--uikit-promo-badge-symbol-ratio: 0.35;
			--uikit-promo-badge-cents-ratio: 0.35;
			--uikit-promo-badge-suffix-ratio: 0.35;
			
			/* Override variables for custom sizing if needed */
			--uikit-promo-badge-symbol-override: initial;
			--uikit-promo-badge-cents-override: initial;
			--uikit-promo-badge-suffix-override: initial;
		}
	}

	@layer base {
		.promo-badge {
			color: var(--uikit-promo-badge-color);
			font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
			line-height: 1;
			display: flex;
			flex-direction: column;
			gap: var(--uikit-promo-badge-spacing);
		}

		.promo-badge__heading {
			font-size: var(--uikit-promo-badge-heading-size);
			font-weight: 500;
			text-align: left;
			letter-spacing: 0.025em;
			color: var(--uikit-promo-badge-heading-color);
		}

		.promo-badge__display {
			display: flex;
			align-items: center;
		}

		.promo-badge__value {
			font-size: calc(var(--uikit-promo-badge-value-size) * var(--uikit-promo-badge-scale));
			font-weight: 700;
			line-height: 1;
			height: calc(var(--uikit-promo-badge-value-size) * var(--uikit-promo-badge-scale) * 0.8);
			overflow: hidden;
			display: flex;
			align-items: center;
			color: var(--uikit-promo-badge-value-color);
		}

		.promo-badge__cents, .promo-badge__symbol {
			color: var(--uikit-promo-badge-symbol-color);
			font-weight: 600;
			align-self: flex-start;
		}
			
		.promo-badge__symbol {
			font-size: var(--uikit-promo-badge-symbol-override, calc(var(--uikit-promo-badge-value-size) * var(--uikit-promo-badge-scale) * var(--uikit-promo-badge-symbol-ratio)));
		}

		.promo-badge__cents {
			font-size: var(--uikit-promo-badge-cents-override, calc(var(--uikit-promo-badge-value-size) * var(--uikit-promo-badge-scale) * var(--uikit-promo-badge-cents-ratio)));
		}

		.promo-badge__percent-suffix {
			display: flex;
			flex-direction: column;
			font-weight: 500;
		}

		.promo-badge__percent-suffix .promo-badge__symbol {
			font-size: var(--uikit-promo-badge-suffix-override, calc(var(--uikit-promo-badge-value-size) * var(--uikit-promo-badge-scale) * var(--uikit-promo-badge-suffix-ratio)));
		}

		.promo-badge__suffix {
			font-size: var(--uikit-promo-badge-suffix-override, calc(var(--uikit-promo-badge-value-size) * var(--uikit-promo-badge-scale) * var(--uikit-promo-badge-suffix-ratio)));
			font-weight: 500;
			color: var(--uikit-promo-badge-symbol-color);
		}

		.promo-badge__legal {
			font-size: var(--uikit-promo-badge-legal-size);
			font-weight: 400;
			opacity: 0.9;
			color: var(--uikit-promo-badge-legal-color);
		}
	}

	@layer variants {
		.promo-badge__value--free {
			font-size: calc(var(--uikit-promo-badge-value-size) * var(--uikit-promo-badge-scale) * 0.8);
			height: calc(var(--uikit-promo-badge-value-size) * var(--uikit-promo-badge-scale) * 0.65);
		}
	}
</style>