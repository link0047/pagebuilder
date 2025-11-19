import { getRequestEvent, query, command } from "$app/server";
import { error, redirect } from "@sveltejs/kit";
import { sql } from "$lib/server/database";
import { createBuildSchema } from "$lib/schema/builds";

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

export const getTemplates = query(async () => {
  requireAuth();
  const builds = await sql`SELECT * FROM templates ORDER BY created_at DESC`;
  return builds;
});

export const createBuild = command(createBuildSchema, async ({ name, buildType, content, thumbnailUrl }) => {
  const user = requireAuth();
  const createdBy = user.id;

  await sql`
    INSERT INTO builds (
      name, 
      build_type, 
      content, 
      thumbnail_url, 
      created_by, 
      updated_by
    )
    VALUES (${name}, ${buildType}, ${content}, ${thumbnailUrl}, ${createdBy}, ${createBuild})
    RETURNING id;
  `;
});