<script lang="ts">
	import { type Snippet } from "svelte";

	type Props = {
		leading?: Snippet;
		content?: Snippet;
		trailing?: Snippet;
	}

	let {
		leading,
		content,
		trailing
	}: Props = $props();
</script>

<header class="app-header">
  <div class="app-header__leading">
		{@render leading?.()}
  </div>
  <div class="app-header__content">
		{@render content?.()}
  </div>
  <div class="app-header__trailing">
		{@render trailing?.()}
  </div>
</header>

<style>	
	.app-header {
		grid-area: header;
		display: grid;
		grid-template-columns: minmax(0, max-content) 1fr minmax(0, max-content);
		align-items: center;
		padding-inline: .5rem;
		height: 3.5rem;
		box-shadow: 0 .125rem .0625rem #0000000d, 0 0 .0625rem #42474c73;
		background-color: color-mix(in oklab, #fff 90%, transparent);
		position: relative;
		z-index: 100;
	}

	.app-header__leading,
	.app-header__content,
	.app-header__trailing {
		display: flex;
		flex-flow: row nowrap;
		align-items: center;
		gap: .5rem;
	}
</style>