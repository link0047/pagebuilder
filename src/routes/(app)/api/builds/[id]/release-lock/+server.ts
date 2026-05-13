import { json } from "@sveltejs/kit";
import { sql } from "$lib/server/database";

export async function POST({ params, locals }) {
  if (!locals.user) return json({ success: false }, { status: 401 });

  await sql`
    UPDATE builds SET locked_by = NULL, locked_at = NULL
    WHERE id = ${params.id} AND locked_by = ${locals.user.id}
  `;

  return json({ success: true });
}
