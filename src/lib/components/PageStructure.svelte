<script lang="ts">
  import type { PageTreeNode } from "./types";

  import { getContext } from "svelte";
  import PageStructure from "./PageStructure.svelte";
  import Button from "./Button.svelte";
  import Tree from "./Tree.svelte";
  import TreeItem from "./TreeItem.svelte";
  import Icon from "./Icon.svelte";
  import Menu from "./Menu.svelte";
  import MenuItem from "./MenuItem.svelte";
  import { getAppState } from "./app-state.svelte";
  import { childConfigs, componentRegistry, type ChildOption } from "./component-registry";
  import debounce from "$lib/utils/debounced";

  type Props = {
    pageTree?: PageTreeNode;
    path?: number[];
  };

  let { pageTree, path = [] }: Props = $props();

  const sendToPreview = getContext<(type: string, data?: Record<string, unknown>) => void>("sendToPreview");
  let appState = getAppState();
  let addChildButtonRef = $state<HTMLButtonElement>();

  let childConfig = $derived(
    pageTree?.type === "component" ? (childConfigs[pageTree.name] ?? null) : null
  );

  let isKnownComponent = $derived(
    pageTree?.type === "component" && pageTree.name in componentRegistry
  );

  let siblingCount = $derived((() => {
    if (path.length === 0) return 0;
    const parentPath = path.slice(0, -1);
    const parent = appState.getNodeAtPath(parentPath);
    return parent?.children?.length ?? 0;
  })());

  const isHovered = $derived(appState.hoveredComponentPath?.join(",") === path.join(","));
  let currentIndex = $derived(path[path.length - 1] ?? 0);
  let canMoveUp = $derived(path.length > 0 && currentIndex > 0);
  let canMoveDown = $derived(path.length > 0 && currentIndex < siblingCount - 1);

  const debouncedHover = debounce((pathStr: string) => {
    sendToPreview("preview-hover", { path: pathStr });
  }, 300);

  function handlePointerOver(event: PointerEvent) {
    const el = (event.target as Element)?.closest("[data-tree-item-path]") as HTMLElement | null;
    if (el?.dataset.treeItemPath !== path.join(",")) return;
    debouncedHover(path.join(","));
  }

  function handlePointerOut(event: PointerEvent) {
    const related = event.relatedTarget as Node | null;
    if (related && (event.currentTarget as HTMLElement).contains(related)) return;
    debouncedHover.cancel();
    sendToPreview("preview-hover", { path: null });
  }

  function deleteComponent() {
    if (path.length > 0) {
      appState.removeComponent(path);
    }
  }

  function editProperties() {
    if (path.length > 0) {
      appState.selectComponent(path);
      console.log("[editProperties] sending preview-select", path.join(","));
      sendToPreview("preview-select", { path: path.join(",") });
    }
  }

  function moveUp(event: MouseEvent) {
    event.stopPropagation();
    if (canMoveUp) appState.moveComponent(path, "up");
  }

  function moveDown(event: MouseEvent) {
    event.stopPropagation();
    if (canMoveDown) appState.moveComponent(path, "down");
  }

  function addChild(option: ChildOption) {
    if (!childConfig || pageTree?.type !== "component") return;

    appState.insertComponent(
      {
        type: "component",
        name: option.childName,
        props: option.defaultProps,
        data: {},
        meta: {
          locked: false,
          hidden: false,
          label: option.defaultMeta.label ?? option.childName,
          ...option.defaultMeta,
        },
        children: option.defaultChildren,
      },
      path
    );
  }
</script>

{#snippet addAction(label: string, onclick: () => void)}
  <TreeItem>
    {#snippet text()}
      <div class="page-structure-add-action">
        <button
          class="page-structure-add-action__button"
          type="button"
          bind:this={addChildButtonRef}
          {onclick}
        >
          <Icon>
            <use href="#plus-circle-outline" />
          </Icon>
          {label}
        </button>
      </div>
    {/snippet}
  </TreeItem>
{/snippet}

{#if pageTree?.type === "root" && pageTree.children.length > 0}
  <Tree>
    {#each pageTree.children as child, index (child.id ?? index)}
      <PageStructure pageTree={child} path={[...path, index]} />
    {/each}
  </Tree>
{/if}

{#if pageTree?.type === "component" && isKnownComponent}
  <TreeItem
    hasChildren={!!childConfig}
    expanded={true}
    data-tree-item-path={path.join(",")}
    highlighted={isHovered}
    onpointerover={handlePointerOver}
    onpointerout={handlePointerOut}
  >
    {#snippet text()}
      {#if pageTree.meta}
        <span class="page-structure-meta">
          <button
            class="page-structure-meta__edit-properties"
            type="button"
            onclick={editProperties}
          >
            <span>{pageTree.meta.label}</span>
          </button>

          {#if path.length > 0}
            {#if canMoveUp}
              <Button
                onclick={moveUp}
                disabled={!canMoveUp}
                variant="ghost"
                size="sm"
                shape="rounded-square"
                aria-label="Move up"
              >
                <Icon size="16">
                  <path d="M7.03 9.97H11.03V18.89L13.04 18.92V9.97H17.03L12.03 4.97Z" />
                </Icon>
              </Button>
            {/if}
            {#if canMoveDown}
              <Button
                onclick={moveDown}
                disabled={!canMoveDown}
                variant="ghost"
                size="sm"
                shape="rounded-square"
                aria-label="Move down"
              >
                <Icon size="16">
                  <path d="M7.03 13.92H11.03V5L13.04 4.97V13.92H17.03L12.03 18.92Z" />
                </Icon>
              </Button>
            {/if}
          {/if}

          <Button
            onclick={deleteComponent}
            variant="ghost"
            size="sm"
            shape="rounded-square"
            aria-label="Delete"
          >
            <Icon size="16">
              <use href="#delete" />
            </Icon>
          </Button>
        </span>
      {/if}
    {/snippet}

    {#if childConfig && pageTree.children?.length}
      {#each pageTree.children as child, index (child.id ?? index)}
        <PageStructure pageTree={child} path={[...path, index]} />
      {/each}
    {/if}

    {#if childConfig}
      {#if childConfig.options.length === 1}
        {@render addAction(childConfig.label, () => addChild(childConfig.options[0]))}
      {:else}
        {@render addAction(childConfig.label, () => {})}
        <Menu placement="right-end" anchor={addChildButtonRef}>
          {#each childConfig.options as option}
            <MenuItem onclick={() => addChild(option)}>
              {option.label}
            </MenuItem>
          {/each}
        </Menu>
      {/if}
    {/if}
  </TreeItem>
{/if}

<style>
  .page-structure-meta {
    display: flex;
    height: 100%;
    width: 100%;
    flex-direction: row;
    gap: 0.25rem;
    padding-block: 0.25rem;
    padding-inline-end: 0.5rem;
  }

  .page-structure-add-action__button,
  .page-structure-meta__edit-properties {
    flex-grow: 1;
    background-color: transparent;
    border: none;
    text-align: start;
    padding: 0;
    margin: 0;
    cursor: pointer;
  }

  .page-structure-add-action__button {
    width: 100%;
    display: inline-flex;
    align-items: center;
    gap: 0.5ch;
    letter-spacing: 0.04em;
    font-weight: 500;
    height: 2.5rem;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
    color: #2a508f;
  }
</style>
