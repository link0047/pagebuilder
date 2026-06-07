import { FEATURES } from "./detect";
import { capture, type CaptureResult } from "./canvas";

export { type CaptureResult, toBlob } from "./canvas";
export type ScreenshotOptions = {
  onUnsupported?: () => void;
}

/**
 * Captures a screenshot of the given HTML element and returns a canvas and data URL.
 *
 * Uses SVG `foreignObject` to render the element natively in the browser — no external
 * dependencies, no layout re-implementation. Same-origin iframes are supported via `srcdoc`.
 * External images are fetched and inlined as base64; failed images fall back to a grey placeholder.
 *
 * @param element - The HTML element to capture
 * @param options - Optional configuration
 * @param options.onUnsupported - Called before throwing if `foreignObject` is not supported
 * @returns A `CaptureResult` containing the raw `canvas` and a `toDataURL` helper
 * @throws If `foreignObject` is not supported in the current browser
 *
 * @example
 * ```ts
 * import { screenshot } from "$lib/utils/screenshot";
 *
 * const element = document.getElementById("preview");
 * if (!element) return;
 *
 * const result = await screenshot(element, {
 *     onUnsupported: () => console.warn("Screenshot not supported in this browser"),
 * });
 *
 * // Get a PNG data URL
 * const dataURL = result.toDataURL();
 *
 * // Or access the raw canvas
 * document.body.appendChild(result.canvas);
 *
 * // Download as PNG
 * const link = document.createElement("a");
 * link.download = "screenshot.png";
 * link.href = dataURL;
 * link.click();
 * ```
 */
export async function screenshot(
  element: HTMLElement,
  options: ScreenshotOptions = {}
): Promise<CaptureResult> {
  const supported = await FEATURES.FOREIGNOBJECT;

  if (!supported) {
    options.onUnsupported?.();
    throw new Error("foreignObject is not supported in this browser");
  }

  return capture(element);
}
