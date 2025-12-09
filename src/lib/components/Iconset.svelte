<script lang="ts">
	import { type Snippet } from "svelte";

	type Props = {
		children: Snippet;
	}

	let { children }: Props = $props();
</script>

<svg class="icon-set" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
	<defs>
		{@render children()}
	</defs>
</svg>

<style>
	.icon-set {
		position: absolute;
		width: 0;
		height: 0;
		overflow: hidden;
		pointer-events: none;
		margin: 0;
		padding: 0;
	}
</style>