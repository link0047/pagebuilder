import { getRequestEvent, query, command } from "$app/server";
import { error, redirect } from "@sveltejs/kit";
import { sql } from "$lib/server/database";
import { createBuildSchema } from "$lib/schema/builds";

type BuildResult = {
  id: string; // or number
  name: string;
  build_type: string;
  author: string; // <--- The field your frontend is missing
  updated_at: string;
  // include other fields if necessary
};

function requireAuth() {
  const { locals } = getRequestEvent();
  if (!locals.user) {
    redirect(307, "/login");
  }

  return locals.user;
}

export const getBuilds = query(async () => {
  requireAuth();

  const builds = await sql`
    SELECT 
      b.id,
      b.name,
      b.build_type,
      b.updated_at,
      b.content, 
      b.thumbnail_url,
      u.name as author
    FROM builds b
    LEFT JOIN "user" u ON b.created_by = u.id
    ORDER BY b.created_at DESC
  ` as BuildResult[];

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
  console.log({createdBy})
  try {
    await sql`
      INSERT INTO builds (
        name, 
        build_type, 
        content, 
        thumbnail_url, 
        created_by, 
        updated_by
      )
      VALUES (${name}, ${buildType}, ${content}, ${thumbnailUrl}, ${createdBy}, ${createdBy})
      RETURNING id;
    `;
  } catch(error) {
    console.log(error);
  }
});