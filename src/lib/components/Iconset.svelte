<script lang="ts">
	import { type Snippet } from "svelte";

	type Props = {
		children: Snippet;
	}

	let { children }: Props = $props();

	// This component should only be used once in your app
	// It creates a global SVG sprite for icon definitions
</script>

<svg class="icon-set" aria-hidden="true">
	<defs>
		{@render children()}
	</defs>
</svg>

<style>
	.icon-set {
		display: none;
	}
</style>