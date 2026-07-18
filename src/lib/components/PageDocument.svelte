<script lang="ts">
  import type { RootNode } from "$lib/components/types";
  import Page from "$lib/components/Page.svelte";
  import Preview from "$lib/components/Preview.svelte";
  import Heading from "$lib/components/Heading.svelte";

  let { pageTree }: { pageTree: RootNode } = $props();
</script>

<Page spacing={pageTree.settings?.spacing ?? "2rem"} {...pageTree.settings}>
  {#if pageTree.heading}
    <Heading
      tag={pageTree.heading.tag ?? "h1"}
      visuallyHidden={pageTree.heading.hidden}
      size={pageTree.heading.size}
      weight={pageTree.heading.weight}
      alignment={pageTree.heading.alignment}
      color={pageTree.heading.color}
    >
      {pageTree.heading.text ?? ""}
    </Heading>
  {/if}
  <Preview {pageTree} />
</Page>
