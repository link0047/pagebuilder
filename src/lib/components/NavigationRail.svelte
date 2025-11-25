<script lang="ts">
	import { type Snippet } from "svelte";

	type Props = {
		children: Snippet;
		end?: Snippet;
	};

	let {
		children, 
		end
	}: Props = $props();
</script>

<div class="uikit-navigation-rail">
  <nav class="uikit-navigation-rail__content">
		<section class="uikit-navigation-rail__start">
			{@render children?.()}
		</section>
		<section class="uikit-navigation-rail__end">
			{@render end?.()}
		</section>
  </nav>
</div>

<style>
	.uikit-navigation-rail {
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		height: 100%;
		width: 4.5rem;
		background-color: #fff;
		grid-area: rail;
		border-right: 1px solid hsl(30 3.3% 11.8% / .15);
		padding-block: .5rem;
		padding-inline: .25rem;
	}

	.uikit-navigation-rail__content {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		height: 100%;
    width: 100%;
		gap: .5rem;
	}

	.uikit-navigation-rail__start,
	.uikit-navigation-rail__end {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: .5rem;
	}
</style>