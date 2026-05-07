/**
 * Creates a temporary anchor element to trigger a file download in the browser.
 *
 * @param {string} content - The file content to download.
 * @param {string} filename - The name of the file to save.
 * @param {string} [mimeType="text/plain"] - The MIME type of the file.
 */
export function downloadFile(content: string, filename: string, mimeType: string = "text/plain") {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;

  // Append to body to ensure it works in Firefox and older browsers
  document.body.appendChild(a);
  a.click();

  // Clean up: remove the element and revoke the URL
  document.body.removeChild(a);

  // Use a small timeout to ensure the browser has started the download
  // before the URL is revoked (important for some mobile browsers)
  setTimeout(() => URL.revokeObjectURL(url), 100);
}

/**
 * Downloads a string as an HTML file.
 *
 * @param {string} content - The HTML string to download.
 * @param {string} [filename="page.html"] - The name of the file to save.
 */
export const downloadHTML = (content: string, filename: string = "page.html") =>
  downloadFile(content, filename, "text/html");

/**
 * Downloads an object or string as a JSON file.
 *
 * @param {object|string} content - The data to serialize and download.
 * @param {string} [filename="page.json"] - The name of the file to save.
 */
export const downloadJSON = (content: object | string, filename: string = "data.json") => {
  const jsonString = typeof content === "string"
    ? content
    : JSON.stringify(content, null, 2);

  downloadFile(jsonString, filename, "application/json");
};
