import type { RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ request }) => {
  const report = await request.json();
  console.warn("[csp-report]", JSON.stringify(report, null, 2));
  return new Response(null, { status: 204 });
};
