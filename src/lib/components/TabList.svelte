<script lang="ts">
	import { type Snippet } from "svelte";
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
	const { variant, size, color, shape, fullWidth } = tabState.config;
</script>

{#if heading}
	<svelte:element this={headingLevel} id={headingId}>
		{heading}
	</svelte:element>
{/if}

<div
	role="tablist"
	aria-labelledby={heading ? headingId : null}
	class="uikit-tabs__list"
	class:uikit-tabs__list--underline={variant === "underline"}
	class:uikit-tabs__list--enclosed={variant === "enclosed"}
	class:uikit-tabs__list--outlined={variant === "outlined"}
	class:uikit-tabs__list--ghost={variant === "filled"}
	class:uikit-tabs__list--fullWidth={fullWidth}
>
	{@render children?.()}	
</div>

<style>
	.uikit-tabs__list {
		position: relative;
		display: flex;
		flex-flow: row wrap;
		width: fit-content;
	}
	
	:is(.uikit-tabs__list--underline,.uikit-tabs__list--outlined):before {
		content: "";
		position: absolute;
	  bottom: 0px;
	  width: 100%;
		border-bottom: 1px solid #c5c5cb;
	}

	.uikit-tabs__list--enclosed {
		padding: .25rem;
		border-radius: .5rem;
		background-color: #f4f4f5;
	}

	.uikit-tabs__list--underline,.uikit-tabs__list--outlined,.uikit-tabs__list--fullWidth {
		width: 100%;
	}
</style>