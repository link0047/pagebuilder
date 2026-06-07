import { error } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ url }) => {
  const src = url.searchParams.get("url");
  if (!src) error(400, "Missing url");

  try {
    const response = await fetch(src);
    const blob = await response.blob();
    return new Response(blob, {
      headers: {
        "Content-Type": response.headers.get("Content-Type") ?? "image/jpeg",
        "Cache-Control": "public, max-age=86400",
      }
    });
  } catch {
    error(502, "Failed to fetch image");
  }
};
