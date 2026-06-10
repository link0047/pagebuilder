<script lang="ts">
  import type { PageTreeNode } from "./types";

  import { getContext } from "svelte";
  import PageStructure from "./PageStructure.svelte";
  import PageStructureItem from "./PageStructureItem.svelte";
  import Tree from "./Tree.svelte";
  import TreeItem from "./TreeItem.svelte";
  import Separator from "./Separator.svelte";
  import Button from "./Button.svelte";
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

  const debouncedHover = debounce((path: string) => {
    sendToPreview("preview-scroll-to", { path });
    sendToPreview("preview-hover", { path });
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
    <TreeItem>
      {#snippet text()}
        <PageStructureItem
          label="Page"
          onclick={() => appState.editSection("page")}
        />
      {/snippet}
    </TreeItem>
    <Separator gap={4} />
    <TreeItem>
      {#snippet text()}
        <PageStructureItem
          label="Heading"
          onclick={() => appState.editSection("heading")}
        >
          {#snippet actions()}
            <Button
              variant="ghost"
              size="sm"
              shape="rounded-square"
              aria-label={appState.pageHeading.hidden ? "Show heading" : "Hide heading"}
              onclick={() => appState.updatePageHeading({ hidden: !appState.pageHeading.hidden })}
            >
              <Icon size="16">
                {#if appState.pageHeading.hidden}
                  <path d="M11.83,9L15,12.16C15,12.11 15,12.05 15,12A3,3 0 0,0 12,9C11.94,9 11.89,9 11.83,9M7.53,9.8L9.08,11.35C9.03,11.56 9,11.77 9,12A3,3 0 0,0 12,15C12.22,15 12.44,14.97 12.65,14.92L14.2,16.47C13.53,16.8 12.79,17 12,17A5,5 0 0,1 7,12C7,11.21 7.2,10.47 7.53,9.8M2,4.27L4.28,6.55L4.73,7C3.08,8.3 1.78,10 1,12C2.73,16.39 7,19.5 12,19.5C13.55,19.5 15.03,19.2 16.38,18.66L16.81,19.08L19.73,22L21,20.73L3.27,3M12,7A5,5 0 0,1 17,12C17,12.64 16.87,13.26 16.64,13.82L19.57,16.75C21.07,15.5 22.27,13.86 23,12C21.27,7.61 17,4.5 12,4.5C10.6,4.5 9.26,4.76 8,5.2L10.17,7.35C10.74,7.13 11.35,7 12,7Z" />
                {:else}
                  <path d="M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z" />
                {/if}
              </Icon>
            </Button>
          {/snippet}
        </PageStructureItem>
      {/snippet}
    </TreeItem>
    <Separator gap={4} />
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
      <PageStructureItem
        label={pageTree.meta.label}
        onclick={editProperties}
        {canMoveUp}
        {canMoveDown}
        onMoveUp={moveUp}
        onMoveDown={moveDown}
        onDelete={deleteComponent}
      />
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
  .page-structure-add-action__button {
    flex-grow: 1;
    background-color: transparent;
    border: none;
    text-align: start;
    padding: 0;
    margin: 0;
    cursor: pointer;
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
