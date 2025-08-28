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
>
	{@render children?.()}	
</div>

<style>
	.uikit-tabs__list {
		display: flex;
		flex-flow: row wrap;
	}
</style>