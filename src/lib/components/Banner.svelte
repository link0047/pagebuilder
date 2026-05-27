<script lang="ts">
	import type { Snippet } from "svelte";
	import Button from "./Button.svelte";
	import Icon from "./Icon.svelte";

	type Placement = "top" | "bottom" | "floating-top" | "floating-bottom" | "floating-top-centered" | "floating-bottom-centered";
	type Color = "neutral" | "primary" | "dark";

	type Props = {
		open?: boolean;
		placement?: Placement;
		closable?: boolean;
		icon?: Snippet;
		actions?: Snippet;
		children?: Snippet;
		onclose?: () => void;
		color?: Color;
		[key: string]: unknown;
	};

	let {
		open = $bindable(true),
		placement = "top",
		closable = false,
		icon,
		actions,
		children,
		onclose,
		color = "neutral",
		...restProps
	}: Props = $props();

	function close() {
		open = false;
		onclose?.();
	}

	const isFloating = $derived(placement.startsWith("floating"));
</script>

{#if open}
	<div
		class="wcag-ui-banner"
		class:wcag-ui-banner--floating={isFloating}
		class:wcag-ui-banner--color-dark={color === "dark"}
		class:wcag-ui-banner--color-primary={color === "primary"}
		role="status"
		aria-live="polite"
		aria-atomic="true"
		data-closable={closable}
		data-placement={placement}
		{...restProps}
	>
		<div
			class="wcag-ui-banner__container"
			data-has-actions={!!actions}
		>
			{#if icon}
				<div class="wcag-ui-banner__icon" aria-hidden="true">
					{@render icon()}
				</div>
			{/if}
			<div class="wcag-ui-banner__content">
				{@render children?.()}
			</div>
			{#if actions}
				<div class="wcag-ui-banner__actions">
					{@render actions()}
				</div>
			{/if}
			{#if closable}
				<div class="wcag-ui-banner__close-button">
					<Button
						size="sm"
						variant="ghost"
						shape="rounded-square"
						onclick={close}
						data-surface={color === "dark" || color === "primary" ? "dark" : undefined}
					>
						<Icon size="1rem">
							<path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
						</Icon>
					</Button>
				</div>
			{/if}
		</div>
	</div>
{/if}

<style>
	/* ── Block ── */
	.wcag-ui-banner {
	  --wcag-ui-banner-bg: #fafafa;
	  --wcag-ui-banner-color: #38393b;
	  --wcag-ui-banner-font-size: 0.875rem;
	  --wcag-ui-banner-font-weight: 400;
	  --wcag-ui-banner-line-height: 1.4;
	  --wcag-ui-banner-padding-block: .5rem;
	  --wcag-ui-banner-padding-inline: .75rem;
	  --wcag-ui-banner-gap: 0.5rem;
	  --wcag-ui-banner-float-spacing: 1rem;

	  box-sizing: border-box;
	  position: relative;
	  width: 100%;
	  background: var(--wcag-ui-banner-bg);
	  color: var(--wcag-ui-banner-color);
	  font-size: var(--wcag-ui-banner-font-size);
	  font-weight: var(--wcag-ui-banner-font-weight);
	  line-height: var(--wcag-ui-banner-line-height);
	  container-type: inline-size;
	}

	/* ── Block modifiers ── */
	.wcag-ui-banner--color-dark {
	  --wcag-ui-banner-bg: #333335;
	  --wcag-ui-banner-color: #fff;
	}

	.wcag-ui-banner--color-primary {
	  --wcag-ui-banner-bg: #2a508f;
	  --wcag-ui-banner-color: #fff;
	}

	.wcag-ui-banner--color-dark .wcag-ui-banner__close-button,
	.wcag-ui-banner--color-primary .wcag-ui-banner__close-button {
	  --wcag-ui-button-color: #fff;
	  --wcag-ui-button-hover-bg-color: rgba(255, 255, 255, 0.15);
	  --wcag-ui-button-hover-border-color: rgba(255, 255, 255, 0.15);
	  --wcag-ui-button-border-color: transparent;
	}

	.wcag-ui-banner--floating {
	  position: absolute;
	  border-radius: 0.5rem;
	}

	/* ── Placement modifiers ── */
	.wcag-ui-banner[data-placement="bottom"] {
	  position: absolute;
	  left: 0;
	  bottom: 0;
	}

	.wcag-ui-banner:is([data-placement="floating-top"], [data-placement="floating-top-centered"]) {
	  top: var(--wcag-ui-banner-float-spacing);
	}

	.wcag-ui-banner:is([data-placement="floating-bottom"], [data-placement="floating-bottom-centered"]) {
	  bottom: var(--wcag-ui-banner-float-spacing);
	}

	.wcag-ui-banner:is([data-placement="floating-top"], [data-placement="floating-bottom"]) {
	  left: var(--wcag-ui-banner-float-spacing);
	  width: calc(100% - (var(--wcag-ui-banner-float-spacing) * 2));
	}

	.wcag-ui-banner:is([data-placement="floating-top-centered"], [data-placement="floating-bottom-centered"]) {
	  left: 50%;
	  transform: translateX(-50%);
	  width: max-content;
	  container-type: unset;
	  max-width: calc(100% - (var(--wcag-ui-banner-float-spacing) * 2));

	  & .wcag-ui-banner__container {
	    display: flex;
	    --wcag-ui-banner-padding-block: .5rem;
	    --wcag-ui-banner-padding-inline: 1rem;
	  }
	}

	/* ── Elements ── */
	.wcag-ui-banner__container {
	  box-sizing: border-box;
	  width: 100%;
	  min-height: 3rem;
	  display: grid;
	  grid-template-columns: auto 1fr;
	  grid-template-areas: "icon text";
	  align-items: center;
	  column-gap: 0;
	  row-gap: 0;
	  padding-block: var(--wcag-ui-banner-padding-block);
	  padding-inline: var(--wcag-ui-banner-padding-inline);
	}

	.wcag-ui-banner__icon {
	  grid-area: icon;
	  display: inline-flex;
	  align-items: center;
	  flex-shrink: 0;
	  margin-inline-end: var(--wcag-ui-banner-gap);
	}

	.wcag-ui-banner__content {
	  grid-area: text;
	  display: flex;
	  flex-flow: column wrap;
	}

	.wcag-ui-banner__actions {
	  display: flex;
	  align-items: center;
	  justify-content: end;
	  flex-flow: row nowrap;
	  grid-area: actions;
	  margin-inline-start: var(--wcag-ui-banner-gap);
	}

	.wcag-ui-banner__close-button {
	  position: absolute;
	  inset: var(--wcag-ui-banner-padding-block) var(--wcag-ui-banner-padding-inline) auto auto;
	}

	/* ── State ── */
	.wcag-ui-banner:not(:has(.wcag-ui-banner__icon, .wcag-ui-banner__actions)) {
	  --wcag-ui-banner-gap: 0;
	}

	.wcag-ui-banner__container[data-has-actions="true"] {
	  grid-template-areas:
	    "icon text"
	    ". actions";
	  row-gap: var(--wcag-ui-banner-gap);
	}

	.wcag-ui-banner[data-closable="true"] .wcag-ui-banner__container {
	  padding-inline-end: calc(var(--wcag-ui-banner-padding-inline) + 2rem);
	}

	:is(.wcag-ui-banner__icon, .wcag-ui-banner__actions):empty {
	  display: none;
	}

	/* ── Container query ── */
	@container (min-width: 668px) {
	  .wcag-ui-banner__container {
	    grid-template-columns: auto 1fr auto;
	    grid-template-areas: "icon text actions";
	    row-gap: 0;
	  }
	}
</style>
