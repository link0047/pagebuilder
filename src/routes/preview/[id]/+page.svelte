<script lang="ts">
  import  Preview from "$lib/components/Preview.svelte";
  import  Page from "$lib/components/Page.svelte";

  let { data } = $props();
</script>

<main class="preview">
  <Page>
    <Preview pageTree={data.tree} />
  </Page>
</main>

<style>
  .preview {
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
