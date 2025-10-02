<script lang="ts">
  const blocks = Array(250).fill(0);
</script>

<div class="blocks">
  {#each blocks as block}
    <div class="block">{block}</div>
  {/each}
</div>
<div class="uikit-bottom-bar"></div>

<style>
  .uikit-bottom-bar {
    position: fixed;
    height: 300px;
    width: 100%;
    border-top-left-radius: .5rem;
    border-top-right-radius: .5rem;
    bottom: 0;
    background-color: #212121;
  }

  .blocks {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: .5rem;
    width: 100%;
    max-width: 1200px;
    grid-area: preview;
  }

  .block {
    display: flex;
    background-color: #212121;
    justify-content: center;
    align-items: center;
    aspect-ratio: 1 / 1;
    color: #fff;
    border-radius: .5rem;
  }
</style>