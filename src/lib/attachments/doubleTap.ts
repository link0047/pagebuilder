import type { Attachment } from "svelte/attachments";

/** The orientation of the roving tab index pattern. */
export type DoubleTapOptions = {
  /** Callback fired when a double tap is detected. */
  onDoubleTap: () => void;
  /** Maximum time in milliseconds between taps to count as a double tap. Defaults to 300ms. */
  delay?: number;
};

/**
 * Detects a double tap on an element using `pointerup` events.
 * Use this instead of `dblclick` for reliable mobile support.
 *
 * @example
 * ```svelte
 * <div {@attach doubleTap({ onDoubleTap: () => console.log("double tapped!") })}>
 * ```
 */
export function doubleTap({ onDoubleTap, delay = 300 }: DoubleTapOptions): Attachment<HTMLElement>  {
  return (node) => {
    const controller = new AbortController();
    const { signal } = controller;
    let lastTap = 0;

    node.addEventListener("pointerup", () => {
      const now = Date.now();
      if (now - lastTap < delay) {
        onDoubleTap?.();
        lastTap = 0;
      } else {
        lastTap = now;
      }
    }, { signal });

    return () => controller.abort();
  };
}
