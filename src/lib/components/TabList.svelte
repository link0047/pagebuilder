<script lang="ts">
	import type { Snippet } from "svelte";
  import { getTabState } from "./tabs-state.svelte";

	type HeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

	type Props = {
		children: Snippet,
		heading?: string,
		headingLevel?: HeadingLevel
	};

	let {
		children,
		heading,
		headingLevel = "h3"
	}: Props = $props();

	const tabState = getTabState();
  const headingId = tabState.headingId;
  const config = $derived(tabState.config);
</script>

{#if heading}
	<svelte:element this={headingLevel} id={headingId}>
		{heading}
	</svelte:element>
{/if}

<div
	role="tablist"
	aria-labelledby={heading ? headingId : null}
	class="wcag-ui-tabs__list"
	class:wcag-ui-tabs__list--underline={config.variant === "underline"}
	class:wcag-ui-tabs__list--enclosed={config.variant === "enclosed"}
	class:wcag-ui-tabs__list--outlined={config.variant === "outlined"}
	class:wcag-ui-tabs__list--ghost={config.variant === "filled"}
	class:wcag-ui-tabs__list--fullWidth={config.fullWidth}
>
	{@render children?.()}
</div>

<style>
	.wcag-ui-tabs__list {
		position: relative;
		display: flex;
		flex-flow: row wrap;
		width: fit-content;
	}

	:is(.wcag-ui-tabs__list--underline,.wcag-ui-tabs__list--outlined):before {
		content: "";
		position: absolute;
	  bottom: 0px;
	  width: 100%;
		border-bottom: 1px solid #c5c5cb;
	}

	.wcag-ui-tabs__list--enclosed {
		padding: .25rem;
		border-radius: .5rem;
		background-color: #f4f4f5;
	}

	.wcag-ui-tabs__list--underline,.wcag-ui-tabs__list--outlined,.wcag-ui-tabs__list--fullWidth {
		width: 100%;
	}
</style>
