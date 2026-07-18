<script lang="ts">
  import { type Snippet, onMount, onDestroy, untrack } from "svelte";
  import { getTabState } from "./tabs-state.svelte";

  type Props = {
    children?: Snippet;
    value?: string;
    [key: string]: unknown;
  };

  let {
    children,
    value: valueProp,
    ...restProps
  }: Props = $props();

  let ref: HTMLElement;

  const tabState = getTabState();
  const { id, value } = untrack(() => tabState.addTab(valueProp));
  const panelId = $derived(tabState.getPanelIdForTab(value));
  const isSelected = $derived(tabState.isTabSelected(value));
  const config = $derived(tabState.config);

  function handleClick() {
    tabState.setSelectedTab(value);
  }

  function handleKeydown(event: KeyboardEvent) {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) {
      return;
    }

    event.stopPropagation();
    event.preventDefault();

    switch(event.key) {
      case "ArrowLeft":
        tabState.selectPreviousTab();
        break;
      case "ArrowRight":
        tabState.selectNextTab();
        break;
      case "Home":
        tabState.selectFirstTab();
        break;
      case "End":
        tabState.selectLastTab();
        break;
    }
  }

  onMount(() => {
    tabState.registerTabElement(value, ref);
  });

  onDestroy(() => {
    tabState.removeTab(value);
  });
</script>

<button
  bind:this={ref}
  {id}
  type="button"
  role="tab"
  class="wcag-ui-tabs__tab"
  class:wcag-ui-tabs__tab--size-sm={config.size === "sm"}
  class:wcag-ui-tabs__tab--size-lg={config.size === "lg"}
  class:wcag-ui-tabs__tab--shape-square={config.shape === "square"}
  class:wcag-ui-tabs__tab--shape-pill={config.shape === "pill"}
  class:wcag-ui-tabs__tab--color-primary={config.color === "primary"}
  class:wcag-ui-tabs__tab--underline={config.variant === "underline"}
  class:wcag-ui-tabs__tab--enclosed={config.variant === "enclosed"}
  class:wcag-ui-tabs__tab--outlined={config.variant === "outlined"}
  class:wcag-ui-tabs__tab--filled={config.variant === "filled"}
  class:wcag-ui-tabs__tab--fullWidth={config.fullWidth}
  tabindex={isSelected ? 0 : -1}
  aria-selected={isSelected}
  aria-controls={panelId}
  onclick={handleClick}
  onkeydown={handleKeydown}
  {...restProps}
>
  {@render children?.()}
</button>

<style>
  @layer variables, base, variants, sizes, shapes, states, accessibility;

  @layer variables {

  }

  @layer base {
    .wcag-ui-tabs__tab {
      position: relative;
      display: inline-flex;
      box-sizing: border-box;
      margin: 0;
      padding-inline: .75rem;
      align-items: center;
      justify-content: center;
      font-size: .875rem;
      font-weight: 400;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, Oxygen, Ubuntu, Cantarell, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
      height: 2.5rem;
      color: #52525b;
      border: 1px solid transparent;
      border-radius: .25rem;
      background-color: transparent;
      cursor: pointer;
    }
  }

  @layer variants {
    .wcag-ui-tabs__tab[aria-selected="true"] {
      color: #174f95;
      font-weight: 600;
    }

    .wcag-ui-tabs__tab--enclosed[aria-selected="true"] {
      background-color: #fff;
      color: #212121;
    }

    .wcag-ui-tabs__tab--underline[aria-selected="true"]:before {
      content: "";
      position: absolute;
      bottom: -1px;
      z-index: 10;
      height: 2px;
      width: 100%;
      background-color: #174f95;
    }

    :is(.wcag-ui-tabs__tab--filled,.wcag-ui-tabs__tab--enclosed)[aria-selected="true"] {
      box-shadow: 0px 1px 2px color-mix(in srgb, #18181b 10%, transparent),0px 0px 1px color-mix(in srgb, #18181b 20%, transparent);
    }

    .wcag-ui-tabs__tab--outlined[aria-selected="true"] {
      border: 1px solid #c5c5cb;
      border-bottom: none;
      margin-bottom: -1px;
      background-color: #fff;
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
      z-index: 2;
    }

    .wcag-ui-tabs__tab--filled[aria-selected="true"] {
      background-color: #f4f4f5;

    }
  }

  @layer sizes {
    .wcag-ui-tabs__tab--size-sm {
      height: 2rem;
    }

    .wcag-ui-tabs__tab--size-lg {
      height: 3rem;
    }
  }

  @layer shapes {
    .uikit-tabs__tab--shape-square {
      border-radius: 0;
    }

    .uikit-tabs__tab--shape-pill {
      border-radius: 9999px;
    }
  }

  @layer colors {
    .uikit-tabs__tab--color-primary[aria-selected="true"] {
      color: #2563eb;
    }

    .uikit-tabs__tab--underline.uikit-tabs__tab--color-primary[aria-selected="true"]:before {
      background-color: #2563eb;
    }
  }

  @layer states {
    .wcag-ui-tabs__tab--fullWidth {
      flex: 1;
    }

    .wcag-ui-tabs__tab:not([aria-selected="true"]):hover {
      background-color: #eee;
    }

    /*.wcag-ui-tabs__tab:disabled {

    }*/
  }

  @layer accessibility {

  }
</style>
