import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import PreviewComponent from "$lib/components/Preview.svelte";
import { render } from "svelte/server";
import { minify } from "html-minifier";
import { PurgeCSS } from "purgecss";
import { attempt } from "$lib/utils/attempt";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

/**
 * Comprehensive cleanup function for generated HTML
 * - Removes Svelte scoped classes (s-<hash>)
 * - Removes empty class attributes
 * - Cleans up multiple spaces
 * - Removes Svelte event handlers (onload/onerror)
 * - Normalizes whitespace between elements
 * 
 * @param {string} html - The HTML string to clean
 * @returns {string} Cleaned HTML string
 */
function stripSvelteArtifacts(html: string): string {
  return html
    .replace(/\s*s-[a-zA-Z0-9_-]+/g, "")
    .replace(/\s*onload="this\.__e=event"\s*/g, " ")
    .replace(/\s*onerror="this\.__e=event"\s*/g, " ")
    .replace(/\s*class=(["'])\1\s*/g, " ")
    .replace(/\s+/g, " ")
    .replace(/>\s+</g, "><")
    .trim();
}

export const POST: RequestHandler = async ({ request }) => {
  // Get form data
  const [formDataError, data] = await attempt(request.formData());
  if (formDataError) {
    throw error(400, "Invalid form data");
  }

  const propsString = data.get("props")?.toString() ?? "{}";
  
  // Validate JSON props
  const [parseError, props] = await attempt(Promise.resolve(JSON.parse(propsString)));
  if (parseError) {
    throw error(400, "Invalid JSON in props parameter");
  }

  // Render the component (this is synchronous and unlikely to fail)
  const result = render(PreviewComponent, { props });
  const rawHTML = stripSvelteArtifacts(result.body);

  console.log(rawHTML);
}