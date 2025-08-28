<script lang="ts">
	import { type Snippet } from "svelte";

	type Props = {
		children?: Snippet,
		title?: string
	}

	let {
		children,
		title
	}: Props = $props();
</script>

<aside class="app-sidebar">
	{#if title}
	<header class="app-sidebar__header">
		<h1 class="app-side__title">{title}</h1>
	</header>
	{/if}
	{@render children?.()}
</aside>

<style>
	.app-sidebar {
		position: relative;
		grid-area: sidebar;
		background-color: #fff;
		width: 18.75rem;
		height: 100%;
		border-right: .0625rem solid #ebebeb;
		overflow: hidden;
	}

	.app-sidebar__header {
		display: flex;
		align-items: center;
		padding-inline: 1rem;
		height: 3rem;
		border-bottom: 1px solid #ebebeb;
	}

	.app-side__title {
		font-size: 1rem;
		font-weight: 500;
		line-height: 1;
		letter-spacing: 0;
		user-select: none;
	}
</style>