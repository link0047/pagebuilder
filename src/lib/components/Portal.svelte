<script lang="ts">
  import { generateId } from "$lib/utils/unique-id-generator";
  import { onMount, onDestroy, type Snippet } from "svelte";
  
  // Types
  interface Props {
    target?: HTMLElement | string | undefined;
    children?: Snippet
  }
  
  // Constants
  const uid = generateId("portal");
  const id = `aria-uikit-portal-${uid}`;
  
  // Props
  let {
    children,
    target
  }: Props = $props();
  
  // State
  let portal: HTMLDivElement | null = null;
  let mounted = $state(false);
  
  // Lifecycle
  onMount(() => {
    // Set default target to document.body if not provided
    const resolvedTarget = target ?? document.body;
    
    if (resolvedTarget === null || resolvedTarget === undefined) {
      throw new Error("Portal target cannot be nullable");	
    }

    if (typeof resolvedTarget === "string" && resolvedTarget.trim() === "") {
      throw new Error("Portal target selector cannot be empty.");
    }
    
    const targetEl: HTMLElement | null = typeof resolvedTarget === "string" 
      ? document.querySelector(resolvedTarget)
      : resolvedTarget;
      
    if (!targetEl) {
      throw new Error(`Portal target "${resolvedTarget}" not found in DOM`);
    }
    
    if (portal && targetEl) {
      targetEl.appendChild(portal);
      mounted = true;
    }
  });
  
  onDestroy(() => {
    if (mounted && portal?.parentNode) {
      portal.parentNode.removeChild(portal);
    }
  });
</script>

<div 
  bind:this={portal} 
  {id}
  data-portal
>
  {#if mounted}
    {@render children?.()}
  {/if}
</div>

<style>
  div[data-portal] {
    display: contents;
  }
</style>