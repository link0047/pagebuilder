import { getRequestEvent, query } from "$app/server";
import { error, redirect } from "@sveltejs/kit";
import { sql } from "$lib/server/database";

function requireAuth() {
  const { locals } = getRequestEvent();
  if (!locals.user) {
    redirect(307, "/login");
  }

  return locals.user;
}

export const getBuilds = query(async () => {
  requireAuth();
  const builds = await sql`SELECT * FROM builds ORDER BY created_at DESC`;
  return builds;
});