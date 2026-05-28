<script lang="ts">
	type Orientation = "horizontal" | "vertical";

	type Props = {
		gap?: number;
		color?: string;
		width?: string;
		orientation?: Orientation;
	}

	// Constants for defaults
	const DEFAULT_GAP = 0;
	const DEFAULT_COLOR = "#a8a8ae";
	const DEFAULT_WIDTH = "100%";
	const DEFAULT_ORIENTATION = "horizontal";

	function validateCSSProperty(
		value: string,
		property: string,
		defaultValue: string
	): string {
		if (value === defaultValue) return value;

		if (typeof value !== "string" || value.trim() === "") {
			console.warn(`Invalid wcag-ui-separator ${property}: "${value}". Must be a non-empty string. Falling back to "${defaultValue}"`);
			return defaultValue;
		}

		if (!CSS.supports(property, value)) {
			console.warn(`Invalid wcag-ui-separator ${property}: "${value}". Not a valid CSS ${property} value. Falling back to "${defaultValue}"`);
			return defaultValue;
		}

		return value;
	}

	function validateGap(gap: number): number {
		if (typeof gap !== "number" || isNaN(gap) || gap < 0) {
			console.warn(`Invalid wcag-ui-separator gap: "${gap}". Must be a non-negative number. Falling back to ${DEFAULT_GAP}`);
			return DEFAULT_GAP;
		}
		return gap;
	}

	let {
		gap = DEFAULT_GAP,
		color = DEFAULT_COLOR,
		width = DEFAULT_WIDTH,
		orientation: rawOrientation = DEFAULT_ORIENTATION
	}: Props = $props();

	const orientation = $derived.by(() => {
		if (!["horizontal", "vertical"].includes(rawOrientation)) {
			console.warn(`Invalid wcag-ui-separator orientation: "${rawOrientation}". Falling back to "${DEFAULT_ORIENTATION}"`);
			return DEFAULT_ORIENTATION;
		}
		return rawOrientation;
	});

	const validatedGap = $derived(validateGap(gap));
	const validatedColor = $derived(validateCSSProperty(color, "color", DEFAULT_COLOR));
	const validatedWidth = $derived(validateCSSProperty(width, "width", DEFAULT_WIDTH));

	const inlineStyles = $derived.by(() => {
		const styles = `${validatedGap !== DEFAULT_GAP ? `--wcag-ui-separator-gap:${validatedGap / 16}rem;` : ""}${validatedColor !== DEFAULT_COLOR ? `--wcag-ui-separator-color:${validatedColor};` : ""}${validatedWidth !== DEFAULT_WIDTH ? `--wcag-ui-separator-width:${validatedWidth};` : ""}`;
		return styles || null;
	});
</script>

<hr
	aria-orientation={orientation}
	class="separator"
	class:separator--vertical={orientation === "vertical"}
	style={inlineStyles}
/>

<style>
	:root {
		--wcag-ui-separator-width: 100%;
		--wcag-ui-separator-color: #a8a8ae;
		--wcag-ui-separator-gap: 0;
		--wcag-ui-separator-thickness: .0625rem;
	}

	.separator {
		border: none;
		margin: var(--wcag-ui-separator-gap, 0) 0;
		height: var(--wcag-ui-separator-thickness);
		background-color: var(--wcag-ui-separator-color);
		width: var(--wcag-ui-separator-width);
	}

	.separator--vertical {
		height: 100%;
		width: var(--wcag-ui-separator-thickness);
		margin: 0 var(--wcag-ui-separator-gap);
	}
</style>
