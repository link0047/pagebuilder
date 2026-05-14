import { sql } from "$lib/server/database";
import { error } from "@sveltejs/kit";

export async function load({ params }) {
  const result = await sql`SELECT content FROM builds WHERE id = ${params.id}`;

  if (result.length === 0) error(404, "Build not found");

  return { tree: result[0].content };
}
