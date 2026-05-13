import { getRequestEvent, query, command } from "$app/server";
import { error, redirect } from "@sveltejs/kit";
import { sql } from "$lib/server/database";
import {
  createBuildSchema,
  createTemplateSchema,
  updateBuildSchema,
  updateTemplateSchema,
  deleteBuildSchema,
  deleteTemplateSchema,
  duplicateBuildSchema,
  lockBuildSchema,
} from "$lib/schema/builds";

export type BuildResult = {
  id: string;
  name: string;
  build_type: string;
  author: string;
  updated_by_name: string;
  updated_at: string;
  content: any; // or RootNode if you import it
  thumbnail_url: string | null;
  locked_by: string | null;
  locked_at: string | null;
  locked_by_name: string | null;
};

function requireAuth() {
  const { locals } = getRequestEvent();

  if (!locals.user) redirect(307, "/login");

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
      b.locked_by,
      b.locked_at,
      u1.name AS author,
      u2.name AS updated_by_name,
      u3.name AS locked_by_name
    FROM builds b
    LEFT JOIN "user" u1 ON b.created_by  = u1.id
    LEFT JOIN "user" u2 ON b.updated_by  = u2.id
    LEFT JOIN "user" u3 ON b.locked_by = u3.id
    ORDER BY b.created_at DESC
  ` as BuildResult[];

  return builds;
});

export const getRecentBuilds = query(async (limit = 5) => {
  requireAuth();

  const builds = await sql`
    SELECT
      b.id,
      b.name,
      b.build_type,
      b.updated_at,
      b.content,
      b.thumbnail_url,
      b.locked_by,
      b.locked_at,
      u1.name AS author,
      u2.name AS updated_by_name,
      u3.name AS locked_by_name
    FROM builds b
    LEFT JOIN "user" u1 ON b.created_by = u1.id
    LEFT JOIN "user" u2 ON b.updated_by = u2.id
    LEFT JOIN "user" u3 ON b.locked_by = u3.id
    ORDER BY b.created_at DESC
    LIMIT ${limit}
  ` as BuildResult[];

  return builds;
});

export const getUserBuilds = query(async () => {
  const user = requireAuth();

  const builds = await sql`
    SELECT
      b.id,
      b.name,
      b.build_type,
      b.updated_at,
      b.content,
      b.thumbnail_url,
      u1.name AS author,
      u2.name AS updated_by_name
    FROM builds b
    LEFT JOIN "user" u1 ON b.created_by = u1.id
    LEFT JOIN "user" u2 ON b.updated_by = u2.id
    WHERE b.created_by = ${user.id}
    ORDER BY b.created_at DESC
  ` as BuildResult[];

  return builds;
});

export const getTemplates = query(async () => {
  requireAuth();

  return await sql`SELECT * FROM templates ORDER BY created_at DESC`;
});

export const createBuild = command(createBuildSchema, async ({ name, buildType, content, thumbnailUrl }) => {
  const user = requireAuth();
  const createdBy = user.id;

  try {
    const result = await sql`
      INSERT INTO builds (
        name,
        build_type,
        content,
        thumbnail_url,
        created_by,
        updated_by
      )
      VALUES (${name}, ${buildType}, ${content}, ${thumbnailUrl}, ${createdBy}, ${createdBy})
      RETURNING id, name;
    `;

    return result[0] as { id: string; name: string };
  } catch(err) {
    console.error("Error creating build:", err);
    error(500, "Failed to create build");
  }
});

export const updateBuild = command(updateBuildSchema, async ({ id, name, buildType, content, thumbnailUrl }) => {
  const user = requireAuth();

  try {
    const result = await sql`
      UPDATE builds
      SET
        name = COALESCE(${name}, name),
        build_type = COALESCE(${buildType}, build_type),
        content = COALESCE(${content}, content),
        thumbnail_url = COALESCE(${thumbnailUrl}, thumbnail_url),
        updated_by = ${user.id},
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *;
    `;

    if (result.length === 0) error(404, "Build not found or unauthorized");

    return result[0];
  } catch(err) {
    console.error("Error updating build:", err);
    error(500, "Failed to update build");
  }
});

export const deleteBuild = command(deleteBuildSchema, async ({ id }) => {
  const user = requireAuth();

  try {
    const result = await sql`
      DELETE FROM builds
      WHERE id = ${id} AND created_by = ${user.id}
      RETURNING id;
    `;

    if (result.length === 0) error(404, "Build not found or unauthorized");

    return { success: true };
  } catch(err) {
    console.error("Error deleting build:", err);
    error(500, "Failed to delete build");
  }
});

export const duplicateBuild = command(duplicateBuildSchema, async ({ id }) => {
  const user = requireAuth();

  const original = await sql`
    SELECT
      name,
      build_type,
      content,
      thumbnail_url
    FROM builds
    WHERE id = ${id}
  `;

  if (original.length === 0) error(404, "Build not found");

  const build = original[0];

  try {
    const result = await sql`
      INSERT INTO builds (
        name,
        build_type,
        content,
        thumbnail_url,
        created_by,
        updated_by
      )
      VALUES (
        ${`${build.name} (Copy)`},
        ${build.build_type},
        ${build.content},
        ${build.thumbnail_url},
        ${user.id},
        ${user.id}
      )
      RETURNING id, name;
    `;

    return result[0] as { id: string; name: string };
  } catch(err) {
    console.error("Error duplicating build:", err);
    error(500, "Failed to duplicate build");
  }
});

export const createTemplate = command(createTemplateSchema, async ({ name, buildType, content, thumbnailUrl }) => {
  const user = requireAuth();

  try {
    const result = await sql`
      INSERT INTO templates (
        name,
        build_type,
        content,
        thumbnail_url,
        created_by,
        updated_by
      )
      VALUES (${name}, ${buildType}, ${content}, ${thumbnailUrl}, ${user.id}, ${user.id})
      RETURNING id, name;
    `;

    return result[0] as { id: string; name: string };
  } catch(err) {
    console.error('Error creating template:', err);
    error(500, 'Failed to create template');
  }
});

export const updateTemplate = command(updateTemplateSchema, async ({ id, name, buildType, content, thumbnailUrl }) => {
  const user = requireAuth();

  try {
    const result = await sql`
      UPDATE templates
      SET
        name = COALESCE(${name}, name),
        build_type = COALESCE(${buildType}, build_type),
        content = COALESCE(${content}, content),
        thumbnail_url = COALESCE(${thumbnailUrl}, thumbnail_url),
        updated_by = ${user.id},
        updated_at = NOW()
      WHERE id = ${id} AND created_by = ${user.id}
      RETURNING *;
    `;

    if (result.length === 0) error(404, "Template not found or unauthorized");

    return result[0];
  } catch(err) {
    console.error("Error updating template:", err);
    error(500, "Failed to update template");
  }
});

export const deleteTemplate = command(deleteTemplateSchema, async ({ id }) => {
  const user = requireAuth();

  try {
    const result = await sql`DELETE FROM templates WHERE id = ${id} AND created_by = ${user.id} RETURNING *`;

    if (result.length === 0) error(404, "Template not found or unauthorized");

    return { success: true };
  } catch(err) {
    console.error("Error deleting template:", err);
    error(500, "Failed to delete template");
  }
});

export const acquireLock = command(lockBuildSchema, async ({ id }) => {
  const user = requireAuth();

  const result = await sql`
    UPDATE builds
    SET locked_by = ${user.id}, locked_at = NOW()
    WHERE id = ${id}
      AND (locked_by IS NULL OR locked_by = ${user.id} OR locked_at < NOW() - INTERVAL '5 minutes')
    RETURNING id, locked_by, locked_at
  `;

  if (result.length === 0) {
    await sql`SELECT locked_by FROM builds WHERE id = ${id}`;
    error(423, `Build is locked by another user`);
  }

  return result[0];
});

export const releaseLock = command(lockBuildSchema, async ({ id }) => {
  const user = requireAuth();

  await sql`
    UPDATE builds SET locked_by = NULL, locked_at = NULL
    WHERE id = ${id} AND locked_by = ${user.id}
  `;

  return { success: true };
});

export const refreshLock = command(lockBuildSchema, async ({ id }) => {
  const user = requireAuth();

  await sql`
    UPDATE builds SET locked_at = NOW()
    WHERE id = ${id} AND locked_by = ${user.id}
  `;

  return { success: true };
});
