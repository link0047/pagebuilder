/**
 * Copies text to clipboard using the Clipboard API
 * @param text - The text to copy to clipboard
 * @returns Promise that resolves to true if copied successfully, false otherwise
 * @example
 * ```typescript
 * // Returns true if copied successfully
 * const success = await copyToClipboard("Hello World");
 * if (success) {
 *   console.log("Text copied to clipboard!");
 * } else {
 *   console.log("Failed to copy text");
 * }
 * ```
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (!navigator.clipboard || !window.isSecureContext) {
    return false;
  }

  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}