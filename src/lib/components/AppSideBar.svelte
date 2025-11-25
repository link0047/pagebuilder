<script lang="ts">
	import { type Snippet } from "svelte";

	type Props = {
		children?: Snippet,
	}

	let {
		children,
	}: Props = $props();
</script>

<aside class="app-sidebar">
	{@render children?.()}
</aside>

<style>
	.app-sidebar {
		position: relative;
		display: flex;
  	flex-direction: column;
		grid-area: sidebar;
		background-color: #fff;
		width: 18.75rem;
		height: 100%;
		border-right: .0625rem solid #ebebeb;
		overflow: hidden;
	}
</style>