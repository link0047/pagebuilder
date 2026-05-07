<script lang="ts">
	import { type Snippet, getContext, onMount } from "svelte";

	type Props = {
		href?: string;
		children?: Snippet;
		leading?: Snippet;
		trailing?: Snippet;
	};

	let {
		href,
		children,
		leading,
		trailing
	}: Props = $props();

	const uid = getContext("listbox-id");
	const optionCounter = getContext("option-counter");
	const registerOption = getContext<(id: string) => () => void>("register-option");
  const activeOptionId = getContext<{ current: string | null }>("active-option-id");
  const setActiveId = getContext<(id: string) => void>("set-active-id");
	const id = `${uid}-option-${optionCounter()}`;

	const isActive = $derived(activeOptionId.current === id);

	function handleSelect() {
	  setActiveId(id);

		if (href) {
			window.location.href = href;
		}
	}

	function handleKeyup(event: KeyboardEvent) {
		if (event.key === "Enter" || event.key === " ") {
			event.preventDefault();
			handleSelect();
		}
	}

	onMount(() => registerOption(id));
</script>

<div
	class="wcag-ui-listbox__option"
	role="option"
	aria-selected={isActive}
	{id}
	onclick={handleSelect}
	onkeyup={handleKeyup}
>
	{#if leading}
		<div class="wcag-ui-listbox__option-prefix">
			{@render leading()}
		</div>
	{/if}
	<div class="wcag-ui-listbox__option-content">
		{@render children?.()}
	</div>
	{#if trailing}
		<div class="wcag-ui-listbox__option-suffix">
			{@render trailing()}
		</div>
	{/if}
</div>

<style>
	.wcag-ui-listbox__option {
		box-sizing: border-box;
		display: flex;
		min-height: 2.75rem;
		align-items: center;
		gap: 0.75rem;
		padding-inline: 1rem;
		padding-block: .5rem;
		border-radius: .5rem;
		background-color: transparent;
		cursor: pointer;
		text-decoration: none;
		color: #333;
		transition: background-color 0.12s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.wcag-ui-listbox__option:hover {
		background-color: #f5f5f5;
	}

	.wcag-ui-listbox__option:is(:global([aria-selected="true"])) {
	  background-color: #e8f0fe;
    outline: 2px solid #0066cc;
	  outline-offset: -2px;
	}

	.wcag-ui-listbox__option:is([aria-selected="true"]):hover {
    background-color: #dbeafe;
	}

	.wcag-ui-listbox__option-content {
		flex: 1;
	}

	.wcag-ui-listbox__option-prefix,
	.wcag-ui-listbox__option-suffix {
		display: flex;
		align-items: center;
		flex-shrink: 0;
	}
</style>
