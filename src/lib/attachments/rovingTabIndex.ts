import type { Attachment } from "svelte/attachments";

/** The axis along which arrow key navigation moves focus. */
export type RovingOrientation = "horizontal" | "vertical";

export type RovingTabIndexOptions = {
  /** The axis along which arrow key navigation moves focus. Defaults to `"horizontal"`. */
  orientation?: RovingOrientation;
  /** The index of the child element that receives focus when the container is first focused. Defaults to `0`. */
  initialIndex?: number;
  /** Whether the container itself is a tab stop. Defaults to `false`. */
  tabbable?: boolean;
  /** Callback fired when focus moves between children via keyboard navigation. Receives the new index and the newly focused element. */
  onRove?: (index: number, element: HTMLElement, event: PointerEvent | KeyboardEvent) => void;
  /** Callback fired when container is re-entered */
  onFocus?: (index: number, element: HTMLElement, event: FocusEvent) => void;
};

const FOCUSABLE_SELECTOR = ":is(input:not([type='hidden']):not(:disabled), select:not(:disabled), textarea:not(:disabled), button:not(:disabled), summary:not(:disabled), a[href], [tabindex]:not([tabindex='-1']), iframe, area[href], audio[controls], video[controls], [contenteditable]:not([contenteditable='false'])):not([inert])";

/**
 * Implements the roving tabindex pattern for keyboard navigation within a container.
 *
 * - The container is tabbable (`tabindex="0"`), its focusable children are not (`tabindex="-1"`).
 * - Arrow keys move focus between children.
 * - `Home` and `End` jump to the first and last child.
 * - `Tab` moves focus out of the container to the next tabbable element.
 * - `Shift+Tab` moves focus out of the container to the previous tabbable element, skipping the container itself.
 * - Re-entering the container restores focus to the last focused child.
 *
 * @example
 * ```svelte
 * <div {@attach rovingTabIndex({ orientation: "horizontal" })}>
 *   <button>One</button>
 *   <button>Two</button>
 *   <button>Three</button>
 * </div>
 * ```
 *
 * @see https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/#kbd_roving_tabindex
 */
export function rovingTabIndex({ orientation = "horizontal", initialIndex = 0, tabbable = false, onRove, onFocus }: RovingTabIndexOptions = {}): Attachment<HTMLElement> {
  return (node) => {
    const prevKey = orientation === "horizontal" ? "ArrowLeft"  : "ArrowUp";
    const nextKey = orientation === "horizontal" ? "ArrowRight" : "ArrowDown";
    const controller = new AbortController();
    const { signal } = controller;
    let lastFocusedIndex = initialIndex;

    function getFocusableElements(): HTMLElement[] {
      const elements: HTMLElement[] = [];
      for (const element of node.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)) {
        if (element !== node) elements.push(element);
      }
      return elements;
    }

    function rove(index: number, elements: HTMLElement[], event: PointerEvent | KeyboardEvent, shouldFocus = true) {
      const currentElement = elements[lastFocusedIndex];
      currentElement?.setAttribute("tabindex", "-1");

      const newElement = elements[index];
      if (shouldFocus) newElement?.focus();
      newElement?.setAttribute("tabindex", "0");
      lastFocusedIndex = index;
      onRove?.(index, elements[index], event);
    }

    function initTabIndices() {
      if (tabbable && !node.hasAttribute("tabindex")) {
        node.setAttribute("tabindex", "0");
      }

      for (const [index, element] of getFocusableElements().entries()) {
        element.setAttribute("tabindex", index === lastFocusedIndex ? "0" : "-1");
      }
    }

    function onFocusIn(event: FocusEvent) {
      const comingFromOutside = !node.contains(event.relatedTarget as Node);
      if (!comingFromOutside) return;
      const elements = getFocusableElements();
      const element = elements[lastFocusedIndex];
      if (element) {
        element.focus();
        onFocus?.(lastFocusedIndex, element, event);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      const { key } = event;

      if (tabbable && event.shiftKey && key === "Tab") {
        node.setAttribute("tabindex", "-1");
        requestAnimationFrame(() => {
          node.setAttribute("tabindex", "0");
        });
      }

      if (![prevKey, nextKey, "Home", "End"].includes(key)) return;
      event.preventDefault();

      const focusableElements = getFocusableElements();
      const focusedIndex = focusableElements.indexOf(document.activeElement as HTMLElement);
      if (focusedIndex === -1) return;

      switch (key) {
        case prevKey: {
          rove((focusedIndex - 1 + focusableElements.length) % focusableElements.length, focusableElements, event);
          break;
        }
        case nextKey: {
          rove((focusedIndex + 1) % focusableElements.length, focusableElements, event);
          break;
        }
        case "Home":
          rove(0, focusableElements, event);
          break;
        case "End":
          rove(focusableElements.length - 1, focusableElements, event);
          break;
      }
    }

    function onPointerDown(event: PointerEvent) {
      const focusableElements = getFocusableElements();
      const closest = (event.target as HTMLElement).closest<HTMLElement>(FOCUSABLE_SELECTOR);
      const index = closest ? focusableElements.indexOf(closest) : -1;
      if (index !== -1) {
        rove(index, focusableElements, event);
      }
    }

    initTabIndices();

    node.addEventListener("keydown", onKeyDown, { signal });
    node.addEventListener("pointerdown", onPointerDown, { signal });
    node.addEventListener("focusin", onFocusIn, { signal });

    return () => controller.abort();
  };
}
