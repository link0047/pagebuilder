<script lang="ts">
  import Listbox from "$lib/components/Listbox.svelte";
  import ListboxOption from "$lib/components/ListboxOption.svelte";
  import Button from "$lib/components/Button.svelte";

  let options = $state([1, 2, 3, 4, 5]);
  let shouldRenderListbox = $state(true);

  function toggleListbox() {
    shouldRenderListbox = !shouldRenderListbox;
  }

	function deleteItem(option: number) {
		options = options.filter(opt => opt !== option);
	}
</script>

<main>
  <Button onclick={toggleListbox}>
    {shouldRenderListbox ? "hide listbox" : "show listbox"}
  </Button>
  <div class="listbox-area">
    {#if shouldRenderListbox}
     	<Listbox>
        {#each options as option}
     			<ListboxOption>
      				{option}
      				{#snippet trailing()}
     					<Button size="xs" onclick={() => deleteItem(option)}>
      						Delete
     					</Button>
      				{/snippet}
     			</ListboxOption>
        {/each}
     	</Listbox>
    {/if}
  </div>
</main>

<style>
  .listbox-area {
		margin-block: 1rem;
		margin-inline: auto;
		border: 1px solid #d1d1d6;
		border-radius: .5rem;
		max-width: 600px;
	}

	.listbox-area:empty {
	  border: none;
	}
</style>
